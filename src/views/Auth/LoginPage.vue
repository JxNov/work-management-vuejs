<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { toast } from '@/utils/toast';

const auth = useAuthStore();

const email = ref<string>('');
const password = ref<string>('');

const handleLogin = async () => {
  if (!email.value || !password.value) {
    toast.error('Vui lòng điền đầy đủ thông tin', 5000);
    return;
  }

  const payload = {
    email: email.value,
    password: password.value,
  };

  try {
    await auth.login(payload);
  } catch {}
};
</script>

<template>
  <div class="d-flex flex-column align-items-center justify-content-center vh-100">
    <form class="w-25" @submit.prevent="handleLogin">
      <h1 class="text-center mb-4">Login</h1>

      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="name@example.com"
          v-model="email"
        />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          placeholder="Enter password"
          v-model="password"
        />
      </div>

      <button type="submit" class="btn btn-primary w-100" :disabled="auth.loading">Login</button>
    </form>
  </div>
</template>

<style scoped></style>
