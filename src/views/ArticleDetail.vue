<template>
  <section>
    <p class="back-link">
      <router-link to="/articles">← Back to Articles</router-link>
    </p>

    <p v-if="loading">Loading article...</p>
    <p v-else-if="error" class="error-text">{{ error }}</p>

    <article v-else-if="article" class="detail-paper">
      <p class="meta">{{ formatDate(article.publishedDate) }} · {{ article.author }}</p>
      <h1>{{ article.title }}</h1>
      <p class="summary">{{ article.summary }}</p>
      <hr />
      <p class="body">{{ article.body }}</p>
    </article>

    <article v-else class="detail-paper">
      <p class="eyebrow">404</p>
      <h1>Article Not Found</h1>
      <p class="lede">This manuscript may have been rejected by reviewers or reality.</p>
    </article>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchArticleDetail } from '../services/api'

const route = useRoute()
const article = ref(null)
const loading = ref(true)
const error = ref('')

const formatDate = (value) => {
  if (!value) {
    return 'Undated'
  }
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(async () => {
  try {
    article.value = await fetchArticleDetail(route.params.id)
  } catch (err) {
    error.value = 'Unable to load article. Please verify backend availability.'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>
