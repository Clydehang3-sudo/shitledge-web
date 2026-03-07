<template>
  <section>
    <header class="page-head">
      <p class="eyebrow">Contribute</p>
      <h1>Submit Manuscript</h1>
      <p class="lede">All submissions are judged by a strict standard: does this feel painfully true?</p>
    </header>

    <form class="submit-form" @submit.prevent="handleSubmit">
      <label>
        Title
        <input v-model.trim="form.title" required maxlength="180" />
        <small class="meta">{{ form.title.length }}/180</small>
      </label>

      <label>
        Author
        <input v-model.trim="form.author" required maxlength="120" />
        <small class="meta">{{ form.author.length }}/120</small>
      </label>

      <label>
        Email
        <input v-model.trim="form.email" type="email" required maxlength="200" />
      </label>

      <label>
        Abstract
        <textarea v-model.trim="form.summary" rows="4" required maxlength="600" />
        <small class="meta">{{ form.summary.length }}/600</small>
      </label>

      <label>
        Body
        <textarea v-model.trim="form.body" rows="10" required minlength="40" />
      </label>

      <button type="submit" :disabled="submitting">
        {{ submitting ? 'Submitting...' : 'Submit to Editorial Board' }}
      </button>
    </form>

    <p v-if="successMessage" class="success-text">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { submitArticle } from '../services/api'

const router = useRouter()

const form = reactive({
  title: '',
  author: '',
  email: '',
  summary: '',
  body: ''
})

const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

function validateForm() {
  if (!form.title || !form.author || !form.email || !form.summary || !form.body) {
    return 'Please complete every field before submission.'
  }
  if (!form.email.includes('@')) {
    return 'Please provide a valid email address.'
  }
  if (form.body.length < 40) {
    return 'Body must be at least 40 characters to count as a manuscript.'
  }
  return ''
}

async function handleSubmit() {
  const validationError = validateForm()
  if (validationError) {
    errorMessage.value = validationError
    successMessage.value = ''
    return
  }

  submitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const created = await submitArticle(form)
    successMessage.value = `Submission accepted. Manuscript #${created.id} is now under dramatic review.`

    setTimeout(() => {
      router.push(`/articles/${created.id}`)
    }, 700)
  } catch (err) {
    errorMessage.value = err.message || 'Submission failed. Confirm backend is running and form data is valid.'
    console.error(err)
  } finally {
    submitting.value = false
  }
}
</script>
