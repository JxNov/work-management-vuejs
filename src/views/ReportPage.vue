<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useReports } from '@/composables/useReports';
import { CDatePicker } from '@coreui/vue-pro';
import { useUsers } from '@/composables/useUsers';

const { users, getAllUsers } = useUsers();
const { reports, getDailySummary } = useReports();

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

onMounted(async () => {
  const today = new Date();
  const formattedDate = formatDate(today);
  await getDailySummary(formattedDate, usernameFilter.value);
  await getAllUsers();
});

const dateFilter = ref(new Date());
const usernameFilter = ref('');

const changeDate = async () => {
  const formattedDate = formatDate(dateFilter.value);
  await getDailySummary(formattedDate, usernameFilter.value);
};
</script>

<template>
  <div class="container">
    <div class="mb-4 d-flex justify-content-between align-items-center">
      <h1>Reports Page</h1>

      <div class="d-flex align-items-center gap-3">
        <select class="form-select" v-model="usernameFilter" @change="changeDate">
          <option value="" selected>All Users</option>
          <option v-for="user in users" :key="user.id" :value="user.username">
            {{ user.username }}
          </option>
        </select>

        <CDatePicker locale="en-US" v-model:date="dateFilter" @update:date="changeDate" />
      </div>
    </div>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Username</th>
          <th>Total</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="reports.length === 0">
          <td colspan="3" class="text-center">No reports found</td>
        </tr>

        <template v-for="(report, index) in reports" :key="index">
          <tr>
            <td>{{ index + 1 }}</td>
            <td>{{ report.username }}</td>
            <td>{{ report.total }}</td>
          </tr>

          <tr v-for="(log, logIndex) in report.logs" :key="`${index}-${logIndex}`">
            <td></td>
            <td colspan="2" class="ps-4">Task: {{ log.task }}: {{ log.quantity }}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
