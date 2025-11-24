import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/listing',
    name: 'listing',
    component: () => import(/* webpackChunkName: "listing" */ '../views/ListingView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/create',
    name: 'create',
    component: () => import(/* webpackChunkName: "upload" */ '../views/UploadView.vue')
  },
  {
    path: '/payment',
    name: 'payment',
    component: () => import(/* webpackChunkName: "payment" */ '../views/PaymentView.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/ProfileView.vue')
  },
  {
    path: '/favorite',
    name: 'favorite',
    component: () => import(/* webpackChunkName: "favorite" */ '../views/FavView.vue')
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import(/* webpackChunkName: "auth" */ '../views/AuthView.vue')
  },
  {
    path: '/invest',
    name: 'invest',
    component: () => import(/* webpackChunkName: "invest" */ '../views/DisplayInvest.vue')
  },
  {
    path: '/rent',
    name: 'rent',
    component: () => import(/* webpackChunkName: "rent" */ '../views/DisplayRent.vue')
  },
  {
    path: '/buy',
    name: 'buy',
    component: () => import(/* webpackChunkName: "buy" */ '../views/DisplayBuy.vue')
  },
  {
    path: '/stay',
    name: 'stay',
    component: () => import(/* webpackChunkName: "stay" */ '../views/DisplayStay.vue')
  },
  {
    path: '/feed',
    name: 'feed',
    component: () => import(/* webpackChunkName: "feed" */ '../views/NewsFeed.vue')
  },
  {
    path: '/confirm',
    name: 'confirm',
    component: () => import(/* webpackChunkName: "confirm" */ '../views/ConfirmView.vue')
  },
  {
    path: '/notification',
    name: 'notification',
    component: () => import(/* webpackChunkName: "notification" */ '../views/NotificationView.vue')
  },
  {
    path: '/forget',
    name: 'forget',
    component: () => import(/* webpackChunkName: "forget" */ '../views/ForgetPassword.vue')
  }
 
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
