<template>
    <div>
        <HeaderView/>
        
        <div class="property-listings-page">
            <main class="main-content">
                <div class="page-header">
                    <h1>Property Listings</h1>
                    <p>Discover your perfect property from our verified listings</p>
                    
                    </div>

                <div class="content-area">
                    <aside class="filter-sidebar">
                        <form @submit.prevent="applyFilters" @reset="clearFilters" method="post">
                            <div class="formClass" id="filter">
                                <p class="filter-heading">Filters</p>
                                <button type="reset" class="clear-btn">Clear All</button>
                            </div>

                            <div class="formClass" id="type">
                                <label for="type">Property Type</label>
                                <div class="custom-select">
                                    <select name="type" id="type" v-model="filters.type">
                                        <option value="all">All Types</option>
                                        <option value="buy">Buy</option>
                                        <option value="rent">Rent</option>
                                        <option value="invest">Invest</option>
                                        <option value="stay">Stay</option>
                                    </select>
                                    <ChevronDown :size="16" class="select-icon" />
                                </div>
                            </div>

                            <div class="formClass" id="countryCode">
                                <label for="country">Select Country</label>
                                <div class="custom-select">
                                    <select name="country" id="country" v-model="filters.country">
                                        <option value="" disabled selected>Select Country</option>
                                        <option v-for="country in countries" :key="country" :value="country">
                                            {{ country }}
                                        </option>
                                    </select>
                                    <ChevronDown :size="16" class="select-icon" />
                                </div>
                            </div>

                            <div id="location" class="formClass">
                                <label for="location">Location</label>
                                <input type="text" name="location" id="location-input" v-model="filters.location" placeholder="Enter city or state">
                            </div>

                            <div id="price" class="formClass">
                                <label for="price-select">Price Range</label>
                                <div class="custom-select">
                                    <select name="price" id="price-select" v-model="filters.price">
                                        <option value="any" selected>Any</option>
                                        <option value="low">below $100,000</option>
                                        <option value="avg">$100,000 to $500,000</option>
                                        <option value="high">$500,001 to $1,000,000</option>
                                        <option value="vhigh">above $1,000,000</option>
                                    </select>
                                    <ChevronDown :size="16" class="select-icon" />
                                </div>
                            </div>

                            <div class="formClass" id="bedroom">
                                <label for="bed">Bedrooms</label>
                                <div class="custom-select">
                                    <select name="bed" id="bed" v-model="filters.bed">
                                        <option value="any" selected>Any</option>
                                        <option value="one">1</option>
                                        <option value="two">2</option>
                                        <option value="three">3</option>
                                        <option value="four">4</option>
                                        <option value="five">5 and above</option>
                                    </select>
                                    <ChevronDown :size="16" class="select-icon" />
                                </div>
                            </div>

                            <div class="formClass" id="bathroom">
                                <label for="bath">Bathrooms</label>
                                <div class="custom-select">
                                    <select name="bath" id="bath" v-model="filters.bath">
                                        <option value="any" selected>Any</option>
                                        <option value="one">1</option>
                                        <option value="two">2</option>
                                        <option value="three">3</option>
                                        <option value="four">4</option>
                                        <option value="five">5 and above</option>
                                    </select>
                                    <ChevronDown :size="16" class="select-icon" />
                                </div>
                            </div>

                            <button type="submit" class="btn-apply-filters">Search & Apply Filters</button>
                        </form>
                    </aside>

                    <section class="listings-container">
                        <div v-if="loading" class="loading-state">
                            <Loader :size="32" class="icon-loader" />
                            <p>Loading properties...</p>
                        </div>
                        <div v-else-if="error" class="error-state">
                            <AlertTriangle :size="32" />
                            <p>Error loading properties. Please try again later.</p>
                        </div>
                        <div v-else>
                            <div class="listing-header">
                                <p>Showing **{{ properties.length }}** of **{{ totalProperties }}** properties</p>
                                <div class="dropdown-sort">
                                    <label for="sort-by">Sort by:</label>
                                    <select id="sort-by" v-model="filters.sortBy">
                                        <option value="featured">Featured</option>
                                        <option value="price-asc">Price: Low to High</option>
                                        <option value="price-desc">Price: High to Low</option>
                                        <option value="newest">Newest Listings</option>
                                    </select>
                                </div>
                            </div>

                            <div class="property-grid">
                                <div 
                                    v-for="property in properties" 
                                    :key="property.id" 
                                    class="property-card" 
                                    @click.prevent="navigatePage(property)" >
                                    <div class="card-image-wrapper">
                                        <img :src="property.image" :alt="property.name" class="card-image">
                                        <span :class="['badge', property.type.toLowerCase()]">{{ property.type }}</span>
                                        <span class="badge featured" v-if="property.featured">Featured</span>
                                        <button class="btn-favorite">
                                            <Heart :size="20" class="icon-heart" />
                                        </button>
                                    </div>
                                    <div class="card-content">
                                        <h3 class="property-name">{{ property.name }}</h3>
                                        <p class="property-price">{{ property.price }}<span v-if="property.period"> /{{ property.period }}</span></p>
                                        <p class="property-location">
                                            <MapPin :size="16" class="icon-detail" />
                                            {{ property.location }}
                                        </p>
                                        <div class="property-details">
                                            <span>
                                                <Bed :size="16" class="icon-detail" />
                                                {{ property.beds }} Beds
                                            </span>
                                            <span>
                                                <Bath :size="16" class="icon-detail" />
                                                {{ property.baths }} Baths
                                            </span>
                                            <span>
                                                <Ruler :size="16" class="icon-detail" />
                                                {{ property.size }} sqft
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div v-if="!properties.length && !loading" class="no-results">
                                <PackageX :size="32" />
                                <p>No properties found matching your criteria.</p>
                            </div>

                            <div v-if="totalPages > 1 && !loading" class="pagination-controls">
                                <button 
                                    @click="changePage(currentPage - 1)" 
                                    :disabled="currentPage === 1"
                                    class="pagination-btn">
                                    <ChevronLeft :size="20" />
                                </button>
                                
                                <div class="page-numbers">
                                    <button 
                                        v-for="page in totalPages" 
                                        :key="page" 
                                        @click="changePage(page)"
                                        :class="['page-number-btn', { active: page === currentPage }]">
                                        {{ page }}
                                    </button>
                                </div>

                                <button 
                                    @click="changePage(currentPage + 1)" 
                                    :disabled="currentPage === totalPages"
                                    class="pagination-btn">
                                    <ChevronRight :size="20" />
                                </button>
                            </div>
                            </div>
                    </section>
                </div>
            </main>
        </div>
        <FooterView/>
    </div>
</template>

<script setup>

import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router';
import axios from 'axios';
import * as Ably from 'ably'; // ✅ Updated import
import { Heart, ChevronDown, Bed, Bath, Ruler, MapPin, Loader, AlertTriangle, PackageX, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import HeaderView from '../components/HeaderView.vue';
import FooterView from '../components/FooterView.vue';

// --- Reactive State ---
const loading = ref(true);
const error = ref(null);
const properties = ref([]);
const countries = ref([]);

// --- Pagination State ---
const currentPage = ref(1);
const itemsPerPage = ref(12);
const totalProperties = ref(0);
const totalPages = computed(() => Math.ceil(totalProperties.value / itemsPerPage.value));

const router = useRouter();

const filters = reactive({
    type: 'all',
    country: '',
    location: '',
    price: 'any',
    bed: 'any',
    bath: 'any',
    sortBy: 'featured',
});

// --- Ably Realtime Setup ---
const ablyRealtime = new Ably.Realtime({ key: 'RSTb1g.Dg9vCg:IYEo1Otd0e1OLvKynv_go5Ma3LvCEa2R1ln7KLwhRk8' });
const channel = ablyRealtime.channels.get('property-updates');

// Subscribe to real-time property updates
channel.subscribe('update', (msg) => {
    const updatedProperty = msg.data;
    const index = properties.value.findIndex(p => p.id === updatedProperty.id);
    if (index !== -1) {
        // Update existing property
        properties.value[index] = { ...properties.value[index], ...updatedProperty };
    } else {
        // Add new property
        properties.value.unshift(updatedProperty);
        totalProperties.value += 1; // Update total properties count
    }
});

// --- API Endpoints ---
const LISTINGS_API_URL = '/api/listings';
const COUNTRIES_API_URL = '/api/countries';

// --- Functions ---
async function fetchCountries() {
    try {
        const response = await axios.get(COUNTRIES_API_URL);
        countries.value = response.data;
    } catch (err) {
        console.error('Failed to fetch countries:', err);
        countries.value = ['Nigeria', 'USA', 'UK']; // fallback
    }
}

async function fetchProperties() {
    loading.value = true;
    error.value = null;

    const params = {
        type: filters.type,
        country: filters.country,
        location: filters.location,
        price_range: filters.price,
        bedrooms: filters.bed,
        bathrooms: filters.bath,
        sort_by: filters.sortBy,
        page: currentPage.value,
        limit: itemsPerPage.value,
    };

    try {
        const response = await axios.get(LISTINGS_API_URL, { params });
        const apiData = response.data;
        properties.value = apiData.data.map(p => ({
            id: p.id,
            name: p.title || p.name,
            type: p.property_type || 'Buy',
            featured: p.is_featured || false,
            price: p.price_formatted || `$${p.price.toLocaleString()}`,
            period: p.rent_period,
            location: p.city_state,
            beds: p.num_beds,
            baths: p.num_baths,
            size: p.area_sqft,
            image: p.main_image_url,
        }));
        totalProperties.value = apiData.total;
    } catch (err) {
        console.error('Failed to fetch properties:', err);
        error.value = 'Failed to fetch properties.';
        properties.value = [];
        totalProperties.value = 0;
    } finally {
        loading.value = false;
    }
}

function navigatePage(property) {
    let routeName;
    switch (property.type.toLowerCase()) {
        case 'stay': routeName = 'StayDetails'; break;
        case 'invest': routeName = 'InvestDetails'; break;
        case 'buy': routeName = 'BuyDetails'; break;
        case 'rent': routeName = 'RentDetails'; break;
        default: routeName = 'PropertyDetails';
    }
    router.push({ name: routeName, params: { id: property.id } });
}

function applyFilters() {
    currentPage.value = 1;
    fetchProperties();
}

function clearFilters() {
    Object.assign(filters, {
        type: 'all',
        country: '',
        location: '',
        price: 'any',
        bed: 'any',
        bath: 'any',
        sortBy: 'featured',
    });
    currentPage.value = 1;
    fetchProperties();
}

function changePage(page) {
    if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
        currentPage.value = page;
        fetchProperties();
        window.scrollTo({ top: 300, behavior: 'smooth' });
    }
}

// Lifecycle & Watchers
onMounted(() => {
    fetchCountries();
    fetchProperties();
});

watch(() => filters.sortBy, () => {
    currentPage.value = 1;
    fetchProperties();
});
</script>


<style scoped>
.property-listings-page {
    min-height: 100vh;
    background-color: var(--background);
    color: var(--foreground);
    margin-top: 10dvh;
}

/* Main Content Layout */
.main-content {
    padding: 2rem 3rem;
    max-width: 1400px;
    margin: 0 auto;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap; 
}

.page-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

.page-header p {
    color: var(--muted-foreground);
}

.content-area {
    display: flex;
    gap: 3rem;
    margin-top: 2rem;
}

/* Filter Sidebar (Desktop/Default) */
.filter-sidebar {
    width: 280px;
    flex-shrink: 0;
    padding: 1.5rem;
    background-color: var(--card);
    border-radius: var(--radius-md);
    box-shadow: var(--card-shadow);
    height: fit-content;
}

.filter-sidebar form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.formClass#filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.filter-heading {
    font-size: 1.25rem;
    font-weight: 600;
}

.clear-btn {
    background: none;
    border: none;
    color: var(--primary);
    cursor: pointer;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
}

.clear-btn:hover {
    background-color: var(--muted);
}

.formClass label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--foreground);
    font-size: 0.9rem;
}

/* Custom Select and Input Styling */
.custom-select {
    position: relative;
}

.custom-select select,
.formClass input[type="text"] {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background-color: var(--input);
    color: var(--foreground);
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
}

.custom-select .select-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--muted-foreground);
}

/* Apply Filters Button */
.btn-apply-filters {
    background-color: var(--primary);
    color: var(--primary-foreground);
    border: none;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s ease;
    width: 100%;
}

.btn-apply-filters:hover {
    background-color: var(--hover);
}

/* Listings Container */
.listings-container {
    flex-grow: 1;
}

.listing-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.listing-header p {
    font-weight: 500;
}

.dropdown-sort select {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background-color: var(--card);
    color: var(--foreground);
    cursor: pointer;
    margin-left: 0.5rem;
}

/* Property Grid */
.property-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
}

.property-card {
    background-color: var(--card);
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--card-shadow);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
}

.property-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--card-shadow-lg);
}

.card-image-wrapper {
    position: relative;
}

.card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.badge {
    position: absolute;
    top: 1rem;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: var(--radius-sm);
}

.badge.buy {
    left: 1rem;
    background-color: var(--primary);
    color: var(--primary-foreground);
}

.badge.rent {
    left: 1rem;
    background-color: #4CAF50;
    color: white;
}

.badge.invest {
    left: 1rem;
    background-color: #FF9800; /* Orange color */
    color: white;
}

.badge.stay {
    left: 1rem;
    background-color: #2196F3; /* Blue color */
    color: white;
}

.badge.featured {
    left: auto;
    right: 1rem;
    background-color: var(--accent);
    color: var(--accent-foreground);
}

.btn-favorite {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.7);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background 0.2s ease;
    z-index: 5;
}

/* Adjust badge position if both badges are present */
.property-card:has(.badge:not(.featured) + .badge.featured) .badge.featured {
    right: 6rem;
}

.icon-heart {
    color: var(--foreground);
}

.card-content {
    padding: 1rem;
}

.property-name {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.property-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 0.5rem;
}

.property-price span {
    font-size: 1rem;
    font-weight: 400;
    color: var(--muted-foreground);
}

.property-location {
    display: flex;
    align-items: center;
    color: var(--muted-foreground);
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.property-details {
    display: flex;
    gap: 1.5rem;
    color: var(--muted-foreground);
    font-size: 0.9rem;
}

.property-details span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.icon-detail {
    color: var(--primary);
}

/* --- Pagination Controls --- */
.pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 3rem;
    padding-bottom: 2rem;
}

.pagination-btn {
    background-color: var(--card);
    border: 1px solid var(--border);
    color: var(--foreground);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
    background-color: var(--muted);
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-numbers {
    display: flex;
    gap: 5px;
}

.page-number-btn {
    background-color: var(--card);
    border: 1px solid var(--border);
    color: var(--foreground);
    width: 40px;
    height: 40px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s, color 0.2s;
}

.page-number-btn.active {
    background-color: var(--primary);
    color: var(--primary-foreground);
    border-color: var(--primary);
}

.page-number-btn:hover:not(.active) {
    background-color: var(--muted);
}


/* --- Mobile Responsiveness --- */
@media (max-width: 1024px) {
    .main-content {
        padding: 1.5rem;
    }
    
    .page-header {
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 1rem;
    }

    .page-header h1, .page-header p {
        width: 100%;
        margin-bottom: 0.25rem;
    }
    
    .btn-filter-toggle {
        display: none; 
    }

    .content-area {
        flex-direction: column;
        gap: 1.5rem;
    }

    .filter-sidebar {
        width: 100%; 
        order: -1; 
        border-right: none;
        padding: 1rem;
    }

    .property-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }

    .listing-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .dropdown-sort {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .dropdown-sort select {
        flex-grow: 1;
    }
}

/* Loading/Error/No Results States */
.loading-state, .error-state, .no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
    color: var(--muted-foreground);
}

.icon-loader {
    animation: spin 1s linear infinite;
    color: var(--primary);
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.error-state p {
    color: var(--destructive);
    font-weight: 500;
}

.error-state svg, .no-results svg {
    color: var(--accent);
    margin-bottom: 1rem;
}

.no-results p {
    margin-top: 1rem;
}

.btn-apply-filters {
    margin-top: 1rem;
}
</style>