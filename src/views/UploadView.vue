<template>
    <HeaderView/>
    <div class="list-property-container">
        <h1 class="page-title">List Your Property</h1>
        <p class="subtitle">Fill in the details below to create your listing</p>

        <form @submit.prevent="submitListing" class="listing-form">

            <div class="section-card">
                <h2 class="card-title">Basic Information</h2>
                <p class="section-note">Provide the essential details about your property</p>
                <div class="form-grid basic-info-grid">
                    <div class="form-group full-width">
                        <label for="propertyTitle">Property Title *</label>
                        <input 
                            id="propertyTitle" 
                            v-model="listingForm.propertyTitle" 
                            type="text" 
                            placeholder="e.g., Modern Downtown Loft" 
                            required 
                            class="text-input"
                            :class="{'input-error': validationErrors.propertyTitle}"
                        >
                        <span v-if="validationErrors.propertyTitle" class="error-message">{{ validationErrors.propertyTitle }}</span>
                    </div>
                    <div class="form-group">
                        <label for="listingType">Listing Type *</label>
                        <select 
                            id="listingType" 
                            v-model="listingForm.listingType" 
                            required 
                            class="text-input select-input"
                            :class="{'input-error': validationErrors.listingType}"
                        >
                            <option value="" disabled>Select listing type</option>
                            <option value="Buy">Buy</option>
                            <option value="Rent">Rent</option>
                            <option value="Invest">Invest</option>
                            <option value="Stay">Stay</option>
                        </select>
                        <span v-if="validationErrors.listingType" class="error-message">{{ validationErrors.listingType }}</span>
                    </div>
                    
                    <div class="form-group" v-if="listingForm.listingType === 'Rent'">
                        <label for="rentalDuration">Rental Duration *</label>
                        <select 
                            id="rentalDuration" 
                            v-model="listingForm.rentalDuration" 
                            required 
                            class="text-input select-input"
                            :class="{'input-error': validationErrors.rentalDuration}"
                        >
                            <option value="" disabled>Select duration</option>
                            <option value="1month">1 Month</option>
                            <option value="6months">6 Months</option>
                            <option value="1year">1 Year</option>
                        </select>
                        <span v-if="validationErrors.rentalDuration" class="error-message">{{ validationErrors.rentalDuration }}</span>
                    </div>

                    <div class="form-group" v-else-if="listingForm.listingType === 'Invest'">
                        <label for="investmentPlan">Investment Plan *</label>
                        <select 
                            id="investmentPlan" 
                            v-model="listingForm.investmentPlan" 
                            required 
                            class="text-input select-input"
                            :class="{'input-error': validationErrors.investmentPlan}"
                        >
                            <option value="" disabled>Select plan</option>
                            <option v-for="plan in investmentPlans" :key="plan" :value="plan">{{ plan }}</option>
                        </select>
                        <span v-if="validationErrors.investmentPlan" class="error-message">{{ validationErrors.investmentPlan }}</span>
                    </div>

                    <div class="form-group">
                        <label for="propertyType">Property Type *</label>
                        <select 
                            id="propertyType" 
                            v-model="listingForm.propertyType" 
                            required 
                            class="text-input select-input"
                            :class="{'input-error': validationErrors.propertyType}"
                        >
                            <option value="" disabled>Select property type</option>
                            <option value="House">House</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Condo">Condo</option>
                            <option value="Land" v-if="listingForm.listingType === 'Invest' || listingForm.propertyType === 'Land'">Land</option>
                        </select>
                        <span v-if="validationErrors.propertyType" class="error-message">{{ validationErrors.propertyType }}</span>
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="description">Description *</label>
                        <textarea 
                            id="description" 
                            v-model="listingForm.description" 
                            rows="4" 
                            placeholder="Describe your property and the percentage of the property you are offering(if)..." 
                            required 
                            class="text-input"
                            :class="{'input-error': validationErrors.description}"
                        ></textarea>
                        <span v-if="validationErrors.description" class="error-message">{{ validationErrors.description }}</span>
                    </div>
                </div>
            </div>

            <div class="section-card">
                <h2 class="card-title">Location</h2>
                <div class="form-grid location-grid">
                    <div class="form-group full-width">
                        <label for="streetAddress">Street Address *</label>
                        <input id="streetAddress" v-model="listingForm.streetAddress" type="text" required class="text-input" :class="{'input-error': validationErrors.streetAddress}">
                        <span v-if="validationErrors.streetAddress" class="error-message">{{ validationErrors.streetAddress }}</span>
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="country">Country *</label>
                        <select 
                            id="country" 
                            v-model="listingForm.country" 
                            required 
                            class="text-input select-input" 
                            :class="{'input-error': validationErrors.country}"
                            >
                            <option value="" disabled>Select a country</option>
                            <option v-for="country in countryList" :key="country" :value="country">
                                {{ country }}
                            </option>
                        </select>
                        <span v-if="validationErrors.country" class="error-message">{{ validationErrors.country }}</span>
                    </div>
                    
                    <div class="form-group ">
                        <label for="city">City *</label>
                        <input id="city" v-model="listingForm.city" type="text" required class="text-input" :class="{'input-error': validationErrors.city}">
                        <span v-if="validationErrors.city" class="error-message">{{ validationErrors.city }}</span>
                    </div>
                    <div class="form-group">
                        <label for="state">State *</label>
                        <input id="state" v-model="listingForm.state" type="text" required class="text-input" :class="{'input-error': validationErrors.state}">
                        <span v-if="validationErrors.state" class="error-message">{{ validationErrors.state }}</span>
                    </div>
                    <div class="form-group">
                        <label for="zipCode">ZIP Code *</label>
                        <input id="zipCode" v-model="listingForm.zipCode" type="text" required class="text-input" :class="{'input-error': validationErrors.zipCode}">
                        <span v-if="validationErrors.zipCode" class="error-message">{{ validationErrors.zipCode }}</span>
                    </div>
                </div>
            </div>

            <div class="section-card">
                <h2 class="card-title">Property Details</h2>
                <div class="form-grid details-grid">
                    <div class="form-group">
                        <label for="price">Price *</label>
                        <input id="price" v-model.number="listingForm.price" type="text" inputmode="numeric" min="0" required class="text-input" :class="{'input-error': validationErrors.price}">
                        <span v-if="validationErrors.price" class="error-message">{{ validationErrors.price }}</span>
                    </div>
                    <div class="form-group">
                        <label for="bedrooms">Bedrooms *</label>
                        <input id="bedrooms" v-model.number="listingForm.bedrooms" type="number" min="1" required class="text-input" :class="{'input-error': validationErrors.bedrooms}">
                        <span v-if="validationErrors.bedrooms" class="error-message">{{ validationErrors.bedrooms }}</span>
                    </div>
                    <div class="form-group">
                        <label for="bathrooms">Bathrooms *</label>
                        <input id="bathrooms" v-model.number="listingForm.bathrooms" type="number" min="1" step="0.5" required class="text-input" :class="{'input-error': validationErrors.bathrooms}">
                        <span v-if="validationErrors.bathrooms" class="error-message">{{ validationErrors.bathrooms }}</span>
                    </div>
                    <div class="form-group">
                        <label for="squareFeet">Square Feet *</label>
                        <input id="squareFeet" v-model.number="listingForm.squareFeet" type="text" inputmode="numeric" min="1" required class="text-input" :class="{'input-error': validationErrors.squareFeet}">
                        <span v-if="validationErrors.squareFeet" class="error-message">{{ validationErrors.squareFeet }}</span>
                    </div>
                    <div class="form-group">
                        <label for="yearBuilt">Year Built</label>
                        <input id="yearBuilt" v-model.number="listingForm.yearBuilt" type="number" min="2000" :max="new Date().getFullYear()" class="text-input">
                    </div>
                    <div class="form-group">
                        <label for="parkingSpaces">Parking Spaces</label>
                        <input id="parkingSpaces" v-model.number="listingForm.parkingSpaces" type="number" min="0" class="text-input">
                    </div>
                </div>
            </div>

            <div class="section-card">
                <h2 class="card-title">Property Images</h2>
                <p class="section-note">Upload high-quality images of your property</p>
                <div class="file-upload-area">
                   <input type="file" multiple @change="handleImageUpload" accept="image/png, image/jpeg, image/jpg" class="file-input">
                     <div class="upload-content">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="upload-icon">
                            <path d="M4 17v-3a4 4 0 014-4h8a4 4 0 014 4v3"></path>
                            <path d="M12 5v14"></path>
                            <path d="M7 10l5-5 5 5"></path>
                        </svg>
                        <p class="upload-link">
                            Click to upload or drag and drop
                        </p>
                        <p class="upload-hint">PNG, JPG up to 10MB (3 images minimum)</p>
                    </div>
                </div>
                <span v-if="validationErrors.propertyImages" class="error-message" style="margin-top: 10px; display: block;">{{ validationErrors.propertyImages }}</span>

                <div v-if="listingForm.propertyImages.length" class="image-previews">
                    <span v-for="image in listingForm.propertyImages" :key="image.name" class="image-tag">{{ image.name }}</span>
                </div>
            </div>

            <div class="action-buttons">
                <button type="submit" class="submit-listing-btn" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Submitting...' : 'Submit Listing' }}
                </button>
                <button type="button" @click="resetForm" class="cancel-btn" :disabled="isSubmitting">Cancel</button>
            </div>

        </form>
    </div>
    
    <div v-if="submissionStatus" :class="['submission-notification', submissionStatus.type]">
        {{ submissionStatus.message }}
        <button @click="submissionStatus = null" class="close-notification-btn">&times;</button>
    </div>

    <FooterView/>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'; // Import 'watch'
import axios from 'axios';
import HeaderView from '../components/HeaderView.vue'
import FooterView from '../components/FooterView.vue'

// --- IMPORTANT: Change API path to your listings.php file ---
const api = '/api/listings.php'; 

// --- Investment Plan Data ---
const investmentPlans = [
    "Auction Properties", 
    "House Hacking", 
    "Land Development", 
    "BRRRR", 
    "Fix & Flip", 
    "Buy & Hold", 
    "Vacational Rental", 
    "Commercial Real Estate", 
    "Real Estate Private Equity Fund", 
    "Fractional Ownership", 
    "Development Company Equity", 
    "Crowdfunded Real Estate", 
    "International Realestate"
];

// --- Form State ---
const listingForm = reactive({
    propertyTitle: '',
    listingType: '',
    propertyType: '',
    description: '',
    streetAddress: '',
    country: '', // Now a select value
    city: '',
    state: '',
    zipCode: '',
    price: null,
    bedrooms: null,
    bathrooms: null,
    squareFeet: null,
    yearBuilt: null,
    parkingSpaces: null,
    propertyImages: [],
    // NEW CONDITIONAL FIELDS
    rentalDuration: '', 
    investmentPlan: ''
});

// --- Watcher to clear conditional fields when listingType changes ---
watch(() => listingForm.listingType, (newType, oldType) => {
    // If we switch away from Rent, clear rentalDuration
    if (oldType === 'Rent' && newType !== 'Rent') {
        listingForm.rentalDuration = '';
    }
    // If we switch away from Invest, clear investmentPlan
    if (oldType === 'Invest' && newType !== 'Invest') {
        listingForm.investmentPlan = '';
        // Also check if propertyType was Land and reset it
        if(listingForm.propertyType === 'Land') {
            listingForm.propertyType = '';
        }
    }
});


// --- Country Data (Unchanged) ---
const countryList = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", 
    "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", 
    "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", 
    "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", 
    "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", 
    "Colombia", "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)", "Costa Rica", "Croatia", 
    "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", 
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", 
    "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", 
    "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", 
    "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", 
    "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", 
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", 
    "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", 
    "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", 
    "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", 
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", 
    "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", 
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", 
    "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", 
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", 
    "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", 
    "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", 
    "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", 
    "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", 
    "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", 
    "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", 
    "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// --- UI State (Unchanged) ---
const isSubmitting = ref(false);
const validationErrors = reactive({});
const submissionStatus = ref(null); 

// --- Validation Logic (Updated) ---
const validateForm = () => {
    // Clear previous errors
    Object.keys(validationErrors).forEach(key => delete validationErrors[key]);
    let isValid = true;
    
    const requiredFields = [
        'propertyTitle', 'listingType', 'propertyType', 'description', 
        'streetAddress', 'country', 'city', 'state', 'zipCode', 
        'price', 'bedrooms', 'bathrooms', 'squareFeet'
    ];

    // Add conditional required fields
    if (listingForm.listingType === 'Rent') {
        requiredFields.push('rentalDuration');
    } else {
        // Remove validation error if field is not visible/required
        delete validationErrors.rentalDuration;
    }

    if (listingForm.listingType === 'Invest') {
        requiredFields.push('investmentPlan');
    } else {
        // Remove validation error if field is not visible/required
        delete validationErrors.investmentPlan;
    }


    requiredFields.forEach(field => {
        const value = listingForm[field];
        if (value === null || value === '' || (typeof value === 'number' && isNaN(value)) || (Array.isArray(value) && value.length === 0)) {
            // Note: I'm using a regex replace for friendly field names (e.g., 'zipCode' -> 'zip code')
            validationErrors[field] = `The ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required.`;
            isValid = false;
        }
    });

    // Specific numeric validations
    if (listingForm.price !== null && listingForm.price <= 0) {
        validationErrors.price = 'Price must be a positive number.';
        isValid = false;
    }
    // Only require bedrooms/bathrooms/squareFeet if propertyType is NOT Land
    if (listingForm.propertyType !== 'Land') {
        if (listingForm.bedrooms !== null && listingForm.bedrooms < 1) {
            validationErrors.bedrooms = 'Property must have at least one bedroom.';
            isValid = false;
        }
        if (listingForm.bathrooms !== null && listingForm.bathrooms < 1) {
            validationErrors.bathrooms = 'Property must have at least one bathroom.';
            isValid = false;
        }
    } else {
        // For Land, clear these fields and their errors if they are not relevant
        delete validationErrors.bedrooms;
        delete validationErrors.bathrooms;
    }
    
    // Image Count Validation
    if (listingForm.propertyImages.length === 0) {
        validationErrors.propertyImages = 'You must upload at least one property image.';
        isValid = false;
    } else if (listingForm.propertyImages.length < 3) {
        validationErrors.propertyImages = 'You must upload at least 3 property images.';
        isValid = false;
    }


    return isValid;
};

// --- Form Submission (Unchanged for API call structure) ---
const submitListing = async () => {
    // 1. Validate
    if (!validateForm()) {
        submissionStatus.value = { 
            type: 'error', 
            message: 'Please correct the highlighted errors before submitting.' 
        };
        return;
    }

    // 2. Prepare Data (for multi-part form submission with files)
    const formData = new FormData();
    for (const key in listingForm) {
        if (key !== 'propertyImages') {
             // Only append non-empty/relevant data
             if (listingForm[key] !== null && listingForm[key] !== '') {
                formData.append(key, listingForm[key]);
            }
        }
    }
    // Append images
    listingForm.propertyImages.forEach((file) => {
        formData.append('propertyImages[]', file.file); // Use array notation for multiple files
    });

    // 3. Send to Backend via Axios
    isSubmitting.value = true;
    submissionStatus.value = null; // Clear previous status

    try {
        const response = await axios.post(api, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        // Handle success
        submissionStatus.value = { 
            type: 'success', 
            message: 'Listing submitted successfully! It is now under review.' 
        };
        console.log('Backend Response:', response.data);
        resetForm(); // Reset form on success

    } catch (error) {
        // Handle error
        console.error('Submission Error:', error.response ? error.response.data : error.message);
        const errorMessage = error.response?.data?.message || 'An unexpected error occurred during submission.';
        // Attempt to display validation errors from backend
        if (error.response?.data?.errors) {
             Object.assign(validationErrors, error.response.data.errors);
        }
        submissionStatus.value = { 
            type: 'error', 
            message: `Submission failed: ${errorMessage}` 
        };
    } finally {
        isSubmitting.value = false;
    }
};

// --- Image Handling (Unchanged) ---
const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    // Basic checks
    if (files.length > 20) {
        alert('You can only upload a maximum of 20 images.');
        event.target.value = ''; // Clear file input
        return;
    }

    listingForm.propertyImages = files.map(file => ({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file), 
        file: file 
    }));
};

// --- Form Reset (Updated) ---
const resetForm = () => {
    // Simple reset for reactive object fields
    Object.assign(listingForm, {
        propertyTitle: '',
        listingType: '',
        propertyType: '',
        description: '',
        streetAddress: '',
        country: '',
        city: '',
        state: '',
        zipCode: '',
        price: null,
        bedrooms: null,
        bathrooms: null,
        squareFeet: null,
        yearBuilt: null,
        parkingSpaces: null,
        propertyImages: [],
        rentalDuration: '', // Reset new fields
        investmentPlan: '' // Reset new fields
    });
    // Clear errors and status
    Object.keys(validationErrors).forEach(key => delete validationErrors[key]);
    submissionStatus.value = null;
    // Note: If you want to visually clear the file input, you need a ref on the input and set its value to null.
};
</script>

<style scoped>
/* (Styles are unchanged, but included for completeness) */
/* ========================================================= */
/* --- BASE STYLES (RETAINED) --- */
/* ========================================================= */

.list-property-container {
    width: 100%;
    max-width: 900px;
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

.listing-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.section-card {
    background-color: var(--card);
    padding: 25px;
    border-radius: var(--radius-sm);
    box-shadow: var(--card-shadow);
    display: flex;
    flex-direction: column;
}

.card-title {
    font-size: 1.25em;
    color: var(--foreground);
    font-weight: 600;
    margin-bottom: 10px;
}

.section-note {
    font-size: 0.9em;
    color: var(--muted-foreground);
    margin-bottom: 25px;
}

/* --- Form Grid --- */
.form-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.basic-info-grid {
    display: grid; /* Changed to use grid for flexibility */
    grid-template-columns: repeat(2, 1fr);
}

.location-grid {
  display: flex;
    flex-direction:column;
    gap: 20px;
}
.details-grid{
    display: flex;
    flex-direction:column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.full-width {
    grid-column: 1 / -1;
}

label {
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--foreground);
    font-size: 0.95em;
}

.text-input, .select-input {
    padding: 10px;
    border: 1px solid var(--input);
    border-radius: var(--radius-sm);
    background-color: var(--background);
    color: var(--foreground);
    font-size: 1em;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.text-input:focus, .select-input:focus {
    border-color: var(--primary);
    outline: none;
    box-shadow: 0 0 0 3px var(--ring-shadow, rgba(26, 79, 255, 0.2));
}

.select-input {
    appearance: none; 
    background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236e717a%22%3E%3Cpath%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 0.8em 0.8em;
    padding-right: 2rem;
}

/* --- Image Upload Area --- */
.file-upload-area {
    position: relative;
    border: 2px dashed var(--border);
    border-radius: var(--radius-sm);
    background-color: var(--secondary);
    padding: 30px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s;
}

.file-upload-area:hover {
    border-color: var(--primary);
}

.file-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

.upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.upload-icon {
    width: 40px;
    height: 40px;
    color: var(--primary);
    margin-bottom: 10px;
}

.upload-link {
    font-weight: 500;
    color: var(--primary);
}

.upload-hint {
    font-size: 0.8em;
    color: var(--muted-foreground);
    margin-top: 5px;
}

.image-previews {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
}

.image-tag {
    background-color: var(--secondary);
    color: var(--secondary-foreground);
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.8em;
}

/* --- Action Buttons --- */
.action-buttons {
    display: flex;
    gap: 15px;
    margin-top: 20px;
}

.submit-listing-btn {
    background-color: var(--primary);
    color: var(--primary-foreground);
    padding: 12px 25px;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background-color 0.3s, opacity 0.3s;
    font-size: 1.1em;
    font-weight: 600;
}

.submit-listing-btn:hover:not(:disabled) {
    background-color: var(--hover);
}

.submit-listing-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.cancel-btn {
    background: none;
    color: var(--muted-foreground);
    padding: 12px 25px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
    font-size: 1.1em;
    font-weight: 500;
}

.cancel-btn:hover:not(:disabled) {
    color: var(--foreground);
    background-color: var(--secondary);
}

.cancel-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}


/* ========================================================= */
/* --- NEW VALIDATION & FEEDBACK STYLES --- */
/* ========================================================= */
.error-message {
    color: var(--destructive);
    font-size: 0.85em;
    margin-top: 4px;
}

.input-error {
    border-color: var(--destructive) !important;
}

.input-error:focus {
    box-shadow: 0 0 0 3px rgba(255, 42, 42, 0.2) !important; /* destructive ring */
}

.submission-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px 30px;
    border-radius: var(--radius-sm);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-weight: 500;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 15px;
}

.submission-notification.success {
    background-color: #28a745; /* Custom green for success */
    color: #ffffff;
}

.submission-notification.error {
    background-color: var(--destructive);
    color: var(--destructive-foreground);
}

.close-notification-btn {
    background: none;
    border: none;
    color: inherit;
    font-size: 1.5em;
    line-height: 1;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s;
}

.close-notification-btn:hover {
    opacity: 1;
}


/* --- Tablet and Mobile Responsiveness (Updated Grid behavior) --- */
@media (max-width: 768px) {
    .basic-info-grid {
        grid-template-columns: 1fr;
    }
    
}

@media (max-width: 480px) {
   
    .action-buttons {
        flex-direction: column;
    }
    .submit-listing-btn, .cancel-btn {
        width: 100%;
    }
}
</style>