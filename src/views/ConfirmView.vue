<template>
    <HeaderView/>
    <div class="confirmation-container">
        <div class="confirmation-card">
            <div class="header-icon">
                <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            
            <h1 class="page-title">Payment Successful!</h1>
            <p class="subtitle">Your investment deposit has been secured.</p>

            <div class="summary-details">
                <div class="detail-row">
                    <span>Amount Paid</span>
                    <span class="value paid-amount">{{ displayAmount }}</span>
                </div>
                <div class="detail-row">
                    <span>Transaction ID</span>
                    <span class="value transaction-id">{{ transactionId }}</span>
                </div>
                <div class="detail-row">
                    <span>Property Title</span>
                    <span class="value">{{ propertyTitle }}</span>
                </div>
                <div class="detail-row">
                    <span>Date</span>
                    <span class="value">{{ formattedDate }}</span>
                </div>
            </div>

            <p class="next-steps-text">
                A detailed receipt and investment contract documents have been sent to your registered email address.
            </p>

            <div class="action-buttons">
                <button @click="viewDocuments" class="btn btn-primary">
                    View Documents
                </button>
                <button @click="goToDashboard" class="btn btn-secondary">
                    Go to Dashboard
                </button>
            </div>
        </div>
    </div>
    <FooterView/>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeaderView from '../components/HeaderView.vue';
import FooterView from '../components/FooterView.vue';

const route = useRoute();
const router = useRouter();

// --- State Variables ---
const amount = ref(0);
const currency = ref('USD');
// This transaction ID is still a necessary mock ID for display until replaced by a backend response
const transactionId = ref(`TXN-${Math.random().toString(36).substring(2, 11).toUpperCase()}`); 
const propertyTitle = ref('Modern Downtown Loft'); 
const transactionDate = ref(new Date());

// --- Computed Properties ---
const displayAmount = computed(() => {
    const value = amount.value > 0 ? amount.value : 0;
    
    const nonDecimalCurrencies = ['XAF', 'IRN', 'NGN'];
    const fractionDigits = nonDecimalCurrencies.includes(currency.value) ? 0 : 2;
    
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency.value, 
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    }).format(value);
});

const formattedDate = computed(() => {
    return transactionDate.value.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
});

// --- Methods ---

const goToDashboard = () => {
    router.push('/home'); 
};

const viewDocuments = () => {
    router.push('/dashboard/contracts'); 
};

/**
 * Strictly checks the router query parameters for payment details.
 */
const getPaymentDetailsFromQuery = () => {
    // 1. Check Route Query Parameters
    if (route.query.amount && route.query.currency) {
        amount.value = parseFloat(route.query.amount);
        currency.value = route.query.currency.toUpperCase();
        console.log('Payment details fetched successfully from URL query.');
    } else {
        // If data is missing from the query, log a severe warning and default to 0 USD.
        console.error('CRITICAL: Missing payment amount or currency in the URL query. Data integrity risk.');
    }
};


onMounted(getPaymentDetailsFromQuery);
</script>

<style scoped>
/*
|----------------------------------------------------------
| STYLES BASED ON YOUR PALETTE (UNCHANGED)
|----------------------------------------------------------
*/

/* Base Colors (Referencing your global variables) */
.confirmation-container {
    max-width: 650px;
    margin: 0 auto;
    padding: 40px 20px;
    min-height: 70dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5dvh;
}

.confirmation-card {
    background-color: var(--card);
    padding: 40px;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    box-shadow: var(--card-shadow-lg);
    text-align: center;
    width: 100%;
}

/* Header Icon */
.header-icon {
    width: 80px;
    height: 80px;
    background-color: var(--primary);
    border-radius: 50%;
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px color-mix(in srgb, var(--primary) 50%, transparent);
}

.check-icon {
    width: 40px;
    height: 40px;
    color: var(--primary-foreground); /* White */
    stroke-width: 3;
}

.page-title {
    font-size: 2.2em;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 5px;
}

.subtitle {
    color: var(--muted-foreground);
    margin-bottom: 30px;
    font-size: 1.1em;
}

/* Summary Details */
.summary-details {
    background-color: var(--secondary);
    padding: 20px;
    border-radius: var(--radius-md);
    margin-bottom: 30px;
    border: 1px solid var(--border);
}

.detail-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    font-size: 1em;
    border-bottom: 1px dashed var(--border);
}

.detail-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.detail-row span:first-child {
    color: var(--muted-foreground);
    font-weight: 500;
}

.value {
    color: var(--card-foreground);
    font-weight: 600;
}

.paid-amount {
    color: var(--accent); /* Use accent color for the main paid amount */
    font-size: 1.1em;
    font-weight: 700;
}

/* Next Steps */
.next-steps-text {
    font-size: 0.95em;
    color: var(--card-foreground);
    margin-bottom: 30px;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
}

.btn {
    padding: 12px 25px;
    border-radius: var(--radius-sm);
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid transparent;
    width: 100%;
    max-width: 200px;
}

.btn-primary {
    background-color: var(--primary);
    color: var(--primary-foreground);
}

.btn-primary:hover {
    background-color: var(--hover);
}

.btn-secondary {
    background-color: transparent;
    border-color: var(--border);
    color: var(--muted-foreground);
}

.btn-secondary:hover {
    background-color: var(--muted);
    color: var(--card-foreground);
}
</style>