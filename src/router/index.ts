import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { ACCESS_TOKEN, PROFILE } from '@/constants/variables';
import Cookies from 'js-cookie';

// Layouts
import MainLayout from '@/components/Layouts/MainLayout.vue';
import AuthLayout from '@/components/Layouts/AuthLayout.vue';

import LoginPage from '@/views/Auth/LoginPage.vue';
import NotFoundPage from '@/views/NotFoundPage.vue';

// Views
import HomePage from '@/views/HomePage.vue';
import TaskPage from '@/views/TaskPage.vue';
import WorkLogPage from '@/views/WorkLogPage.vue';
import ReportPage from '@/views/ReportPage.vue';
import StandardPage from '@/views/StandardPage.vue';
import UserPage from '@/views/UserPage.vue';

export const routers: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        component: HomePage,
        meta: {
          icon: 'fa-solid fa-house',
          requiresAuth: true,
          name: 'Home',
        },
      },
    ],
  },
  {
    path: '/users',
    component: MainLayout,
    meta: {
      requiresAuth: true,
      permissions: ['admin'],
    },
    children: [
      {
        path: '',
        component: UserPage,
        meta: {
          requiresAuth: true,
          permissions: ['admin'],
          icon: 'fa-solid fa-user',
          name: 'Users',
        },
      },
    ],
  },
  {
    path: '/tasks',
    component: MainLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        component: TaskPage,
        meta: {
          requiresAuth: true,
          icon: 'fa-solid fa-tasks',
          name: 'Tasks',
        },
      },
    ],
  },
  {
    path: '/work-logs',
    component: MainLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        component: WorkLogPage,
        meta: {
          requiresAuth: true,
          icon: 'fa-solid fa-clock',
          name: 'Work Logs',
        },
      },
    ],
  },
  {
    path: '/reports',
    component: MainLayout,
    meta: {
      requiresAuth: true,
      permissions: ['director'],
    },
    children: [
      {
        path: '',
        component: ReportPage,
        meta: {
          requiresAuth: true,
          icon: 'fa-solid fa-chart-line',
          name: 'Reports',
          permissions: ['director'],
        },
      },
    ],
  },
  {
    path: '/standards',
    component: MainLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        component: StandardPage,
        meta: {
          requiresAuth: true,
          icon: 'fa-solid fa-book',
          name: 'Standards',
        },
      },
    ],
  },
];

const authRouters: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: LoginPage,
        meta: {
          requiresAuth: false,
        },
      },
    ],
  },
];

const fallbackRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: NotFoundPage,
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...routers, ...authRouters, fallbackRoute],
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get(ACCESS_TOKEN);
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const userStr = Cookies.get(PROFILE);
  const user = userStr ? JSON.parse(userStr) : null;

  if (requiresAuth && !token) {
    return next('/auth/login');
  }

  if (to.path === '/auth/login' && token) {
    return next('/');
  }

  const requiredPermissions = to.matched.flatMap(record => record.meta.permissions || []);
  if (requiredPermissions.length > 0) {
    if (!user || !requiredPermissions.includes(user.role)) {
      return next('/');
    }
  }

  next();
});

export default router;
