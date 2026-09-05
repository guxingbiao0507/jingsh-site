<script setup lang="ts">
definePageMeta({ layout: false, i18n: { defaultLocale: 'cn' } })

const localePath = useLocalePath()
const route = useRoute()
const toast = useToast()
const { t, locale } = useI18n()
const loading = ref(false)
const verified = ref(false)
const showPassword = ref(false)
const state = reactive({ email: '', password: '' })

const tagline = computed(() =>
  locale.value === 'cn'
    ? '内容管理系统 · 新闻与站点配置'
    : 'Content Management · News & Site Settings',
)

async function onSubmit() {
  if (!verified.value) {
    toast.add({
      title: t('admin.login.failed'),
      description: t('admin.login.verifyRequired'),
      color: 'warning',
    })
    return
  }

  loading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: state.email,
        password: state.password,
      },
    })

    const redirect = (route.query.redirect as string) || ''
    const localePrefix = localePath('/')
    const target = redirect.startsWith(localePrefix) ? redirect : localePath('/admin')
    await navigateTo(target)
  }
  catch (err: any) {
    const status = err?.statusCode || err?.data?.statusCode
    let desc = err?.data?.statusMessage || err?.message || ''
    if (status === 401) desc = t('admin.login.invalidCredentials')
    else if (status === 429) desc = t('admin.login.tooManyAttempts')
    else if (!desc) desc = t('admin.login.networkError')
    toast.add({ title: t('admin.login.failed'), description: desc, color: 'error' })
    verified.value = false
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="admin-login-page">
    <div class="admin-login-shell">
      <!-- Brand panel -->
      <aside class="admin-login-brand">
        <div class="admin-login-brand-inner">
          <NuxtLink :to="localePath('/')" class="admin-login-logo-link">
            <img
              src="/assets/themes/jingsh/images/logo.png"
              alt="Jingsh Law Firm"
              class="admin-login-logo"
            >
          </NuxtLink>
          <h1 class="admin-login-brand-title">Jingsh Law Firm</h1>
          <p class="admin-login-brand-sub">{{ tagline }}</p>

          <ul class="admin-login-features">
            <li>
              <span class="admin-login-feature-icon">✓</span>
              {{ locale === 'cn' ? '新闻与博客管理' : 'News & blog management' }}
            </li>
            <li>
              <span class="admin-login-feature-icon">✓</span>
              {{ locale === 'cn' ? 'SEO 与站点设置' : 'SEO & site settings' }}
            </li>
            <li>
              <span class="admin-login-feature-icon">✓</span>
              {{ locale === 'cn' ? '媒体与多语言内容' : 'Media & multilingual content' }}
            </li>
          </ul>
        </div>

        <div class="admin-login-brand-footer">
          <NuxtLink :to="localePath('/')" class="admin-login-home-link">
            ← {{ t('common.backToHome') }}
          </NuxtLink>
        </div>
      </aside>

      <!-- Form panel -->
      <main class="admin-login-main">
        <div class="admin-login-card">
          <div class="admin-login-card-head">
            <div class="admin-login-badge">{{ locale === 'cn' ? '管理后台' : 'Admin Portal' }}</div>
            <h2 class="admin-login-title">{{ t('admin.login.title') }}</h2>
            <p class="admin-login-desc">
              {{ locale === 'cn' ? '请使用管理员账号登录以继续。' : 'Sign in with your administrator account to continue.' }}
            </p>
          </div>

          <form class="admin-login-form" @submit.prevent="onSubmit">
            <label class="admin-login-field">
              <span class="admin-login-label">{{ t('admin.login.email') }}</span>
              <input
                v-model="state.email"
                type="email"
                autocomplete="username"
                placeholder="admin@jingsh.fi"
                required
                class="admin-login-input"
              >
            </label>

            <label class="admin-login-field">
              <span class="admin-login-label">{{ t('admin.login.password') }}</span>
              <div class="admin-login-password-wrap">
                <input
                  v-model="state.password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  required
                  class="admin-login-input admin-login-input--password"
                >
                <button
                  type="button"
                  class="admin-login-toggle-pw"
                  :aria-label="showPassword ? (locale === 'cn' ? '隐藏密码' : 'Hide password') : (locale === 'cn' ? '显示密码' : 'Show password')"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? (locale === 'cn' ? '隐藏' : 'Hide') : (locale === 'cn' ? '显示' : 'Show') }}
                </button>
              </div>
            </label>

            <label class="admin-login-verify">
              <input v-model="verified" type="checkbox" class="admin-login-checkbox">
              <span>{{ t('admin.login.verifyLabel') }}</span>
            </label>

            <button
              type="submit"
              class="admin-login-submit"
              :disabled="loading || !verified"
            >
              <span v-if="loading" class="admin-login-spinner" aria-hidden="true" />
              {{ loading ? (locale === 'cn' ? '登录中…' : 'Signing in…') : t('admin.login.submit') }}
            </button>
          </form>

          <p class="admin-login-mobile-home">
            <NuxtLink :to="localePath('/')">← {{ t('common.backToHome') }}</NuxtLink>
          </p>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  background: #f4f6f8;
  color: rgb(33, 33, 33);
  font-family: Inter, system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.admin-login-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(280px, 42%) 1fr;
}

.admin-login-brand {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3rem 2.5rem;
  background:
    linear-gradient(145deg, rgba(0, 0, 0, 0.08) 0%, transparent 55%),
    linear-gradient(160deg, #f0a030 0%, #EB9624 45%, #c97a12 100%);
  color: #fff;
  overflow: hidden;
}

.admin-login-brand::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.18) 0%, transparent 45%),
    radial-gradient(circle at 80% 80%, rgba(0, 0, 0, 0.12) 0%, transparent 40%);
  pointer-events: none;
}

.admin-login-brand-inner,
.admin-login-brand-footer {
  position: relative;
  z-index: 1;
}

.admin-login-logo-link {
  display: inline-block;
  margin-bottom: 1.5rem;
}

.admin-login-logo {
  width: 72px;
  height: 72px;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
}

.admin-login-brand-title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.admin-login-brand-sub {
  font-size: 0.95rem;
  opacity: 0.92;
  max-width: 20rem;
  line-height: 1.6;
}

.admin-login-features {
  margin-top: 2.5rem;
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.85rem;
}

.admin-login-features li {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.9rem;
  opacity: 0.95;
}

.admin-login-feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  font-size: 0.7rem;
  font-weight: 700;
}

.admin-login-home-link {
  color: rgba(255, 255, 255, 0.92);
  text-decoration: none;
  font-size: 0.9rem;
  transition: opacity 0.2s;
}

.admin-login-home-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.admin-login-main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
}

.admin-login-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 1.25rem;
  padding: 2rem 2rem 1.75rem;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 12px 40px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(15, 23, 42, 0.06);
}

.admin-login-card-head {
  margin-bottom: 1.75rem;
}

.admin-login-badge {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background: rgba(235, 150, 36, 0.12);
  color: #b8730f;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 0.85rem;
}

.admin-login-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(33, 33, 33);
  margin-bottom: 0.35rem;
}

.admin-login-desc {
  font-size: 0.9rem;
  color: rgb(82, 100, 124);
  line-height: 1.5;
}

.admin-login-form {
  display: grid;
  gap: 1.1rem;
}

.admin-login-field {
  display: grid;
  gap: 0.4rem;
}

.admin-login-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgb(33, 33, 33);
}

.admin-login-input {
  width: 100%;
  padding: 0.72rem 0.9rem;
  border: 1px solid #d8dee8;
  border-radius: 0.65rem;
  font-size: 0.95rem;
  color: rgb(33, 33, 33);
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.admin-login-input::placeholder {
  color: #9aa5b5;
}

.admin-login-input:focus {
  outline: none;
  border-color: #EB9624;
  box-shadow: 0 0 0 3px rgba(235, 150, 36, 0.15);
}

.admin-login-password-wrap {
  position: relative;
}

.admin-login-input--password {
  padding-right: 2.75rem;
}

.admin-login-toggle-pw {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #EB9624;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.4rem;
  line-height: 1;
}

.admin-login-verify {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.85rem 0.9rem;
  border: 1px solid #e8edf3;
  border-radius: 0.65rem;
  background: rgb(248, 248, 248);
  cursor: pointer;
  user-select: none;
}

.admin-login-verify span {
  font-size: 0.875rem;
  color: rgb(82, 100, 124);
  line-height: 1.45;
}

.admin-login-checkbox {
  width: 1.1rem;
  height: 1.1rem;
  margin-top: 0.1rem;
  accent-color: #EB9624;
  flex-shrink: 0;
}

.admin-login-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 0.65rem;
  background: #EB9624;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}

.admin-login-submit:hover:not(:disabled) {
  background: #d4851f;
}

.admin-login-submit:active:not(:disabled) {
  transform: translateY(1px);
}

.admin-login-submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.admin-login-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: admin-login-spin 0.7s linear infinite;
}

@keyframes admin-login-spin {
  to { transform: rotate(360deg); }
}

.admin-login-mobile-home {
  display: none;
  margin-top: 1.25rem;
  text-align: center;
  font-size: 0.875rem;
}

.admin-login-mobile-home a {
  color: #EB9624;
  text-decoration: none;
}

.admin-login-mobile-home a:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .admin-login-shell {
    grid-template-columns: 1fr;
  }

  .admin-login-brand {
    padding: 2rem 1.5rem 1.5rem;
    min-height: auto;
  }

  .admin-login-brand-title {
    font-size: 1.4rem;
  }

  .admin-login-features,
  .admin-login-brand-footer {
    display: none;
  }

  .admin-login-main {
    padding: 0 1rem 2rem;
    margin-top: -0.5rem;
  }

  .admin-login-card {
    margin-top: -1rem;
  }

  .admin-login-mobile-home {
    display: block;
  }
}
</style>
