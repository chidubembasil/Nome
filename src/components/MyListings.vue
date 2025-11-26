<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import axios from 'axios';
import * as Ably from 'ably';
import { LayoutGrid, MapPin, Bed, Bath, Clock, CheckCircle, XCircle, Loader2, DollarSign, Trash2 } from 'lucide-vue-next';

// --- State ---
const listings = ref([]);
const activeTab = ref('Active');
const isLoading = ref(true);
const error = ref(null);
const ablyStatus = ref('');

// Tabs
const tabs = ['Active', 'Pending', 'Sold/Rented'];

// --- Ably setup ---
let ablyRealtime = null;
let channel = null;

const setupAbly = () => {
    ablyRealtime = new Ably.Realtime({
        key: 'YOUR_REALTIME_KEY_HERE',
        logLevel: 4, // for debugging
    });

    channel = ablyRealtime.channels.get('listings-updates');

    channel.subscribe('listing-updated', (msg) => {
        // msg.data should contain updated listing info
        const updated = msg.data;
        const index = listings.value.findIndex(l => l.id === updated.id);
        if (index >= 0) {
            listings.value[index] = updated;
        } else {
            listings.value.push(updated);
        }
        ablyStatus.value = `Received update for listing ID ${updated.id}`;
    });

    channel.subscribe('listing-deleted', (msg) => {
        const id = msg.data.id;
        listings.value = listings.value.filter(l => l.id !== id);
        ablyStatus.value = `Listing ID ${id} deleted`;
    });
};

// --- Cleanup on unmount ---
onUnmounted(() => {
    if (channel) {
        try { 
            channel.unsubscribe(); 
        } catch (e) { 
            console.warn('Error unsubscribing channel:', e); 
        }
    }
    if (ablyRealtime) {
        try { 
            ablyRealtime.close(); 
        } catch (e) { 
            console.warn('Error closing Ably connection:', e); 
        }
    }
});

// --- API Call: Fetch User Listings ---
const fetchMyListings = async () => {
    const API_URL = '/api/user/listings';
    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
    };

    isLoading.value = true;
    error.value = null;

    try {
        const response = await axios.get(API_URL, config);
        listings.value = response.data;
        isLoading.value = false;
    } catch (err) {
        error.value = 'Failed to load your listings. Please check your network or ensure you are logged in.';
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchMyListings();
    setupAbly();
});

// --- Computed Property for Filtering ---
const filteredListings = computed(() => {
    return listings.value.filter(listing => listing.status === activeTab.value);
});

// --- Helper Functions ---
const formatPrice = (property) => {
    const price = property.price;
    const isRent = property.isRent || property.type.toLowerCase() === 'rent';
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
    return isRent ? `${formatted}/mo` : formatted;
};

const getStatusIcon = (status) => {
    switch(status) {
        case 'Active': return CheckCircle;
        case 'Pending': return Clock;
        case 'Sold/Rented': return XCircle;
        default: return LayoutGrid;
    }
};

const getStatusClass = (status) => {
    switch(status) {
        case 'Active': return 'status-active';
        case 'Pending': return 'status-pending';
        case 'Sold/Rented': return 'status-sold';
        default: return '';
    }
};

// --- Actions ---
const removeListing = async (id) => {
    if (confirm('Are you sure you want to remove this listing?')) {
        try {
            await axios.delete(`/api/listings/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });
            listings.value = listings.value.filter(l => l.id !== id);
        } catch(err) {
            console.error('Failed to delete listing:', err);
        }
    }
};

const editListing = (id) => {
    console.log(`Navigating to edit page for listing ID: ${id}`);
};
</script>


<template>
    <div class="my-listings-component">
        <header class="listings-header">
            <h2>Your Property Listings</h2>
            <router-link to="/create" class="add-listing-btn" @click="editListing(null)">+ List New Property</router-link> 
        </header>
        
        <nav class="tabs-nav">
            <button
                v-for="tab in tabs"
                :key="tab"
                :class="['tab-button', { 'active': activeTab === tab }]"
                @click="activeTab = tab"
            >
                {{ tab }} ({{ listings.filter(l => l.status === tab).length }})
            </button>
        </nav>

        <div class="listings-content">
            <div v-if="isLoading" class="loading-state">
                <Loader2 class="animate-spin" size="48" />
                <p>Loading your properties...</p>
            </div>

            <div v-else-if="error" class="error-state">
                <p>Error: {{ error }}</p>
            </div>

            <div v-else-if="filteredListings.length === 0" class="empty-state">
                <p>You have no **{{ activeTab.toLowerCase() }}** listings.</p>
                <button class="add-listing-btn" @click="editListing(null)">List Your First Property</button>
            </div>

            <div v-else class="listings-grid">
                <div v-for="property in filteredListings" :key="property.id" class="listing-card">
                    <div class="card-image-container">
                        <img :src="property.image" :alt="property.title" class="listing-image"/>
                        <span :class="['property-type-badge', property.type.toLowerCase()]">{{ property.type }}</span>
                        <div :class="['status-badge', getStatusClass(property.status)]">
                            <component :is="getStatusIcon(property.status)" size="14" />
                            {{ property.status }}
                        </div>
                    </div>
                    
                    <div class="card-info">
                        <h3 class="card-title">{{ property.title }}</h3>
                        <p class="card-location"><MapPin size="14" /> {{ property.location }}</p>
                        
                        <div class="card-price">
                            <DollarSign size="16" /> {{ formatPrice(property) }}
                        </div>
                        
                        <div class="card-specs">
                            <span><Bed size="14" /> {{ property.beds }} Beds</span>
                            <span><Bath size="14" /> {{ property.baths }} Baths</span>
                        </div>
                        
                        <div class="card-actions">
                            <button class="action-btn edit-btn" @click="editListing(property.id)">Edit</button>
                            <button class="action-btn remove-btn" @click="removeListing(property.id)">
                                <Trash2 size="16"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    /*
        The styles remain the same as the previous response to ensure visual consistency
        and are omitted here for brevity. They are already included in the previous reply.
    */
    
    .my-listings-component {
        padding: 20px;
        max-width: 1000px;
        margin: 0 auto;
    }
    .listings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
    }
    .listings-header h2 {
        font-size: 1.8rem;
        color: var(--foreground);
    }
    .add-listing-btn {
        background-color: var(--primary);
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s;
    }
    .add-listing-btn:hover {
        background-color: var(--hover);
    }
    .tabs-nav {
        display: flex;
        gap: 0;
        margin-bottom: 30px;
        border-bottom: 2px solid var(--border);
    }
    .tab-button {
        background: none;
        border: none;
        padding: 10px 20px;
        font-size: 1rem;
        font-weight: 500;
        color: var(--text-muted);
        cursor: pointer;
        transition: color 0.2s;
        border-bottom: 2px solid transparent;
        margin-bottom: -2px;
    }
    .tab-button.active {
        color: var(--primary);
        border-bottom-color: var(--primary);
        font-weight: bold;
    }
    .listings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
    }
    .listing-card {
        background: var(--background-soft);
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s;
    }
    .listing-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    }
    .card-image-container {
        position: relative;
        height: 200px;
    }
    .listing-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .property-type-badge {
        position: absolute;
        top: 15px;
        left: 15px;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 0.8rem;
        font-weight: bold;
        color: white;
    }
    .property-type-badge.buy, .property-type-badge.invest { background-color: var(--primary); }
    .property-type-badge.rent { background-color: #f7a048; }
    .status-badge {
        position: absolute;
        top: 15px;
        right: 15px;
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 0.8rem;
        font-weight: bold;
        color: white;
    }
    .status-active { background-color: #28a745; }
    .status-pending { background-color: #ffc107; color: #333; }
    .status-sold { background-color: #dc3545; }
    .card-info {
        padding: 15px;
    }
    .card-title {
        font-size: 1.2rem;
        margin-bottom: 5px;
        color: var(--foreground);
    }
    .card-location {
        display: flex;
        align-items: center;
        gap: 5px;
        color: var(--text-muted);
        font-size: 0.9rem;
        margin-bottom: 15px;
    }
    .card-price {
        font-size: 1.4rem;
        font-weight: bold;
        color: var(--primary);
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 10px;
    }
    .card-specs {
        display: flex;
        gap: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid var(--border);
    }
    .card-specs span {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: var(--text-muted);
    }
    .card-actions {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }
    .action-btn {
        padding: 8px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        transition: background-color 0.2s;
    }
    .edit-btn {
        flex-grow: 1;
        background-color: transparent;
        border: 1px solid var(--primary);
        color: var(--primary);
    }
    .edit-btn:hover {
        background-color: var(--hover);
    }
    .remove-btn {
        flex-shrink: 0;
        width: 40px;
        background-color: #dc3545;
        color: white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .remove-btn:hover {
        background-color: #c82333;
    }
    .loading-state, .empty-state, .error-state {
        text-align: center;
        padding: 50px;
        color: var(--text-muted);
        background: var(--background-soft);
        border-radius: 10px;
    }
    @media (max-width: 600px) {
        .listings-grid {
            grid-template-columns: 1fr;
        }
        .tabs-nav {
            overflow-x: auto;
            justify-content: flex-start;
        }
        .tab-button {
            flex-shrink: 0;
        }
    }

</style>