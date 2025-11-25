<script setup>
import { reactive } from 'vue';
import HeaderView from '../components/HeaderView.vue'
import FooterView from '../components/FooterView.vue'

const faqs = reactive([
  {
    question: "How do I list my property on zipsleeper?",
    answer: "Navigate to the 'Listings' tab and click 'List Your Property'. Fill out the required information regarding property details, location, and upload high-quality images. Once submitted, our team will review it before publishing.",
    isOpen: false
  },
  {
    question: "Is there a fee to use zipsleeper?",
    answer: "Listing a property is generally free. We charge a small transaction fee only upon successful sale or lease, which is clearly outlined in our terms of service.",
    isOpen: false
  },
  {
    question: "How does the AI evaluation tool work?",
    answer: "Our AI tool uses machine learning algorithms on thousands of market data points, including recent sales, neighborhood trends, and property specifics, to provide a competitive price estimate.",
    isOpen: false
  },
  {
    question: "Can I schedule property tours through the platform?",
    answer: "Yes, you can directly message the agent or owner via the listing page to request and schedule a private showing or virtual tour.",
    isOpen: false
  },
  {
    question: "What makes zipsleeper different from other real estate platforms?",
    answer: "zipsleeper combines cutting-edge technology with personalized service, offering AI-powered insights, seamless KYC verification, and a focus on secure, transparent transactions.",
    isOpen: false
  },
]);

const contactForm = reactive({
  fullName: '',
  email: '',
  subject: '',
  message: ''
});

const toggleFaq = (index) => {
  faqs[index].isOpen = !faqs[index].isOpen;
};

const sendMessage = () => {
  console.log('Contact Message Sent:', contactForm);
  alert('Thank you for your message! We will get back to you soon.');
  // Reset form
  contactForm.fullName = '';
  contactForm.email = '';
  contactForm.subject = '';
  contactForm.message = '';
};
</script>

<template>
  <HeaderView/>
  <div class="about-page-container">
    <h1 class="page-title">About Zipsleeper</h1>
    <p class="mission-statement">
      We're on a mission to make real estate simple, transparent, and accessible for everyone
    </p>

    <div class="features-section">
      <div class="feature-card">
        <svg viewBox="0 0 24 24" fill="currentColor" class="feature-icon primary-color"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        <h3 class="feature-title">Trusted Platform</h3>
        <p class="feature-description">Every property is verified and authenticated for your peace of mind.</p>
      </div>

      <div class="feature-card">
        <svg viewBox="0 0 24 24" fill="currentColor" class="feature-icon accent-color"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        <h3 class="feature-title">Expert Support</h3>
        <p class="feature-description">Our team of real estate professionals is here to guide you every step.</p>
      </div>

      <div class="feature-card">
        <svg viewBox="0 0 24 24" fill="currentColor" class="feature-icon primary-color"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
        <h3 class="feature-title">Smart Technology</h3>
        <p class="feature-description">AI-powered insights help you make informed investment decisions.</p>
      </div>
    </div>

    <div class="narrative-section">
      <p>
        Founded in 2025, Zipsleeper has revolutionized the real estate market by combining cutting-edge technology with personalized service. We believe that finding your dream property should be exciting, not stressful. Whether you're buying your first home, looking for an investment opportunity, or searching for the perfect rental, we're here to make your property journey seamless.
      </p>
    </div>
    
    <div class="faq-section">
        <h2 class="faq-title">Frequently Asked Questions</h2>
        <p class="faq-subtitle">Find answers to common questions about using Zipsleeper</p>
        
        <div class="faq-list">
          <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
            <div class="faq-question" @click="toggleFaq(index)">
              <span>{{ faq.question }}</span>
              <svg :class="{ 'rotated': faq.isOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toggle-icon"><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <transition name="fade">
              <div v-if="faq.isOpen" class="faq-answer">
                <p>{{ faq.answer }}</p>
              </div>
            </transition>
          </div>
        </div>
    </div>
    
    <div class="contact-section-wrapper">
        <h2 class="contact-title">Get in Touch</h2>
        <p class="contact-subtitle">Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        
        <div class="contact-grid">
            
            <form @submit.prevent="sendMessage" class="contact-form">
                <div class="form-group">
                  <label for="fullName">Full Name</label>
                  <input id="fullName" v-model="contactForm.fullName" type="text" placeholder="John Doe" required class="text-input">
                </div>
                <div class="form-group">
                  <label for="email">Email</label>
                  <input id="email" v-model="contactForm.email" type="email" placeholder="your@email.com" required class="text-input">
                </div>
                <div class="form-group">
                  <label for="subject">Subject</label>
                  <input id="subject" v-model="contactForm.subject" type="text" placeholder="How can we help?" required class="text-input">
                </div>
                <div class="form-group full-width">
                  <label for="message">Message</label>
                  <textarea id="message" v-model="contactForm.message" rows="5" placeholder="Tell us more about your inquiry..." required class="text-input"></textarea>
                </div>
                <button type="submit" class="send-message-btn full-width">Send Message</button>
            </form>
            
            <div class="contact-info-cards">
                <div class="info-card">
                    <div class="card-icon-wrapper email-bg">
                        <svg viewBox="0 0 24 24" fill="currentColor" class="card-icon"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    </div>
                    <div class="card-content">
                        <h4 class="card-subtitle">Email Us</h4>
                        <p class="card-text">info@zipsleeper.com</p>
                        <p class="card-text">support@zipsleeper.com</p>
                    </div>
                </div>
                
                <div class="info-card">
                    <div class="card-icon-wrapper call-bg">
                        <svg viewBox="0 0 24 24" fill="currentColor" class="card-icon"><path d="M20.01 15.38c-1.23 0-2.45-.14-3.59-.51-.57-.18-1.21-.08-1.63.34l-2.22 2.22c-2.83-1.44-5.15-3.75-6.59-6.59l2.22-2.22c.42-.42.52-1.05.34-1.63-.37-1.14-.51-2.36-.51-3.59 0-.55-.45-1-1-1H3.5c-.55 0-1 .45-1 1C2.5 12.01 7.99 17.5 14.5 17.5c.55 0 1-.45 1-1v-3.51c0-.55-.45-1-1-1z"/></svg>
                    </div>
                    <div class="card-content">
                        <h4 class="card-subtitle">Call Us</h4>
                        <p class="card-text">+1 (234) 567-890</p>
                        <p class="card-subtext">Mon-Fri 9am-6pm EST</p>
                    </div>
                </div>

                <div class="info-card">
                    <div class="card-icon-wrapper visit-bg">
                        <svg viewBox="0 0 24 24" fill="currentColor" class="card-icon"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    </div>
                    <div class="card-content">
                        <h4 class="card-subtitle">Visit Us</h4>
                        <p class="card-text">123 Main Street</p>
                        <p class="card-subtext">San Francisco, CA 94102</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
  <FooterView/>
</template>

<style scoped>
/* Fade transition for FAQ answer */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, max-height 0.3s ease-out;
  overflow: hidden;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  max-height: 0;
}
.fade-enter-to, .fade-leave-from {
    max-height: 200px; /* Needs to be larger than max content height */
    opacity: 1;
}

.about-page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  color: var(--foreground);
  margin-top: 10dvh;
}

.page-title {
  font-size: 2.5em;
  margin-bottom: 10px;
  text-align: center;
  color: var(--foreground);
}

.mission-statement {
  font-size: 1.2em;
  color: var(--muted-foreground);
  text-align: center;
  margin-bottom: 40px;
}

/* --- Features Section --- */
.features-section {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 50px;
}

.feature-card {
  flex: 1;
  text-align: center;
  padding: 30px 20px;
  border-radius: var(--radius-md);
  background-color: var(--card);
  box-shadow: var(--card-shadow-lg);
}

.feature-icon {
  width: 50px;
  height: 50px;
  margin-bottom: 15px;
}

.primary-color {
    color: var(--primary);
}

.accent-color {
    color: var(--accent);
}

.feature-title {
  font-size: 1.1em;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 10px;
}

.feature-description {
  font-size: 0.9em;
  color: var(--muted-foreground);
}

/* --- Narrative Section --- */
.narrative-section {
    max-width: 800px;
    margin: 0 auto 50px;
    font-size: 1em;
    line-height: 1.6;
    color: var(--foreground);
    text-align: center;
}

/* --- FAQ Section --- */
.faq-section {
  margin-bottom: 50px;
  padding: 0 20px;
}

.faq-title {
  font-size: 2em;
  text-align: center;
  color: var(--foreground);
  margin-bottom: 5px;
}

.faq-subtitle {
  text-align: center;
  color: var(--muted-foreground);
  margin-bottom: 30px;
}

.faq-item {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  margin-bottom: 10px;
  background-color: var(--card);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  font-weight: 500;
  color: var(--foreground);
}

.faq-answer {
  padding: 0 20px 15px;
  font-size: 0.95em;
  color: var(--muted-foreground);
  line-height: 1.5;
}

.toggle-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s;
  color: var(--muted-foreground);
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

/* --- Contact Section (New Styles) --- */
.contact-section-wrapper {
    margin-top: 50px;
    padding: 20px 0;
}

.contact-title {
  font-size: 2em;
  text-align: center;
  color: var(--foreground);
  margin-bottom: 10px;
}

.contact-subtitle {
  text-align: center;
  color: var(--muted-foreground);
  margin-bottom: 30px;
}

.contact-grid {
    display: grid;
    grid-template-columns: 3fr 2fr; /* Form takes more space than cards */
    gap: 30px;
    align-items: flex-start;
}

/* Contact Form Styling */
.contact-form {
    background-color: var(--card);
    padding: 30px;
    border-radius: var(--radius-md);
    box-shadow: var(--card-shadow-lg);
    display: flex;
    flex-direction: column;
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
  padding: 12px;
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

textarea.text-input {
    resize: vertical;
}

.send-message-btn {
  background-color: var(--primary);
  color: var(--primary-foreground);
  padding: 15px 25px;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1.1em;
  font-weight: 600;
}

.send-message-btn:hover {
  background-color: var(--hover);
}

/* Contact Info Cards Styling */
.contact-info-cards {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.info-card {
    background-color: var(--card);
    padding: 20px;
    border-radius: var(--radius-md);
    box-shadow: var(--card-shadow);
    display: flex;
    align-items: flex-start;
    gap: 15px;
}

.card-icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--primary-foreground); /* White icons */
}

.card-icon {
    width: 20px;
    height: 20px;
}

.email-bg { background-color: var(--primary); }
.call-bg { background-color: var(--accent); }
.visit-bg { background-color: var(--hover); } /* Use a darker blue or secondary shade */

.card-subtitle {
    font-weight: 600;
    color: var(--foreground);
    margin-bottom: 5px;
}

.card-text, .card-subtext {
    font-size: 0.95em;
    color: var(--muted-foreground);
    line-height: 1.3;
}
.card-text:first-of-type {
    color: var(--foreground);
}


/* Tablet and Mobile Responsiveness */
@media (max-width: 768px) {
  .features-section {
    flex-direction: column;
  }
  .contact-grid {
    grid-template-columns: 1fr; /* Stack form and cards */
  }
  .contact-form {
      padding: 20px;
  }
}
</style>