<template>
  <article class="article-card" :class="{ compact }">
    <p class="meta">{{ formatDate(article.publishedDate) }} · {{ article.author }}</p>
    <h3 class="title">
      <router-link :to="`/articles/${article.id}`">{{ article.title }}</router-link>
    </h3>
    <p class="summary">{{ article.summary }}</p>
    <p class="read-more">
      <router-link :to="`/articles/${article.id}`">Read paper</router-link>
    </p>
  </article>
</template>

<script setup>
defineProps({
  article: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
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
