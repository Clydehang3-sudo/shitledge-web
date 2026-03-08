<template>
  <section class="page-stack ask-page">
    <header class="page-head">
      <p class="eyebrow">提问</p>
      <h1>提一个值得认真胡扯的问题</h1>
      <p class="muted-text">问题越具体，回答越精彩。请尽量描述背景，而不是只留一个情绪。</p>
    </header>

    <form class="card ask-form" @submit.prevent="handleSubmit">
      <label>
        问题标题
        <input v-model.trim="form.title" maxlength="160" placeholder="例如：为什么人总在深夜突然想起不该想起的人？" required />
      </label>

      <label>
        问题描述
        <textarea
          v-model.trim="form.description"
          rows="7"
          maxlength="2400"
          placeholder="补充背景、你的观察、你希望讨论的方向..."
          required
        />
      </label>

      <div class="form-inline">
        <label>
          你的称呼
          <input v-model.trim="form.authorName" maxlength="80" placeholder="先用一个网名也行" required />
        </label>

        <label>
          标签（逗号分隔）
          <input v-model.trim="form.tags" maxlength="320" placeholder="例如：拖延, 职场, 自我管理" />
        </label>
      </div>

      <div class="form-footer">
        <p class="muted-text">{{ form.title.length }}/160 · {{ form.description.length }}/2400</p>
        <button type="submit" :disabled="submitting">{{ submitting ? '发布中...' : '发布问题' }}</button>
      </div>
    </form>

    <p v-if="successMessage" class="success-text">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createQuestion } from '../services/api'

const router = useRouter()

const form = reactive({
  title: '',
  description: '',
  authorName: '',
  tags: ''
})

const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

async function handleSubmit() {
  submitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const created = await createQuestion(form)
    successMessage.value = '问题发布成功，社区已经准备好认真歪楼。'
    setTimeout(() => {
      router.push(`/questions/${created.id}`)
    }, 500)
  } catch (err) {
    errorMessage.value = err.message || '发布失败，请稍后重试。'
    console.error(err)
  } finally {
    submitting.value = false
  }
}
</script>
