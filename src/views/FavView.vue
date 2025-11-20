<template>
    <HeaderView/>
    <div class="favorites-page">
        <div class="content-container">
            <h1>
                <Heart :fill="'var(--accent)'" :stroke="'var(--accent)'" :size="28" />
                My Favorites
            </h1>
            <p class="saved-count">{{ properties.length }} saved properties</p>

            <div class="view-toggle">
                <button 
                    :class="{ active: viewMode === 'grid' }" 
                    @click="viewMode = 'grid'"
                    :style="{ borderRadius: `var(--radius-sm) 0 0 var(--radius-sm)` }"
                >
                    Grid View
                </button>
                <button 
                    :class="{ active: viewMode === 'list' }" 
                    @click="viewMode = 'list'"
                    :style="{ borderRadius: `0 var(--radius-sm) var(--radius-sm) 0` }"
                >
                    List View
                </button>
            </div>

            <div v-if="loading" class="loading-state">Loading properties...</div>
            <div v-else-if="error" class="error-state">Error loading data: {{ error.message }}</div>
            
            <div v-else :class="['property-list', viewMode === 'list' ? 'list-view' : 'grid-view']">
                
                <div 
                    v-for="property in properties"
                    :key="property.id"
                    :class="['property-card', {'list-view-card': viewMode === 'list'}]"
                >
                    <div class="image-container">
                        <img :src="property.image" :alt="property.title" class="property-image" />
                        <div class="badge accent" v-if="!property.isRent">Buy</div>
                        <div class="badge primary" v-if="property.isRent">Rent</div>
                        
                        <Heart
                            :fill="property.isFavorite ? 'var(--accent)' : 'transparent'"
                            :stroke="property.isFavorite ? 'var(--accent)' : 'var(--card)'"
                            :size="20"
                            class="favorite-icon"
                            @click="toggleFavorite(property.id)"
                        />
                    </div>

                    <div class="details">
                        <h3>{{ property.title }}</h3>
                        <p class="location">{{ property.location }}</p>
                        <p class="price">{{ formatCurrency(property) }}</p>
                        
                        <div class="stats">
                            <div class="stat">
                                <Bed :size="16" />
                                <span>{{ property.beds }} Beds</span>
                            </div>
                            <div class="stat">
                                <Bathtub :size="16" />
                                <span>{{ property.baths }} Baths</span>
                            </div>
                            <div class="stat">
                                <span>{{ property.sqft }} sqft</span>
                            </div>
                        </div>
                        
                        <button class="btn btn-destructive" @click="removeFavorite(property.id)">
                            Remove
                        </button>
                    </div>
                </div>
                </div>
        </div>
    </div>
    <FooterView/>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import HeaderView from '../components/HeaderView.vue';
import FooterView from '../components/FooterView.vue';
import { Heart, Bed, Bathtub } from 'lucide-vue-next'; // Now importing card icons here

// --- Reactive State ---
const properties = ref([]);
const loading = ref(true);
const error = ref(null);
const viewMode = ref('grid');

// --- API Endpoint ---
const API_URL = '/api/favorites'; 

// --- Utility Functions (previously in PropertyCard) ---
const formatCurrency = (property) => {
    const value = property.price;
    const options = {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    };
    let formatted = new Intl.NumberFormat('en-US', options).format(value);
    
    if (property.isRent) {
        formatted += '/mo';
    }
    return formatted;
};

const toggleFavorite = (id) => {
    // This is typically a PUT/POST request to change the favorite status
    console.log(`Toggling favorite status for property ID: ${id}`);
    
    // In this specific Favorites page, clicking the heart often just un-favorites it,
    // which would trigger the removeFavorite logic or a separate state change.
    // For now, we'll log it, assuming 'removeFavorite' handles the actual deletion from the list.
};


// --- Data Fetching Function (Connected to Backend) ---
const fetchProperties = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await axios.get(API_URL);
        
        properties.value = response.data.map(p => ({
            ...p,
            isRent: p.type === 'rent', 
            isFavorite: true // Assumed true as they are in the favorites list
        }));

    } catch (err) {
        error.value = err;
        console.error('Error fetching favorites:', err);
    } finally {
        loading.value = false;
    }
};

// --- Remove Favorite Function (Connected to Backend) ---
const removeFavorite = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        
        // Optimistically remove from the local list after successful API call
        properties.value = properties.value.filter(p => p.id !== id);
        
    } catch (err) {
        console.error(`Error removing favorite ${id}:`, err);
        alert(`Failed to remove property. Please try again.`);
    }
};

// --- Lifecycle Hook ---
onMounted(fetchProperties);
</script>

<style scoped>
/* ========================================================= */
/* --- FAVORITES PAGE LAYOUT STYLES --- */
/* ========================================================= */
.favorites-page {
    background-color: var(--background);
    min-height: 100vh;
    padding-top: 40px;
    color: var(--foreground);
    margin-top: 10dvh;
}

.content-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

h1 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 5px;
}

.saved-count {
    font-size: 0.95rem;
    color: var(--muted-foreground);
    margin-bottom: 25px;
}

.view-toggle {
    display: inline-flex;
    margin-bottom: 30px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    overflow: hidden;
}

.view-toggle button {
    background-color: var(--card);
    border: none;
    color: var(--muted-foreground);
    padding: 8px 15px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
}

.view-toggle button.active {
    background-color: var(--primary);
    color: var(--primary-foreground);
    box-shadow: none;
}
.view-toggle button:not(.active):hover {
    background-color: var(--secondary);
}

.loading-state, .error-state {
    text-align: center;
    padding: 50px;
    font-size: 1.1rem;
    color: var(--muted-foreground);
}

/* --- Property List Layout (Responsive) --- */
.property-list {
    display: grid;
    gap: 30px;
}

/* Mobile Default: Single Column */
.property-list.grid-view {
    grid-template-columns: 1fr;
}
.property-list.list-view {
    grid-template-columns: 1fr; /* Always one column for list view */
}

/* Tablet/Desktop: 2-column grid for grid view */
@media (min-width: 768px) {
    .property-list.grid-view {
        grid-template-columns: repeat(2, 1fr);
    }
}


/* ========================================================= */
/* --- INLINED PROPERTY CARD STYLES --- */
/* ========================================================= */

/* Button Utilities */
.btn {
    padding: 8px 15px;
    border-radius: var(--radius-sm);
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, opacity 0.2s;
    font-size: 0.9rem;
}
.btn-destructive {
    background-color: var(--destructive);
    color: var(--destructive-foreground);
    border: 1px solid var(--destructive);
}
.btn-destructive:hover {
    opacity: 0.9;
}


/* Base Card Styling */
.property-card {
  background-color: var(--card);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s;
}
.property-card:hover {
    box-shadow: var(--card-shadow-lg);
}

/* Image Section */
.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  max-height: 250px;
}
.property-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
}
.badge.accent { background-color: var(--accent); color: var(--accent-foreground); }
.badge.primary { background-color: var(--primary); color: var(--primary-foreground); }

.favorite-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  background-color: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  padding: 6px;
  z-index: 10;
  transition: transform 0.2s;
}
.favorite-icon:hover { transform: scale(1.1); }

/* Details Section */
.details {
  padding: 15px;
}
.property-card h3 { /* Specificity for the card's h3 */
  margin-top: 0;
  font-size: 1.1rem;
  color: var(--card-foreground);
}
.location {
  font-size: 0.85rem;
  color: var(--muted-foreground);
  margin-bottom: 8px;
}
.price {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 12px;
}
.stats {
  display: flex;
  gap: 20px;
  font-size: 0.8rem;
  color: var(--muted-foreground);
  margin-bottom: 15px;
  border-top: 1px solid var(--border);
  padding-top: 15px;
}
.stat {
  display: flex;
  align-items: center;
  gap: 4px;
}
.details .btn {
    width: 100%;
}

/* --- Responsiveness: List View Styles (Applied via .list-view-card class) --- */
@media (min-width: 768px) {
  .list-view-card {
    flex-direction: row; 
  }
  .list-view-card .image-container {
    width: 250px;
    flex-shrink: 0;
    aspect-ratio: auto;
    max-height: 100%;
  }
  .list-view-card .details {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
  }
  .list-view-card .details .btn {
    width: auto;
    align-self: flex-start;
  }
}
</style>