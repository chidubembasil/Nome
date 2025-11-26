<template>
    <HeaderView/>
    <div id="error" ref="errors">
        <X/>
        <p>{{ error }}</p>
    </div>

    <div class="login-page">
        <div class="login-box">
           <svg width="30" height="30" viewBox="0 0 100 100">
                    <!-- Left half: #1637cc -->
                    <polygon points="50,10 10,35 10,75 50,100 50,55 50,10" fill="#1637cc"/>
                    <!-- Right half: #1a4fff -->
                    <polygon points="50,10 90,35 90,75 50,100 50,55 50,10" fill="#1a4fff"/>
                </svg>
            <h2 class="title">Welcome Back</h2>
            <p class="subtitle">Sign in to continue your property journey</p>
            
            <form @submit.prevent="handleLogin">
                <div class="input-group">
                    <Mail :size="20" class="input-icon" />
                    <input type="email" placeholder="Email" v-model="email" required>
                </div>
                
                <div class="input-group">
                    <Lock :size="20" class="input-icon" />
                    <input type="password" placeholder="Password" v-model="password" required>
                </div>

                <div class="options">
                    <label class="remember-me">
                        <input type="checkbox"> Remember me
                    </label>
                    <router-link to="/forget" class="forgot-link">Forgot password?</router-link>
                    <!-- <a href="#" class="forgot-link">Forgot password?</a> -->
                </div>
                
                <button type="submit" class="btn btn-primary sign-in-btn">Sign In</button>
            </form>

            <div class="separator">OR CONTINUE WITH</div>

            <div class="social-login">
                <button class="social-btn" @click="googleLogin">
                    <Google :size="18" /> Google
                </button>

            </div>
        </div>
    </div>

    <FooterView/>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { Mail, Lock, Google } from 'lucide-vue-next';
import HeaderView from '../components/HeaderView.vue'
import FooterView from '../components/FooterView.vue'

// ⭐ Firebase imports
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const email = ref('');
const password = ref('');
const errors = ref(null);
const error = ref("");

// ---------------------------------------------
// Email + Password Login (Your existing method)
// ---------------------------------------------
const handleLogin = async () => {
  if (email.value === "" || password.value === "") {
    return showError("Email and password are required");
  }

  try {
    const response = await axios.post('https://zipsleeper.gt.tc/api/auth.php', {
      email: email.value,
      password: password.value
    });

    console.log('Login Successful:', response.data);

    // Redirect after login
    window.location.href = "/";

  } catch (err) {
    showError("Invalid email or password");
  }
};

// ---------------------------------------------
// GOOGLE LOGIN
// ---------------------------------------------
const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("Google Login:", user);

    // SEND TO PHP BACKEND
    await axios.post('https://zipsleeper.gt.tc/api/auth.php', {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      provider: "google"
    });

    // Store user in frontend
    localStorage.setItem("Zipsleeper_user", JSON.stringify(user));

    window.location.href = "/";

  } catch (err) {
    showError("Google login failed");
  }
};



// ---------------------------------------------
// Error Display
// ---------------------------------------------
const showError = (msg) => {
  error.value = msg;
  errors.value.style.display = "flex";

  setTimeout(() => {
    errors.value.style.display = "none";
  }, 2000);
};
</script>

<style scoped>

.login-page {
  background-color: var(--background); 
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin-top: 10dvh;
}
#error{
    position: absolute;
    top: 12dvh;
    right: 0;
    display: none;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: var(--destructive);
    width: 300px;
    height: 50px;
    background-color: var(--card);
    box-shadow: 0px 2px 5px var(--card-shadow-lg);
  }

.login-box {
  background-color: var(--card);
  padding: 30px;
  border-radius: var(--radius-md);
  box-shadow: var(--card-shadow-lg);
  width: 100%;
  max-width: 400px; 
  text-align: center;
  color: var(--card-foreground);
}

.Zipsleeper-icon {
    color: var(--primary); 
    margin-bottom: 10px;
}

.title { font-size: 1.75rem; margin-bottom: 5px; }
.subtitle { color: var(--muted-foreground); margin-bottom: 30px; font-size: 0.95rem;}

/* Button Utility for the main Sign In button */
.btn-primary {
    width: 100%;
    padding: 12px;
    background-color: var(--primary);
    border: none;
    border-radius: var(--radius-sm);
    color: var(--primary-foreground);
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}
.btn-primary:hover {
    background-color: var(--hover);
}


.input-group {
  position: relative;
  margin-bottom: 15px;
}
.input-icon {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: var(--muted-foreground);
}
input[type="email"], input[type="password"] {
  width: 100%;
  padding: 12px 12px 12px 45px;
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--foreground);
  outline: none;
  transition: border-color 0.2s;
}
input:focus {
    border-color: var(--ring);
}

.options {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 20px;
  color: var(--muted-foreground);
}
.forgot-link { 
    color: var(--primary); 
    text-decoration: none; 
    font-weight: 500;
}

.separator {
  margin: 25px 0;
  color: var(--muted-foreground);
  font-size: 0.85rem;
}

.social-login {
  display: flex;
  gap: 10px;
}
.social-btn {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background-color: var(--background);
  color: var(--foreground);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.social-btn:hover {
    background-color: var(--secondary);
}
</style>