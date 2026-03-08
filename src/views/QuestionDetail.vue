<template>
  <section class="page-stack">
    <p class="back-link"><router-link to="/">← 返回问题流</router-link></p>

    <p v-if="loadingQuestion" class="muted-text">正在加载问题...</p>
    <p v-else-if="questionError" class="error-text">{{ questionError }}</p>

    <article v-else-if="question" class="card question-detail">
      <p class="question-meta">{{ formatDate(question.createdAt) }} · {{ question.authorName }}</p>
      <h1>{{ question.title }}</h1>
      <p class="question-description">{{ question.description }}</p>

      <div v-if="question.tags?.length" class="tag-row">
        <span v-for="tag in question.tags" :key="tag" class="tag-chip">#{{ tag }}</span>
      </div>

      <p class="muted-text">{{ question.answerCount }} 条回答</p>
    </article>

    <section class="card answer-form-wrap">
      <h2>写回答</h2>
      <form class="answer-form" @submit.prevent="submit">
        <label>
          你的称呼
          <input v-model.trim="answerForm.authorName" maxlength="80" required placeholder="例如：理性但困惑" />
        </label>

        <label>
          你的回答
          <textarea
            v-model.trim="answerForm.content"
            rows="6"
            maxlength="3200"
            required
            placeholder="给出你的观察、推理，或者一个优雅的离谱结论。"
          />
        </label>

        <div class="form-footer">
          <p class="muted-text">{{ answerForm.content.length }}/3200</p>
          <button type="submit" :disabled="submittingAnswer">{{ submittingAnswer ? '提交中...' : '提交回答' }}</button>
        </div>
      </form>
      <p v-if="answerSuccess" class="success-text">{{ answerSuccess }}</p>
      <p v-if="answerError" class="error-text">{{ answerError }}</p>
    </section>

    <section>
      <h2 class="section-title">回答 {{ answers.length }}</h2>
      <p v-if="loadingAnswers" class="muted-text">正在加载回答...</p>
      <p v-else-if="answersError" class="error-text">{{ answersError }}</p>
      <div v-else-if="answers.length" class="answer-list">
        <AnswerItem v-for="answer in answers" :key="answer.id" :answer="answer" />
      </div>
      <div v-else class="card empty-state">
        <p>还没有回答。</p>
        <p>你可以成为这个问题下第一个认真胡扯的人。</p>
      </div>
    </section>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import AnswerItem from '../components/AnswerItem.vue'
import { createAnswer, fetchAnswers, fetchQuestionDetail } from '../services/api'

const route = useRoute()

const question = ref(null)
const loadingQuestion = ref(true)
const questionError = ref('')

const answers = ref([])
const loadingAnswers = ref(true)
const answersError = ref('')

const answerForm = reactive({
  authorName: '',
  content: ''
})
const submittingAnswer = ref(false)
const answerSuccess = ref('')
const answerError = ref('')

function formatDate(value) {
  if (!value) return '刚刚'
  return new Date(value).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function loadQuestion() {
  loadingQuestion.value = true
  questionError.value = ''

  try {
    const data = await fetchQuestionDetail(route.params.id)
    if (!data) {
      questionError.value = '这个问题不存在，或者已经被宇宙回收。'
      return
    }
    question.value = data
  } catch (err) {
    questionError.value = '问题加载失败，请稍后重试。'
    console.error(err)
  } finally {
    loadingQuestion.value = false
  }
}

async function loadAnswers() {
  loadingAnswers.value = true
  answersError.value = ''

  try {
    answers.value = await fetchAnswers(route.params.id)
  } catch (err) {
    answersError.value = '回答加载失败。'
    console.error(err)
  } finally {
    loadingAnswers.value = false
  }
}

async function submit() {
  submittingAnswer.value = true
  answerSuccess.value = ''
  answerError.value = ''

  try {
    await createAnswer(route.params.id, answerForm)
    answerSuccess.value = '回答已提交。感谢你为混乱世界补充样本。'
    answerForm.content = ''
    await Promise.all([loadQuestion(), loadAnswers()])
  } catch (err) {
    answerError.value = err.message || '提交失败，请稍后重试。'
    console.error(err)
  } finally {
    submittingAnswer.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadQuestion(), loadAnswers()])
})
</script>
