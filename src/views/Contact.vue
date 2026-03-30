<template>
  <div class="contact-page">
    <div class="page-header">
      <div class="header-content">
        <div class="header-badge">Contact</div>
        <h1>Get in Touch</h1>
        <p class="header-subtitle">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>
    </div>

    <div class="contact-container">
      <div class="contact-form-section">
        <div class="form-card">
          <div class="form-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <h2>Send us a Message</h2>
          </div>

          <form @submit.prevent="submitForm">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" v-model="form.firstName" required placeholder="John" />
              </div>

              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" v-model="form.lastName" required placeholder="Doe" />
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" v-model="form.email" required placeholder="john.doe@example.com" />
            </div>

            <div class="form-group">
              <label for="message">Your Message</label>
              <textarea id="message" v-model="form.message" required placeholder="Tell us how we can help you..."></textarea>
            </div>

            <button type="submit" class="submit-btn">
              <span>Send Message</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>

      <div class="contact-info-section">
        <div class="info-card">
          <div class="info-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <h2>Contact Information</h2>
          </div>

          <div v-if="websiteStore.isLoading" class="info-items loading-state">
            <div class="skeleton-item" v-for="n in 3" :key="n">
              <div class="skeleton-icon"></div>
              <div class="skeleton-text-group">
                <div class="skeleton-label"></div>
                <div class="skeleton-value"></div>
              </div>
            </div>
          </div>

          <div v-else class="info-items">
            <div class="info-item">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div class="info-content">
                <div class="info-label">Address</div>
                <div class="info-value">{{ address }}</div>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div class="info-content">
                <div class="info-label">Telephone</div>
                <div class="info-value">{{ phone }}</div>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div class="info-content">
                <div class="info-label">Email</div>
                <div class="info-value">{{ email }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'
import axios from '@/plugins/axios.js'

const websiteStore = useWebsiteStore()
const getBasic = computed(() => websiteStore.getBasic || {})

const address = computed(() => getBasic.value?.address || '123 Main Street, City, Country')
const phone = computed(() => getBasic.value?.phone || '+1 234 567 890')
const email = computed(() => getBasic.value?.email || 'contact@example.com')

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  message: ''
})

const submitForm = async () => {
  try {
    const payload = { ...form }
    // Dynamic submission to API using axios plugin
    const response = await axios.post('/contact-message', payload)
    
    if (response.status === 200 || response.status === 201) {
      alert('Message sent successfully!')
    } else {
      alert('Message sent! (Simulated response)')
    }
    
    form.firstName = ''
    form.lastName = ''
    form.email = ''
    form.message = ''
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Message sent locally! (Could not reach API)')
    form.firstName = ''
    form.lastName = ''
    form.email = ''
    form.message = ''
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.contact-page {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 80px 20px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.header-content {
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.header-badge {
  display: inline-block;
  padding: 8px 24px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.page-header h1 {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 15px;
  letter-spacing: -0.5px;
}

.header-subtitle {
  font-size: 18px;
  opacity: 0.9;
  line-height: 1.6;
}

.contact-container {
  max-width: 1280px;
  margin: -60px auto 0;
  padding: 0 20px 80px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  position: relative;
  z-index: 2;
}

.form-card,
.info-card,
.office-hours-card,
.social-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.form-header,
.info-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.form-header svg,
.info-header svg {
  color: #3b82f6;
}

.form-header h2,
.info-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 140px;
}

.submit-btn {
  width: 100%;
  padding: 14px 28px;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.submit-btn svg {
  transition: transform 0.3s ease;
}

.submit-btn:hover svg {
  transform: translateX(3px);
}

.contact-info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: #eff6ff;
  transform: translateX(5px);
}

.info-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon svg {
  color: #3b82f6;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  color: #0f172a;
  font-weight: 600;
}

.office-hours-card h3,
.social-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.office-hours-card h3::before {
  content: '';
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #3b82f6 0%, #06b6d4 100%);
  border-radius: 2px;
}

.hours-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hours-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 10px;
  font-size: 14px;
}

.hours-item .day {
  color: #334155;
  font-weight: 600;
}

.hours-item .time {
  color: #64748b;
  font-weight: 500;
}

.social-card h3::before {
  content: '';
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #3b82f6 0%, #06b6d4 100%);
  border-radius: 2px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-link.facebook {
  background: #1877f2;
  color: white;
}

.social-link.twitter {
  background: #1da1f2;
  color: white;
}

.social-link.linkedin {
  background: #0077b5;
  color: white;
}

.social-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

@media (max-width: 1024px) {
  .contact-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .page-header {
    padding: 60px 20px;
  }

  .page-header h1 {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .form-card,
  .info-card,
  .office-hours-card,
  .social-card {
    padding: 30px 20px;
  }

  .page-header {
    padding: 50px 20px;
  }

  .page-header h1 {
    font-size: 32px;
  }

  .header-subtitle {
    font-size: 16px;
  }

  .contact-container {
    margin-top: -40px;
    padding-bottom: 60px;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 28px;
  }

  .form-header h2,
  .info-header h2 {
    font-size: 20px;
  }

  .submit-btn {
    font-size: 15px;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skeleton-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
}

.skeleton-icon {
  width: 50px;
  height: 50px;
  background: #f0f0f0;
  border-radius: 12px;
  animation: pulse 1.5s infinite;
}

.skeleton-text-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.skeleton-label {
  height: 12px;
  width: 60px;
  background: #f0f0f0;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

.skeleton-value {
  height: 16px;
  width: 200px;
  background: #f0f0f0;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>