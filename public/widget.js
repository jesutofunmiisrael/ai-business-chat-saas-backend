(function () {

  const token =
    document.currentScript.getAttribute(
      "data-token"
    );

  const API_URL =
    `https://ai-business-chat-saas-backend.onrender.com/api/ai/widget/chat/${token}`;

  let conversationId =
    localStorage.getItem(
      "apexchat_conversation"
    );

  // CREATE BUTTON

  const chatButton =
    document.createElement(
      "button"
    );

  chatButton.id =
    "apexchat-widget-button";

  chatButton.innerHTML =
    "💬";

  document.body.appendChild(
    chatButton
  );

  // CREATE CHAT BOX

  const chatBox =
    document.createElement(
      "div"
    );

  chatBox.id =
    "apexchat-widget-container";

  chatBox.style.display =
    "none";

  chatBox.innerHTML = `

    <div id="apexchat-header">

      <div>

        <h3>
          ApexChat AI
        </h3>

        <p>
          We usually reply instantly
        </p>

      </div>

      <button id="closeChat">
        ✕
      </button>

    </div>

    <div id="messages"></div>

    <div id="apexchat-input-area">

      <input
        id="messageInput"
        placeholder="Type your message..."
      />

      <button id="sendBtn">
        Send
      </button>

    </div>

  `;

  document.body.appendChild(
    chatBox
  );

  // ELEMENTS

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

  const closeBtn =
    document.getElementById(
      "closeChat"
    );

  // ADD MESSAGE

  const addMessage = (
    sender,
    text
  ) => {

    const div =
      document.createElement(
        "div"
      );

    if (
      sender ===
      "customer"
    ) {

      div.className =
        "customer-message";

    } else if (
      sender ===
      "agent"
    ) {

      div.className =
        "agent-message";

    } else {

      div.className =
        "ai-message";

    }

    div.innerHTML = `

      <strong>

        ${
          sender ===
          "customer"

            ? "You"

            : sender ===
              "agent"

            ? "Support"

            : "AI"
        }

      </strong>

      <p>
        ${text}
      </p>

    `;

    messagesDiv.appendChild(
      div
    );

    messagesDiv.scrollTop =
      messagesDiv.scrollHeight;

  };



  const loadMessages =
    async () => {

      if (
        !conversationId
      ) return;

      try {

        const response =
          await fetch(

            `https://ai-business-chat-saas-backend.onrender.com/api/ai/conversations/${conversationId}`

          );

        const data =
          await response.json();


        const currentMessages =
  document.querySelectorAll(
    ".customer-message, .ai-message, .agent-message"
  );

if (
  currentMessages.length ===
  data.messages.length
) {

  return;

}

messagesDiv.innerHTML = "";

data.messages.forEach(
  (msg) => {

    addMessage(
      msg.sender,
      msg.text
    );

  }
);

      } catch (error) {

        console.log(
          error
        );

      }

    };

  // OPEN CHAT

  chatButton.onclick =
    async () => {

      chatBox.style.display =
        "flex";

      await loadMessages();

    };

  // CLOSE CHAT

  closeBtn.onclick =
    () => {

      chatBox.style.display =
        "none";

    };

  // ENTER SEND

  input.addEventListener(
    "keypress",
    (event) => {

      if (
        event.key ===
        "Enter"
      ) {

        sendBtn.click();

      }

    }
  );

  // SEND MESSAGE

  sendBtn.onclick =
    async () => {

      const message =
        input.value.trim();

      if (!message)
        return;

      // SHOW USER MESSAGE INSTANTLY

      addMessage(
        "customer",
        message
      );

      input.value = "";

      // SHOW AI TYPING

      const typingDiv =
        document.createElement(
          "div"
        );

      typingDiv.className =
        "ai-message";

      typingDiv.id =
        "typing-indicator";

      typingDiv.innerHTML = `

        <strong>
          AI
        </strong>

        <p>
          Typing...
        </p>

      `;

      messagesDiv.appendChild(
        typingDiv
      );

      messagesDiv.scrollTop =
        messagesDiv.scrollHeight;

      try {

        const response =
          await fetch(
            API_URL,
            {

              method:
                "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body:
                JSON.stringify({

                  message,

                  conversationId,

                }),

            }
          );

        const data =
          await response.json();

        // SAVE CONVERSATION ID

        if (
          data.conversationId
        ) {

          conversationId =
            data.conversationId;

          localStorage.setItem(

            "apexchat_conversation",

            data.conversationId

          );

        }

        // REMOVE TYPING

        const typing =
          document.getElementById(
            "typing-indicator"
          );

        if (typing) {

          typing.remove();

        }

        // RELOAD ALL MESSAGES

        await loadMessages();

      } catch (error) {

        console.log(
          error
        );

      }

    };

  // AUTO REFRESH FOR AGENT REPLIES

// SMART REFRESH

let lastMessageCount = 0;

setInterval(
  async () => {

    if (
      chatBox.style.display !==
      "flex"
    ) return;

    if (
      !conversationId
    ) return;

    try {

      const response =
        await fetch(

          `https://ai-business-chat-saas-backend.onrender.com/api/ai/conversations/${conversationId}`

        );

      const data =
        await response.json();

      if (
        data.messages.length !==
        lastMessageCount
      ) {

        lastMessageCount =
          data.messages.length;

        messagesDiv.innerHTML =
          "";

        data.messages.forEach(
          (msg) => {

            addMessage(
              msg.sender,
              msg.text
            );

          }
        );

      }

    } catch (error) {

      console.log(error);

    }

  },
  5000
);

})();