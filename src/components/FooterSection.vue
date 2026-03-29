<template>
  <footer class="footer">
    <div class="footer-glow"></div>

    <div v-if="footerImage" class="footer-banner">
      <img :src="footerImage" alt="Footer Image" />
    </div>

    <div class="footer-top">

      <div class="footer-left">
        <img v-if="logo" :src="logo" alt="School Logo" class="logo" />
        <p class="motto">{{ footerText }}</p>
        <div class="social-icons">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener" aria-label="Twitter">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn">
            <i class="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>

      <div class="footer-cols-group">

  
        <div class="footer-col footer-col--contact" :class="{ open: openSection === 'contact' }">
          <h4 @click="toggleSection('contact')">
            <span>Contact</span>
            <i class="fas fa-chevron-down accordion-icon"></i>
          </h4>
          <div class="accordion-body">
            <div class="contact-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>{{ address }}</span>
            </div>
            <div class="contact-item">
              <i class="fas fa-phone-alt"></i>
              <span>{{ phone }}</span>
            </div>
            <div class="contact-item">
              <i class="fas fa-envelope"></i>
              <a :href="`mailto:${email}`">{{ email }}</a>
            </div>
          </div>
        </div>

        <div class="footer-col footer-col--support" :class="{ open: openSection === 'support' }">
          <h4 @click="toggleSection('support')">
            <span>Technical Support</span>
            <i class="fas fa-chevron-down accordion-icon"></i>
          </h4>
          <div class="accordion-body">
            <div class="contact-item">
              <i class="fas fa-building"></i>
              <span>{{ supportCompany }}</span>
            </div>
            <div class="contact-item">
              <i class="fas fa-phone-alt"></i>
              <span>{{ supportPhone }}</span>
            </div>
            <div class="contact-item">
              <i class="fas fa-globe"></i>
              <a :href="supportWebsite" target="_blank" rel="noopener">{{ supportWebsite }}</a>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} {{ schoolName }}. All rights reserved.</p>
      <p class="dev-credit">Developed by: <strong>Automate IT Ltd.</strong></p>
    </div>

    <button class="back-to-top" @click="scrollToTop" aria-label="Back to top">
      <i class="fas fa-chevron-up"></i>
    </button>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useHeaderLogoUrl, useFooterImageUrl } from '@/composables/useImageUrl'

const websiteStore = useWebsiteStore()

const getBasic = computed(() => websiteStore.getBasic)
const getUser = computed(() => websiteStore.getUser)
const footerData = computed(() => websiteStore.getFooterData || {})

const logo = computed(() =>
  getBasic.value?.logo ? useHeaderLogoUrl(getBasic.value.logo) : ''
)

const footerImage = computed(() =>
  footerData.value.footer_image ? useFooterImageUrl(footerData.value.footer_image) : ''
)

const footerText = computed(() =>
  footerData.value.footer_text || getUser.value?.institute_name || 'Education is Life'
)
const address = computed(() =>
  footerData.value.footer_address || getBasic.value?.address || getUser.value?.address || ''
)
const phone = computed(() =>
  footerData.value.footer_phone || getBasic.value?.phone || getUser.value?.contact_no || ''
)
const email = computed(() =>
  footerData.value.footer_email || getBasic.value?.email || getUser.value?.email || ''
)

const footerLinks = computed(() =>
  Array.isArray(footerData.value.footer_links) ? footerData.value.footer_links : []
)

const normalizedFooterLinks = computed(() =>
  footerLinks.value.map(link => {
    const url = link.link || link.url || link.href || ''
    const label = link.title || link.name || link.label || link.text || 'Link'
    const external = link.external || /^https?:\/\//i.test(url)
    return {
      label,
      url,
      external
    }
  })
)

const hasFooterLinks = computed(() => normalizedFooterLinks.value.length > 0)

const supportCompany = computed(() => footerData.value.support_company || 'Automate IT Ltd.')
const supportPhone = computed(() => footerData.value.support_phone || '+880 1234 567 890')
const supportWebsite = computed(() => footerData.value.support_website || 'https://automateit.com')

const currentYear = new Date().getFullYear()
const schoolName = computed(() => getBasic.value?.name || getUser.value?.institute_name || 'Our School')

const openSection = ref(null)
const footerOpenSection = ref(null)

onMounted(async () => {
  if (!websiteStore.getFooterData) {
    await websiteStore.fetchFooterData().catch(() => {})
  }
})
function toggleSection(name) {
  openSection.value = openSection.value === name ? null : name
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const navMenus = computed(() => websiteStore.getNavMenus)
</script>

<style scoped>
.footer {
  background: linear-gradient(160deg, #063d4d 0%, #0a728a 50%, #0d8aa6 100%);
  color: #e8f4f7;
  font-family: 'Poppins', sans-serif;
  padding: 36px 48px 0;
  position: relative;
  overflow: hidden;
}

.footer-glow {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 200px;
  background: radial-gradient(ellipse, rgba(255,221,87,0.08) 0%, transparent 70%);
  pointer-events: none;
}

.footer-banner {
  width: 100%;
  margin-bottom: 24px;
  border-radius: 24px;
  overflow: hidden;
}

.footer-banner img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.footer-top {
  display: flex;
  align-items: flex-start;
  gap: 48px;
  margin-bottom: 24px;
}

.footer-left {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.logo {
  height: 100px;
  width: auto;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.25));
  transition: transform 0.3s ease;
}
.logo:hover { transform: scale(1.05); }

.motto {
  font-size: 12px;
  font-weight: 500;
  color: #ffdd57;
  font-style: italic;
  text-align: center;
  line-height: 1.4;
  margin: 0;
}

.social-icons {
  display: flex;
  gap: 7px;
  margin-top: 6px;
}

.social-icons a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  color: #fff;
  font-size: 12px;
  text-decoration: none;
  border: 1px solid rgba(255,255,255,0.15);
  transition: background 0.3s, color 0.3s, transform 0.3s;
}
.social-icons a:hover {
  background: #ffdd57;
  color: #063d4d;
  border-color: #ffdd57;
  transform: translateY(-2px);
}

.footer-cols-group {
  flex: 1 1 auto;
  display: flex;
  justify-content: flex-end;
  gap: 40px;
  align-items: flex-start;
}

.footer-col {
  flex: 0 0 auto;
}

.footer-col h4 {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #fff;
  margin: 0 0 10px 0;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255,255,255,0.15);
  white-space: nowrap;
}

.accordion-icon { display: none; }
.accordion-body { overflow: visible; max-height: none; }

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.footer-col ul li a {
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  font-size: 13px;
  white-space: nowrap;
  display: inline-block;
  transition: color 0.2s, padding-left 0.2s;
}
.footer-col ul li a:hover {
  color: #ffdd57;
  padding-left: 3px;
}

.footer-col--contact {
  min-width: 190px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 12.5px;
  color: rgba(255,255,255,0.78);
  line-height: 1.5;
  margin-bottom: 8px;
}
.contact-item:last-child { margin-bottom: 0; }

.contact-item i {
  color: #ffdd57;
  margin-top: 3px;
  flex-shrink: 0;
  font-size: 11px;
}

.contact-item a {
  color: rgba(255,255,255,0.78);
  text-decoration: none;
  transition: color 0.2s;
}
.contact-item a:hover { color: #ffdd57; }

.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.12);
  padding: 10px 0;
  text-align: center;
}

.footer-bottom p {
  font-size: 11px;
  color: rgba(255,255,255,0.45);
  margin: 2px 0;
  letter-spacing: 0.3px;
}

.dev-credit strong {
  color: rgba(255,255,255,0.65);
}

.back-to-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #0d8aa6;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0,0,0,0.3);
  transition: background 0.25s, transform 0.25s;
  z-index: 999;
}
.back-to-top:hover {
  background: #ffdd57;
  color: #063d4d;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .footer {
    padding: 16px 14px 0;
  }

  .footer-top {
    flex-direction: column;
    align-items: center;
    gap: 0;
    margin-bottom: 0;
  }

  .footer-left {
    width: 100%;
    align-items: center;
    padding: 10px 0 12px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .logo { height: 44px; }

  .footer-cols-group {
    flex-direction: column;
    width: 100%;
    gap: 0;
    justify-content: flex-start;
  }

  .footer-col {
    width: 100%;
    padding: 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .footer-col h4 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 2px;
    margin-bottom: 0;
    border-bottom: none;
    cursor: pointer;
    font-size: 12px;
  }

  .accordion-icon {
    display: inline-block !important;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
    font-size: 11px;
    color: rgba(255,255,255,0.6);
  }

  .footer-col.open .accordion-icon {
    transform: rotate(180deg);
    color: #ffdd57;
  }

  .accordion-body {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), padding 0.3s ease;
    padding: 0 2px;
  }

  .footer-col.open .accordion-body {
    max-height: 400px;
    padding: 6px 2px 12px;
  }

  .footer-col ul { gap: 5px; }
  .footer-col ul li a { font-size: 12px; }
  .footer-col--contact { min-width: unset; }

  .contact-item {
    font-size: 12px;
    margin-bottom: 6px;
  }

  .footer-bottom {
    padding: 8px 0;
    margin-top: 2px;
  }

  .footer-bottom p { font-size: 10px; }

  .back-to-top {
    bottom: 12px;
    right: 12px;
    width: 34px;
    height: 34px;
    font-size: 12px;
  }
}
</style>