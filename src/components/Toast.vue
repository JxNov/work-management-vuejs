<script setup lang="ts">
import { ref } from 'vue';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastItem = {
  id: number;
  type: ToastType;
  message: string;
};

const toasts = ref<ToastItem[]>([]);
let toastId = 0;

function showToast(type: ToastType, message: string, duration = 3000) {
  const id = ++toastId;
  toasts.value.unshift({ id, type, message });

  setTimeout(() => removeToast(id), duration);
}

function removeToast(id: number) {
  toasts.value = toasts.value.filter(t => t.id !== id);
}

const iconMap: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

function toastClass(type: ToastType): string {
  switch (type) {
    case 'success':
      return 'bg-success';
    case 'error':
      return 'bg-danger';
    case 'warning':
      return 'bg-warning text-dark';
    case 'info':
    default:
      return 'bg-info';
  }
}

defineExpose({ showToast });
</script>

<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1055">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast align-items-center text-white border-0 show mb-2"
      :class="toastClass(toast.type)"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">
          <span class="me-2">{{ iconMap[toast.type] }}</span>
          {{ toast.message }}
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          @click="removeToast(toast.id)"
        ></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toast {
  min-width: 250px;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}
</style>
