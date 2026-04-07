<template>
  <div class="student-list-page">
    <div class="page-header">
      <div class="header-content">
        <div class="header-badge">Student Directory</div>
        <h1>Student List</h1>
      </div>
    </div>

    <div class="page-body">
      <div class="panel actions-panel">
        <div class="form-row">
          <label for="academic-year-id">Academic Year ID</label>
          <input id="academic-year-id" type="text" v-model="academicYearId" placeholder="e.g. 1" />
        </div>

        <div class="form-row">
          <label for="class-id">Class ID</label>
          <input id="class-id" type="text" v-model="classId" placeholder="e.g. 10" />
        </div>

        <div class="button-row">
          <button class="btn primary" @click="loadStudentList" :disabled="isLoading">
            {{ isLoading ? 'Loading...' : 'Fetch Student List' }}
          </button>
          <button class="btn secondary" @click="loadClassInfo" :disabled="isLoading">
            {{ isLoading ? 'Loading...' : 'Refresh Class Info' }}
          </button>
        </div>

        <div v-if="error" class="alert error">{{ error }}</div>
      </div>

      <div class="panel info-panel" v-if="classInfo">
        <h2>Class Info</h2>
        <div class="info-content">
          <template v-if="Array.isArray(classInfo)">
            <div v-for="(item, index) in classInfo" :key="index" class="info-block">
              <pre>{{ item }}</pre>
            </div>
          </template>
          <template v-else>
            <pre>{{ classInfo }}</pre>
          </template>
        </div>
      </div>

      <div class="panel table-panel">
        <h2>Students</h2>

        <div v-if="isLoading" class="status-message">Loading student list...</div>
        <div v-else-if="studentList.length === 0" class="status-message">No student records loaded yet.</div>

        <div v-if="studentList.length > 0" class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Roll</th>
                <th>Class</th>
                <th>Section</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, index) in studentList" :key="student.id || index">
                <td>{{ index + 1 }}</td>
                <td>{{ student.name || student.full_name || student.student_name || '-' }}</td>
                <td>{{ student.roll || student.roll_no || student.student_roll || '-' }}</td>
                <td>{{ student.class_name || student.class || student.class_id || '-' }}</td>
                <td>{{ student.section || student.section_name || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'

const websiteStore = useWebsiteStore()
const academicYearId = ref('')
const classId = ref('')

const isLoading = computed(() => websiteStore.isLoading)
const error = computed(() => websiteStore.error)
const studentList = computed(() => websiteStore.studentList || [])
const classInfo = computed(() => websiteStore.classInfo)

const loadClassInfo = async () => {
  await websiteStore.fetchClassInfo()
}

const loadStudentList = async () => {
  await websiteStore.fetchStudentList(academicYearId.value, classId.value)
}

onMounted(() => {
  loadClassInfo()
})
</script>

<style scoped>
.student-list-page {
  min-height: 100vh;
  background: #f7fafc;
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
  letter-spacing: -0.04em;
}

.header-subtitle {
  margin-top: 14px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  opacity: .88;
  line-height: 1.8;
}

.page-body {
  max-width: 1100px;
  margin: -40px auto 40px;
  padding: 0 20px 40px;
  display: grid;
  gap: 24px;
}

.panel {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
}

.actions-panel {
  display: grid;
  gap: 18px;
}

.form-row {
  display: grid;
  gap: 8px;
}

.form-row label {
  font-weight: 600;
  color: #0f172a;
}

.form-row input {
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 1rem;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.btn {
  border: none;
  border-radius: 999px;
  padding: 12px 24px;
  font-weight: 700;
  cursor: pointer;
}

.btn.primary {
  background: #2563eb;
  color: white;
}

.btn.secondary {
  background: #e2e8f0;
  color: #0f172a;
}

.alert.error {
  color: #991b1b;
  background: #fee2e2;
  padding: 14px 18px;
  border-radius: 12px;
}

.info-panel pre,
.status-message {
  margin: 0;
  color: #334155;
  white-space: pre-wrap;
  word-break: break-word;
}

.data-table {
  width: 100%;
  min-width: 680px;
  border-collapse: collapse;
  margin-top: 18px;
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
  padding: 18px 0;
  color: #475569;
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
    gap: 18px;
  }

  .panel {
    padding: 18px;
    border-radius: 16px;
  }

  .button-row {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .data-table th,
  .data-table td {
    padding: 12px 14px;
    font-size: 0.92rem;
  }
}
</style>
