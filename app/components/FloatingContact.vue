<script setup lang="ts">
const { t } = useI18n()
const { data: site } = await useSite()

const phone2 = computed(() => site.value?.settings.companyPhone || '153-6521-5320')
const qq = '2836178166'
const qrSrc = '/api/media/uploads/site/qrcode.png'

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <!-- Fixed right contact bar (replicates wxyfwl.com fix-contact) -->
  <div class="fixed right-4 bottom-24 z-40 hidden md:flex flex-col gap-2">
    <!-- 电话咨询 -->
    <div class="group relative">
      <div class="w-12 h-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-md flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white text-primary transition-colors">
        <UIcon name="i-lucide-phone" class="text-xl" />
      </div>
      <div class="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div class="text-xs text-gray-400">{{ t('float.phone') }}</div>
        <div class="font-medium">{{ phone2 }} 刘 梅</div>
      </div>
    </div>

    <!-- 在线咨询 QQ -->
    <a :href="`https://wpa.qq.com/msgrd?v=3&uin=${qq}&site=qq&menu=yes`" target="_blank" rel="noopener" class="group relative block">
      <div class="w-12 h-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-md flex items-center justify-center hover:bg-primary hover:text-white text-primary transition-colors">
        <UIcon name="i-lucide-message-circle" class="text-xl" />
      </div>
      <div class="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div class="text-xs text-gray-400">{{ t('float.qq') }}</div>
        <div class="font-medium">QQ {{ qq }}</div>
      </div>
    </a>

    <!-- 扫码 -->
    <div class="group relative">
      <div class="w-12 h-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-md flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white text-primary transition-colors">
        <UIcon name="i-lucide-qr-code" class="text-xl" />
      </div>
      <div class="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <img :src="qrSrc" :alt="t('float.scan')" class="w-24 h-24 object-contain">
        <div class="text-[11px] text-center text-gray-500 mt-1">{{ t('float.scan') }}</div>
      </div>
    </div>

    <!-- 回到顶部 -->
    <button type="button" :aria-label="t('float.top')" class="w-12 h-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-md flex items-center justify-center hover:bg-primary hover:text-white text-gray-500 transition-colors" @click="toTop">
      <UIcon name="i-lucide-arrow-up" class="text-xl" />
    </button>
  </div>
</template>
