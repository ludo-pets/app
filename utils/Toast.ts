let showToastFn: ((message: string, type?: 'success' | 'error' | 'info') => void) | null = null;

export function registerShowToast(fn: typeof showToastFn) {
  showToastFn = fn;
}

type ToastType = 'success' | 'error' | 'info';

export function showToast(message: string, type: ToastType = 'info') {
  if (showToastFn) {
    setTimeout(() => showToastFn!(message, type), 0);
  } else {
    console.warn('Toast system not initialized');
  }
}
