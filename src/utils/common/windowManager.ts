/**
 * Window Management Utility
 * Handles opening, closing, and managing browser windows
 */

export interface WindowOptions {
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  scrollbars?: boolean;
  resizable?: boolean;
  toolbar?: boolean;
  menubar?: boolean;
  location?: boolean;
  status?: boolean;
}

/**
 * Opens a new window with the specified URL and options
 */
export function openWindow(
  url: string, 
  target: string = '_blank', 
  options: WindowOptions = {}
): Window | null {
  const defaultOptions: WindowOptions = {
    width: 800,
    height: 600,
    scrollbars: true,
    resizable: true,
    toolbar: false,
    menubar: false,
    location: false,
    status: false
  };

  const windowOptions = { ...defaultOptions, ...options };
  
  const features = [
    `width=${windowOptions.width}`,
    `height=${windowOptions.height}`,
    `scrollbars=${windowOptions.scrollbars ? 'yes' : 'no'}`,
    `resizable=${windowOptions.resizable ? 'yes' : 'no'}`,
    `toolbar=${windowOptions.toolbar ? 'yes' : 'no'}`,
    `menubar=${windowOptions.menubar ? 'yes' : 'no'}`,
    `location=${windowOptions.location ? 'yes' : 'no'}`,
    `status=${windowOptions.status ? 'yes' : 'no'}`
  ].join(',');

  try {
    const newWindow = window.open(url, target, features);
    return newWindow;
  } catch (error) {
    console.error('Failed to open window:', error);
    return null;
  }
}

/**
 * Closes all child windows
 */
export function closeAllWindows(): void {
  try {
    // Close all child windows
    if (window.opener) {
      window.close();
    }
    
    // Close any windows we opened
    const windows = window.opener ? [window.opener] : [];
    windows.forEach(win => {
      if (win && !win.closed) {
        win.close();
      }
    });
  } catch (error) {
    console.error('Failed to close windows:', error);
  }
}

/**
 * Checks if a window is still open
 */
export function isWindowOpen(window: Window | null): boolean {
  return window !== null && !window.closed;
}

/**
 * Focuses a window if it's open
 */
export function focusWindow(window: Window | null): boolean {
  if (isWindowOpen(window)) {
    try {
      window!.focus();
      return true;
    } catch (error) {
      console.error('Failed to focus window:', error);
      return false;
    }
  }
  return false;
} 