<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTasks } from '@/composables/useTasks';
import { useAuthStore } from '@/stores/auth';
import { toast } from '@/utils/toast.ts';
import * as bootstrap from 'bootstrap';

const { tasks, getAllTasks, createTask, updateTask, deleteTask } = useTasks();
const authStore = useAuthStore();

onMounted(async () => {
  await getAllTasks();
});

const updateTaskData = ref({
  id: 0,
  code: '',
  name: '',
});
const deleteTaskId = ref<number | null>(null);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const editTask = async (task: any) => {
  updateTaskData.value.id = task.id;
  updateTaskData.value.code = task.code;
  updateTaskData.value.name = task.name;

  const modalElement = document.getElementById('editTaskModal');
  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement as HTMLElement);
  modalInstance.show();
};

const updateTaskHandler = async () => {
  if (!updateTaskData.value.code || !updateTaskData.value.name) {
    toast.error('Vui lòng điền đầy đủ thông tin', 5000);
    return;
  }

  try {
    await updateTask(updateTaskData.value.id, updateTaskData.value);

    const modalElement = document.getElementById('editTaskModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement as HTMLElement);
    modalInstance?.hide();
  } catch {}
};

const deleteTaskModal = async (taskId: number) => {
  if (!taskId) {
    toast.error('Không tìm thấy công việc', 5000);
    return;
  }

  try {
    await deleteTask(taskId);
    deleteTaskId.value = null;

    const modalElement = document.getElementById('deleteTaskModal');
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
          <th v-if="authStore.users?.role === 'admin'">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(task, index) in tasks" :key="task.code">
          <th>{{ index + 1 }}</th>
          <td>{{ task.code }}</td>
          <td>{{ task.name }}</td>
          <td v-if="authStore.users?.role === 'admin'">
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-sm btn-warning" @click="editTask(task)">
                Edit
              </button>

              <button
                type="button"
                class="btn btn-sm btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#deleteTaskModal"
                @click="deleteTaskId = task.id"
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

  <div
    class="modal fade"
    id="editTaskModal"
    tabindex="-1"
    aria-labelledby="editTaskModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="editTaskModalLabel">Edit Task</h2>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="updateTaskHandler">
            <div class="mb-3">
              <label for="taskUpdateCode" class="form-label">Task Code</label>
              <input
                type="text"
                class="form-control"
                id="taskUpdateCode"
                placeholder="Enter task code"
                v-model="updateTaskData.code"
              />
            </div>

            <div class="mb-3">
              <label for="taskUpdateName" class="form-label">Task Name</label>
              <input
                type="text"
                class="form-control"
                id="taskUpdateName"
                placeholder="Enter task name"
                v-model="updateTaskData.name"
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
    id="deleteTaskModal"
    tabindex="-1"
    aria-labelledby="deleteTaskModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="deleteTaskModalLabel">Delete Task</h2>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="deleteTaskModal(deleteTaskId as number)">
            <p>Are you sure you want to delete this task?</p>
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
