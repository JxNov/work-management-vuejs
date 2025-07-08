<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTasks } from '@/composables/useTasks.ts';
import { useStandards } from '@/composables/useStandards';
import { toast } from '@/utils/toast.ts';
import * as bootstrap from 'bootstrap';

const { standards, getAllStandards, setStandard, deleteStandard } = useStandards();
const { tasks, getAllTasks } = useTasks();

onMounted(async () => {
  await getAllStandards();
  await getAllTasks();
});

const taskId = ref<number | null>(null);
const dailyMinimum = ref<number | null>(null);
const updateStandardData = ref({
  id: null as number | null,
  taskId: null as number | null,
  dailyMinimum: null as number | null,
});
const deleteStandardId = ref<number | null>(null);

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

const editStandard = (id: number, dailyMinimumValue: number, taskIdValue: number) => {
  updateStandardData.value = {
    id: id,
    taskId: taskIdValue,
    dailyMinimum: dailyMinimumValue,
  };

  const modalElement = document.getElementById('editStandardModal');
  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement as HTMLElement);
  modalInstance.show();
};

const updateStandard = async () => {
  if (!updateStandardData.value.taskId || !updateStandardData.value.dailyMinimum) {
    toast.error('Vui lòng điền đầy đủ thông tin', 5000);
    return;
  }

  const payload = {
    id: updateStandardData.value.id ?? undefined,
    taskId: updateStandardData.value.taskId,
    dailyMinimum: updateStandardData.value.dailyMinimum,
  };

  try {
    await setStandard(payload);

    updateStandardData.value = {
      id: null,
      taskId: null,
      dailyMinimum: null,
    };

    const modalElement = document.getElementById('editStandardModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement as HTMLElement);
    modalInstance?.hide();
  } catch {}
};

const deleteStandardModal = async () => {
  if (!deleteStandardId.value) return;

  try {
    await deleteStandard(deleteStandardId.value);
    deleteStandardId.value = null;

    const modalElement = document.getElementById('deleteStandardModal');
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
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="standards.length === 0">
          <td colspan="4" class="text-center">No standards available</td>
        </tr>

        <tr v-for="(standard, index) in standards" :key="index">
          <th>{{ index + 1 }}</th>
          <td>{{ standard.task.name }}</td>
          <td>{{ standard.dailyMinimum }}</td>
          <td>
            <div class="d-flex gap-2">
              <button
                type="button"
                class="btn btn-sm btn-warning"
                @click="editStandard(standard.id, standard.dailyMinimum, standard.task.id)"
              >
                Edit
              </button>

              <button
                type="button"
                class="btn btn-sm btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#deleteStandardModal"
                @click="deleteStandardId = standard.id"
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

  <div
    class="modal fade"
    id="editStandardModal"
    tabindex="-1"
    aria-labelledby="editStandardModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="editStandardModalLabel">Edit Standard</h2>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="updateStandard">
            <div class="mb-3">
              <label for="taskIdUpdate" class="form-label">Task</label>
              <select class="form-select" id="taskIdUpdate" v-model="updateStandardData.taskId">
                <option value="null" disabled selected>Select a task</option>
                <option v-for="task in tasks" :key="task.id" :value="task.id">
                  {{ task.name }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="dailyMinimumUpdate" class="form-label">Daily Minimum</label>
              <input
                type="number"
                class="form-control"
                id="dailyMinimumUpdate"
                placeholder="Enter daily minimum"
                v-model="updateStandardData.dailyMinimum"
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
    id="deleteStandardModal"
    tabindex="-1"
    aria-labelledby="deleteStandardModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="deleteStandardModalLabel">Delete Standard</h2>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="deleteStandardModal">
            <p>Are you sure you want to delete this standard?</p>
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
