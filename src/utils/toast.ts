type ToastType = 'success' | 'error' | 'info' | 'warning';

let _toastInstance: {
  showToast: (type: ToastType, msg: string, duration?: number) => void;
} | null = null;

export function registerToast(instance: {
  showToast: (type: ToastType, msg: string, duration?: number) => void;
}) {
  _toastInstance = instance;
}

// export function toast(type: ToastType, msg: string, duration: number = 3000) {
//   if (_toastInstance) {
//     _toastInstance.showToast(type, msg, duration);
//   } else {
//     console.warn('Toast component chưa được đăng ký!');
//   }
// }

export const toast = {
  success: (msg: string, duration: number = 3000) => {
    if (_toastInstance) {
      _toastInstance.showToast('success', msg, duration);
    } else {
      console.warn('Toast component chưa được đăng ký!');
    }
  },

  error: (msg: string, duration: number = 3000) => {
    if (_toastInstance) {
      _toastInstance.showToast('error', msg, duration);
    } else {
      console.warn('Toast component chưa được đăng ký!');
    }
  },

  info: (msg: string, duration: number = 3000) => {
    if (_toastInstance) {
      _toastInstance.showToast('info', msg, duration);
    } else {
      console.warn('Toast component chưa được đăng ký!');
    }
  },

  warning: (msg: string, duration: number = 3000) => {
    if (_toastInstance) {
      _toastInstance.showToast('warning', msg, duration);
    } else {
      console.warn('Toast component chưa được đăng ký!');
    }
  },
};
