
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const messagesArea = document.getElementById("messagesArea");

const API_URL = "http://localhost:3000/api/messages/send";

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

messageForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = messageInput.value.trim();

    if (message === "") {
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        sendMessage(message);

        messageInput.value = "";
        messageInput.focus();

    } catch (error) {
        console.error("Error sending message:", error);
        alert(error.message || "Failed to send message.");
    }
});
