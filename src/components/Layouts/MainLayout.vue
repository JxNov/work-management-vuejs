<script lang="ts" setup>
import { routers } from '@/router';
import { RouterView, RouterLink, type RouteRecordRaw } from 'vue-router';
import { ROUTES } from '@/constants/routers';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

const auth = useAuthStore();

const handleLogout = async () => {
  await auth.logout();
};

const combinePaths = (parent: string, child: string) => {
  if (child === '') return parent;
  return `${parent}/${child}`.replace(/\/+$/, '');
};

const filteredRouters = computed(() => {
  const checkPermission = (route: RouteRecordRaw): boolean => {
    const permissions = route.meta?.permissions as string[] | undefined;
    if (!permissions || permissions.length === 0) return true;
    return permissions.includes(auth.users?.role ?? '');
  };

  return routers
    .map(router => {
      const children = router.children?.filter(checkPermission) || [];

      if (router.children && router.children.length > 0) {
        return {
          ...router,
          children,
          isVisible: children.length > 0,
        };
      }

      return {
        ...router,
        isVisible: checkPermission(router),
      };
    })
    .filter(r => r.isVisible);
});
</script>

<template>
  <div class="d-flex flex-column vh-100">
    <div class="d-flex justify-content-between align-items-center px-5 py-3 border-bottom">
      <RouterLink :to="ROUTES.HOME" class="text-capitalize text-decoration-none">Home</RouterLink>

      <button type="button" @click="handleLogout" class="btn btn-primary text-capitalize">
        Logout
      </button>
    </div>

    <div class="px-5 d-flex flex-grow-1 py-3">
      <div style="width: 240px" class="border-end">
        <template v-for="router in filteredRouters" :key="router.path">
          <template v-if="router.children && router.children.length > 0">
            <RouterLink
              v-for="child in router.children"
              :key="child.path"
              :to="combinePaths(router.path, child.path)"
              class="text-decoration-none text-capitalize py-2 d-block"
              :class="{
                'd-flex flex-row align-items-center gap-2': child.meta?.icon,
              }"
            >
              <i :class="child.meta?.icon" style="width: 16px" v-if="child.meta?.icon" />
              <span>
                {{ child.meta?.name }}
              </span>
            </RouterLink>
          </template>

          <RouterLink
            v-else
            :to="router.path"
            class="text-decoration-none text-capitalize py-2 d-block"
            :key="router.path + '-single'"
          >
            {{ router.meta?.name }}
          </RouterLink>
        </template>
      </div>

      <div class="flex-grow-1 p-3">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
