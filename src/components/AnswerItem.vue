<template>
  <article class="answer-item">
    <div class="answer-head">
      <p class="question-meta">{{ answer.authorName }} · {{ formatDate(answer.createdAt) }}</p>
      <span class="like-pill">赞同 {{ answer.likes }}</span>
    </div>
    <p class="answer-content">{{ answer.content }}</p>
  </article>
</template>

<script setup>
defineProps({
  answer: {
    type: Object,
    required: true
  }
})

function formatDate(value) {
  if (!value) {
    return '刚刚'
  }

  return new Date(value).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
