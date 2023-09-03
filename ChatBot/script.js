// Get references to HTML elements
const chatLog = document.getElementById('chat-log'),
    userInput = document.getElementById('user-input'),
    sendButton = document.getElementById('send-button'),
    buttonIcon = document.getElementById('button-icon'),
    info = document.querySelector('.info');

// Add a click event listener to the send button
sendButton.addEventListener('click', sendMessage);

// Add a keydown event listener to the user input field to allow sending messages on Enter key press
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Function to handle sending messages
function sendMessage() {
    // Get the user's message and remove leading/trailing whitespace
    const message = userInput.value.trim();

    // If the message is empty, do nothing
    if (message === '') {
        return;
    }
    // If the message is 'developer', show developer information
    else if (message === 'developer') {
        userInput.value = '';
        // Append the user's message to the chat log
        appendMessage('user', message);
        // Simulate a delayed response from the bot
        setTimeout(() => {
            // Append a response message as the bot
            appendMessage('bot', 'This Source Code is Coded By Ayush Chauhan \nPhone: +91 9870817597 \n Email: ayushc262@gmail.com');
            // Change the button icon back to the paper plane
            buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
            buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
        }, 2000);
        return;
    }

    // For other user messages
    // Append the user's message to the chat log
    appendMessage('user', message);
    userInput.value = '';

    // Create options for the API request
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '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',
            'X-RapidAPI-Host': 'openai80.p.rapidapi.com'
        },
        body: `{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"${message}"}]}`
    };

    // Send the API request to OpenAI
    fetch('https://openai80.p.rapidapi.com/chat/completions', options)
        .then((response) => response.json())
        .then((response) => {
            // Append the bot's response message to the chat log
            appendMessage('bot', response.choices[0].message.content);
            // Change the button icon back to the paper plane
            buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
            buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
        })
        .catch((err) => {
            // Handle errors, e.g., API key error
            if (err.name === 'TypeError') {
                appendMessage('bot', 'Error: Check Your API Key!');
                buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
                buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
            }
        });
}

// Function to append a message to the chat log
function appendMessage(sender, message) {
    // Hide the developer info
    info.style.display = "none";
    // Change the send button icon to a loading spinner
    buttonIcon.classList.remove('fa-solid', 'fa-paper-plane');
    buttonIcon.classList.add('fas', 'fa-spinner', 'fa-pulse');

    // Create HTML elements for the message and sender icon
    const messageElement = document.createElement('div');
    const iconElement = document.createElement('div');
    const chatElement = document.createElement('div');
    const icon = document.createElement('i');

    // Add classes and content to the message elements
    chatElement.classList.add("chat-box");
    iconElement.classList.add("icon");
    messageElement.classList.add(sender);
    messageElement.innerText = message;

    // Set the appropriate icon and ID based on the sender (user or bot)
    if (sender === 'user') {
        icon.classList.add('fa-regular', 'fa-user');
        iconElement.setAttribute('id', 'user-icon');
    } else {
        icon.classList.add('fa-solid', 'fa-robot');
        iconElement.setAttribute('id', 'bot-icon');
    }

    // Append the icon and message elements to the chat log
    iconElement.appendChild(icon);
    chatElement.appendChild(iconElement);
    chatElement.appendChild(messageElement);
    chatLog.appendChild(chatElement);
    // Scroll to the bottom of the chat log
    chatLog.scrollTo = chatLog.scrollHeight;
}
