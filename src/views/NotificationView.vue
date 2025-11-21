<template>
    <HeaderView />
    <div class="notifications-container">
        <div class="header-section">
            <h1 class="page-title">Notifications</h1>
            <p class="subtitle">Stay updated on your property journey</p>
        </div>

        <div class="actions">
            <button @click="markAllAsRead" class="btn-text">
                <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Mark all as read
            </button>
        </div>

        <div :class="['ably-status', ablyStatus]">
            <span class="status-dot"></span>
            Ably Status: {{ ablyStatusText }}
        </div>

        <div v-if="loading" class="empty-state">
            <p>Fetching notifications...</p>
            <svg class="spinner" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
        </div>

        <div v-else-if="error" class="error-state">
            <p class="error-message">Error loading notifications: {{ error }}</p>
        </div>

        <div v-else-if="!notifications.length" class="empty-state">
            <p>You are all caught up!</p>
            <p class="subtitle">No new activity on your investments or inquiries.</p>
        </div>

        <div v-else class="notifications-list">
            <div 
                v-for="notification in notifications" 
                :key="notification.id" 
                :class="['notification-item', { 'is-new': notification.status === 'new' }]"
            >
                <div class="icon-container" :style="{ backgroundColor: getIconColor(notification.type) }">
                    <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="getIcon(notification.type)"></svg>
                </div>
                
                <div class="content">
                    <p class="message-text">
                        **{{ notification.title }}**
                        <span>{{ notification.message }}</span>
                    </p>
                    <span class="time">{{ notification.timeAgo }}</span>
                </div>
                
                <div class="actions-right">
                    <span v-if="notification.status === 'new'" class="new-tag">New</span>
                    <a href="#" @click.prevent="viewDetails(notification)" class="view-link">View details</a>
                </div>
            </div>
        </div>
    </div>
    <FooterView />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import HeaderView from '../components/HeaderView.vue';
import FooterView from '../components/FooterView.vue';
import * as Ably from 'ably'; // ✅ Updated Ably import

// --- Configuration ---
const NOTIFICATION_API_URL = '/api/v1/user/notifications';
const ABLY_API_KEY = 'RSTb1g.Dg9vCg:IYEo1Otd0e1OLvKynv_go5Ma3LvCEa2R1ln7KLwhRk8'; // Store key in .env
const USER_ID = 'user-123'; // Replace with actual authenticated user ID

// --- State ---
const notifications = ref([]);
const loading = ref(true);
const error = ref(null);
const ablyStatus = ref('disconnected');
const ablyStatusText = ref('Disconnected');

let ablyClient = null;
let ablyChannel = null;

// --- Methods ---
const initializeAbly = () => {
  if (!ABLY_API_KEY) {
    console.warn("Ably API Key not configured. Real-time notifications disabled.");
    ablyStatusText.value = 'Configuration Missing';
    return;
  }

  try {
    ablyClient = new Ably.Realtime({ key: ABLY_API_KEY });

    ablyClient.connection.on((stateChange) => {
      ablyStatus.value = stateChange.current.toLowerCase();
      ablyStatusText.value = stateChange.current;
    });

    ablyChannel = ablyClient.channels.get(`user:notifications:${USER_ID}`);
    ablyChannel.subscribe('new-notification', (message) => {
      notifications.value.unshift({ ...message.data, status: 'new' });
    });
  } catch (e) {
    console.error('Failed to initialize Ably:', e);
    ablyStatusText.value = 'Initialization Failed';
  }
};

const fetchNotifications = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(NOTIFICATION_API_URL);
    notifications.value = response.data;
  } catch (e) {
    error.value = 'Failed to fetch notifications.';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const markAllAsRead = async () => {
  notifications.value.forEach(n => n.status = 'read');
  try {
    await axios.post(`${NOTIFICATION_API_URL}/mark-all-read`);
  } catch (e) {
    console.error('Failed to mark all as read:', e);
  }
};

const viewDetails = (notification) => {
  if (notification.status === 'new') notification.status = 'read';
  console.log('Viewing details for:', notification.id);
};

// --- Lifecycle ---
onMounted(() => {
  fetchNotifications();
  initializeAbly();
});

onUnmounted(() => {
  if (ablyClient) ablyClient.close();
});
</script>


<style scoped>
/* Scoped styles using the provided color palette */

.notifications-container {
    max-width: 850px;
    margin: 0 auto;
    padding: 40px 20px;
    min-height: 80dvh;
    margin-top: 10dvh;
}

.header-section {
    padding-bottom: 20px;
}

.page-title {
    font-size: 2.5em;
    font-weight: 800;
    margin-bottom: 5px;
    color: var(--card-foreground);
}

.subtitle {
    color: var(--muted-foreground);
    font-size: 1.1em;
}

/* Actions */
.actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
}

.btn-text {
    background: none;
    border: none;
    color: var(--primary);
    font-weight: 600;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    transition: background-color 0.2s;
}

.btn-text:hover {
    background-color: var(--secondary);
}

.btn-text .icon-sm {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    stroke: var(--primary);
}

/* Ably Status */
.ably-status {
    font-size: 0.9em;
    padding: 10px;
    border-radius: var(--radius-sm);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    font-weight: 500;
    border: 1px solid var(--border);
}

.ably-status.connected {
    background-color: color-mix(in srgb, var(--primary) 10%, transparent);
    color: var(--primary);
}

.ably-status.disconnected, .ably-status.failed {
    background-color: color-mix(in srgb, var(--destructive) 10%, transparent);
    color: var(--destructive);
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
}

.ably-status.connected .status-dot {
    background-color: var(--primary);
}
.ably-status.disconnected .status-dot, .ably-status.failed .status-dot {
    background-color: var(--destructive);
}


/* List & Items */
.notifications-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.notification-item {
    display: flex;
    align-items: center;
    background-color: var(--card);
    border: 1px solid var(--border);
    padding: 15px 20px;
    border-radius: var(--radius-md);
    transition: background-color 0.2s, border-color 0.2s;
    box-shadow: var(--card-shadow);
}

.notification-item.is-new {
    border-left: 5px solid var(--primary);
    background-color: var(--secondary);
}

.icon-container {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-right: 15px;
}

.icon-container .icon-sm {
    width: 20px;
    height: 20px;
    color: var(--primary-foreground); /* White */
}

.content {
    flex-grow: 1;
}

.message-text {
    font-size: 1em;
    color: var(--card-foreground);
    line-height: 1.4;
}

.message-text span {
    font-weight: 400;
    color: var(--muted-foreground);
    margin-left: 5px;
}

.time {
    display: block;
    font-size: 0.8em;
    color: var(--muted-foreground);
    margin-top: 3px;
}

.actions-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-shrink: 0;
}

.new-tag {
    background-color: var(--primary);
    color: var(--primary-foreground);
    font-size: 0.75em;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    margin-bottom: 5px;
}

.view-link {
    color: var(--primary);
    font-size: 0.9em;
    font-weight: 600;
    text-decoration: none;
    transition: opacity 0.2s;
}

.view-link:hover {
    opacity: 0.8;
}

/* Empty State */
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
}
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash {
    0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
    50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
    100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}

</style>