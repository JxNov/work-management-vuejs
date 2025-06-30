<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTasks } from '@/composables/useTasks';
import { useAuthStore } from '@/stores/auth';
import { toast } from '@/utils/toast.ts';
import * as bootstrap from 'bootstrap';

const { tasks, getAllTasks, createTask } = useTasks();
const authStore = useAuthStore();

onMounted(async () => {
  await getAllTasks();
});

const code = ref<string>('');
const name = ref<string>('');

const addTask = async () => {
  if (!code.value || !name.value) {
    toast.error('Vui lòng điền đầy đủ thông tin', 5000);
    return;
  }

  const payload = {
    code: code.value,
    name: name.value,
  };

  try {
    await createTask(payload);

    code.value = '';
    name.value = '';

    const modalElement = document.getElementById('addTaskModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement as HTMLElement);
    modalInstance?.hide();
  } catch {}
};
</script>

<template>
  <div class="container">
    <div class="mb-4 d-flex justify-content-between align-items-center">
      <h1>Tasks Page</h1>

      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addTaskModal"
        v-if="authStore.users?.role === 'admin'"
      >
        Add Task
      </button>
    </div>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Code</th>
          <th>Name</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(task, index) in tasks" :key="task.code">
          <th>{{ index + 1 }}</th>
          <td>{{ task.code }}</td>
          <td>{{ task.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    class="modal fade"
    id="addTaskModal"
    tabindex="-1"
    aria-labelledby="addTaskModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="addTaskModalLabel">Add New Task</h2>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="addTask">
            <div class="mb-3">
              <label for="taskCode" class="form-label">Task Code</label>
              <input
                type="text"
                class="form-control"
                id="taskCode"
                placeholder="Enter task code"
                v-model="code"
              />
            </div>

            <div class="mb-3">
              <label for="taskName" class="form-label">Task Name</label>
              <input
                type="text"
                class="form-control"
                id="taskName"
                placeholder="Enter task name"
                v-model="name"
              />
            </div>

            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
