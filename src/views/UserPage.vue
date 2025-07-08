<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useUsers } from '@/composables/useUsers';
import { useAuthStore } from '@/stores/auth';
import { toast } from '@/utils/toast.ts';
import * as bootstrap from 'bootstrap';

const { users, getAllUsers, createUser, updateUser, deleteUser } = useUsers();
const authStore = useAuthStore();

onMounted(async () => {
  await getAllUsers();
});

const updateUserData = ref({
  id: 0,
  username: '',
  email: '',
  role: '',
});
const deleteUserId = ref<number | null>(null);
const username = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');
const role = ref<string>('');
const roles = [
  {
    value: 'admin',
    label: 'Admin',
  },
  {
    value: 'director',
    label: 'Director',
  },
  {
    value: 'staff',
    label: 'Staff',
  },
];

const addUser = async () => {
  if (!username.value || !email.value || !password.value || !role.value) {
    toast.error('Vui lòng điền đầy đủ thông tin', 5000);
    return;
  }

  const payload = {
    username: username.value,
    email: email.value,
    password: password.value,
    role: role.value,
  };

  try {
    await createUser(payload);

    username.value = '';
    email.value = '';
    password.value = '';
    role.value = '';

    const modalElement = document.getElementById('addUserModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement as HTMLElement);
    modalInstance?.hide();
  } catch {}
};

const editUser = (id: number, usernameValue: string, emailValue: string, roleValue: string) => {
  updateUserData.value.id = id;
  updateUserData.value.username = usernameValue;
  updateUserData.value.email = emailValue;
  updateUserData.value.role = roleValue;

  const modalElement = document.getElementById('editUserModal');
  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement as HTMLElement);
  modalInstance.show();
};

const updateUserInfo = async () => {
  if (!updateUserData.value.username || !updateUserData.value.email || !updateUserData.value.role) {
    toast.error('Vui lòng điền đầy đủ thông tin', 5000);
    return;
  }

  try {
    await updateUser(updateUserData.value.id, updateUserData.value);

    const modalElement = document.getElementById('editUserModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement as HTMLElement);
    modalInstance?.hide();
  } catch {}
};

const deleteUserModal = async (userId: number) => {
  if (!userId) {
    toast.error('Không tìm thấy người dùng', 5000);
    return;
  }

  try {
    await deleteUser(userId);
    deleteUserId.value = null;

    const modalElement = document.getElementById('deleteUserModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement as HTMLElement);
    modalInstance?.hide();
  } catch {}
};
</script>

<template>
  <div class="container">
    <div class="mb-4 d-flex justify-content-between align-items-center">
      <h1>Users Page</h1>

      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addUserModal"
        v-if="authStore.users?.role === 'admin'"
      >
        Add User
      </button>
    </div>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th v-if="authStore.users?.role === 'admin'">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(user, index) in users" :key="user.id">
          <th>{{ index + 1 }}</th>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td v-if="authStore.users?.role === 'admin'">
            <div class="d-flex gap-2">
              <button
                type="button"
                class="btn btn-sm btn-warning"
                @click="editUser(user.id, user.username, user.email, user.role)"
              >
                Edit
              </button>

              <button
                type="button"
                class="btn btn-sm btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#deleteUserModal"
                @click="deleteUserId = user.id"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    class="modal fade"
    id="addUserModal"
    tabindex="-1"
    aria-labelledby="addUserModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="addUserModalLabel">Add New User</h2>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="addUser">
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                placeholder="Enter username"
                v-model="username"
              />
            </div>

            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                placeholder="Enter email"
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

            <div class="mb-3">
              <label for="role" class="form-label">Role</label>
              <select class="form-select" id="role" v-model="role">
                <option value="" disabled selected>Select role</option>
                <option
                  v-for="roleOption in roles"
                  :key="roleOption.value"
                  :value="roleOption.value"
                >
                  {{ roleOption.label }}
                </option>
              </select>
            </div>

            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="editUserModal"
    tabindex="-1"
    aria-labelledby="editUserModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="editUserModalLabel">Edit User</h2>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="updateUserInfo">
            <div class="mb-3">
              <label for="updateUsername" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="updateUsername"
                placeholder="Enter username"
                v-model="updateUserData.username"
              />
            </div>

            <div class="mb-3">
              <label for="updateEmail" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                id="updateEmail"
                placeholder="Enter email"
                v-model="updateUserData.email"
              />
            </div>

            <div class="mb-3">
              <label for="updateRole" class="form-label">Role</label>
              <select class="form-select" id="updateRole" v-model="updateUserData.role">
                <option value="" disabled selected>Select role</option>
                <option
                  v-for="roleOption in roles"
                  :key="roleOption.value"
                  :value="roleOption.value"
                >
                  {{ roleOption.label }}
                </option>
              </select>
            </div>

            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="deleteUserModal"
    tabindex="-1"
    aria-labelledby="deleteUserModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="deleteUserModalLabel">Delete User</h2>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="deleteUserModal(deleteUserId as number)">
            <p>Are you sure you want to delete this user?</p>
            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-danger">Delete</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
