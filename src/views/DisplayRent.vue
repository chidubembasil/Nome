<template>
    <HeaderView/>
  <main class="property-detail-main">
    <div v-if="loading" class="loading-state">Loading Rental Data...</div>
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
          <span class="tag primary-tag">{{ propertyData?.status?.rent }}</span>
          <span class="tag secondary-tag">{{ propertyData?.status?.available }}</span>
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
        <h2 class="section-title">Property Features</h2>
        <div class="features-grid">
          <div class="feature-item" v-for="(feature, index) in propertyData?.features" :key="index">
            <LucideIcon name="CheckCircle" class="feature-icon primary-text"/>
            <div class="feature-details">
              <span class="feature-name">{{ feature.name }}</span>
              <span class="feature-subtext">{{ feature.subtext }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section-container lease-terms-section">
        <h2 class="section-title">Lease Terms</h2>
        <div class="lease-terms-grid">
          <div class="term-pair" v-for="(term, key) in propertyData?.leaseTerms" :key="key">
            <span class="term-label">{{ term.label }}</span>
            <span class="term-value" :class="{ 'accent-text': term.isAccent }">{{ term.value }}</span>
          </div>
        </div>
      </section>

      <div class="cta-bar">
        <div class="price-info">
          <span class="price-value">{{ propertyData?.price?.value }}</span>
          <span class="price-unit">{{ propertyData?.price?.unit }}</span>
          <span class="price-note">{{ propertyData?.price?.note }}</span>
        </div>
        <div class="action-buttons">
          <button class="btn btn-secondary schedule-btn">
            <LucideIcon name="Calendar" class="btn-icon"/> Schedule Tour
          </button>
          <button class="btn btn-primary apply-btn">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  </main>
  <FooterView/>
</template>

<script setup>
import { defineComponent, createVNode, ref, onMounted, onUnmounted } from 'vue';
import * as LucideIcons from 'lucide-vue-next';
import axios from 'axios';
import * as Ably from 'ably'; // ✅ Updated Ably import
import HeaderView from '@/components/HeaderView.vue';
import FooterView from '../components/FooterView.vue'

// ICON HANDLER
const LucideIcon = defineComponent({
  props: { name: { type: String, required: true } },
  render() { 
    const icon = LucideIcons[this.name]; 
    return icon ? createVNode(icon) : null;
  }
});

// FETCH + REALTIME
function usePropertyData(endpoint) {
  const defaultData = {
    images: [], status: {}, specs: {}, description: {}, features: [], leaseTerms: {}, price: {}
  };

  const propertyData = ref(defaultData);
  const loading = ref(true);
  const error = ref(null);

  let ablyRealtime = null;
  let channel = null;

  onMounted(async () => {
    try {
      // FETCH INITIAL DATA
      const response = await axios.get(`http://localhost:3000${endpoint}`);
      propertyData.value = response.data;
      loading.value = false;

      // -----------------------------
      // ⚡ ABLY REALTIME STARTS HERE
      // -----------------------------
      ablyRealtime = new Ably.Realtime({
        key: 'RSTb1g.Dg9vCg:IYEo1Otd0e1OLvKynv_go5Ma3LvCEa2R1ln7KLwhRk8'
      });
   

      channel = ablyRealtime.channels.get("property-updates");

      // Subscribing to messages
      channel.subscribe("update", (msg) => {
        console.log("Received update:", msg.data);
        propertyData.value = {
          ...propertyData.value,
          ...msg.data
        };
      });

      console.log("Ably connected and listening...");
      // -----------------------------
      // ⚡ ABLY REALTIME ENDS HERE
      // -----------------------------

    } catch (err) {
      error.value = 'Failed to fetch property data. Check endpoint and server status.';
      console.error('API Error:', err);
      loading.value = false;
    }
  });

  // CLEANUP
  onUnmounted(() => {
    if (channel) channel.unsubscribe();
    if (ablyRealtime) ablyRealtime.close();
  });

  return { propertyData, loading, error };
}

// USE HOOK
const { propertyData, loading, error } = usePropertyData('/api/property/rental');
</script>


<style scoped>
.property-detail-main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: var(--background);
  margin-top: 10dvh;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: var(--muted-foreground);
}

.section-container {
  padding: 1.5rem;
  background-color: var(--card);
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  border: 1px solid var(--border);
}

.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--primary);
}

.section-content {
  line-height: 1.6;
  color: var(--card-foreground);
}

/* Buttons */
.btn {
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background-color: var(--primary);
  color: var(--foreground);
}

.btn-primary:hover {
  background-color: #2563eb; /* Darker primary */
}

.btn-secondary {
  background-color: transparent;
  color: var(--primary);
  border-color: var(--primary);
}

.btn-secondary:hover {
  background-color: rgba(59, 130, 246, 0.1); /* Primary with low opacity */
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* ==================================== */
/* 2. HEADER AND INFO CARD (COMMON)     */
/* ==================================== */

.property-image-gallery {
  margin-bottom: 1.5rem;
}

.main-image-container {
  overflow: hidden;
  border-radius: var(--radius-md);
  margin-bottom: 0.5rem;
}

.main-image {
  width: 100%;
  height: auto;
  max-height: 450px;
  object-fit: cover;
  display: block;
}

.thumbnail-images {
  display: flex;
  gap: 0.5rem;
  overflow: hidden;
}

.thumbnail-image {
  width: 50%;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: opacity 0.2s;
}

.thumbnail-image:hover {
  opacity: 0.8;
}

.property-info-card {
  padding: 1.5rem;
  background-color: var(--card);
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  border: 1px solid var(--border);
}

.status-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  font-weight: 700;
}

.primary-tag {
  background-color: var(--primary);
  color: var(--foreground);
}

.secondary-tag {
  background-color: var(--secondary);
  color: var(--card-foreground);
}

.property-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.property-location {
  font-size: 1rem;
  color: var(--muted-foreground);
  margin-bottom: 1.5rem;
}

.property-specs {
  display: flex;
  gap: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
  color: var(--card-foreground);
}

.spec-icon {
  width: 20px;
  height: 20px;
  color: var(--primary);
}

/* ==================================== */
/* 3. RENTAL-SPECIFIC STYLES (Provided) */
/* ==================================== */

/* Features Grid */
.features-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
@media (min-width: 600px) { .features-grid { grid-template-columns: 1fr 1fr; } }

.feature-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0; }
.feature-icon { width: 20px; height: 20px; }
.primary-text { color: var(--primary); }
.feature-details { display: flex; flex-direction: column; }
.feature-name { font-weight: 600; color: var(--card-foreground); }
.feature-subtext { font-size: 0.85rem; color: var(--muted-foreground); }

/* Lease Terms Grid */
.lease-terms-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem 1rem; }
@media (min-width: 600px) { .lease-terms-grid { grid-template-columns: 1fr 1fr; } }

.term-pair { display: flex; flex-direction: column; }
.term-label { font-size: 0.9rem; color: var(--muted-foreground); margin-bottom: 0.25rem; }
.term-value { font-weight: 600; color: var(--card-foreground); }
.accent-text { color: var(--accent); }

/* CTA Bar */
.cta-bar {
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: var(--card); 
  border-top: 1px solid var(--border);
  gap: 1rem;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  z-index: 10; /* Ensure it floats above other content */
}

.price-info { display: flex; flex-direction: column; line-height: 1.2; }
.price-value { font-size: 1.75rem; font-weight: 700; color: var(--primary); }
.price-unit { font-weight: 500; font-size: 1.1rem; color: var(--card-foreground); }
.price-note { font-size: 0.75rem; color: var(--muted-foreground); }

.action-buttons { display: flex; gap: 0.75rem; }
.schedule-btn { width: auto; min-width: 150px; }
.apply-btn { width: auto; min-width: 120px; }

@media (max-width: 600px) {
  .cta-bar { flex-direction: column; align-items: flex-start; }
  .price-info { margin-bottom: 1rem; }
  .action-buttons { width: 100%; gap: 0.5rem; }
  .btn { flex: 1; }
}
</style>