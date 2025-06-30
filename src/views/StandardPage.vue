<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTasks } from '@/composables/useTasks.ts';
import { useStandards } from '@/composables/useStandards';
import { useAuthStore } from '@/stores/auth';
import { toast } from '@/utils/toast.ts';
import * as bootstrap from 'bootstrap';

const { standards, getAllStandards, setStandard } = useStandards();
const { tasks, getAllTasks } = useTasks();
const authStore = useAuthStore();

onMounted(async () => {
  await getAllStandards();
  await getAllTasks();
});

const taskId = ref<number | null>(null);
const dailyMinimum = ref<number | null>(null);

const addStandard = async () => {
  if (!taskId.value || !dailyMinimum.value) {
    toast.error('Vui lòng điền đầy đủ thông tin', 5000);
    return;
  }

  const payload = {
    taskId: taskId.value,
    dailyMinimum: dailyMinimum.value,
  };

  try {
    await setStandard(payload);

    taskId.value = null;
    dailyMinimum.value = null;

    const modalElement = document.getElementById('addStandardModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement as HTMLElement);
    modalInstance?.hide();
  } catch {}
};
</script>

<template>
  <div class="container">
    <div class="mb-4 d-flex justify-content-between align-items-center">
      <h1>Standards Page</h1>

      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addStandardModal"
        v-if="authStore.users?.role === 'admin'"
      >
        Add Standard
      </button>
    </div>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Task</th>
          <th>Daily Minimum</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(standard, index) in standards" :key="index">
          <th>{{ index + 1 }}</th>
          <td>{{ standard.task.name }}</td>
          <td>{{ standard.dailyMinimum }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    class="modal fade"
    id="addStandardModal"
    tabindex="-1"
    aria-labelledby="addStandardModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="addStandardModalLabel">Add New Task</h2>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="addStandard">
            <div class="mb-3">
              <label for="taskId" class="form-label">Task</label>
              <select class="form-select" id="taskId" v-model="taskId">
                <option value="null" disabled selected>Select a task</option>
                <option v-for="task in tasks" :key="task.id" :value="task.id">
                  {{ task.name }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="dailyMinimum" class="form-label">Daily Minimum</label>
              <input
                type="number"
                class="form-control"
                id="dailyMinimum"
                placeholder="Enter daily minimum"
                v-model="dailyMinimum"
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
