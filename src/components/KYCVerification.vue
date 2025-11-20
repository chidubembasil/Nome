<script setup>
import { reactive } from 'vue';

const kycData = reactive({
  verificationStatus: 'Not Verified',
  isVerified: false,
  // Legal & Identity
  ageLegal: false,
  dateOfBirth: '',
  ssnOrTaxID: '',
  idNumber: '',
  uploadGovIDFront: null,
  uploadGovIDBack: null,
  selfieWithID: null,
  // Property Insurance
  propertyInsurance: null,
  // Financial Verification
  bankName: '',
  accountType: 'Checking',
  bankStatement: null,
  proofOfFunds: null,
  // Address Verification
  residenceAddress: '',
  city: '',
  state: '',
  zipCode: '',
  proofOfAddress: null,
  // Business Entity
  legalCompanyName: '',
  ein: '',
  entityType: 'LLC',
  articlesOfIncorporation: null,
  operatingAgreement: null,
});

const submitVerification = () => {
  console.log('Submitting KYC data:', kycData);
  alert('KYC documents submitted for review. Please check the status later.');
  kycData.verificationStatus = 'Pending Review';
};

const handleFileUpload = (event, field) => {
  const file = event.target.files[0];
  if (file) {
    kycData[field] = file;
  }
};
</script>

<template>
  <div class="kyc-container">
    <div class="section-card status-section">
      <h2 class="card-title">Verification Status</h2>
      <div class="status-indicator">
        <span class="status-label">Status:</span>
        <span :class="['status-value', kycData.verificationStatus.toLowerCase().replace(' ', '-')]">
          {{ kycData.verificationStatus }}
        </span>
      </div>
    </div>
    
    <form @submit.prevent="submitVerification" class="kyc-form">
      
      <div class="section-card">
        <h2 class="card-title">Legal & Identity Verification</h2>
        <p class="section-note">
          Complete this verification to be able to accept payments and finalize property transactions.
        </p>
        
        <div class="form-grid">
          <div class="form-group full-width checkbox-group">
            <input id="ageLegal" type="checkbox" v-model="kycData.ageLegal" required>
            <label for="ageLegal">
              I am legally able to sign documents and complete a transaction.
            </label>
          </div>
          <div class="form-group">
            <label for="dateOfBirth">Date of Birth</label>
            <input id="dateOfBirth" v-model="kycData.dateOfBirth" type="date" required class="text-input">
          </div>
          <div class="form-group">
            <label for="ssnOrTaxID">Social Security Number / Tax ID</label>
            <input id="ssnOrTaxID" v-model="kycData.ssnOrTaxID" type="text" placeholder="XXX-XX-XXXX" required class="text-input">
          </div>
          <div class="form-group full-width">
            <label for="idNumber">ID Number</label>
            <input id="idNumber" v-model="kycData.idNumber" type="text" placeholder="Enter ID number" required class="text-input">
          </div>
        </div>

        <div class="file-upload-grid">
          <div class="file-upload-group">
            <label>Upload Government ID (Front)</label>
            <div class="file-drop-area">
              <input type="file" @change="e => handleFileUpload(e, 'uploadGovIDFront')" required>
              <p class="upload-text">Drag or drop your file or <span class="browse-link">browse</span></p>
              <p v-if="kycData.uploadGovIDFront" class="file-name">{{ kycData.uploadGovIDFront.name }}</p>
            </div>
          </div>
          <div class="file-upload-group">
            <label>Upload Government ID (Back)</label>
            <div class="file-drop-area">
              <input type="file" @change="e => handleFileUpload(e, 'uploadGovIDBack')" required>
              <p class="upload-text">Drag or drop your file or <span class="browse-link">browse</span></p>
              <p v-if="kycData.uploadGovIDBack" class="file-name">{{ kycData.uploadGovIDBack.name }}</p>
            </div>
          </div>
          <div class="file-upload-group full-width">
            <label>Selfie with ID</label>
            <div class="file-drop-area">
              <input type="file" @change="e => handleFileUpload(e, 'selfieWithID')" required>
              <p class="upload-text">Drag or drop your file or <span class="browse-link">browse</span></p>
              <p class="file-name" v-if="kycData.selfieWithID">{{ kycData.selfieWithID.name }}</p>
              <p class="upload-hint">Hold the ID next to your face clearly showing both your face and the ID.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="section-card">
        <h2 class="card-title">Property Insurance</h2>
        <p class="section-note">
          Upload current property insurance policy.
        </p>
        <div class="file-upload-group full-width">
          <label>Upload Document</label>
          <div class="file-drop-area single-upload-grid">
            <input type="file" @change="e => handleFileUpload(e, 'propertyInsurance')">
            <p class="upload-text">Drag or drop your file or <span class="browse-link">browse</span></p>
            <p class="file-name" v-if="kycData.propertyInsurance">{{ kycData.propertyInsurance.name }}</p>
          </div>
        </div>
      </div>

      <div class="section-card">
        <h2 class="card-title">Financial Verification</h2>
        <p class="section-note">
          Verify your financial capacity.
        </p>
        <div class="form-grid">
          <div class="form-group">
            <label for="bankName">Bank Name</label>
            <input id="bankName" v-model="kycData.bankName" type="text" placeholder="Your Bank Name" class="text-input">
          </div>
          <div class="form-group">
            <label for="accountType">Account Type</label>
            <select id="accountType" v-model="kycData.accountType" class="text-input select-input">
              <option value="Checking">Checking</option>
              <option value="Savings">Savings</option>
              <option value="Investment">Investment</option>
            </select>
          </div>
        </div>

        <div class="file-upload-grid financial-grid">
          <div class="file-upload-group">
            <label>Bank Statement</label>
            <div class="file-drop-area">
              <input type="file" @change="e => handleFileUpload(e, 'bankStatement')">
              <p class="upload-text">Drag or drop your file or <span class="browse-link">browse</span></p>
              <p class="upload-hint">Upload recent bank statement (last 3 months).</p>
              <p class="file-name" v-if="kycData.bankStatement">{{ kycData.bankStatement.name }}</p>
            </div>
          </div>
          <div class="file-upload-group">
            <label>Proof of Funds</label>
            <div class="file-drop-area">
              <input type="file" @change="e => handleFileUpload(e, 'proofOfFunds')">
              <p class="upload-text">Drag or drop your file or <span class="browse-link">browse</span></p>
              <p class="upload-hint">Letter from bank or financial institution showing available funds for investment.</p>
              <p class="file-name" v-if="kycData.proofOfFunds">{{ kycData.proofOfFunds.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="section-card">
        <h2 class="card-title">Address Verification</h2>
        <div class="form-grid location-grid">
          <div class="form-group full-width">
            <label for="residenceAddress">Residence Address</label>
            <input id="residenceAddress" v-model="kycData.residenceAddress" type="text" required class="text-input">
          </div>
          <div class="form-group">
            <label for="kycCity">City</label>
            <input id="kycCity" v-model="kycData.city" type="text" required class="text-input">
          </div>
          <div class="form-group">
            <label for="kycState">State</label>
            <input id="kycState" v-model="kycData.state" type="text" required class="text-input">
          </div>
          <div class="form-group">
            <label for="kycZipCode">ZIP Code</label>
            <input id="kycZipCode" v-model="kycData.zipCode" type="text" required class="text-input">
          </div>
        </div>
        
        <div class="file-upload-group full-width">
          <label>Proof of Address</label>
          <div class="file-drop-area single-upload-grid">
            <input type="file" @change="e => handleFileUpload(e, 'proofOfAddress')" required>
            <p class="upload-text">Drag or drop your file or <span class="browse-link">browse</span></p>
            <p class="upload-hint">Utility bill, bank statement, or leasing agreement (must be less than 3 months old).</p>
            <p class="file-name" v-if="kycData.proofOfAddress">{{ kycData.proofOfAddress.name }}</p>
          </div>
        </div>
      </div>

      <div class="section-card">
        <h2 class="card-title">Business Entity Verification (Optional)</h2>
        <p class="section-note">
          For LLC, Corporation, or Trust entities.
        </p>
        <div class="form-grid">
          <div class="form-group full-width">
            <label for="legalCompanyName">Legal Company Name</label>
            <input id="legalCompanyName" v-model="kycData.legalCompanyName" type="text" placeholder="Enter legal company name" class="text-input">
          </div>
          <div class="form-group">
            <label for="ein">EIN (Employer Identification Number)</label>
            <input id="ein" v-model="kycData.ein" type="text" placeholder="XX-XXXXXXX" class="text-input">
          </div>
          <div class="form-group">
            <label for="entityType">Entity Type</label>
            <select id="entityType" v-model="kycData.entityType" class="text-input select-input">
              <option value="LLC">LLC</option>
              <option value="Corporation">Corporation</option>
              <option value="Trust">Trust</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div class="file-upload-grid business-grid">
          <div class="file-upload-group">
            <label>Articles of Incorporation/Organization</label>
            <div class="file-drop-area">
              <input type="file" @change="e => handleFileUpload(e, 'articlesOfIncorporation')">
              <p class="upload-text">Drag or drop your file or <span class="browse-link">browse</span></p>
              <p class="upload-hint">Upload formation documents</p>
              <p class="file-name" v-if="kycData.articlesOfIncorporation">{{ kycData.articlesOfIncorporation.name }}</p>
            </div>
          </div>
          <div class="file-upload-group">
            <label>Operating Agreement / Bylaws</label>
            <div class="file-drop-area">
              <input type="file" @change="e => handleFileUpload(e, 'operatingAgreement')">
              <p class="upload-text">Drag or drop your file or <span class="browse-link">browse</span></p>
              <p class="upload-hint">Upload operating documents</p>
              <p class="file-name" v-if="kycData.operatingAgreement">{{ kycData.operatingAgreement.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <button type="submit" class="submit-kyc-btn">Submit for Verification</button>
    </form>
  </div>
</template>

<style scoped>
.kyc-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: var(--foreground);
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
}
.kyc-form{
  display: flex;
  flex-direction: column;
  gap: 30px;
  height: fit-content;
}
.section-note {
  font-size: 0.9em;
  color: var(--muted-foreground);
  margin-bottom: 25px;
}

/* --- Status Section --- */
.status-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-label {
  font-weight: 500;
  color: var(--foreground);
}

.status-value {
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.9em;
}

.not-verified {
  /* Using destructive token for not verified */
  background-color: rgba(var(--destructive-rgb, 255, 42, 42), 0.1);
  color: var(--destructive);
}

.pending-review {
  /* Using accent token for pending */
  background-color: rgba(var(--accent-rgb, 255, 91, 20), 0.1);
  color: var(--accent);
}

.verified {
  /* Using success color (custom green) */
  background-color: rgba(30, 200, 30, 0.1);
  color: green;
}

/* --- Forms & Inputs --- */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

.select-input {
  appearance: none; 
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236e717a%22%3E%3Cpath%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 0.8em 0.8em;
  padding-right: 2rem;
}

/* Checkbox Group */
.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.checkbox-group label {
  margin: 0;
  font-weight: normal;
}

/* --- File Uploads --- */
.file-upload-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.file-upload-group label {
  display: block;
  margin-bottom: 10px;
}

.file-drop-area {
  border: 2px dashed var(--border);
  border-radius: var(--radius-sm);
  padding: 20px;
  text-align: center;
  position: relative;
  transition: border-color 0.3s;
  cursor: pointer;
  background-color: var(--secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

.file-drop-area:hover {
  border-color: var(--primary);
}

.file-drop-area input[type="file"] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-text {
  margin: 5px 0 0;
  color: var(--muted-foreground);
  font-size: 0.95em;
}

.browse-link {
  color: var(--primary);
  font-weight: 500;
}

.upload-hint {
  font-size: 0.8em;
  color: var(--muted-foreground);
  margin-top: 10px;
}

.file-name {
  margin-top: 10px;
  color: var(--primary);
  font-weight: 500;
  font-size: 0.9em;
  word-break: break-word;
}


/* --- Submit Button --- */
.submit-kyc-btn {
  background-color: var(--primary);
  color: var(--primary-foreground);
  padding: 12px 25px;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1.1em;
  font-weight: 600;
  align-self: flex-start;
  margin-top: 20px;
}

.submit-kyc-btn:hover {
  background-color: var(--hover);
}

/* Tablet and Mobile Responsiveness */
@media (max-width: 768px) {
  .form-grid, 
  .file-upload-grid {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: auto;
  }
  .status-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>