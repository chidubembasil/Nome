<template>
    <HeaderView/>
  <main class="property-detail-main">
    <div v-if="loading" class="loading-state">Loading Vacation Data...</div>
    <div v-else-if="error" class="error-state">{{ error }}</div>
    <div v-else>
      <div class="property-image-gallery">
        <div class="main-image-container">
          <img :src="propertyData?.images?.[0]" :alt="propertyData?.title" class="main-image">
        </div>
        <div class="thumbnail-images">
          <img v-for="(img, index) in propertyData?.images?.slice(1, 3)" :key="index" :src="img" :alt="'Thumbnail ' + (index + 1)" class="thumbnail-image">
        </div>
      </div>

      <div class="property-info-card">
        <div class="status-tags">
          <span class="tag primary-tag">{{ propertyData?.status?.type }}</span>
          <span class="tag secondary-tag">{{ propertyData?.status?.quality }}</span>
        </div>

        <h1 class="property-title">{{ propertyData?.title }}</h1>
        <p class="property-location">{{ propertyData?.location }}</p>

        <div class="property-specs">
          <div class="spec-item"><LucideIcon name="Bed" class="spec-icon"/> {{ propertyData?.specs?.beds }} **Beds**</div>
          <div class="spec-item"><LucideIcon name="Bath" class="spec-icon"/> {{ propertyData?.specs?.baths }} **Baths**</div>
          <div class="spec-item"><LucideIcon name="Ruler" class="spec-icon"/> {{ propertyData?.specs?.sqft }} sqft</div>
        </div>
      </div>

      <section class="section-container about-section">
        <h2 class="section-title">About this place</h2>
        <p class="section-content">{{ propertyData?.description?.about }}</p>
      </section>

      <section class="section-container offers-section">
        <h2 class="section-title">What this place offers</h2>
        <div class="offers-grid">
          <div class="offer-item" v-for="(offer, index) in propertyData?.offers" :key="index">
            <LucideIcon :name="offer.icon" class="offer-icon"/> {{ offer.name }}
          </div>
        </div>
      </section>

      <div class="booking-section section-container">
          <div class="price-per-night">
              <span class="price-value">{{ propertyData?.booking?.price }}</span>
              <span class="price-unit">/ night</span>
          </div>
          
          <div class="date-input-container">
              <input type="text" placeholder="Check In" class="date-input">
              <input type="text" placeholder="Check Out" class="date-input">
          </div>
          
          <button class="btn btn-primary reserve-btn">Reserve</button>
          
          <p class="no-charge-note">You won't be charged yet.</p>

          <div class="price-breakdown">
              <div class="breakdown-item">
                  <span class="breakdown-label">{{ propertyData?.booking?.breakdown?.nights?.label }}</span>
                  <span class="breakdown-amount">{{ propertyData?.booking?.breakdown?.nights?.amount }}</span>
              </div>
              <div class="breakdown-item">
                  <span class="breakdown-label">{{ propertyData?.booking?.breakdown?.service?.label }}</span>
                  <span class="breakdown-amount">{{ propertyData?.booking?.breakdown?.service?.amount }}</span>
              </div>
              <div class="breakdown-item">
                  <span class="breakdown-label">{{ propertyData?.booking?.breakdown?.cleaning?.label }}</span>
                  <span class="breakdown-amount">{{ propertyData?.booking?.breakdown?.cleaning?.amount }}</span>
              </div>
              <div class="breakdown-item total">
                  <span class="breakdown-label">Total</span>
                  <span class="breakdown-amount">{{ propertyData?.booking?.breakdown?.total }}</span>
              </div>
          </div>
      </div>
      
      <section class="section-container contact-section">
          <h2 class="section-title">Contact Host</h2>
          <form class="contact-form" @submit.prevent>
              <input type="text" placeholder="Your Name" class="form-input">
              <input type="email" placeholder="Your Email" class="form-input">
              <textarea placeholder="Ask about the property." class="form-textarea"></textarea>
              <button class="btn btn-primary form-submit-btn">Send Message</button>
          </form>
      </section>
    </div>
  </main>
  <FooterView/>
</template>

<script setup>
import { defineComponent, createVNode, ref, onMounted } from 'vue';
import * as LucideIcons from 'lucide-vue-next';
import axios from 'axios';
import HeaderView from '@/components/HeaderView.vue';
import FooterView from '../components/FooterView.vue'

// --- Utility Functions Included ---
const LucideIcon = defineComponent({
  props: { name: { type: String, required: true } },
  render() { 
    const icon = LucideIcons[this.name]; 
    return icon ? createVNode(icon) : null; 
  }
});

function usePropertyData(endpoint) {
  const defaultData = {
    images: [], status: {}, specs: {}, description: {}, offers: [], booking: { price: '', breakdown: {} }
  };
  
  const propertyData = ref(defaultData);
  const loading = ref(true);
  const error = ref(null);

  onMounted(async () => {
    try {
      const response = await axios.get(`http://localhost:3000${endpoint}`);
      propertyData.value = response.data;
      loading.value = false;
    } catch (err) {
      error.value = 'Failed to fetch property data. Check endpoint and server status.';
      console.error('API Error:', err);
      loading.value = false;
    }
  });
  return { propertyData, loading, error };
}

// --- Page Logic ---
const { propertyData, loading, error } = usePropertyData('/api/property/vacation');
</script>

<style scoped>


/* Base and Utility Styles (Duplicated for self-containment) */
.property-detail-main { max-width: 1000px; margin: 0 auto; padding: 1.5rem; margin-top: 10dvh;}
.loading-state, .error-state { text-align: center; padding: 4rem; font-size: 1.2rem; color: var(--muted-foreground); }
.section-container { padding: 1.5rem; background-color: var(--card); border-radius: var(--radius-md); margin-bottom: 1.5rem; border: 1px solid var(--border); }
.section-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 1rem; color: var(--primary); }
.section-content { line-height: 1.6; color: var(--card-foreground); }
.tag { padding: 0.25rem 0.75rem; border-radius: var(--radius-md); font-size: 0.8rem; font-weight: 700; }
.primary-tag { background-color: var(--primary); color: var(--foreground); }
.secondary-tag { background-color: var(--secondary); color: var(--card-foreground); }
.property-title { font-size: 2rem; font-weight: 800; margin-bottom: 0.25rem; }
.property-location { font-size: 1rem; color: var(--muted-foreground); margin-bottom: 1.5rem; }
.property-specs { display: flex; gap: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border); }
.spec-item { display: flex; align-items: center; gap: 0.3rem; font-weight: 500; color: var(--card-foreground); }
.spec-icon { width: 20px; height: 20px; color: var(--primary); }
.property-image-gallery { margin-bottom: 1.5rem; }
.main-image-container { overflow: hidden; border-radius: var(--radius-md); margin-bottom: 0.5rem; }
.main-image { width: 100%; height: auto; max-height: 450px; object-fit: cover; display: block; }
.thumbnail-images { display: flex; gap: 0.5rem; overflow: hidden; }
.thumbnail-image { width: 50%; height: 100px; object-fit: cover; border-radius: var(--radius-sm); }
.property-info-card { padding: 1.5rem; background-color: var(--card); border-radius: var(--radius-md); margin-bottom: 1.5rem; border: 1px solid var(--border); }

/* Form Styles (Common) */
.contact-form { display: flex; flex-direction: column; gap: 1rem; }
.form-input, .form-textarea {
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background-color: var(--background);
  color: var(--foreground);
  font-size: 1rem;
}
.form-textarea { resize: vertical; min-height: 100px; }
.form-submit-btn { width: 100%; }

/* Buttons (Common) */
.btn { padding: 0.75rem 1.25rem; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; width: 100%; }
.btn-primary { background-color: var(--primary); color: var(--foreground); }
.btn-primary:hover { opacity: 0.9; }

/* Vacation Unique CSS */

.offers-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.offer-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--card-foreground);
  font-weight: 500;
  font-size: 0.95rem;
}
.offer-icon { width: 18px; height: 18px; color: var(--primary); }

/* Booking Section */
.booking-section {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.price-per-night { display: flex; align-items: flex-end; margin-bottom: 1rem; }
.price-value { font-size: 2.2rem; font-weight: 700; color: var(--primary); line-height: 1; }
.price-unit {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--muted-foreground);
    margin-left: 0.25rem;
    line-height: 1.5;
}

.date-input-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    width: 100%;
    margin-bottom: 0.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    overflow: hidden;
}

.date-input {
    padding: 0.75rem 1rem;
    border: none;
    background-color: var(--background);
    color: var(--foreground);
    text-align: center;
    font-size: 1rem;
    font-family: inherit;
}

.date-input:first-child { border-right: 1px solid var(--border); }

.reserve-btn { margin-bottom: 0.5rem; }
.no-charge-note { font-size: 0.85rem; color: var(--muted-foreground); margin-bottom: 1.5rem; }

.price-breakdown { width: 100%; padding-top: 1rem; border-top: 1px solid var(--border); }
.breakdown-item { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.breakdown-label,
.breakdown-amount { font-size: 0.95rem; color: var(--card-foreground); }
.total { margin-top: 1rem; }
.total .breakdown-label, .total .breakdown-amount { font-weight: 700; }

/* ==================================== */
/* MEDIA QUERIES                        */
/* ==================================== */

@media (max-width: 600px) {
  /* Mobile optimizations */
  .property-detail-main {
    padding: 1rem;
  }
  .property-title {
    font-size: 1.75rem;
  }
  .property-specs {
    flex-wrap: wrap; 
    gap: 1rem;
  }
  .main-image {
    max-height: 250px;
  }
  .thumbnail-image {
    height: 80px;
  }
  .offers-grid { 
    grid-template-columns: 1fr; /* Stack offers vertically */
  }
  .price-per-night {
    flex-direction: column;
    align-items: center;
  }
  .price-unit {
    margin-left: 0;
    margin-top: 0.25rem;
  }
}
</style>