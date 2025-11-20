<script setup>
import { reactive } from 'vue';

const preferences = reactive({
  emailNotifications: true,
  smsAlerts: false,
  priceDropAlerts: true
});

const updatePreferences = () => {
  console.log('Preferences updated:', preferences);
};
</script>

<template>
  <div class="preferences-container">
    <div class="section-card">
      <h2 class="card-title">Notification Preferences</h2>
      <p class="subtitle">Manage how you receive updates</p>
      
      <div class="preference-item">
        <label for="emailNotifications">Email Notifications</label>
        <div class="control-group">
          <p class="description">Receive property updates via email</p>
          <input 
            id="emailNotifications" 
            type="checkbox" 
            v-model="preferences.emailNotifications" 
            @change="updatePreferences"
            class="toggle-checkbox"
          >
        </div>
      </div>
      
      <div class="preference-item">
        <label for="smsAlerts">SMS Alerts</label>
        <div class="control-group">
          <p class="description">Get text messages for new listings</p>
          <input 
            id="smsAlerts" 
            type="checkbox" 
            v-model="preferences.smsAlerts" 
            @change="updatePreferences"
            class="toggle-checkbox"
          >
        </div>
      </div>
      
      <div class="preference-item">
        <label for="priceDropAlerts">Price Drop Alerts</label>
        <div class="control-group">
          <p class="description">Notify about saved properties reduce price</p>
          <input 
            id="priceDropAlerts" 
            type="checkbox" 
            v-model="preferences.priceDropAlerts" 
            @change="updatePreferences"
            class="toggle-checkbox"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preferences-container {
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

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px 0;
  border-top: 1px solid var(--border);
}

.preference-item:first-of-type {
  border-top: none;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

label {
  font-weight: 500;
  flex-grow: 1;
  color: var(--foreground);
}

.description {
  font-size: 0.9em;
  color: var(--muted-foreground);
  margin: 0;
}

/* Custom Checkbox/Toggle Switch */
.toggle-checkbox {
  appearance: none;
  width: 40px;
  height: 20px;
  border-radius: 10px;
  background-color: var(--muted);
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
  flex-shrink: 0; /* Prevents shrinking on mobile */
}

.toggle-checkbox::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: var(--secondary-foreground); /* white/light gray circle */
  transition: transform 0.3s, background-color 0.3s;
}

.toggle-checkbox:checked {
  background-color: var(--primary);
}

.toggle-checkbox:checked::before {
  transform: translateX(20px);
  background-color: var(--primary-foreground);
}

/* Tablet and Mobile Responsiveness */
@media (max-width: 600px) {
  .preference-item {
    flex-direction: column;
    align-items: flex-start;
  }
  .control-group {
    width: 100%;
    justify-content: space-between;
    margin-top: 5px;
  }
  .description {
    max-width: 70%;
  }
}
</style>