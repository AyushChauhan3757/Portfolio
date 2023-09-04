const chatLog = document.getElementById('chat-log'),
    userInput = document.getElementById('user-input'),
    sendButton = document.getElementById('send-button'),
    buttonIcon = document.getElementById('button-icon'),
    info = document.querySelector('.info');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = userInput.value.trim();
    // if message = empty do nothing
    if (message === '') {
        return;
    }
    // if message = developer - show our message
    else if (message === 'developer') {
        // clear input value
        userInput.value = '';
        // append message as user - we will code its function
        appendMessage('user', message);
        // sets a fake timeout that shows loading on the send button
        setTimeout(() => {
            // send our message as bot (sender: bot)
            appendMessage('bot', 'This Source Coded By Ayush Chauhan \nPhone: +91 9870817597 \n Email: ayushc262@gmail.com');
            // change button icon to default
            buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
            buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
        }, 2000); // Adjust the delay duration (in milliseconds) as needed
        return;
    }

    // else if none of the above
    // appends the user's message to the screen
    appendMessage('user', message);
    userInput.value = '';

    // Simulate a delay before making the API request (e.g., 2 seconds)
    setTimeout(() => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: message }, // Use the user's message here
                ],
                max_tokens: 50, // Adjust as needed
            }),
        };
        // Make the API request after the timeout
        fetch('https://api.openai.com/v1/engines/davinci/completions', options)
            .then((response) => response.json())
            .then((response) => {
                appendMessage('bot', response.choices[0].message.content);

                buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
                buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
            })
            .catch((err) => {
                if (err.name === 'TypeError') {
                    appendMessage('bot', 'Error: Check Your API Key!');
                    buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
                    buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
                }
            });
    }, 5000); // Adjust the delay duration (in milliseconds) as needed
}


function appendMessage(sender, message) {
    info.style.display = "none";
    // change send button icon to loading using fontawesome
    buttonIcon.classList.remove('fa-solid', 'fa-paper-plane');
    buttonIcon.classList.add('fas', 'fa-spinner', 'fa-pulse');

    const messageElement = document.createElement('div');
    const iconElement = document.createElement('div');
    const chatElement = document.createElement('div');
    const icon = document.createElement('i');

    chatElement.classList.add("chat-box");
    iconElement.classList.add("icon");
    messageElement.classList.add(sender);
    messageElement.innerText = message;

    // add icons depending on who send message bot or user
    if (sender === 'user') {
        icon.classList.add('fa-regular', 'fa-user');
        iconElement.setAttribute('id', 'user-icon');
    } else {
        icon.classList.add('fa-solid', 'fa-robot');
        iconElement.setAttribute('id', 'bot-icon');
    }

    iconElement.appendChild(icon);
    chatElement.appendChild(iconElement);
    chatElement.appendChild(messageElement);
    chatLog.appendChild(chatElement);
    chatLog.scrollTo = chatLog.scrollHeight;

}
