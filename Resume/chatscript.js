// Get references to DOM elements
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

// Initialize variables
let userMessage = null; // Stores user's message
const API_KEY = "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"; // Your API key
const inputInitHeight = chatInput.scrollHeight; // Initial height of the input textarea

// Function to create a chat <li> element
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

// Function to generate a response using the OpenAI API
const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }],
        })
    }

    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            messageElement.textContent = data.choices[0].message.content.trim();
        })
        .catch(() => {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

// Function to handle user input and chat interactions
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return; // If no message, exit

    chatInput.value = ""; // Clear input
    chatInput.style.height = `${inputInitHeight}px`; // Reset input height

    chatbox.appendChild(createChatLi(userMessage, "outgoing")); // Add user message to chat
    chatbox.scrollTo(0, chatbox.scrollHeight); // Scroll to bottom of chat

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming"); // Show "Thinking..." message
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi); // Generate and display AI response
    }, 600);
}

// Event listeners

// Adjust input textarea height as user types
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// Handle chat when Enter key is pressed
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

// Handle chat when send button is clicked
sendChatBtn.addEventListener("click", handleChat);

// Close the chatbot window
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

// Toggle the chatbot window
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
