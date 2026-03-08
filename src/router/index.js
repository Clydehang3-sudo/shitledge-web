import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Ask from '../views/Ask.vue'
import QuestionDetail from '../views/QuestionDetail.vue'
import Explore from '../views/Explore.vue'
import About from '../views/About.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/ask', name: 'ask', component: Ask },
  { path: '/questions/:id', name: 'question-detail', component: QuestionDetail },
  { path: '/explore', name: 'explore', component: Explore },
  { path: '/about', name: 'about', component: About },
  { path: '/submit', redirect: '/ask' },
  { path: '/articles', redirect: '/' },
  { path: '/articles/:id', redirect: to => `/questions/${to.params.id}` },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
