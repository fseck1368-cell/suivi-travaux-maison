import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/',
    component: () => import('../components/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
      { path: 'projets', name: 'Projets', component: () => import('../views/Projets.vue') },
      { path: 'projets/:id', name: 'ProjetDetail', component: () => import('../views/ProjetDetail.vue') },
      { path: 'projets/nouveau', name: 'NouveauProjet', component: () => import('../views/NouveauProjet.vue') },
      { path: 'chat/:projetId', name: 'Chat', component: () => import('../views/Chat.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if ((to.name === 'Login' || to.name === 'Register') && token) {
    next('/')
  } else {
    next()
  }
})

export default router
