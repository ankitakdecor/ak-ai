import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const text = message.trim();

    if (!text || loading) return;

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: text,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "I couldn't connect to the AK AI server. Please make sure the backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">AK</div>
          <span>AK AI</span>
        </div>

        <button
          className="new-chat"
          onClick={() => setMessages([])}
        >
          + New chat
        </button>

        <div className="sidebar-section">
          <div className="section-title">Chats</div>

          <div className="chat-item active">
            <span>💬</span>
            <span>New conversation</span>
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="menu-item">⚙ Settings</div>
          <div className="menu-item">👤 Account</div>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h1>AK AI</h1>
            <p>Your AI assistant</p>
          </div>

          <button className="model-button">
            AI Model ▾
          </button>
        </header>

        <section className="chat-area">
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-icon">✦</div>

              <h2>How can I help you today?</h2>

              <p>
                Ask questions, analyze documents, write content,
                generate ideas and more.
              </p>

              <div className="suggestions">
                <button
                  onClick={() =>
                    setMessage("Help me analyze my sales")
                  }
                >
                  📊 Analyze my sales
                </button>

                <button
                  onClick={() =>
                    setMessage("Help me write an email")
                  }
                >
                  ✉️ Write an email
                </button>

                <button
                  onClick={() =>
                    setMessage("Analyze this document")
                  }
                >
                  📄 Analyze a document
                </button>

                <button
                  onClick={() =>
                    setMessage("Help me with my business")
                  }
                >
                  💼 Business assistant
                </button>
              </div>
            </div>
          ) : (
            <div className="messages">
              {messages.map((item, index) => (
                <div
                  key={index}
                  className={`message ${
                    item.role === "user"
                      ? "user-message"
                      : "assistant-message"
                  }`}
                >
                  <div className="message-label">
                    {item.role === "user" ? "You" : "AK AI"}
                  </div>

                  <div className="message-content">
                    {item.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="message assistant-message">
                  <div className="message-label">AK AI</div>
                  <div className="message-content">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <div className="input-container">
          <div className="input-box">
            <button className="attach">＋</button>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message AK AI..."
              rows="1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            <button
              className="send"
              onClick={sendMessage}
              disabled={!message.trim() || loading}
            >
              ↑
            </button>
          </div>

          <div className="input-note">
            AK AI can make mistakes. Check important information.
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;