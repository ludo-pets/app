let showToastFn: ((message: string, type?: 'success' | 'error' | 'info') => void) | null = null;

export function registerShowToast(fn: typeof showToastFn) {
  showToastFn = fn;
}

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  if (showToastFn) {
    showToastFn(message, type);
  } else {
    console.warn('Toast system not initialized');
  }
}