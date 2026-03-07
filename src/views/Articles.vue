<template>
  <section>
    <header class="page-head">
      <p class="eyebrow">Archive</p>
      <h1>Articles</h1>
      <p class="lede">Field reports from the front lines of overthinking.</p>
    </header>

    <section class="toolbar">
      <input
        v-model.trim="queryInput"
        class="toolbar-input"
        placeholder="Search title, author, summary, or body"
        @keyup.enter="applyFilters"
      />

      <select v-model="sort" class="toolbar-select" @change="applyFilters">
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
        <option value="title">Title A-Z</option>
      </select>

      <button type="button" @click="applyFilters">Apply</button>
    </section>

    <p v-if="loading">Loading articles...</p>
    <p v-else-if="error" class="error-text">{{ error }}</p>

    <template v-else>
      <p class="meta">{{ result.totalElements }} records · Page {{ result.page + 1 }} / {{ displayTotalPages }}</p>

      <div v-if="result.items.length > 0" class="list-stack">
        <ArticleCard v-for="article in result.items" :key="article.id" :article="article" />
      </div>
      <p v-else class="detail-paper">No matching manuscripts found.</p>

      <div class="pager">
        <button type="button" :disabled="!result.hasPrevious || loading" @click="goToPage(result.page - 1)">
          Previous
        </button>
        <button type="button" :disabled="!result.hasNext || loading" @click="goToPage(result.page + 1)">
          Next
        </button>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import ArticleCard from '../components/ArticleCard.vue'
import { fetchArticles } from '../services/api'

const loading = ref(true)
const error = ref('')
const queryInput = ref('')
const activeQuery = ref('')
const sort = ref('latest')

const result = ref({
  items: [],
  page: 0,
  size: 6,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false
})

const displayTotalPages = computed(() => Math.max(result.value.totalPages, 1))

async function loadArticles() {
  loading.value = true
  error.value = ''

  try {
    result.value = await fetchArticles({
      query: activeQuery.value,
      page: result.value.page,
      size: result.value.size,
      sort: sort.value
    })
  } catch (err) {
    error.value = 'Unable to load articles. Confirm backend is running on localhost:8080.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function applyFilters() {
  activeQuery.value = queryInput.value
  result.value.page = 0
  loadArticles()
}

function goToPage(page) {
  result.value.page = page
  loadArticles()
}

onMounted(loadArticles)
</script>
