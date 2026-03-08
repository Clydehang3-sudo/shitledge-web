<template>
  <section class="page-stack ask-page">
    <header class="page-head">
      <p class="eyebrow">提问入口</p>
      <h1>问点没法发朋友圈的</h1>
      <p class="muted-text">建议写具体一点。别只写“我好像完了”，请交代你是怎么一步步走到这里的。</p>
    </header>

    <form class="card ask-form" @submit.prevent="handleSubmit">
      <label>
        问题标题
        <input v-model.trim="form.title" maxlength="160" placeholder="例如：我只是周期性点进她主页，这算复吸吗？" required />
      </label>

      <label>
        问题描述
        <textarea
          v-model.trim="form.description"
          rows="7"
          maxlength="2400"
          placeholder="把背景说清楚：发生了什么、你怎么理解、你卡在哪一步。"
          required
        />
      </label>

      <div class="form-inline">
        <label>
          你的称呼
          <input v-model.trim="form.authorName" maxlength="80" placeholder="例如：战略性嘴硬" required />
        </label>

        <label>
          标签（逗号分隔）
          <input v-model.trim="form.tags" maxlength="320" placeholder="例如：关系, 拖延, 自我欺骗" />
        </label>
      </div>

      <div class="form-footer">
        <p class="muted-text">{{ form.title.length }}/160 · {{ form.description.length }}/2400</p>
        <button type="submit" :disabled="submitting">{{ submitting ? '挂号中...' : '拉一个问题出来' }}</button>
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
    successMessage.value = '问题已入池。围观群众正在路上。'
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
