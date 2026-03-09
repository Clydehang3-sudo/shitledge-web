<template>
  <article class="question-card" :class="{ compact }">
    <div class="question-top">
      <p class="question-meta">
        {{ formatDate(question.createdAt) }} · {{ question.authorName }}
      </p>
      <div class="question-stats">
        <p v-if="question.likes > 0" class="like-count">{{ question.likes }} 赞</p>
        <p class="answer-count"><span class="poop-mini" aria-hidden="true">💩</span>{{ question.answerCount }} 回应</p>
      </div>
    </div>

    <h3 class="question-title">
      <router-link :to="`/questions/${question.id}`">{{ question.title }}</router-link>
    </h3>

    <p v-if="question.descriptionSnippet" class="question-snippet">{{ question.descriptionSnippet }}</p>

    <p v-if="question.latestAnswerSnippet" class="latest-answer">
      最新回声：{{ question.latestAnswerSnippet }}
    </p>

    <div v-if="question.tags?.length" class="tag-row">
      <span v-for="tag in question.tags" :key="tag" class="tag-chip">#{{ tag }}</span>
    </div>
  </article>
</template>

<script setup>
defineProps({
  question: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
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
