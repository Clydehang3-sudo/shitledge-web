<template>
  <section class="page-stack">
    <section class="hero-block card">
      <p class="eyebrow">认真处理荒谬</p>
      <h1>欢迎来到知屎 Shitledge</h1>
      <p class="hero-text">一个认真讨论离谱问题的中文问答社区。你可以提问，也可以给这个世界一个不太可靠但很诚实的回答。</p>
      <div class="hero-actions">
        <router-link to="/ask" class="primary-link">提一个值得胡扯的问题</router-link>
        <router-link to="/explore" class="ghost-link">去发现广场</router-link>
      </div>
    </section>

    <section class="feed-layout">
      <div class="feed-main">
        <section class="toolbar card">
          <input
            v-model.trim="queryInput"
            class="toolbar-input"
            placeholder="搜索问题标题或描述"
            @keyup.enter="applyFilters"
          />

          <select v-model="sort" class="toolbar-select" @change="applyFilters">
            <option value="latest">最新发布</option>
            <option value="oldest">最早发布</option>
          </select>

          <button type="button" @click="applyFilters">筛选</button>
        </section>

        <p v-if="loading" class="muted-text">正在加载问题流...</p>
        <p v-else-if="error" class="error-text">{{ error }}</p>

        <template v-else>
          <p class="question-meta">{{ result.totalElements }} 个问题 · 第 {{ result.page + 1 }} / {{ displayTotalPages }} 页</p>

          <div v-if="result.items.length" class="question-list">
            <QuestionCard v-for="question in result.items" :key="question.id" :question="question" />
          </div>
          <div v-else class="card empty-state">
            <p>这里还没有匹配的问题。</p>
            <p>试试换个关键词，或者你来开第一个话题。</p>
            <router-link to="/ask" class="ghost-link">去提问</router-link>
          </div>

          <div class="pager">
            <button type="button" :disabled="!result.hasPrevious || loading" @click="goToPage(result.page - 1)">上一页</button>
            <button type="button" :disabled="!result.hasNext || loading" @click="goToPage(result.page + 1)">下一页</button>
          </div>
        </template>
      </div>

      <aside class="feed-side">
        <article class="card side-card">
          <h3>今日提醒</h3>
          <p>别急着输出观点，先把问题问准。高质量胡扯从问题定义开始。</p>
        </article>

        <article class="card side-card">
          <h3>热门标签</h3>
          <div v-if="tags.length" class="tag-row">
            <span v-for="tag in tags" :key="tag" class="tag-chip">#{{ tag }}</span>
          </div>
          <p v-else class="muted-text">标签生成中...</p>
        </article>
      </aside>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import QuestionCard from '../components/QuestionCard.vue'
import { fetchQuestions, fetchTags } from '../services/api'

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
