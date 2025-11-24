<script setup>
import { ref } from 'vue';
import ProfileInfo from '../components/ProfileInfo.vue';
import Security from '../components/SecurityView.vue';
import KYCVerification from '../components/KYCVerification.vue';
import MyListings from '../components/MyListings.vue';
import HeaderView from '../components/HeaderView.vue';
import FooterView from '../components/FooterView.vue';
const currentTab = ref('personal-info');

const tabs = [
  { id: 'personal-info', label: 'Personal Info', component: ProfileInfo },
  { id: 'security', label: 'Security', component: Security },
  { id: 'kyc-verification', label: 'KYC Verification', component: KYCVerification },
  { id: 'my-listings', label: 'My Listings', component: MyListings },
];
</script>

<template>
  <HeaderView/>
  <div class="profile-page">
    <h1 class="page-title">My Profile</h1>
    
    <div class="tabs-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab.id" 
        :class="{ 'active': currentTab === tab.id }"
        @click="currentTab = tab.id"
        class="tab-button"
      >
        {{ tab.label }}
      </button>     
    </div>

    <div class="tab-content">
      <KeepAlive>
        <component :is="tabs.find(t => t.id === currentTab).component" />
      </KeepAlive>
    </div>
  </div>
  <FooterView/>
</template>

<style scoped>
.profile-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  color: var(--foreground);
  font-family: 'Poppins', sans-serif;
  margin-top: 10dvh;
}

.page-title {
  font-size: 2em;
  margin-bottom: 20px;
  color: var(--foreground);
}

.tabs-nav {
  display: flex;
  flex-wrap: wrap;
  border-bottom: 2px solid var(--border);
  margin-bottom: 30px;
}

.tab-button {
  background: none;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 1rem;
  color: var(--muted-foreground); 
  transition: color 0.3s, border-bottom 0.3s;
  margin-right: 10px;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: var(--foreground);
}

.tab-button.active {
  color: var(--primary); 
  border-bottom: 2px solid var(--primary);
  font-weight: 600;
}

/* Tablet and Mobile Responsiveness */
@media (max-width: 768px) {
  .tabs-nav {
    justify-content: space-between;
    gap: 5px;
  }
  .tab-button {
    flex-grow: 1;
    text-align: center;
    margin-right: 0;
    padding: 10px 5px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5em;
  }
}
</style>
