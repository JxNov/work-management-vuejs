<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="d-flex flex-column align-items-center justify-content-center vh-100">
    <h1 class="display-1">404</h1>
    <p class="lead">Page Not Found</p>
    <RouterLink to="/" class="btn btn-primary">Go to Home</RouterLink>
  </div>
</template>

<style scoped></style>
