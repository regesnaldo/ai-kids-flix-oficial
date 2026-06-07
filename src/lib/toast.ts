// ─── src/lib/toast.ts ───────────────────────────────────────────────────────
//
// Simple toast notification utility — replace silent console.error with user feedback.
// Usage: import { toastError } from '@/lib/toast';
//        toastError('Falha ao carregar. Tente novamente.');

let toastContainer: HTMLDivElement | null = null;

function getContainer(): HTMLDivElement {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'mente-toast-container';
    toastContainer.style.cssText =
      'position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

function showToast(message: string, type: 'error' | 'success' | 'info' = 'error') {
  const colors = {
    error: { bg: '#7f1d1d', border: '#ef4444', text: '#fca5a5' },
    success: { bg: '#14532d', border: '#22c55e', text: '#86efac' },
    info: { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd' },
  };
  const c = colors[type];

  const toast = document.createElement('div');
  toast.style.cssText = `pointer-events:auto;padding:10px 16px;border-radius:8px;font-family:monospace;font-size:12px;max-width:360px;animation:fadeIn 0.3s ease;background:${c.bg};border:1px solid ${c.border};color:${c.text};`;
  toast.textContent = message;

  getContainer().appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

export function toastError(message: string) {
  showToast(message, 'error');
}

export function toastSuccess(message: string) {
  showToast(message, 'success');
}

export function toastInfo(message: string) {
  showToast(message, 'info');
}
