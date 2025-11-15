interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

class ToastService {
  private static instance: ToastService;

  private constructor() {}

  public static getInstance(): ToastService {
    if (!ToastService.instance) {
      ToastService.instance = new ToastService();
    }
    return ToastService.instance;
  }

  public success(title: string, message: string, duration: number = 5000): void {
    this.showToast('success', title, message, duration);
  }

  public error(title: string, message: string, duration: number = 7000): void {
    this.showToast('error', title, message, duration);
  }

  public warning(title: string, message: string, duration: number = 6000): void {
    this.showToast('warning', title, message, duration);
  }

  public info(title: string, message: string, duration: number = 5000): void {
    this.showToast('info', title, message, duration);
  }

  private showToast(type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, duration: number): void {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 max-w-sm w-full bg-surface-light rounded-lg shadow-lg border-l-4 ${
      type === 'success' ? 'border-success-500' :
      type === 'error' ? 'border-error-500' :
      type === 'warning' ? 'border-yellow-500' :
      'border-primary-500'
    } p-4 transform transition-all duration-300 ease-in-out`;

    toast.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <div class="w-6 h-6 rounded-full flex items-center justify-center ${
            type === 'success' ? 'bg-success-100 text-success-600' :
            type === 'error' ? 'bg-error-100 text-error-600' :
            type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
            'bg-primary-100 text-primary-600'
          }">
            ${type === 'success' ? '✓' :
              type === 'error' ? '✕' :
              type === 'warning' ? '⚠' :
              'ℹ'}
          </div>
        </div>
        <div class="ml-3 flex-1">
          <h3 class="text-sm font-medium text-text-primary-light">${title}</h3>
          <p class="mt-1 text-sm text-text-secondary-light">${message}</p>
        </div>
        <button class="ml-4 flex-shrink-0 text-text-muted-dark hover:text-text-secondary-light" onclick="this.parentElement.parentElement.remove()">
          <span class="sr-only">Close</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    `;

    // Add to DOM
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentElement) {
          toast.parentElement.removeChild(toast);
        }
      }, 300);
    }, duration);
  }
}

export const toastService = ToastService.getInstance();
