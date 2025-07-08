<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useWorkLogs } from '@/composables/useWorkLogs';
import { toast } from '@/utils/toast.ts';
import * as bootstrap from 'bootstrap';
import { useTasks } from '@/composables/useTasks.ts';
import { CDatePicker } from '@coreui/vue-pro';

const { tasks, getAllTasks } = useTasks();
const { workLogs, getUserWorkLogsByDate, createOrUpdateWorkLog, deleteWorkLog } = useWorkLogs();

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
const updateWorkLogData = ref({
  taskId: null as number | null,
  quantity: null as number | null,
  date: new Date(),
});
const deleteWorkLogId = ref<number | null>(null);

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

const editWorkLog = (quantityValue: number, dateValue: string, taskIdValue: number) => {
  updateWorkLogData.value = {
    taskId: taskIdValue,
    quantity: quantityValue,
    date: new Date(dateValue),
  };

  const modalElement = document.getElementById('editWorkLogModal');
  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement as HTMLElement);
  modalInstance.show();
};

const handleUpdateWorkLog = async () => {
  if (!updateWorkLogData.value.taskId || !updateWorkLogData.value.quantity) {
    toast.error('Vui lòng điền đầy đủ thông tin', 5000);
    return;
  }

  const payload = {
    taskId: updateWorkLogData.value.taskId,
    quantity: updateWorkLogData.value.quantity,
    date: formatDate(updateWorkLogData.value.date),
  };

  try {
    await createOrUpdateWorkLog(payload);

    updateWorkLogData.value = {
      taskId: null,
      quantity: null,
      date: new Date(),
    };

    const modalElement = document.getElementById('editWorkLogModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement as HTMLElement);
    modalInstance?.hide();
  } catch {}
};

const deleteWorkLogModal = async (workLogId: number) => {
  if (!workLogId) {
    toast.error('Không tìm thấy nhật ký công việc', 5000);
    return;
  }

  try {
    await deleteWorkLog(workLogId);
    deleteWorkLogId.value = null;

    const modalElement = document.getElementById('deleteWorkLogModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement as HTMLElement);
    modalInstance?.hide();
  } catch {
    toast.error('Không thể xóa nhật ký công việc', 5000);
  }
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
          <th>Enough</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="!workLogs?.logs">
          <td colspan="5" class="text-center">No work logs found</td>
        </tr>

        <tr v-for="(workLog, index) in workLogs?.logs" :key="index" v-else>
          <th>{{ index + 1 }}</th>
          <td>{{ workLog.task }}</td>
          <td>{{ workLog.quantity }}</td>
          <td>
            <span
              class="badge"
              :class="{
                'bg-success': workLog.isEnough === true,
                'bg-danger': workLog.isEnough === false,
              }"
            >
              {{ workLog.isEnough ? 'Enough' : 'Not Enough' }}
            </span>
          </td>
          <td>
            <div class="d-flex gap-2">
              <button
                type="button"
                class="btn btn-sm btn-warning"
                @click="editWorkLog(workLog.quantity, workLog.date, workLog.taskId)"
              >
                Edit
              </button>

              <button
                type="button"
                class="btn btn-sm btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#deleteWorkLogModal"
                @click="deleteWorkLogId = workLog.id"
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

  <div
    class="modal fade"
    id="editWorkLogModal"
    tabindex="-1"
    aria-labelledby="editWorkLogModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="editWorkLogModalLabel">Edit Work Log</h2>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="handleUpdateWorkLog">
            <div class="mb-3">
              <label for="taskIdUpdate" class="form-label">Task</label>
              <select class="form-select" id="taskIdUpdate" v-model="updateWorkLogData.taskId">
                <option value="null" disabled selected>Select a task</option>
                <option v-for="task in tasks" :key="task.id" :value="task.id">
                  {{ task.name }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <CDatePicker label="Date" locale="en-US" v-model:date="updateWorkLogData.date" />
            </div>

            <div class="mb-3">
              <label for="quantityUpdate" class="form-label">Quantity</label>
              <input
                type="number"
                class="form-control"
                id="quantityUpdate"
                placeholder="Enter quantity"
                v-model="updateWorkLogData.quantity"
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

  <div
    class="modal fade"
    id="deleteWorkLogModal"
    tabindex="-1"
    aria-labelledby="deleteWorkLogModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="deleteWorkLogModalLabel">Delete Work Log</h2>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="deleteWorkLogModal(deleteWorkLogId as number)">
            <p>Are you sure you want to delete this work log?</p>
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
