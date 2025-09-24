/**
 * Service Worker for CMMC 2.0 Level 1 Implementation Suite
 * Provides offline functionality and caching
 */

const CACHE_NAME = 'cmmc-app-v1';
const STATIC_CACHE = 'cmmc-static-v1';
const DYNAMIC_CACHE = 'cmmc-dynamic-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/health.html'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('Service Worker: Activation failed', error);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', request.url);
          return cachedResponse;
        }

        // Otherwise, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If network fails and it's a navigation request, show offline page
            if (request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            // For other requests, return a basic offline response
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      console.log('Service Worker: Skip waiting requested');
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      console.log('Service Worker: Clear cache requested');
      clearAllCaches();
      break;
      
    case 'GET_CACHE_INFO':
      console.log('Service Worker: Cache info requested');
      getCacheInfo().then((info) => {
        event.ports[0].postMessage({ type: 'CACHE_INFO', data: info });
      });
      break;
      
    default:
      console.log('Service Worker: Unknown message type', type);
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/cybercertitude-512.png',
    badge: '/cybercertitude-512.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/cybercertitude-512.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/cybercertitude-512.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('CMMC Compliance Suite', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Utility functions
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('Service Worker: All caches cleared');
  } catch (error) {
    console.error('Service Worker: Failed to clear caches', error);
  }
}

async function getCacheInfo() {
  try {
    const cacheNames = await caches.keys();
    const cacheInfo = await Promise.all(
      cacheNames.map(async (name) => {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        return { name, size: keys.length };
      })
    );
    return cacheInfo;
  } catch (error) {
    console.error('Service Worker: Failed to get cache info', error);
    return [];
  }
}

async function doBackgroundSync() {
  try {
    // Implement background sync logic here
    console.log('Service Worker: Performing background sync');
    
    // Example: Sync offline data when back online
    const offlineData = await getOfflineData();
    if (offlineData.length > 0) {
      await syncOfflineData(offlineData);
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

async function getOfflineData() {
  // Get offline data from IndexedDB or other storage
  return [];
}

async function syncOfflineData(data) {
  // Sync offline data with server
  console.log('Service Worker: Syncing offline data', data.length, 'items');
}

console.log('Service Worker: Script loaded');