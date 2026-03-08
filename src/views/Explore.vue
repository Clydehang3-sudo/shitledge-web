<template>
  <section class="page-stack">
    <header class="page-head">
      <p class="eyebrow">发现</p>
      <h1>广场</h1>
      <p class="muted-text">看看大家最近在认真讨论哪些离谱问题。</p>
    </header>

    <p v-if="loading" class="muted-text">广场加载中...</p>
    <p v-else-if="error" class="error-text">{{ error }}</p>

    <template v-else>
      <div class="explore-grid">
        <section class="card section-block">
          <h2>热门问题</h2>
          <div v-if="explore.hottest.length" class="question-list compact-list">
            <QuestionCard v-for="item in explore.hottest" :key="`hot-${item.id}`" :question="item" compact />
          </div>
          <p v-else class="muted-text">暂无热门问题</p>
        </section>

        <section class="card section-block">
          <h2>最新问题</h2>
          <div v-if="explore.latest.length" class="question-list compact-list">
            <QuestionCard v-for="item in explore.latest" :key="`new-${item.id}`" :question="item" compact />
          </div>
          <p v-else class="muted-text">暂无最新问题</p>
        </section>
      </div>

      <section class="card section-block">
        <h2>随机离谱问题</h2>
        <div v-if="explore.random.length" class="question-list compact-list">
          <QuestionCard v-for="item in explore.random" :key="`rnd-${item.id}`" :question="item" compact />
        </div>
        <p v-else class="muted-text">随机池还没填满。</p>
      </section>

      <section class="card section-block">
        <h2>标签导航</h2>
        <div v-if="explore.tags.length" class="tag-row">
          <span v-for="tag in explore.tags" :key="tag" class="tag-chip">#{{ tag }}</span>
        </div>
        <p v-else class="muted-text">标签生成中...</p>
      </section>
    </template>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import QuestionCard from '../components/QuestionCard.vue'
import { fetchExplore } from '../services/api'

const loading = ref(true)
const error = ref('')

const explore = ref({
  hottest: [],
  latest: [],
  random: [],
  tags: []
})

onMounted(async () => {
  loading.value = true
  error.value = ''

  try {
    explore.value = await fetchExplore()
  } catch (err) {
    error.value = '发现页加载失败，请稍后重试。'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>
