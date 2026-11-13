
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const messagesArea = document.getElementById("messagesArea");

function getCurrentTime() {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function sendMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "sent");

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");

    const messageText = document.createElement("p");
    messageText.textContent = message;

    const messageTime = document.createElement("span");
    messageTime.classList.add("message-time");
    messageTime.textContent = getCurrentTime();

    messageContent.appendChild(messageText);
    messageContent.appendChild(messageTime);

    messageElement.appendChild(messageContent);

    messagesArea.appendChild(messageElement);

    messagesArea.scrollTop = messagesArea.scrollHeight;
}

messageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = messageInput.value.trim();

    if (message === "") {
        return;
    }

    sendMessage(message);

    messageInput.value = "";
    messageInput.focus();
});
