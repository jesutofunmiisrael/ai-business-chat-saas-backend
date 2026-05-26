(function () {

  // GET TOKEN
  const token =
    document.currentScript.getAttribute(
      "data-token"
    );

  // API URL
  const API_URL =
    `https://ai-business-chat-saas-backend.onrender.com/api/ai/widget/chat/${token}`;

  // CREATE CHAT BUTTON
  const chatButton =
    document.createElement("button");

  chatButton.id =
    "apexchat-widget-button";

  chatButton.innerHTML = "💬";

  document.body.appendChild(
    chatButton
  );

  // CREATE CHAT BOX
  const chatBox =
    document.createElement("div");

  chatBox.id =
    "apexchat-widget-container";

  chatBox.style.display =
    "none";

  chatBox.innerHTML = `
    
    <div
      style="
        background:#5b4ef5;
        color:white;
        padding:16px;
        font-weight:600;
        font-size:16px;
      "
    >
      ApexChat AI
    </div>

    <div
      id="messages"
      style="
        flex:1;
        overflow:auto;
        padding:16px;
        height:420px;
        background:#f9fafb;
      "
    ></div>

    <div
      style="
        padding:14px;
        border-top:1px solid #eee;
        display:flex;
        gap:10px;
      "
    >

      <input
        id="messageInput"
        placeholder="Type your message..."
        style="
          flex:1;
          padding:12px;
          border-radius:10px;
          border:1px solid #ddd;
          outline:none;
        "
      />

      <button
        id="sendBtn"
        style="
          background:#5b4ef5;
          color:white;
          border:none;
          padding:12px 16px;
          border-radius:10px;
          cursor:pointer;
        "
      >
        Send
      </button>

    </div>
  `;

  document.body.appendChild(
    chatBox
  );

  // GET ELEMENTS
  const messagesDiv =
    document.getElementById(
      "messages"
    );

  const input =
    document.getElementById(
      "messageInput"
    );

  const sendBtn =
    document.getElementById(
      "sendBtn"
    );

  // OPEN/CLOSE CHAT
  chatButton.onclick = () => {

    chatBox.style.display =
      chatBox.style.display ===
      "none"
        ? "flex"
        : "none";
  };

  // SEND ON ENTER
  input.addEventListener(
    "keypress",
    (event) => {

      if (event.key === "Enter") {
        sendBtn.click();
      }
    }
  );

  // SEND MESSAGE
  sendBtn.onclick = async () => {

    const message =
      input.value;

    if (!message) return;

    messagesDiv.innerHTML += `
      <div style="margin-bottom:14px;">
        <strong>You:</strong>
        ${message}
      </div>
    `;

    input.value = "";

    try {

      const response =
        await fetch(API_URL, {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message,
          }),
        });

      const data =
        await response.json();

      messagesDiv.innerHTML += `
        <div style="margin-bottom:14px;">
          <strong>AI:</strong>
          ${data.reply}
        </div>
      `;

      messagesDiv.scrollTop =
        messagesDiv.scrollHeight;

    } catch (error) {

      console.log(error);

    }
  };

})();