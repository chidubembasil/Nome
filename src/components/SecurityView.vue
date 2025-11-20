<script setup>
import { reactive, ref } from 'vue';

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
});

const updateStatus = ref('');

const changePassword = () => {
  updateStatus.value = '';
  if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
    updateStatus.value = 'Error: New passwords do not match.';
    return;
  }
  
  if (passwordForm.newPassword.length < 8) {
    updateStatus.value = 'Error: New password must be at least 8 characters.';
    return;
  }

  // Simulate API call
  console.log('Changing password...');
  setTimeout(() => {
    updateStatus.value = 'Success: Your password has been updated.';
    // Clear form
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmNewPassword = '';
  }, 1000);
};
</script>

<template>
  <div class="security-container">
    <div class="section-card">
      <h2 class="card-title">Change Password</h2>
      <p class="subtitle">Update your current password to keep your account secure.</p>
      
      <form @submit.prevent="changePassword" class="password-form">
        <div class="form-group">
          <label for="currentPassword">Current Password</label>
          <input id="currentPassword" v-model="passwordForm.currentPassword" type="password" required class="text-input">
        </div>
        <div class="form-group">
          <label for="newPassword">New Password</label>
          <input id="newPassword" v-model="passwordForm.newPassword" type="password" required class="text-input">
        </div>
        <div class="form-group">
          <label for="confirmNewPassword">Confirm New Password</label>
          <input id="confirmNewPassword" v-model="passwordForm.confirmNewPassword" type="password" required class="text-input">
        </div>

        <p v-if="updateStatus" :class="['update-status', updateStatus.includes('Error') ? 'error' : 'success']">
          {{ updateStatus }}
        </p>

        <button type="submit" class="update-password-btn">Update Password</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.security-container {
  color: var(--foreground);
}

.section-card {
  background-color: var(--card);
  padding: 25px;
  border-radius: var(--radius-sm);
  box-shadow: var(--card-shadow);
}

.card-title {
  font-size: 1.25em;
  color: var(--foreground);
  font-weight: 600;
}

.subtitle {
  color: var(--muted-foreground);
  margin-bottom: 25px;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 450px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--foreground);
}

.text-input {
  padding: 10px;
  border: 1px solid var(--input);
  border-radius: var(--radius-sm);
  background-color: var(--background);
  color: var(--foreground);
  font-size: 1em;
}

.text-input:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px var(--ring-shadow, rgba(26, 79, 255, 0.2));
}

.update-status {
  padding: 10px;
  border-radius: var(--radius-sm);
  font-weight: 500;
}

.success {
  /* Using a custom light green derived from primary or a new success token */
  background-color: rgba(30, 200, 30, 0.1); 
  color: green; /* Adjust color for visibility in both themes */
}

.error {
  background-color: rgba(var(--destructive, 255, 42, 42), 0.1); 
  color: var(--destructive);
}

.update-password-btn {
  background-color: var(--primary);
  color: var(--primary-foreground);
  padding: 12px 25px;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1.1em;
  font-weight: 600;
}

.update-password-btn:hover {
  background-color: var(--hover);
}

/* Tablet and Mobile Responsiveness */
@media (max-width: 600px) {
  .password-form {
    max-width: 100%;
  }
}
</style>