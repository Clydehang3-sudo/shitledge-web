<template>
  <section class="submit-shell">
    <header class="page-head">
      <p class="eyebrow">Contribute</p>
      <h1>Submit Manuscript</h1>
      <p class="lede">All submissions are judged by a strict standard: does this feel painfully true?</p>
    </header>

    <div class="submit-decor" aria-hidden="true">
      <span class="poop-float poop-float-a">💩</span>
      <span class="poop-float poop-float-b">💩</span>
    </div>

    <form class="submit-form refined-form" @submit.prevent="handleSubmit">
      <div class="form-grid-two">
        <label>
          Title
          <input v-model.trim="form.title" :class="fieldClass('title')" required maxlength="180" @blur="touch('title')" />
          <small class="meta">{{ form.title.length }}/180</small>
          <small v-if="fieldError('title')" class="error-text">{{ fieldError('title') }}</small>
        </label>

        <label>
          Author
          <input v-model.trim="form.author" :class="fieldClass('author')" required maxlength="120" @blur="touch('author')" />
          <small class="meta">{{ form.author.length }}/120</small>
          <small v-if="fieldError('author')" class="error-text">{{ fieldError('author') }}</small>
        </label>
      </div>

      <label>
        Email
        <input v-model.trim="form.email" :class="fieldClass('email')" type="email" required maxlength="200" @blur="touch('email')" />
        <small v-if="fieldError('email')" class="error-text">{{ fieldError('email') }}</small>
      </label>

      <label>
        Abstract
        <textarea v-model.trim="form.summary" :class="fieldClass('summary')" rows="4" required maxlength="600" @blur="touch('summary')" />
        <small class="meta">{{ form.summary.length }}/600</small>
        <small v-if="fieldError('summary')" class="error-text">{{ fieldError('summary') }}</small>
      </label>

      <label>
        Body
        <textarea v-model.trim="form.body" :class="fieldClass('body')" rows="11" required minlength="40" @blur="touch('body')" />
        <small class="meta">{{ bodyWords }} words · minimum 40 characters</small>
        <small v-if="fieldError('body')" class="error-text">{{ fieldError('body') }}</small>
      </label>

      <div class="submission-progress" role="status" aria-live="polite">
        <span>Form readiness</span>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <strong>{{ progress }}%</strong>
      </div>

      <button type="submit" :disabled="submitting || progress < 100">
        {{ submitting ? 'Submitting...' : 'Submit to Editorial Board' }}
      </button>
    </form>

    <p v-if="successMessage" class="success-text">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
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

const touched = reactive({
  title: false,
  author: false,
  email: false,
  summary: false,
  body: false
})

const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const bodyWords = computed(() => (form.body.trim() ? form.body.trim().split(/\s+/).length : 0))

const rules = {
  title: (value) => (value ? '' : 'Title is required.'),
  author: (value) => (value ? '' : 'Author is required.'),
  email: (value) => {
    if (!value) return 'Email is required.'
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please provide a valid email address.'
  },
  summary: (value) => (value ? '' : 'Abstract is required.'),
  body: (value) => {
    if (!value) return 'Body is required.'
    return value.length >= 40 ? '' : 'Body must be at least 40 characters.'
  }
}

const progress = computed(() => {
  const keys = Object.keys(rules)
  const completed = keys.filter((key) => !rules[key](form[key])).length
  return Math.round((completed / keys.length) * 100)
})

function touch(field) {
  touched[field] = true
}

function fieldError(field) {
  if (!touched[field]) return ''
  return rules[field](form[field])
}

function fieldClass(field) {
  if (!touched[field]) return ''
  return rules[field](form[field]) ? 'input-invalid' : 'input-valid'
}

function validateForm() {
  for (const key of Object.keys(touched)) {
    touched[key] = true
  }

  const errors = Object.keys(rules).map((key) => rules[key](form[key])).filter(Boolean)
  return errors[0] || ''
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
