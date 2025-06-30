<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useWorkLogs } from '@/composables/useWorkLogs';
import { toast } from '@/utils/toast.ts';
import * as bootstrap from 'bootstrap';
import { useTasks } from '@/composables/useTasks.ts';
import { CDatePicker } from '@coreui/vue-pro';

const { tasks, getAllTasks } = useTasks();
const { workLogs, getUserWorkLogsByDate, createOrUpdateWorkLog } = useWorkLogs();

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

onMounted(async () => {
  const today = new Date();
  const formattedDate = formatDate(today);
  await getUserWorkLogsByDate(formattedDate);
  await getAllTasks();
});

const taskId = ref<number | null>(null);
const quantity = ref<number | null>(null);
const date = ref(new Date());
const dateFilter = ref(new Date());

const handleWorkLog = async () => {
  if (!taskId.value || !quantity.value) {
    toast.error('Vui lòng điền đầy đủ thông tin', 5000);
    return;
  }

  const payload = {
    taskId: taskId.value,
    quantity: quantity.value,
    date: formatDate(date.value),
  };

  try {
    await createOrUpdateWorkLog(payload);

    taskId.value = null;
    quantity.value = null;
    date.value = new Date();

    const modalElement = document.getElementById('addWorkLogModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement as HTMLElement);
    modalInstance?.hide();
  } catch {}
};

const changeDate = async () => {
  const formattedDate = formatDate(dateFilter.value);
  await getUserWorkLogsByDate(formattedDate);
};
</script>

<template>
  <div class="container">
    <div class="mb-4 d-flex justify-content-between align-items-center">
      <h1>Work Logs Page</h1>

      <div class="d-flex align-items-center gap-3">
        <CDatePicker locale="en-US" v-model:date="dateFilter" @update:date="changeDate" />
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#addWorkLogModal"
        >
          Add Work Log
        </button>
      </div>
    </div>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Task</th>
          <th>Quantity</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="workLogs.length === 0">
          <td colspan="3" class="text-center">No work logs found</td>
        </tr>

        <tr v-for="(workLog, index) in workLogs" :key="index" v-else>
          <th>{{ index + 1 }}</th>
          <td>{{ workLog.tasks.name }}</td>
          <td>{{ workLog.quantity }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    class="modal fade"
    id="addWorkLogModal"
    tabindex="-1"
    aria-labelledby="addWorkLogModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="addWorkLogModalLabel">Add New Work Log</h2>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="handleWorkLog">
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
              <CDatePicker label="Date" locale="en-US" v-model:date="date" />
            </div>

            <div class="mb-3">
              <label for="quantity" class="form-label">Quantity</label>
              <input
                type="number"
                class="form-control"
                id="quantity"
                placeholder="Enter quantity"
                v-model="quantity"
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
