<script setup>
  import { reactive } from 'vue';
  import HeaderView from '../components/HeaderView.vue'
  import FooterView from '../components/FooterView.vue'

  const paymentData = reactive({
    paymentMethod: 'Credit or Debit Card',
    // Card Info
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    // Billing Address
    streetAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const orderSummary = reactive({
    propertyTitle: 'Modern Downtown Loft',
    location: 'New York, NY',
    propertyPrice: 850000,
    processingFee: 2500,
    depositPercentage: 0.10,
    get depositAmount() {
      return this.propertyPrice * this.depositPercentage;
    },
    get totalAmount() {
      return this.depositAmount + this.processingFee;
    }
  });

  const completePayment = () => {
    console.log('Processing payment with data:', paymentData);
    alert(`Payment of $${orderSummary.totalAmount.toLocaleString()} completed successfully!`);
  };

  // Formatting helper for currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };
</script>

<template>
    <HeaderView/>
  <div class="payment-container">
    <h1 class="page-title">Secure Payment</h1>
    
    <form @submit.prevent="completePayment" class="payment-form">

      <div class="section-card">
        <h2 class="card-title">Payment Method</h2>
        <p class="section-note">Select how you'd like to pay</p>
        
        <div class="radio-group">
          <label class="radio-item">
            <input type="radio" v-model="paymentData.paymentMethod" value="Credit or Debit Card" name="paymentMethod">
            Credit or Debit Card
          </label>
          <label class="radio-item">
            <input type="radio" v-model="paymentData.paymentMethod" value="Bank Transfer" name="paymentMethod">
            Bank Transfer
          </label>
          <label class="radio-item">
            <input type="radio" v-model="paymentData.paymentMethod" value="Wire Transfer" name="paymentMethod">
            Wire Transfer
          </label>
        </div>
      </div>

      <div class="section-card" v-if="paymentData.paymentMethod === 'Credit or Debit Card'">
        <h2 class="card-title">Card Information</h2>
        <div class="form-grid card-grid">
          <div class="form-group full-width">
            <label for="cardholderName">Cardholder Name</label>
            <input id="cardholderName" v-model="paymentData.cardholderName" type="text" required class="text-input" placeholder="John Doe">
          </div>
          <div class="form-group full-width">
            <label for="cardNumber">Card Number</label>
            <input id="cardNumber" v-model="paymentData.cardNumber" type="text" pattern="\d{4} \d{4} \d{4} \d{4}" maxlength="19" required class="text-input" placeholder="1234 5678 9012 3456">
          </div>
          <div class="form-group expiry-group">
            <label for="expiryDate">Expiry Date</label>
            <input id="expiryDate" v-model="paymentData.expiryDate" type="text" pattern="\d{2}/\d{2}" maxlength="5" required class="text-input" placeholder="MM/YY">
          </div>
          <div class="form-group cvv-group">
            <label for="cvv">CVV</label>
            <input id="cvv" v-model="paymentData.cvv" type="text" pattern="\d{3,4}" maxlength="4" required class="text-input" placeholder="123">
          </div>
        </div>
      </div>

      <div class="section-card">
        <h2 class="card-title">Billing Address</h2>
        <div class="form-grid location-grid">
          <div class="form-group full-width">
            <label for="billStreet">Street Address</label>
            <input id="billStreet" v-model="paymentData.streetAddress" type="text" required class="text-input">
          </div>
          <div class="form-group">
            <label for="billCity">City</label>
            <input id="billCity" v-model="paymentData.city" type="text" required class="text-input">
          </div>
          <div class="form-group">
            <label for="billState">State</label>
            <input id="billState" v-model="paymentData.state" type="text" required class="text-input">
          </div>
          <div class="form-group">
            <label for="billZipCode">ZIP Code</label>
            <input id="billZipCode" v-model="paymentData.zipCode" type="text" required class="text-input">
          </div>
        </div>
        <div class="security-note">
            Your payment information is encrypted and secure. We never store your card details.
        </div>
      </div>

      <button type="submit" class="complete-payment-btn">Complete Payment</button>

      <div class="section-card order-summary">
        <h2 class="card-title">Order Summary</h2>
        <div class="property-details">
            <div class="image-placeholder">
                <svg viewBox="0 0 24 24" fill="currentColor" class="house-icon"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            </div>
            <div class="text-details">
                <p class="property-title">{{ orderSummary.propertyTitle }}</p>
                <p class="property-location">{{ orderSummary.location }}</p>
            </div>
        </div>
        
        <div class="summary-line">
            <span>Property Price</span>
            <span>{{ formatCurrency(orderSummary.propertyPrice) }}</span>
        </div>
        <div class="summary-line">
            <span>Processing Fee</span>
            <span>{{ formatCurrency(orderSummary.processingFee) }}</span>
        </div>
        <div class="summary-line subtotal-line">
            <span>Deposit ({{ orderSummary.depositPercentage * 100 }}%)</span>
            <span>{{ formatCurrency(orderSummary.depositAmount) }}</span>
        </div>
        <div class="summary-line total-line">
            <span class="total-label">Total Amount Due</span>
            <span class="total-value">{{ formatCurrency(orderSummary.totalAmount) }}</span>
        </div>
      </div>

    </form>
  </div>
  <FooterView/>
</template>

<style scoped>
  .payment-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    color: var(--foreground);
    margin-top: 10dvh;
  }

  .page-title {
    font-size: 2em;
    margin-bottom: 5px;
    color: var(--foreground);
  }

  .subtitle {
    color: var(--muted-foreground);
    margin-bottom: 30px;
  }

  .payment-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .section-card {
    background-color: var(--card);
    padding: 25px;
    border-radius: var(--radius-sm);
    box-shadow: var(--card-shadow);
  }

  .card-title {
    font-size: 1.25em;
    color: var(--foreground);
    font-weight: 600;
    margin-bottom: 15px;
  }

  .section-note {
    font-size: 0.9em;
    color: var(--muted-foreground);
    margin-bottom: 25px;
  }

  /* --- Radio Group (Payment Method) --- */
  .radio-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
  }

  .radio-item {
      display: block;
      padding: 15px;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;
      color: var(--foreground);
  }

  .radio-item:hover {
      border-color: var(--primary);
  }

  .radio-item input[type="radio"] {
      margin-right: 10px;
      /* Customizing the radio button appearance */
      accent-color: var(--primary); 
      width: 1.1em;
      height: 1.1em;
  }

  /* --- Forms & Inputs --- */
  .form-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
  }

  .card-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .expiry-group {
      grid-column: span 2;
  }
  .cvv-group {
      grid-column: span 2;
  }
  .location-grid > .form-group {
      grid-column: span 1;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .full-width {
    grid-column: 1 / -1;
  }

  label {
    margin-bottom: 5px;
    font-weight: 500;
    color: var(--muted-foreground);
    font-size: 0.9em;
  }

  .text-input {
    padding: 10px;
    border: 1px solid var(--input);
    border-radius: var(--radius-sm);
    background-color: var(--background);
    color: var(--foreground);
    font-size: 1em;
  }

  .text-input:focus {
    border-color: var(--primary);
    outline: none;
    box-shadow: 0 0 0 3px var(--ring-shadow, rgba(26, 79, 255, 0.2));
  }

  .security-note {
      background-color: var(--secondary);
      color: var(--secondary-foreground);
      padding: 10px;
      border-radius: var(--radius-sm);
      font-size: 0.9em;
      margin-top: 20px;
      text-align: center;
  }

  /* --- Complete Payment Button --- */
  .complete-payment-btn {
    background-color: var(--primary);
    color: var(--primary-foreground);
    padding: 15px 25px;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 1.1em;
    font-weight: 600;
    width: 100%;
  }

  .complete-payment-btn:hover {
    background-color: var(--hover);
  }

  /* --- Order Summary --- */
  .order-summary {
      border: 1px solid var(--border);
  }

  .property-details {
      display: flex;
      align-items: center;
      gap: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 15px;
  }

  .image-placeholder {
      width: 60px;
      height: 60px;
      background-color: var(--secondary);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
  }

  .house-icon {
      width: 30px;
      height: 30px;
      color: var(--muted-foreground);
  }

  .property-title {
      font-weight: 600;
      color: var(--foreground);
      margin-bottom: 3px;
  }

  .property-location {
      font-size: 0.9em;
      color: var(--muted-foreground);
  }

  .summary-line {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 0.95em;
      color: var(--foreground);
  }

  .subtotal-line {
      border-bottom: 1px dashed var(--border);
      margin-bottom: 10px;
  }

  .total-line {
      font-size: 1.1em;
      font-weight: 600;
      color: var(--primary);
  }

  /* Mobile Responsiveness */
  @media (max-width: 480px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
    .card-grid, .location-grid {
        grid-template-columns: 1fr;
    }
    .expiry-group, .cvv-group, .location-grid > .form-group {
        grid-column: span 1;
    }
  }
</style>