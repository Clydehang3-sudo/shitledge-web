<template>
  <header class="site-header">
    <div class="brand-block">
      <p class="brand-cn">知屎</p>
      <router-link to="/" class="brand-en">Shitledge</router-link>
      <p class="brand-tag">you need more shitledge</p>
    </div>

    <nav class="main-nav" aria-label="Main navigation">
      <router-link to="/" class="nav-link">首页</router-link>
      <router-link to="/explore" class="nav-link">发现</router-link>
      <router-link to="/ask" class="nav-link">提问</router-link>
      <router-link to="/about" class="nav-link">关于</router-link>
    </nav>
  </header>
</template>
