<template>
  <article class="article-card">
    <p class="meta">{{ formatDate(article.publishedDate) }} · {{ article.author }}</p>
    <h3 class="title">
      <router-link :to="`/articles/${article.id}`">{{ article.title }}</router-link>
    </h3>
    <p class="summary">{{ article.summary }}</p>
  </article>
</template>

<script setup>
defineProps({
  article: {
    type: Object,
    required: true
  }
})

const formatDate = (value) => {
  if (!value) {
    return 'Undated'
  }
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
