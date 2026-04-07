<template>
  <div class="teacher-list-page">
    <div class="page-header">
      <div class="header-content">
        <div class="header-badge">Teacher Directory</div>
        <h1>Teacher List</h1>
      </div>
    </div>

    <div class="page-body">
      <div class="panel table-panel">
        <div class="panel-header">
          <h2>Teachers</h2>
          <button class="btn refresh-btn" @click="loadTeacherList" :disabled="isLoading">
            {{ isLoading ? 'Refreshing...' : 'Refresh List' }}
          </button>
        </div>

        <div v-if="isLoading" class="status-message">Loading teachers...</div>
        <div v-else-if="teacherList.length === 0" class="status-message">No teachers loaded yet.</div>

        <div v-if="teacherList.length > 0" class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(teacher, index) in teacherList" :key="teacher.id || index">
                <td>{{ index + 1 }}</td>
                <td>{{ teacher.name || teacher.full_name || teacher.teacher_name || '-' }}</td>
                <td>{{ teacher.designation || teacher.role || '-' }}</td>
                <td>{{ teacher.email || teacher.email_address || '-' }}</td>
                <td>{{ teacher.phone || teacher.mobile || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="error" class="alert error">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'

const websiteStore = useWebsiteStore()
const isLoading = computed(() => websiteStore.isLoading)
const error = computed(() => websiteStore.error)
const teacherList = computed(() => websiteStore.teacherList || [])

const loadTeacherList = async () => {
  await websiteStore.fetchTeacherList()
}

onMounted(() => {
  loadTeacherList()
})
</script>

<style scoped>
.teacher-list-page {
  min-height: 100vh;
  background: #f8fafc;
  font-family: Inter, system-ui, sans-serif;
}

.page-header {
  background: linear-gradient(135deg, #0f172a 0%, #2563eb 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
}

.header-content {
  max-width: 900px;
  margin: 0 auto;
}

.header-badge {
  display: inline-flex;
  padding: 8px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  margin-bottom: 18px;
  font-size: 13px;
  letter-spacing: .04em;
  text-transform: uppercase;
}

.page-header h1 {
  margin: 0;
  font-size: 3rem;
}

.page-subtitle {
  margin-top: 14px;
  opacity: .9;
  line-height: 1.8;
}

.page-body {
  max-width: 1100px;
  margin: -40px auto 40px;
  padding: 0 20px 40px;
}

.panel {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}

.refresh-btn {
  border: none;
  border-radius: 999px;
  padding: 12px 22px;
  background: #2563eb;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.data-table {
  width: 100%;
  min-width: 680px;
  border-collapse: collapse;
  margin-top: 20px;
}

.table-scroll {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.data-table th,
.data-table td {
  text-align: left;
  padding: 14px 16px;
  border-bottom: 1px solid #e2e8f0;
}

.data-table th {
  font-weight: 700;
  background: #f8fafc;
}

.status-message {
  margin-top: 20px;
  color: #475569;
}

.alert.error {
  margin-top: 18px;
  color: #991b1b;
  background: #fee2e2;
  padding: 14px 18px;
  border-radius: 12px;
}

@media (max-width: 640px) {
  .page-header {
    padding: 44px 16px;
  }

  .page-header h1 {
    font-size: 2.2rem;
  }

  .page-body {
    margin-top: -28px;
    padding: 0 14px 28px;
  }

  .panel {
    padding: 18px;
    border-radius: 16px;
  }

  .panel-header {
    align-items: stretch;
  }

  .refresh-btn {
    width: 100%;
    justify-content: center;
  }

  .data-table th,
  .data-table td {
    padding: 12px 14px;
    font-size: 0.92rem;
  }
}
</style>
