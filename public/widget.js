(function () {

  // ================================
  // GET TOKEN
  // ================================

  const token =
    document.currentScript.getAttribute(
      "data-token"
    );

  // ================================
  // API URL
  // ================================

  const API_URL =
    `https://ai-business-chat-saas-backend.onrender.com/api/ai/widget/chat/${token}`;

  // ================================
  // CREATE CHAT BUTTON
  // ================================

  const chatButton =
    document.createElement("button");

  chatButton.id =
    "apexchat-widget-button";

  chatButton.innerHTML = "💬";

  document.body.appendChild(
    chatButton
  );

  // ================================
  // CREATE CHAT BOX
  // ================================

  const chatBox =
    document.createElement("div");

  chatBox.id =
    "apexchat-widget-container";

  chatBox.style.display =
    "none";

  chatBox.innerHTML = `

    <!-- HEADER -->
<div
  style="
    background:linear-gradient(135deg,#7c3aed,#5b4ef5);
    color:white;
    padding:16px 18px;
    font-weight:600;
    font-size:16px;

    display:flex;
    align-items:center;
    justify-content:space-between;

    min-height:70px;
  "
>

  <div>
    ApexChat AI
  </div>

  <button
    id="closeChat"
    style="
      background:none;
      border:none;

      color:white;

      font-size:28px;

      cursor:pointer;

      width:40px;
      height:40px;

      display:flex;
      align-items:center;
      justify-content:center;
    "
  >
    ×
  </button>

</div>

    <!-- MESSAGES -->

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

    <!-- INPUT -->

    <div
      style="
        padding:14px;
        border-top:1px solid #eee;
        display:flex;
        gap:10px;
        background:white;
      "
    >

      <input
        id="messageInput"
        placeholder="Type your message..."
        style="
          flex:1;
          padding:12px;
          border-radius:12px;
          border:1px solid #ddd;
          outline:none;
          font-size:14px;
        "
      />

      <button
        id="sendBtn"
        style="
          background:#5b4ef5;
          color:white;
          border:none;
          padding:12px 18px;
          border-radius:12px;
          cursor:pointer;
          font-weight:600;
        "
      >
        Send
      </button>

    </div>

  `;

  document.body.appendChild(
    chatBox
  );

  // ================================
  // GET ELEMENTS
  // ================================

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

  const closeChat =
    document.getElementById(
      "closeChat"
    );

  // ================================
  // OPEN CHAT
  // ================================

  chatButton.onclick = () => {

    chatBox.style.display =
      "flex";

  };

  // ================================
  // CLOSE CHAT
  // ================================

  closeChat.onclick = () => {

    chatBox.style.display =
      "none";

  };

  // ================================
  // SEND ON ENTER
  // ================================

  input.addEventListener(
    "keypress",
    (event) => {

      if (event.key === "Enter") {

        sendBtn.click();

      }

    }
  );

  // ================================
  // SEND MESSAGE
  // ================================

  sendBtn.onclick = async () => {

    const message =
      input.value.trim();

    if (!message) return;

    // USER MESSAGE

    messagesDiv.innerHTML += `

      <div
        style="
          margin-bottom:14px;
          background:#ede9fe;
          padding:12px;
          border-radius:14px;
          color:#111827;
          line-height:1.6;
        "
      >
        <strong
          style="
            display:block;
            margin-bottom:4px;
            color:#5b4ef5;
          "
        >
          You:
        </strong>

        ${message}

      </div>

    `;

    input.value = "";

    messagesDiv.scrollTop =
      messagesDiv.scrollHeight;

    try {

      // LOADING MESSAGE

      const loadingId =
        Date.now();

      messagesDiv.innerHTML += `

        <div
          id="loading-${loadingId}"
          style="
            margin-bottom:14px;
            background:white;
            padding:12px;
            border-radius:14px;
            color:#6b7280;
          "
        >
          AI is typing...
        </div>

      `;

      messagesDiv.scrollTop =
        messagesDiv.scrollHeight;

      // FETCH AI RESPONSE

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

      // REMOVE LOADING

      const loadingElement =
        document.getElementById(
          `loading-${loadingId}`
        );

      if (loadingElement) {
        loadingElement.remove();
      }

      // AI MESSAGE

      messagesDiv.innerHTML += `

        <div
          style="
            margin-bottom:14px;
            background:white;
            padding:12px;
            border-radius:14px;
            color:#111827;
            line-height:1.7;
            border:1px solid #eee;
          "
        >
          <strong
            style="
              display:block;
              margin-bottom:4px;
              color:#5b4ef5;
            "
          >
            AI:
          </strong>

          ${data.reply}

        </div>

      `;

      messagesDiv.scrollTop =
        messagesDiv.scrollHeight;

    } catch (error) {

      console.log(error);

      messagesDiv.innerHTML += `

        <div
          style="
            margin-bottom:14px;
            background:#fee2e2;
            color:#991b1b;
            padding:12px;
            border-radius:14px;
          "
        >
          Something went wrong.
          Please try again.
        </div>

      `;

    }

  };

})();