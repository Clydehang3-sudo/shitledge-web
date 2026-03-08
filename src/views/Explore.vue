<template>
  <section class="page-stack">
    <header class="page-head">
      <p class="eyebrow">发现页</p>
      <h1>屎海雷达</h1>
      <p class="muted-text">热门、最新、随机抽样。看别人都在认真胡扯什么。</p>
    </header>

    <p v-if="loading" class="muted-text">雷达扫描中...</p>
    <p v-else-if="error" class="error-text">{{ error }}</p>

    <template v-else>
      <div class="explore-grid">
        <section class="card section-block">
          <h2>热议区</h2>
          <div v-if="explore.hottest.length" class="question-list compact-list">
            <QuestionCard v-for="item in explore.hottest" :key="`hot-${item.id}`" :question="item" compact />
          </div>
          <p v-else class="muted-text">今天还没出现大规模共鸣。</p>
        </section>

        <section class="card section-block">
          <h2>新鲜出炉</h2>
          <div v-if="explore.latest.length" class="question-list compact-list">
            <QuestionCard v-for="item in explore.latest" :key="`new-${item.id}`" :question="item" compact />
          </div>
          <p v-else class="muted-text">暂时没有新样本。</p>
        </section>
      </div>

      <section class="card section-block">
        <h2>随机掉落</h2>
        <div v-if="explore.random.length" class="question-list compact-list">
          <QuestionCard v-for="item in explore.random" :key="`rnd-${item.id}`" :question="item" compact />
        </div>
        <p v-else class="muted-text">随机池还没填满。</p>
      </section>

      <section class="card section-block">
        <h2>标签海</h2>
        <div v-if="explore.tags.length" class="tag-row">
          <span v-for="tag in explore.tags" :key="tag" class="tag-chip">#{{ tag }}</span>
        </div>
        <p v-else class="muted-text">标签统计中...</p>
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
