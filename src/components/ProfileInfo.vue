<script setup>
import { reactive } from 'vue';

const profileData = reactive({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phoneNumber: '+1 (555) 123-4567',
  bio: 'Real estate enthusiast looking for the perfect home.',
  location: {
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  }
});

const saveChanges = () => {
  console.log('Saving changes:', profileData);
  // Implement API call to save data
  alert('Profile updated!');
};
</script>

<template>
  <div class="profile-info-container">
    <div class="section-card">
      <h2 class="card-title">Profile Picture</h2>
      <div class="profile-picture-upload">
        <div class="profile-avatar">
          <svg viewBox="0 0 24 24" fill="currentColor" class="avatar-icon"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </div>
        <div class="upload-controls">
          <button class="change-photo-btn">Change Photo</button>
          <p class="file-info">JPG, PNG or GIF. Max size 2MB</p>
        </div>
      </div>
    </div>

    <div class="section-card">
      <h2 class="card-title">Basic Information</h2>
      <div class="form-grid">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input id="firstName" v-model="profileData.firstName" type="text" class="text-input">
        </div>
        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input id="lastName" v-model="profileData.lastName" type="text" class="text-input">
        </div>
        <div class="form-group full-width">
          <label for="email">Email</label>
          <input id="email" v-model="profileData.email" type="email" class="text-input" disabled>
        </div>
        <div class="form-group full-width">
          <label for="phoneNumber">Phone Number</label>
          <input id="phoneNumber" v-model="profileData.phoneNumber" type="tel" class="text-input">
        </div>
        <div class="form-group full-width">
          <label for="bio">Bio</label>
          <textarea id="bio" v-model="profileData.bio" rows="3" class="text-input"></textarea>
        </div>
      </div>
    </div>

    <div class="section-card">
      <h2 class="card-title">Location</h2>
      <div class="form-grid location-grid">
        <div class="form-group full-width">
          <label for="address">Address</label>
          <input id="address" v-model="profileData.location.address" type="text" class="text-input">
        </div>
        <div class="form-group">
          <label for="city">City</label>
          <input id="city" v-model="profileData.location.city" type="text" class="text-input">
        </div>
        <div class="form-group">
          <label for="state">State</label>
          <input id="state" v-model="profileData.location.state" type="text" class="text-input">
        </div>
        <div class="form-group">
          <label for="zipCode">ZIP Code</label>
          <input id="zipCode" v-model="profileData.location.zipCode" type="text" class="text-input">
        </div>
      </div>
    </div>

    <button @click="saveChanges" class="save-changes-btn">Save Changes</button>
  </div>
</template>

<style scoped>
    .profile-info-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    }

    .section-card {
    background-color: var(--card); 
    padding: 25px;
    border-radius: var(--radius-sm);
    box-shadow: var(--card-shadow);
    color: var(--card-foreground);
    }

    .card-title {
    font-size: 1.25em;
    margin-bottom: 20px;
    color: var(--foreground);
    font-weight: 600;
    }

    /* --- Profile Picture Section --- */
    .profile-picture-upload {
    display: flex;
    align-items: center;
    gap: 20px;
    }

    .profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: var(--secondary); /* secondary background */
    display: flex;
    align-items: center;
    justify-content: center;
    }

    .avatar-icon {
    width: 50px;
    height: 50px;
    color: var(--muted-foreground);
    }

    .change-photo-btn {
    background-color: var(--secondary);
    color: var(--secondary-foreground);
    padding: 8px 15px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background-color 0.3s;
    font-weight: 500;
    }

    .change-photo-btn:hover {
    background-color: var(--muted);
    }

    .file-info {
    font-size: 0.85em;
    color: var(--muted-foreground);
    margin-top: 5px;
    }

    /* --- Form Grid Layout --- */
    .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    }

    .form-group {
    display: flex;
    flex-direction: column;
    }

    .full-width {
    grid-column: 1 / -1;
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
    box-shadow: 0 0 0 3px var(--ring-shadow, rgba(26, 79, 255, 0.2)); /* Custom ring shadow */
    }

    .text-input[disabled] {
    background-color: var(--muted);
    color: var(--muted-foreground);
    cursor: not-allowed;
    }

    textarea.text-input {
        resize: vertical;
    }

    /* --- Save Button --- */
    .save-changes-btn {
    background-color: var(--primary);
    color: var(--primary-foreground);
    padding: 12px 25px;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 1.1em;
    font-weight: 600;
    align-self: flex-start;
    }

    .save-changes-btn:hover {
    background-color: var(--hover);
    }

    /* Tablet and Mobile Responsiveness */
    @media (max-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
    .full-width {
        grid-column: auto;
    }
    .profile-picture-upload {
        flex-direction: column;
        align-items: flex-start;
    }
    }
</style>