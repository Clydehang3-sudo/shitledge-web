<template>
  <div class="site-shell">
    <SiteHeader />
    <main class="content-wrap">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import SiteHeader from './components/SiteHeader.vue'
</script>
