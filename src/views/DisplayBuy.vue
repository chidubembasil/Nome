<template>
    <HeaderView/>
  <main class="property-detail-main">
    <div v-if="loading" class="loading-state">Loading For Sale Data...</div>
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
          <span class="tag accent-tag">{{ propertyData?.status?.sale }}</span>
          <span class="tag secondary-tag">{{ propertyData?.status?.featured }}</span>
          <span class="tag primary-tag">{{ propertyData?.status?.promo }}</span>
        </div>

        <h1 class="property-title">{{ propertyData?.title }}</h1>
        <p class="property-location">{{ propertyData?.location }}</p>

        <div class="property-specs">
          <div class="spec-item"><LucideIcon name="Bed" class="spec-icon"/> {{ propertyData?.specs?.beds }} **Beds**</div>
          <div class="spec-item"><LucideIcon name="Bath" class="spec-icon"/> {{ propertyData?.specs?.baths }} **Baths**</div>
          <div class="spec-item"><LucideIcon name="Ruler" class="spec-icon"/> {{ propertyData?.specs?.sqft }} sqft</div>
        </div>
      </div>

      <section class="section-container description-section">
        <h2 class="section-title">Property Description</h2>
        <p class="section-content">{{ propertyData?.description?.full }}</p>
      </section>

      <section class="section-container features-section">
        <h2 class="section-title">Key Features</h2>
        <div class="key-features-grid">
          <div class="feature-item" v-for="(feature, index) in propertyData?.keyFeatures" :key="index">
            <LucideIcon :name="feature.icon" class="feature-icon"/> {{ feature.name }}
          </div>
        </div>
      </section>
      
      <section class="try-before-buy-card">
          <div class="card-content">
              <h3 class="card-title">{{ propertyData?.promo?.title }}</h3>
              <p class="card-text">{{ propertyData?.promo?.description }}</p>
              <button class="btn buy-vacation-btn">Book Vacation Stay</button>
          </div>
      </section>

      <div class="price-action-section">
          <div class="price-row">
              <span class="main-price">{{ propertyData?.price?.value }}</span>
              <span class="price-note">{{ propertyData?.price?.note }}</span>
          </div>
          <div class="action-row">
              <button class="btn btn-primary buy-now-btn">Buy Now</button>
              <button class="btn btn-secondary tour-btn">
                  <LucideIcon name="MapPin" class="btn-icon"/> Virtual Tour
              </button>
          </div>
      </div>
      
      <section class="section-container property-highlights-section">
          <h2 class="section-title">Property Highlights</h2>
          <div class="highlights-grid">
              <div class="highlight-pair" v-for="(highlight, key) in propertyData?.highlights" :key="key">
                <span class="label">{{ highlight.label }}</span>
                <span class="value">{{ highlight.value }}</span>
              </div>
          </div>
      </section>
      
      <section class="section-container contact-section">
          <h2 class="section-title">Contact Agent</h2>
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
    images: [], status: {}, specs: {}, description: {}, keyFeatures: [], promo: {}, price: {}, highlights: {}
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
const { propertyData, loading, error } = usePropertyData('/api/property/forsale');
</script>

<style scoped>


/* Base and Utility Styles (Duplicated for self-containment) */
.property-detail-main { max-width: 1000px; margin: 0 auto; padding: 1.5rem; margin-top: 10dvh; }
.loading-state, .error-state { text-align: center; padding: 4rem; font-size: 1.2rem; color: var(--muted-foreground); }
.section-container { padding: 1.5rem; background-color: var(--card); border-radius: var(--radius-md); margin-bottom: 1.5rem; border: 1px solid var(--border); }
.section-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 1rem; color: var(--primary); }
.section-content { line-height: 1.6; color: var(--card-foreground); }
.tag { padding: 0.25rem 0.75rem; border-radius: var(--radius-md); font-size: 0.8rem; font-weight: 700; }
.primary-tag { background-color: var(--primary); color: var(--foreground); }
.secondary-tag { background-color: var(--secondary); color: var(--card-foreground); }
.accent-tag { background-color: var(--accent); color: var(--foreground); }
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
.btn-secondary { background-color: transparent; color: var(--primary); border-color: var(--primary); }
.btn-secondary:hover { background-color: rgba(239, 68, 68, 0.1); }


/* For Sale Unique CSS */

.key-features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--card-foreground);
  font-weight: 500;
  font-size: 0.95rem;
}
.feature-icon { width: 18px; height: 18px; color: var(--primary); }

/* Try Before You Buy Card */
.try-before-buy-card {
  background-color: var(--destructive); /* Blue accent */
  border-radius: var(--radius-md);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--destructive-foreground);
}

.try-before-buy-card .card-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; }
.try-before-buy-card .card-text { font-size: 0.95rem; margin-bottom: 1rem; }
.buy-vacation-btn {
    padding: 0.5rem 1rem;
    background-color: var(--destructive-foreground);
    color: var(--destructive);
    width: auto;
    font-weight: 700;
}

/* Price and Action Section */
.price-action-section {
    padding: 1.5rem;
    background-color: var(--card);
    border-radius: var(--radius-md);
    margin-bottom: 1.5rem;
    border: 1px solid var(--border);
}

.price-row { margin-bottom: 1rem; }
.main-price { font-size: 2.2rem; font-weight: 700; color: var(--primary); display: block; }
.price-note { font-size: 0.85rem; color: var(--muted-foreground); margin-top: 0.25rem; display: block; }
.action-row { display: flex; gap: 0.75rem; }
.buy-now-btn, .tour-btn { flex: 1; }

/* Highlights Grid */
.highlights-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.highlight-pair {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px dashed var(--border);
}

.highlight-pair:last-child { border-bottom: none; }
.label { font-size: 0.9rem; color: var(--muted-foreground); }
.value { font-weight: 600; color: var(--card-foreground); }

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
  .key-features-grid,
  .highlights-grid { 
    grid-template-columns: 1fr; /* Stack features/highlights vertically */
  }
  .action-row {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>