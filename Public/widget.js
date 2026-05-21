(function () {

  // SOCKET CONNECTION
  const socket = io(
    "http://localhost:5000"
  );

  // LOAD SAVED CONVERSATION
  let conversationId =
    localStorage.getItem(
      "conversationId"
    ) || null;

  // GET TOKEN FROM SCRIPT
  const token =
    document.currentScript.getAttribute(
      "data-token"
    );

  // API URL
  const API_URL =
    `http://localhost:5000/api/ai/widget/chat/${token}`;

  // CREATE CHAT BUTTON
  const chatButton =
    document.createElement("button");

  chatButton.innerText = "Chat";

  chatButton.style.position =
    "fixed";

  chatButton.style.bottom =
    "20px";

  chatButton.style.right =
    "20px";

  chatButton.style.padding =
    "12px 20px";

  chatButton.style.borderRadius =
    "50px";

  chatButton.style.border =
    "none";

  chatButton.style.background =
    "#000";

  chatButton.style.color =
    "#fff";

  chatButton.style.cursor =
    "pointer";

  chatButton.style.zIndex =
    "9999";

  document.body.appendChild(
    chatButton
  );

  // CREATE CHAT BOX
  const chatBox =
    document.createElement("div");

  chatBox.style.position =
    "fixed";

  chatBox.style.bottom =
    "80px";

  chatBox.style.right =
    "20px";

  chatBox.style.width =
    "300px";

  chatBox.style.height =
    "400px";

  chatBox.style.background =
    "#fff";

  chatBox.style.border =
    "1px solid #ddd";

  chatBox.style.borderRadius =
    "10px";

  chatBox.style.display =
    "none";

  chatBox.style.flexDirection =
    "column";

  chatBox.style.padding =
    "10px";

  chatBox.style.zIndex =
    "9999";

  // CHAT UI
  chatBox.innerHTML = `
    <div
      id="messages"
      style="
        flex:1;
        overflow:auto;
        margin-bottom:10px;
      "
    ></div>

    <input
      id="messageInput"
      placeholder="Type message..."
      style="
        padding:10px;
        width:100%;
        margin-bottom:10px;
      "
    />

    <button
      id="sendBtn"
      style="
        padding:10px;
        cursor:pointer;
      "
    >
      Send
    </button>
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

  // PRESS ENTER TO SEND
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

    // SHOW USER MESSAGE
    messagesDiv.innerHTML += `
      <div style="margin-bottom:10px;">
        <strong>You:</strong>
        ${message}
      </div>
    `;

    input.value = "";

    // SHOW TYPING
    const loadingMessage =
      document.createElement(
        "div"
      );

    loadingMessage.innerHTML = `
      <div style="margin-bottom:10px;">
        <strong>AI:</strong>
        Typing...
      </div>
    `;

    messagesDiv.appendChild(
      loadingMessage
    );

    sendBtn.disabled = true;

    try {

      // SEND TO BACKEND
      const response =
        await fetch(API_URL, {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message,
            conversationId,
          }),
        });

      // GET RESPONSE
      const data =
        await response.json();

      // SAVE CONVERSATION ID
      conversationId =
        data.conversationId;

      localStorage.setItem(
        "conversationId",
        conversationId
      );

      // JOIN SOCKET ROOM
      socket.emit(
        "joinConversation",
        conversationId
      );

      // SHOW AI RESPONSE
      loadingMessage.innerHTML = `
        <div style="margin-bottom:10px;">
          <strong>AI:</strong>
          ${data.reply}
        </div>
      `;

      sendBtn.disabled = false;

      // AUTO SCROLL
      messagesDiv.scrollTop =
        messagesDiv.scrollHeight;

    } catch (error) {

      console.log(error);

      sendBtn.disabled = false;
    }
  };

  // LISTEN FOR LIVE AGENT REPLIES
  socket.on(
    "newMessage",
    (data) => {

      const lastMessage =
        data.messages[
          data.messages.length - 1
        ];

      if (
        lastMessage.sender ===
        "agent"
      ) {

        messagesDiv.innerHTML += `
          <div style="margin-bottom:10px;">
            <strong>Agent:</strong>
            ${lastMessage.text}
          </div>
        `;

        messagesDiv.scrollTop =
          messagesDiv.scrollHeight;
      }
    }
  );

})();