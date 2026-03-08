<template>
  <section class="page-stack">
    <section class="hero-block card">
      <div class="hero-poop-layer" aria-hidden="true">
        <img :src="poopOutline" class="hero-poop hero-poop-1" alt="" />
        <img :src="poopOutline" class="hero-poop hero-poop-2" alt="" />
        <img :src="poopOutline" class="hero-poop hero-poop-3" alt="" />
      </div>

      <p class="eyebrow">中文互联网肠道研究所</p>
      <h1>把难以启齿的问题，体面地端上来。</h1>
      <p class="hero-text">这里不负责正确，只负责诚实。翻主页、做计划、假装放下、凌晨立誓，都可以拿来公开讨论。</p>
      <p class="hero-foot">知屎不生产真理，只把精神排泄物重新摆盘。</p>

      <div class="hero-actions">
        <router-link to="/ask" class="primary-link">发个不太体面的疑问</router-link>
        <router-link to="/explore" class="ghost-link">去屎海冲浪</router-link>
      </div>
    </section>

    <section class="feed-layout">
      <div class="feed-main">
        <section class="toolbar card">
          <input
            v-model.trim="queryInput"
            class="toolbar-input"
            placeholder="搜一句你不敢发朋友圈的话"
            @keyup.enter="applyFilters"
          />

          <select v-model="sort" class="toolbar-select" @change="applyFilters">
            <option value="latest">最新出土</option>
            <option value="oldest">最早存档</option>
          </select>

          <button type="button" @click="applyFilters">开挖</button>
        </section>

        <p v-if="loading" class="muted-text">正在打捞问题样本...</p>
        <p v-else-if="error" class="error-text">{{ error }}</p>

        <template v-else>
          <p class="question-meta">已收录 {{ result.totalElements }} 条精神样本 · 第 {{ result.page + 1 }} / {{ displayTotalPages }} 页</p>

          <div v-if="result.items.length" class="question-list">
            <QuestionCard v-for="question in result.items" :key="question.id" :question="question" />
          </div>
          <div v-else class="card empty-state">
            <p>暂时没捞到匹配样本。</p>
            <p>换个关键词，或者你先丢一个新问题进池子。</p>
            <router-link to="/ask" class="ghost-link">先来一条</router-link>
          </div>

          <div class="pager">
            <button type="button" :disabled="!result.hasPrevious || loading" @click="goToPage(result.page - 1)">上一桶</button>
            <button type="button" :disabled="!result.hasNext || loading" @click="goToPage(result.page + 1)">下一桶</button>
          </div>
        </template>
      </div>

      <aside class="feed-side">
        <article class="card side-card">
          <h3>值班公告</h3>
          <p>先别急着给答案。把问题问准，比输出 300 字情绪更有用。</p>
          <p class="muted-text">一句话建议：先写事实，再写脑补。</p>
        </article>

        <article class="card side-card">
          <h3>本周高频症状</h3>
          <div v-if="tags.length" class="tag-row">
            <span v-for="tag in tags" :key="tag" class="tag-chip">#{{ tag }}</span>
          </div>
          <p v-else class="muted-text">症状统计中...</p>
        </article>
      </aside>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import QuestionCard from '../components/QuestionCard.vue'
import { fetchQuestions, fetchTags } from '../services/api'
import poopOutline from '../assets/poop-outline.svg'

const loading = ref(true)
const error = ref('')
const queryInput = ref('')
const activeQuery = ref('')
const sort = ref('latest')
const tags = ref([])

const result = ref({
  items: [],
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false
})

const displayTotalPages = computed(() => Math.max(result.value.totalPages, 1))

async function loadQuestions() {
  loading.value = true
  error.value = ''

  try {
    result.value = await fetchQuestions({
      query: activeQuery.value,
      page: result.value.page,
      size: result.value.size,
      sort: sort.value
    })
  } catch (err) {
    error.value = '问题流加载失败，请确认后端已启动。'
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function loadTags() {
  try {
    const data = await fetchTags()
    tags.value = data.slice(0, 12)
  } catch {
    tags.value = []
  }
}

function applyFilters() {
  activeQuery.value = queryInput.value
  result.value.page = 0
  loadQuestions()
}

function goToPage(page) {
  result.value.page = page
  loadQuestions()
}

onMounted(() => {
  loadQuestions()
  loadTags()
})
</script>
