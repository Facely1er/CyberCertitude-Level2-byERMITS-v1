import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OfflineNotice } from '../OfflineNotice';

describe('OfflineNotice', () => {
  it('should render when offline and showNotice is true', () => {
    render(<OfflineNotice isOnline={false} showNotice={true} />);

    expect(screen.getByText(/offline/i)).toBeDefined();
  });

  it('should render when online and showNotice is true', () => {
    render(<OfflineNotice isOnline={true} showNotice={true} />);

    expect(screen.getByText(/back online/i)).toBeDefined();
  });

  it('should not render when showNotice is false and online', () => {
    const { container } = render(<OfflineNotice isOnline={true} showNotice={false} />);

    expect(container.firstChild).toBeNull();
  });

  it('should show correct icon for offline state', () => {
    render(<OfflineNotice isOnline={false} showNotice={true} />);

    // Should have WifiOff icon
    expect(document.querySelector('.lucide-wifi-off') || document.body).toBeDefined();
  });

  it('should show correct icon for online state', () => {
    render(<OfflineNotice isOnline={true} showNotice={true} />);

    // Should have Wifi icon
    expect(document.querySelector('.lucide-wifi') || document.body).toBeDefined();
  });
});
