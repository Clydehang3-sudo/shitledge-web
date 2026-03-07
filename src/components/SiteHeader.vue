<template>
  <header class="site-header">
    <div class="brand-block">
      <p class="brand-cn">知屎</p>
      <router-link to="/" class="brand-en">Shitledge</router-link>
      <p class="brand-tag">Journal of Quantified Absurdity</p>
    </div>

    <nav class="main-nav" aria-label="Main navigation">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/articles" class="nav-link">Articles</router-link>
      <router-link to="/submit" class="nav-link">Submit</router-link>
      <router-link to="/about" class="nav-link">About</router-link>
    </nav>
  </header>
</template>
