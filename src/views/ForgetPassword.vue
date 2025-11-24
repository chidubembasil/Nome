<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { Mail, ArrowLeft, Loader2 } from 'lucide-vue-next';
import HeaderView from '@/components/HeaderView.vue';
import FooterView from '../components/FooterView.vue'

import { useRouter } from 'vue-router';
const router = useRouter();

// --- State ---
const email = ref('');
const message = ref('');
const isSubmitting = ref(false);
const submitSuccess = ref(false);

// --- Actions ---
const handleResetPassword = async () => {
    if (!email.value) {
        message.value = 'Please enter your email address.';
        return;
    }

    isSubmitting.value = true;
    message.value = '';
    
    // 1. Hypothetical API Endpoint (Replace with your actual URL)
    const API_URL = '/api/auth/forgot-password';

    try {
        // 2. Submit email to the backend
        const response = await axios.post(API_URL, { email: email.value });
        
        submitSuccess.value = true;
        // Display success message from backend or default one
        message.value = response.data.message || 'Success! A password reset link has been sent to your email address.';
        
    } catch (err) {
        submitSuccess.value = false;
        // Handle specific error messages from backend or provide a generic error
        const errorMsg = err.response?.data?.message || 'Failed to send reset link. Please check your email address and try again.';
        message.value = errorMsg;
        // console.error('Password reset error:', err);
    } finally {
        isSubmitting.value = false;
    }
};

const goToLogin = () => {
    // Implement router navigation here
     router.push('/auth');
    console.log('Navigating back to login...');
};
</script>

<template>
    <HeaderView/>
    <main class="reset-password-page">
        <div class="reset-card">
            <h2>Reset Password</h2>
            <p class="subtitle">Enter your email address and we'll send you a link to reset your password.</p>

            <form @submit.prevent="handleResetPassword" class="reset-form">
                
                <div class="input-group">
                    <label for="email">Email</label>
                    <div class="input-wrapper">
                        <Mail size="20" class="input-icon" />
                        <input
                            id="email"
                            type="email"
                            v-model="email"
                            placeholder="Enter your email"
                            required
                            :disabled="isSubmitting || submitSuccess"
                        />
                    </div>
                </div>

                <div v-if="message" :class="['submission-message', { 'success': submitSuccess, 'error': !submitSuccess && !isSubmitting }]">
                    {{ message }}
                </div>

                <button type="submit" :disabled="isSubmitting || submitSuccess" class="send-reset-btn">
                    <span v-if="isSubmitting">
                        <Loader2 class="animate-spin" size="20" /> Sending...
                    </span>
                    <span v-else>
                        Send Reset Password
                    </span>
                </button>
            </form>

            <button @click="goToLogin" class="back-to-login">
                <ArrowLeft size="16" /> Back to login
            </button>
        </div>
    </main>
    <FooterView/>
</template>

<style scoped>
/* All styles are preserved from the previous response for visual consistency */
.reset-password-page {
    margin-top: 10dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 120px); 
    padding: 20px;
}
.reset-card {
    background-color: var(--card);
    color: var(--card-foreground);
    border-radius: var(--radius-md);
    box-shadow: var(--card-shadow-lg);
    width: 100%;
    max-width: 400px;
    padding: 40px 30px;
    text-align: center;
}
h2 {
    font-size: 1.8rem;
    margin-bottom: 10px;
    color: var(--foreground);
}
.subtitle {
    color: var(--muted-foreground);
    margin-bottom: 30px;
}
.reset-form {
    margin-bottom: 20px;
}
.input-group {
    text-align: left;
    margin-bottom: 20px;
}
.input-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    font-size: 0.95rem;
}
.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}
.input-icon {
    position: absolute;
    left: 12px;
    color: var(--muted-foreground);
    pointer-events: none;
}
input {
    width: 100%;
    padding: 12px 12px 12px 40px; 
    border: 1px solid var(--input);
    border-radius: var(--radius-sm);
    background-color: var(--background);
    color: var(--foreground);
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
}
input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 1px var(--primary);
}
.submission-message {
    padding: 10px;
    border-radius: var(--radius-sm);
    margin-bottom: 20px;
    font-size: 0.9rem;
    font-weight: 500;
}
.submission-message.success {
    background-color: #d4edda;
    color: #155724;
}
.submission-message.error {
    background-color: #f8d7da;
    color: #721c24;
}
body.dark-mode .submission-message.success {
    background-color: #1f3d2e;
    color: #4fff8c;
}
body.dark-mode .submission-message.error {
    background-color: #451b21;
    color: #ff5e67;
}
.send-reset-btn {
    width: 100%;
    background-color: var(--primary);
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
.send-reset-btn:hover:not(:disabled) {
    background-color: var(--hover);
}
.send-reset-btn:disabled {
    background-color: var(--muted);
    color: var(--muted-foreground);
    cursor: not-allowed;
}
.back-to-login {
    background: none;
    border: none;
    color: var(--primary);
    margin-top: 15px;
    cursor: pointer;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: color 0.2s;
}
.back-to-login:hover {
    color: var(--hover);
}
</style>