<template>
    <HeaderView />
    <div class="feed-container">
        <h1 class="page-title">Your Feed</h1>

        <div v-if="loading" class="empty-state">
            <p>Loading the latest real estate news...</p>
            <svg class="spinner" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
        </div>

        <div v-else-if="error" class="error-state">
            <p class="error-message">Error loading feed content: {{ error }}</p>
            <p class="subtitle">Check your API key and network connection.</p>
        </div>

        <div v-else-if="!feedItems.length" class="empty-state">
            <p>Nothing new right now!</p>
            <p class="subtitle">No results for 'real estate' from the API.</p>
        </div>
        
        <div v-else class="feed-list">
            <div 
                v-for="item in feedItems" 
                :key="item.id" 
                :class="['feed-item', { 'is-expanded': item.id === expandedItemId }]" 
                @click="toggleExpand(item.id)"
            >
                <div class="image-wrapper">
                    <img :src="item.imageUrl || 'https://via.placeholder.com/280x180?text=No+Image'" :alt="item.title" class="feed-image" />
                </div>
                <div class="content-body">
                    <div class="meta-info">
                        <span class="category">{{ item.category || 'NEWS' }}</span>
                        <span class="time-ago">{{ item.timeAgo }}</span>
                    </div>
                    <h2 class="item-title">{{ item.title }}</h2>
                    
                    <p v-if="item.id !== expandedItemId" class="item-summary">{{ item.summary }}</p>

                    <div v-else class="full-details-content">
                        <p>{{ item.fullDetails || item.summary }}</p>
                        <a :href="item.sourceUrl" target="_blank" rel="noopener noreferrer" class="source-link">Read full story at source &rarr;</a>
                    </div>
                </div>
                
                <div class="toggle-icon-wrapper">
                    <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline v-if="item.id !== expandedItemId" points="6 9 12 15 18 9"></polyline>
                        <polyline v-else points="18 15 12 9 6 15"></polyline>
                    </svg>
                </div>
            </div>
        </div>
    </div>
    <FooterView />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import HeaderView from '../components/HeaderView.vue';
import FooterView from '../components/FooterView.vue';

// --- Configuration ---
// !!! SECURITY WARNING: NEVER HARDCODE API KEYS IN FRONTEND CODE FOR PRODUCTION !!!
const API_KEY = 'pub_d2764b2d45b840b7b042cad48f3f1bc6'; 
const FEED_API_URL = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&q=real%20estate&language=en`; 
// NewsData.io does not offer a separate article detail endpoint on the free tier.
// We will rely on the content provided in the initial fetch.
// The FEED_DETAIL_API_URL is removed as it's not applicable here.

// --- State ---
const feedItems = ref([]);
const loading = ref(true);
const error = ref(null);
const expandedItemId = ref(null); // Tracks the ID of the currently expanded item

// --- Methods ---

/**
 * Maps the raw NewsData.io article object to our application's expected format.
 */
const mapNewsItem = (item) => {
    // NewsData.io uses 'article_id' for ID, 'image_url' for image, 'description' for summary, 'pubDate' for time, and 'link' for source URL.
    return {
        id: item.article_id,
        title: item.title || 'Untitled Article',
        summary: item.description || 'No summary available.',
        // We use the full content field as the 'fullDetails' for expansion
        fullDetails: item.content || item.description || 'Full content could not be loaded. Please click the link below to view the original source.',
        imageUrl: item.image_url,
        category: item.category ? item.category.join(', ').toUpperCase() : 'General',
        timeAgo: new Date(item.pubDate).toLocaleDateString(), // Simple date formatting
        sourceUrl: item.link,
    };
};

/**
 * Fetches the feed content from the backend using Axios.
 */
const fetchFeed = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await axios.get(FEED_API_URL);
        
        // NewsData.io returns an object with a 'results' array
        if (response.data.results && response.data.results.length > 0) {
            feedItems.value = response.data.results.map(mapNewsItem);
        } else {
            feedItems.value = [];
        }

    } catch (e) {
        // If the API key is expired or limits are hit, NewsData.io often returns an error object/status
        error.value = e.response ? `API Error: ${e.response.status} - ${e.response.data.results || 'Check API key or limits.'}` : 'Network error.';
        console.error('NewsData.io API Error:', e);
    } finally {
        loading.value = false;
    }
};

/**
 * Toggles the expansion state of a card.
 * No secondary fetch needed, as we already have the 'content' field mapped to 'fullDetails'.
 */
const toggleExpand = (id) => {
    // If the clicked card is already expanded, collapse it.
    if (expandedItemId.value === id) {
        expandedItemId.value = null;
        return;
    }
    
    // Expand the clicked card
    expandedItemId.value = id;
};

onMounted(fetchFeed);
</script>


<style scoped>
/* Scoped styles using the provided color palette */

.feed-container {
    max-width: 850px;
    margin: 0 auto;
    padding: 40px 20px;
    min-height: 80dvh;
    margin-top: 10dvh;
}

.page-title {
    font-size: 2.5em;
    font-weight: 800;
    margin-bottom: 30px;
    color: var(--card-foreground);
}

/* Feed List and Items */
.feed-list {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.feed-item {
    display: flex;
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
    cursor: pointer;
    transition: box-shadow 0.3s, transform 0.2s;
    box-shadow: var(--card-shadow);
}

.feed-item:hover {
    box-shadow: var(--card-shadow-lg);
    transform: translateY(-2px);
}

.image-wrapper {
    flex-shrink: 0;
    width: 280px; /* Fixed width for image */
    height: 180px;
}

.feed-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.content-body {
    padding: 20px;
    flex-grow: 1;
}

.meta-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-size: 0.9em;
}

.category {
    font-weight: 600;
    color: var(--primary);
}

.time-ago {
    color: var(--muted-foreground);
}

.item-title {
    font-size: 1.4em;
    font-weight: 700;
    color: var(--card-foreground);
    margin-bottom: 8px;
    line-height: 1.3;
}

.item-summary {
    color: var(--muted-foreground);
    font-size: 1em;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Empty/Loading State */
.empty-state {
    text-align: center;
    padding: 60px 20px;
    border: 1px dashed var(--border);
    border-radius: var(--radius-md);
    margin-top: 30px;
}
.empty-state p {
    color: var(--muted-foreground);
    font-size: 1.2em;
}
.empty-state .subtitle {
    margin-top: 5px;
    font-size: 1em;
}

/* Loading Spinner */
.spinner {
    animation: rotate 1s linear infinite;
    width: 20px;
    height: 20px;
    margin-top: 15px;
    flex-shrink: 0;
}
.spinner circle {
    stroke: var(--primary);
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
    fill: none;
}.feed-item {
    /* ... (Existing styles) ... */
    position: relative; /* Needed for positioning the toggle icon */
    padding-right: 50px; /* Space for the toggle icon */
    align-items: flex-start; /* Align content to the top */
}

/* Expansion Content Styles */
.item-summary {
    /* Existing style for brief view: */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: all 0.3s;
}

.full-details-content p {
    color: var(--card-foreground);
    line-height: 1.6;
    margin-bottom: 15px;
    white-space: pre-wrap; /* Respect line breaks from backend if formatted */
}

.source-link {
    display: inline-block;
    color: var(--primary);
    font-weight: 600;
    text-decoration: none;
    margin-top: 10px;
    transition: color 0.2s;
}

.source-link:hover {
    color: var(--hover);
}

/* Toggle Icon */
.toggle-icon-wrapper {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted-foreground);
    transition: transform 0.3s, color 0.2s;
}

.toggle-icon {
    width: 100%;
    height: 100%;
}

/* Expanded State Overrides */
.feed-item.is-expanded {
    flex-direction: column; /* Stacks image and content vertically */
    height: auto; /* Allows the card to grow based on content */
    align-items: stretch;
    transition: all 0.5s ease-in-out;
}

.feed-item.is-expanded .image-wrapper {
    width: 100%;
    height: 300px; /* Larger image height for expanded view */
}

.feed-item.is-expanded .content-body {
    padding-right: 20px; /* Reset padding for the icon space */
}

/* Mobile Responsiveness (adjust for expanded state) */
@media (max-width: 768px) {
    .image-wrapper {
        width: 100%;
        height: 200px;
    }
    .feed-item {
        /* Always stack vertically on small screens */
        flex-direction: column;
    }
    .feed-item.is-expanded .image-wrapper {
        height: 250px;
    }
}
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash {
    0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
    50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
    100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
    .image-wrapper {
        width: 100%;
        height: 200px;
    }
    .feed-item {
        flex-direction: column;
    }
}
</style>