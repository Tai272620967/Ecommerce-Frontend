"use client";

import { useState, useRef, useEffect } from "react";
import { sendChatbotMessageApi, ChatbotResponse } from "@/base/utils/api/chatbot";
import { useRouter } from "next/navigation";
import "./Chatbot.scss";

interface ChatbotMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatbotMessage[]>([
    {
      text: "Xin chào! Tôi là trợ lý ảo của Muji. Tôi có thể giúp bạn tìm kiếm sản phẩm, tra cứu đơn hàng và hỗ trợ các thông tin khác. Bạn cần hỗ trợ gì?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatbotMessage = {
      text: inputMessage.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await sendChatbotMessageApi({
        message: userMessage.text,
        conversationId: conversationId || undefined,
      });

      // Update conversation ID if provided
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }

      const botMessage: ChatbotMessage = {
        text: response.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Navigate to product if suggestion is provided
      if (response.hasProductSuggestion && response.productSuggestionUrl) {
        setTimeout(() => {
          router.push(response.productSuggestionUrl!);
        }, 2000);
      }
    } catch (error) {
      const errorMessage: ChatbotMessage = {
        text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`chatbot ${isOpen ? "chatbot--open" : ""}`}>
      {/* Chatbot Button */}
      <button className="chatbot__toggle" onClick={handleToggle}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isOpen ? (
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot__window">
          <div className="chatbot__header">
            <h3>Trợ lý ảo Muji</h3>
            <button
              className="chatbot__close"
              onClick={handleToggle}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>

          <div className="chatbot__messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chatbot__message ${
                  message.isUser ? "chatbot__message--user" : "chatbot__message--bot"
                }`}
              >
                <div className="chatbot__message-content">{message.text}</div>
                <div className="chatbot__message-time">
                  {message.timestamp.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chatbot__message chatbot__message--bot">
                <div className="chatbot__message-content">
                  <span className="chatbot__typing">Đang soạn tin nhắn...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot__input-container">
            <input
              ref={inputRef}
              type="text"
              className="chatbot__input"
              placeholder="Nhập tin nhắn của bạn..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              className="chatbot__send"
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
