<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted, ref } from 'vue';
import Toast from '@/components/Toast.vue';
import { registerToast } from '@/utils/toast';

const toastRef = ref<InstanceType<typeof Toast>>();

onMounted(() => {
  if (toastRef.value) {
    registerToast(toastRef.value);
  }
});
</script>

<template>
  <RouterView />
  <Toast ref="toastRef" />
</template>

<style scoped></style>
