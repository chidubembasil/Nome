<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { Send, Loader2, Bot, MessageSquare, X } from 'lucide-vue-next';

const body = ref(null)



// --- State ---
const userQuery = ref('');
const messages = ref([
    {
        id: 1,
        sender: 'bot',
        text: 'Ask me anything about real estate! I can help with property searches, market insights, investment advice, and more.'
    }
]);
const isResponding = ref(false);
const chatContainer = ref(null); 

// --- Actions ---
const sendMessage = async () => {
    if (!userQuery.value.trim() || isResponding.value) return;

    const query = userQuery.value.trim();
    userQuery.value = '';
    
    // Add user message to the chat immediately
    messages.value.push({
        id: Date.now(),
        sender: 'user',
        text: query
    });

    scrollToBottom();
    isResponding.value = true;
    
    // 1. Hypothetical API Endpoint (Replace with your actual URL)
    const API_URL = '/api/ai-assistant'; 

    try {
        // --- API Call: Get AI Response ---
        const response = await axios.post(API_URL, { query: query });
        const botResponse = response.data.answer || "I received your query but didn't get a clear response. Please refine your question.";
        
        // Add bot response to the chat
        messages.value.push({
            id: Date.now() + 1,
            sender: 'bot',
            text: botResponse
        });
        
    } catch (err) {
        // Handle API errors
        const errorMsg = err.response?.data?.message || 'I apologize, but I encountered an error fetching that information. Please check your network or try again.';
        messages.value.push({
            id: Date.now() + 1,
            sender: 'bot',
            text: errorMsg
        });
        // console.error('AI API error:', err);
    } finally {
        isResponding.value = false;
        scrollToBottom();
    }
};

const scrollToBottom = () => {
    // Ensures scrolling happens after DOM update
    setTimeout(() => {
        if (chatContainer.value) {
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        }
    }, 50);
};

function nessaAi(){
    body.value.style.display = "flex"
}
function cancel(){
    body.value.style.display = "none"
}

</script>

<template>
   <div id="divBody" ref="body">
        <main class="ai-assistant-page">
            <div class="assistant-card">
                <div id="details">
                    <h2 class="card-header">AI Assistant</h2>

                     <X id="cancel" @click="cancel"/>
                </div>
                
                <div class="chat-history" ref="chatContainer">
                    <div v-if="messages.length === 1 && messages[0].sender === 'bot'" class="welcome-message-container">
                        <Bot size="64" class="bot-icon" />
                        <p class="welcome-text">{{ messages[0].text }}</p>
                    </div>
                    
                    <template v-else>
                        <div v-for="message in messages" :key="message.id" :class="['message-bubble', message.sender]">
                            <p>{{ message.text }}</p>
                        </div>
                    </template>

                    <div v-if="isResponding" class="message-bubble bot typing">
                        <Loader2 class="animate-spin" size="16" />
                    </div>
                </div>

                <form @submit.prevent="sendMessage" class="chat-input-form">
                    <input
                        type="text"
                        v-model="userQuery"
                        placeholder="Ask a question..."
                        :disabled="isResponding"
                        class="query-input"
                    />
                    <button type="submit" :disabled="!userQuery.trim() || isResponding" class="send-button">
                        <Send size="20" />
                    </button>
                </form>
                <p class="hint-text">Press Enter to send, Shift+Enter for new line (not currently implemented)</p>
            </div>
        </main>
   </div>

   <div id="nessaBtn">
        <button type="button" @click="nessaAi" id="btnAi"><MessageSquare/></button>
   </div>
</template>

<style scoped>
    /* All styles are preserved from the previous response for visual consistency */
    #divBody{
        width: 100%;
        height: 90dvh;
        position: fixed;
        top: 10dvh;
        z-index: 10000;
        background-color: var(--glass-border);
        display: none;
        justify-content: center;
        align-items: center;
        
    }
    .ai-assistant-page {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        min-height: calc(100vh - 120px); 
        padding: 20px;
    }
    .assistant-card {
        background-color: var(--card);
        color: var(--card-foreground);
        border-radius: var(--radius-md);
        box-shadow: var(--card-shadow-lg);
        width: 100%;
        max-width: 650px;
        height: 70vh; 
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .card-header {
        font-size: 1.5rem;
        padding: 15px 20px;
        border-bottom: 1px solid var(--border);
        font-weight: 600;
    }
    .chat-history {
        flex-grow: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .welcome-message-container {
        text-align: center;
        padding-top: 50px;
        color: var(--muted-foreground);
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .bot-icon {
        color: var(--primary);
        margin-bottom: 20px;
    }
    .welcome-text {
        max-width: 80%;
    }
    .message-bubble {
        max-width: 80%;
        padding: 10px 15px;
        border-radius: var(--radius-sm);
        line-height: 1.4;
    }
    .message-bubble.user {
        align-self: flex-end;
        background-color: var(--primary);
        color: var(--primary-foreground);
        border-bottom-right-radius: 0;
    }
    .message-bubble.bot {
        align-self: flex-start;
        background-color: var(--secondary);
        color: var(--secondary-foreground);
        border-bottom-left-radius: 0;
    }
    .message-bubble.bot.typing {
        background-color: transparent;
        color: var(--muted-foreground);
        border: none;
        padding: 5px;
    }
    .chat-input-form {
        display: flex;
        padding: 15px 20px;
        border-top: 1px solid var(--border);
        gap: 10px;
    }
    .query-input {
        flex-grow: 1;
        padding: 10px 15px;
        border: 1px solid var(--input);
        border-radius: var(--radius-sm);
        background-color: var(--background);
        color: var(--foreground);
        font-size: 1rem;
        transition: border-color 0.2s;
    }
    .query-input:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 1px var(--primary);
    }
    .send-button {
        background-color: var(--primary);
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: background-color 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .send-button:hover:not(:disabled) {
        background-color: var(--hover);
    }
    .send-button:disabled {
        background-color: var(--muted);
        color: var(--muted-foreground);
        cursor: not-allowed;
    }
    .hint-text {
        font-size: 0.75rem;
        color: var(--muted-foreground);
        padding: 0 20px 10px;
    }
    body.dark-mode .message-bubble.bot {
        background-color: var(--sidebar-accent);
        color: var(--sidebar-accent-foreground);
    }
    body.dark-mode .query-input {
        background-color: var(--card);
        border-color: var(--input);
    }
    #nessaBtn{
        width: 100%;
        height: fit-content;
        position: fixed;
        bottom: 10px;
        right: 10px;
        display: flex;
        justify-content: end;
        padding-left: 20px;
       
    }
    #details{
        display: flex;
        flex-direction: row;
        width: 100%;
        height: fit-content;
        align-items: center;

    }
    #btnAi{
        background-color: var(--primary);
        color: #ffffff;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    
</style>