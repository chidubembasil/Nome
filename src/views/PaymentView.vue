<template>
  <HeaderView/>
  <div class="payment-container">
    <h1 class="page-title">Order Receipt & Summary</h1>
    <p class="subtitle">Review your investment details and select a display currency.</p>
    
    <div class="summary-section-wrapper">
        
        <div v-if="loadingOrder" class="loading-state section-card">
            <svg class="spinner" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
            <p>Loading Investment Details...</p>
        </div>

        <div v-else-if="orderError" class="error-state section-card">
            <h2 class="card-title">Error</h2>
            <p class="error-message">{{ orderError }}</p>
            <p class="subtitle">Please refresh the page or contact support.</p>
        </div>

        <template v-else>
            
            <div class="currency-selector-card section-card">
                <h2 class="card-title">Choose Display Currency</h2>
                <div class="currency-select-group">
                    <label for="currency-select">Display Currency</label>
                    <select 
                        id="currency-select" 
                        v-model="selectedCurrency" 
                        @change="fetchConversionRate" 
                        :disabled="loadingConversion || !isOrderLoaded"
                        class="select-input"
                    >
                        <option v-for="currency in availableCurrencies" :key="currency" :value="currency">
                            {{ currency }}
                        </option>
                    </select>
                    <p class="conversion-note" v-if="conversionRate > 0 && !loadingConversion">
                        1 USD $\approx$ **{{ conversionRate.toFixed(4) }}** {{ selectedCurrency }}
                    </p>
                    <div class="feedback-messages">
                        <span class="loading-message" v-if="loadingConversion">
                            <svg class="spinner" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
                            Loading conversion rate...
                        </span>
                        <span class="error-message" v-if="currencyError">{{ currencyError }}</span>
                    </div>
                </div>
            </div>

            <div class="section-card order-summary">
                <h2 class="card-title">Investment Receipt</h2>
                
                <div class="property-details">
                    <div class="image-container">
                        <img :src="orderSummary.propertyImage" :alt="orderSummary.propertyTitle" class="property-image">
                    </div>
                    <div class="text-details">
                        <p class="property-title">{{ orderSummary.propertyTitle }}</p>
                        <p class="property-location">{{ orderSummary.location }}</p>
                        <div class="base-currency-tag">Base Currency: USD</div>
                    </div>
                </div>
                
                <div class="summary-line">
                    <span>Property Price (USD)</span>
                    <span>{{ formatCurrency(orderSummary.propertyPrice, 'USD') }}</span>
                </div>
                <div class="summary-line">
                    <span>Processing Fee (USD)</span>
                    <span>{{ formatCurrency(orderSummary.processingFee, 'USD') }}</span>
                </div>
                <div class="summary-line subtotal-line">
                    <span>Deposit ({{ orderSummary.depositPercentage * 100 }}% of Price)</span>
                    <span>{{ formatCurrency(orderSummary.depositAmount, 'USD') }}</span>
                </div>

                <div class="summary-line total-line">
                    <span class="total-label">Total Amount Due (USD)</span>
                    <span class="total-value">{{ formatCurrency(orderSummary.totalAmount, 'USD') }}</span>
                </div>
                
                <div class="summary-line total-line converted-total">
                    <span class="total-label">Total in **{{ selectedCurrency }}**</span>
                    <span class="total-value">{{ formatCurrency(convertedTotal, selectedCurrency) }}</span>
                </div>
            </div>
            
            <button 
                @click="proceedToPayment" 
                class="proceed-btn" 
                :disabled="conversionRate === 0 || loadingConversion || !isOrderLoaded || loadingPayment"
            >
                {{ loadingPayment ? 'Processing Payment...' : 'Proceed to Checkout' }}
            </button>

        </template>
        
    </div>
  </div>
  <FooterView/>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import axios from 'axios';
// import { useRouter } from 'vue-router'; 

import HeaderView from '../components/HeaderView.vue';
import FooterView from '../components/FooterView.vue';

// const router = useRouter();

// // --- Configuration ---
// const ORDER_API_BASE_URL = '/api/v1/orders/'; 
const EXCHANGE_API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest/USD'; 

// --- Order Data & State ---
const orderSummaryId = ref('O-456789'); 
const loadingOrder = ref(true);
const orderError = ref(null);
const loadingPayment = ref(false);

const orderSummary = reactive({
    propertyTitle: '',
    location: '',
    propertyImage: '', 
    propertyPrice: 0,
    processingFee: 0,
    depositPercentage: 0,
    type: 'buy', // will detect property type (buy/rent/stay/invest)
    get depositAmount() { return this.propertyPrice * this.depositPercentage; },
    get totalAmount() { return this.depositAmount + this.processingFee; }
});

const isOrderLoaded = computed(() => orderSummary.propertyPrice > 0 && !loadingOrder.value);

// --- Currency Conversion ---
const availableCurrencies = [
    'USD','EUR','GBP','CAD','XAF','COP','EGP','GHS','KES','IRN','NGN','RWF','SLL','ZAR','TZS','UGX','XOF','ZMW'
];
const selectedCurrency = ref('NGN'); 
const conversionRate = ref(0); 
const loadingConversion = ref(false);
const currencyError = ref(null);

const convertedTotal = computed(() => {
    if (conversionRate.value <= 0) return orderSummary.totalAmount;
    return orderSummary.totalAmount * conversionRate.value;
});

// --- Fetch Order Summary ---
const fetchOrderSummary = async () => {
    loadingOrder.value = true;
    orderError.value = null;

    try {
        // Simulate API fetch
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock property data
        const mockData = {
            title: 'Luxurious Waterfront Villa',
            location: 'Miami, FL',
            image: '/images/property-villa-main.jpg',
            price: 1200000,
            fee: 3000,
            depositPct: 0.15,
            type: 'buy' // can be buy/rent/stay/invest
        };

        orderSummary.propertyTitle = mockData.title;
        orderSummary.location = mockData.location;
        orderSummary.propertyImage = mockData.image;
        orderSummary.propertyPrice = mockData.price;
        orderSummary.processingFee = mockData.fee;
        orderSummary.depositPercentage = mockData.depositPct;
        orderSummary.type = mockData.type;

    } catch (error) {
        orderError.value = 'A critical error occurred while fetching the order data.';
    } finally {
        loadingOrder.value = false;
        if (!orderError.value) fetchConversionRate();
    }
};

// --- Fetch Conversion Rate ---
const fetchConversionRate = async () => {
    loadingConversion.value = true;
    currencyError.value = null;

    if (selectedCurrency.value === 'USD') {
        conversionRate.value = 1;
        loadingConversion.value = false;
        return;
    }

    try {
        const response = await axios.get(EXCHANGE_API_BASE_URL); 
        const rate = response.data?.rates?.[selectedCurrency.value];
        if (rate) conversionRate.value = rate;
        else {
            conversionRate.value = 0;
            currencyError.value = `Rate for ${selectedCurrency.value} not found.`;
        }
    } catch (error) {
        conversionRate.value = 0;
        currencyError.value = 'Failed to fetch conversion rate.';
        console.error(error);
    } finally {
        loadingConversion.value = false;
    }
};

// --- Proceed to Payment (calls backend for Flutterwave) ---
const proceedToPayment = async () => {
    if (conversionRate.value <= 0) {
        currencyError.value = 'Cannot proceed: Conversion rate is unavailable.';
        return;
    }

    loadingPayment.value = true;

    try {
        const payload = {
            amount: convertedTotal.value.toFixed(2),
            currency: selectedCurrency.value,
            propertyId: orderSummaryId.value,
            propertyType: orderSummary.type, // used by backend to pick flat/split
        };

        const response = await axios.post("/backend/payment.php", payload, {
            headers: { "Content-Type": "application/json" }
        });

        if (response.data.status === "success") {
            window.location.href = response.data.payment_link; // redirect to Flutterwave
        } else {
            alert(response.data.message || "Payment initialization failed.");
        }

    } catch (error) {
        console.error("Payment Error:", error);
        alert("Something went wrong while starting your payment.");
    } finally {
        loadingPayment.value = false;
    }
};

onMounted(fetchOrderSummary);

const formatCurrency = (amount, currencyCode) => {
    const value = amount > 0 ? amount : 0;
    const fractionDigits = ['XAF','IRN','NGN'].includes(currencyCode) ? 0 : 2;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
    }).format(value);
};
</script>

<style scoped>
/*
|----------------------------------------------------------
| STYLES USING YOUR PROVIDED COLOR PALETTE VARIABLES
|----------------------------------------------------------
*/

/* Base Styles */
.payment-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    color: var(--foreground);
    margin-top: 10dvh;
    font-family: "Poppins", sans-serif;
}

.page-title {
    font-size: 2.5em;
    font-weight: 800;
    margin-bottom: 5px;
    color: var(--primary); /* Primary blue for title */
}

.subtitle {
    color: var(--muted-foreground);
    margin-bottom: 30px;
    font-size: 1.1em;
}

.summary-section-wrapper {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.section-card {
    background-color: var(--card);
    padding: 25px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    box-shadow: var(--card-shadow);
}

.card-title {
    font-size: 1.4em;
    color: var(--card-foreground);
    font-weight: 700;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 10px;
}

/* Loading/Error States */
.loading-state, .error-state {
    text-align: center;
    padding: 50px 20px;
}
.loading-state p {
    color: var(--primary);
    font-weight: 600;
    margin-top: 15px;
}

/* --- Currency Selector Styles --- */
.currency-select-group label {
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--muted-foreground);
    font-size: 1em;
}

.select-input {
    padding: 12px 15px;
    border: 1px solid var(--input);
    border-radius: var(--radius-md);
    background-color: var(--background);
    color: var(--foreground);
    font-size: 1em;
    appearance: none;
    cursor: pointer;
    transition: border-color 0.2s;
}
.select-input:focus {
    border-color: var(--primary);
    outline: none;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 30%, transparent);
}

.conversion-note {
    margin-top: 15px;
    font-size: 0.9em;
    color: var(--primary); /* Use primary color for success/rate */
    font-weight: 600;
}
.feedback-messages {
    min-height: 20px;
    margin-top: 10px;
}
.loading-message, .error-message {
    display: flex;
    align-items: center;
    font-size: 0.9em;
    font-weight: 500;
}
.error-message {
    color: var(--destructive);
    font-weight: 600;
}
.spinner {
    animation: rotate 1s linear infinite;
    width: 16px;
    height: 16px;
    margin-right: 8px;
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

/* --- Property Image and Details --- */
.property-details {
    display: flex;
    align-items: center;
    gap: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 20px;
}
.image-container {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-md);
    overflow: hidden;
    flex-shrink: 0;
    border: 1px solid var(--border);
}
.property-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.property-title {
    font-weight: 700;
    color: var(--card-foreground);
    margin-bottom: 5px;
    font-size: 1.1em;
}

.property-location {
    font-size: 0.9em;
    color: var(--muted-foreground);
}
.base-currency-tag {
    display: inline-block;
    background-color: var(--secondary);
    color: var(--secondary-foreground);
    font-weight: 600;
    font-size: 0.75em;
    padding: 3px 8px;
    border-radius: 4px;
    margin-top: 8px;
}


/* --- Summary Lines --- */
.summary-line {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    font-size: 1em;
    color: var(--card-foreground);
    font-weight: 500;
}

.subtotal-line {
    border-bottom: 1px dashed var(--border);
    margin-bottom: 10px;
    font-weight: 600;
}
.subtotal-line span:last-child {
    color: var(--primary);
}

.total-line {
    font-size: 1.25em;
    font-weight: 700;
    padding-top: 15px;
    color: var(--primary);
}

.converted-total {
    border-top: 2px solid var(--border);
    padding-top: 15px;
    font-size: 1.4em;
    color: var(--accent); /* Use accent color for the final converted amount */
}

/* --- Proceed Button --- */
.proceed-btn {
    background-color: var(--primary);
    color: var(--primary-foreground);
    padding: 15px 25px;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 0.3s, opacity 0.3s;
    font-size: 1.2em;
    font-weight: 700;
    width: 100%;
    margin-top: 20px;
}

.proceed-btn:hover:not(:disabled) {
    background-color: var(--hover);
}

.proceed-btn:disabled {
    background-color: var(--muted);
    color: var(--muted-foreground);
    cursor: not-allowed;
    opacity: 0.7;
}

/* Mobile Responsiveness */
@media (max-width: 480px) {
    .property-details {
        flex-direction: column;
        align-items: flex-start;
    }
    .image-container {
        width: 100%;
        height: 150px;
        margin-bottom: 10px;
    }
}
</style>