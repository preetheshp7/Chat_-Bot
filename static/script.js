const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

function addMessage(text, sender = "bot") {
  const msg = document.createElement("div");
  msg.className = sender === "bot" ? "bot-message" : "user-message";
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  addMessage("...", "bot");

  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text }),
  })
    .then(res => res.json())
    .then(data => {
      chatBox.lastChild.remove(); // Remove "..."
      addMessage(data.reply, "bot");
    });
}
