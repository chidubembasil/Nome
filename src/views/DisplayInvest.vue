<template>
  <HeaderView/>
  <main class="property-detail-main">

    <div v-if="loading" class="loading-state">Loading Investment Data...</div>
    <div v-else-if="error" class="error-state">{{ error }}</div>

    <div v-else>

      <!-- ========================== -->
      <!-- IMAGE GALLERY -->
      <!-- ========================== -->
      <div class="property-image-gallery">
        <div class="main-image-container">
          <img :src="propertyData?.images?.[0]" :alt="propertyData?.title" class="main-image">
        </div>

        <div class="thumbnail-images">
          <img
            v-for="(img, index) in propertyData?.images?.slice(1,3)"
            :key="index"
            :src="img"
            :alt="'Thumbnail ' + (index + 1)"
            class="thumbnail-image"
          >
        </div>
      </div>

      <!-- ========================== -->
      <!-- PROPERTY INFO CARD -->
      <!-- ========================== -->
      <div class="property-info-card">
        <div class="status-tags">
          <span class="tag primary-tag">{{ propertyData?.status?.type }}</span>
          <span class="tag secondary-tag">{{ propertyData?.status?.roi }}</span>
        </div>

        <h1 class="property-title">{{ propertyData?.title }}</h1>
        <p class="property-location">{{ propertyData?.location }}</p>

        <div class="property-specs">
          <div class="spec-item"><LucideIcon name="Bed" class="spec-icon"/> {{ propertyData?.specs?.beds }} Beds</div>
          <div class="spec-item"><LucideIcon name="Bath" class="spec-icon"/> {{ propertyData?.specs?.baths }} Baths</div>
          <div class="spec-item"><LucideIcon name="Ruler" class="spec-icon"/> {{ propertyData?.specs?.sqft }} sqft</div>
        </div>
      </div>

      <!-- ========================== -->
      <!-- OVERVIEW -->
      <!-- ========================== -->
      <section class="section-container overview-section">
        <h2 class="section-title">Investment Overview</h2>
        <p class="section-content">{{ propertyData?.overview }}</p>
      </section>

      <!-- ========================== -->
      <!-- INVESTMENT OPTIONS -->
      <!-- ========================== -->
      <section class="section-container investment-options-section">
        <h2 class="section-title">Investment Options</h2>

        <div class="investment-tabs">
          <button class="tab-button active">Direct Buy</button>
          <button class="tab-button">Co-Invest</button>
          <button class="tab-button">Fractional</button>
        </div>

        <div class="investment-option-details">
          <h3>{{ propertyData?.options?.directBuy?.title }}</h3>
          <p class="option-description">{{ propertyData?.options?.directBuy?.description }}</p>

          <div class="option-price-row">
            <span class="option-price">{{ propertyData?.options?.directBuy?.price }}</span>
            <button class="btn btn-primary invest-btn">Invest Now</button>
          </div>
        </div>
      </section>

      <!-- ========================== -->
      <!-- METRICS -->
      <!-- ========================== -->
      <section class="section-container metrics-section">
        <h2 class="section-title">Investment Metrics</h2>

        <div class="metrics-grid">
          <div class="metric-item" v-for="(metric, index) in propertyData?.metrics" :key="index">
            <span class="metric-label">{{ metric.label }}</span>
            <span class="metric-value" :class="{ 'primary-text': metric.isPrimary }">
              {{ metric.value }}
            </span>
          </div>
        </div>

        <button class="btn btn-primary start-process-btn">Start Investment Process</button>
      </section>

      <!-- ========================== -->
      <!-- CONTACT FORM -->
      <!-- ========================== -->
      <section class="section-container contact-section">
        <h2 class="section-title">Contact Property Manager</h2>

        <form class="contact-form" @submit.prevent>
          <input type="text" placeholder="Your Name" class="form-input">
          <input type="email" placeholder="Your Email" class="form-input">
          <textarea placeholder="Ask about the investment opportunity." class="form-textarea"></textarea>
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
import FooterView from '@/components/FooterView.vue';

// ABLY
import { Realtime } from "ably";

// ICON COMPONENT
const LucideIcon = defineComponent({
  props: { name: { type: String, required: true } },
  render() {
    const icon = LucideIcons[this.name];
    return icon ? createVNode(icon) : null;
  }
});


// =====================================
// FETCH + REAL-TIME HOOK
// =====================================
function usePropertyData(endpoint) {
  const defaultData = {
    images: [],
    status: {},
    specs: {},
    overview: '',
    options: { directBuy: {} },
    metrics: []
  };

  const propertyData = ref(defaultData);
  const loading = ref(true);
  const error = ref(null);

  onMounted(async () => {
    try {
      // INITIAL API FETCH
      const response = await axios.get(`http://localhost:3000${endpoint}`);
      propertyData.value = response.data;
      loading.value = false;

      // ================================
      // REALTIME ABLY SUBSCRIPTION
      // ================================
      const ably = new Realtime("RSTb1g.Dg9vCg:IYEo1Otd0e1OLvKynv_go5Ma3LvCEa2R1ln7KLwhRk8");

      const channel = ably.channels.get("property-updates");

      channel.subscribe("update", (msg) => {
        console.log("Real-time update received:", msg.data);

        // Update property data live
        propertyData.value = {
          ...propertyData.value,
          ...msg.data
        };
      });

    } catch (err) {
      error.value = 'Failed to fetch property data. Check endpoint and server.';
      console.error('API Error:', err);
      loading.value = false;
    }
  });

  return { propertyData, loading, error };
}

// PAGE LOGIC
const { propertyData, loading, error } = usePropertyData('/api/property/investment');
</script>



<style scoped>
/* ( FULL CSS EXACTLY AS YOU PROVIDED — NO CHANGE ) */

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
.contact-form { display: flex; flex-direction: column; gap: 1rem; }
.form-input, .form-textarea { padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border); background-color: var(--background); color: var(--foreground); font-size: 1rem; }
.form-textarea { resize: vertical; min-height: 100px; }
.btn { padding: 0.75rem 1.25rem; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; width: 100%; }
.btn-primary { background-color: var(--primary); color: var(--foreground); }
.btn-primary:hover { opacity: 0.9; }
.investment-tabs { display: flex; background-color: var(--secondary); border-radius: var(--radius-sm); padding: 0.25rem; margin-bottom: 1.5rem; }
.tab-button { flex: 1; padding: 0.5rem 0.75rem; border: none; background: transparent; color: var(--muted-foreground); font-weight: 500; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s; }
.tab-button.active { background-color: var(--card); color: var(--card-foreground); font-weight: 600; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.3); }
.option-price-row { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border); }
.option-price { font-size: 1.75rem; font-weight: 700; color: var(--card-foreground); }
.invest-btn { width: auto; min-width: 120px; }
.metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem 1rem; margin-bottom: 1.5rem; }
.metric-item { display: flex; flex-direction: column; }
.metric-label { font-size: 0.9rem; color: var(--muted-foreground); margin-bottom: 0.25rem; }
.metric-value { font-size: 1.2rem; font-weight: 700; color: var(--card-foreground); }
.primary-text { color: var(--primary); }

@media (max-width: 600px) {
  .property-detail-main { padding: 1rem; }
  .property-title { font-size: 1.75rem; }
  .property-specs { flex-wrap: wrap; gap: 1rem; }
  .main-image { max-height: 250px; }
  .thumbnail-image { height: 80px; }
  .option-price-row { flex-direction: column; align-items: flex-start; }
  .option-price { margin-bottom: 1rem; }
  .invest-btn { width: 100%; }
  .metrics-grid { grid-template-columns: 1fr; gap: 1rem; }
}
</style>
