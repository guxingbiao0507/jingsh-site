<script setup lang="ts">
const { t, li } = useYfLang()

const open = ref(false)
const sending = ref(false)
const sent = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: '',
})

function openModal() {
  open.value = true
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  open.value = false
  document.body.style.overflow = ''
}

async function submitForm() {
  if (!form.name || !form.email || !form.message) {
    error.value = li('请填写必填项', 'Please fill in required fields')
    return
  }
  sending.value = true
  error.value = ''
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      },
    })
    sent.value = true
    form.name = ''
    form.email = ''
    form.phone = ''
    form.message = ''
  } catch {
    error.value = li('发送失败，请重试', 'Failed to send. Please try again.')
  } finally {
    sending.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) closeModal()
}
</script>

<template>
  <div>
    <button type="button" class="contact-float-btn" :title="li('联系我们', 'Contact Us')" @click="openModal">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 4L12 13 2 4" />
      </svg>
      <span>{{ li('联系', 'Contact') }}</span>
    </button>

    <div
      class="contact-modal-overlay"
      :class="{ active: open }"
      @click.self="closeModal"
    >
      <div class="contact-modal-box">
        <div class="contact-modal-header">
          <h3>{{ li('联系我们', 'Contact Us') }}</h3>
          <button type="button" class="contact-modal-close" @click="closeModal">×</button>
        </div>
        <div class="p-5 space-y-4">
          <p v-if="sent" class="text-green-600 text-sm">
            {{ li('消息已发送，我们会尽快与您联系！', 'Message sent! We will get back to you soon.') }}
          </p>
          <template v-else>
            <div class="contact-form-field">
              <label>{{ li('姓名', 'Name') }} *</label>
              <input v-model="form.name" type="text" />
            </div>
            <div class="contact-form-field">
              <label>{{ li('邮箱', 'Email') }} *</label>
              <input v-model="form.email" type="email" />
            </div>
            <div class="contact-form-field">
              <label>{{ li('电话', 'Phone') }}</label>
              <input v-model="form.phone" type="tel" />
            </div>
            <div class="contact-form-field">
              <label>{{ li('需求描述', 'Message') }} *</label>
              <textarea v-model="form.message" rows="4" />
            </div>
            <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
            <button type="button" class="contact-form-submit" :disabled="sending" @click="submitForm">
              {{ sending ? li('发送中…', 'Sending…') : li('发送消息', 'Send Message') }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
