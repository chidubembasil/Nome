import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './assets/style.css'
import * as lucideIcons from 'lucide-vue-next'
import { socket } from './service/socket';
import { auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";




// ✅ Register all icons globally
for (const [key, component] of Object.entries(lucideIcons)) {
  createApp(App).component(key, component)
}
onAuthStateChanged(auth, (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
});
createApp(App).mount('#app')
createApp(App).config.globalProperties.$socket = socket;
createApp(App).config.globalProperties.$auth = auth;
createApp(App).use(store).use(router).mount('#app')
