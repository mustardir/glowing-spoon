"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

/**
 * AI Assistant page
 * Chat interface with Claude AI for financial advice with streaming responses
 */
export default function AiAssistantPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Scroll to bottom when messages change
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages, streaming]);

  /**
   * Load conversations on mount
   */
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await fetch("/api/ai-conversations");
        const data = await response.json();

        if (data.success) {
          setConversations(data.data);
          if (data.data.length > 0) {
            setActiveConversation(data.data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      }
    };

    loadConversations();
  }, []);

  /**
   * Start new conversation
   */
  const handleNewConversation = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/ai-conversations", {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        const newConversation: Conversation = {
          id: data.data.id,
          title: data.data.title || "New Conversation",
          messages: [],
        };
        setConversations([newConversation, ...conversations]);
        setActiveConversation(newConversation);
        setMessage("");
      }
    } catch (err) {
      setError("Failed to create conversation");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send message with streaming support
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !activeConversation) return;

    try {
      setLoading(true);
      setStreaming(true);
      setError("");
      const userMessage = message;
      setMessage("");

      // Add user message to conversation immediately
      const updatedConversation = {
        ...activeConversation,
        messages: [
          ...activeConversation.messages,
          {
            id: `user-${Date.now()}`,
            role: "USER" as const,
            content: userMessage,
            createdAt: new Date().toISOString(),
          },
        ],
      };
      setActiveConversation(updatedConversation);

      // Send message and get response
      const response = await fetch(
        `/api/ai-conversations/${activeConversation.id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: userMessage }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send message");
        setStreaming(false);
        setLoading(false);
        return;
      }

      // Add assistant message
      const finalConversation = {
        ...updatedConversation,
        messages: [
          ...updatedConversation.messages,
          {
            id: `assistant-${Date.now()}`,
            role: "ASSISTANT" as const,
            content: data.data.response,
            createdAt: new Date().toISOString(),
          },
        ],
      };
      setActiveConversation(finalConversation);
    } catch (err) {
      setError("Failed to send message");
      console.error(err);
    } finally {
      setStreaming(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6">
      {/* Sidebar - Conversations */}
      <aside className="w-full md:w-64 bg-slate-900 rounded-lg border border-slate-800 p-3 md:p-4 flex flex-col order-2 md:order-1 max-h-96 md:max-h-screen md:sticky md:top-20">
        <button
          onClick={handleNewConversation}
          disabled={loading}
          className="btn-primary w-full mb-4 text-sm md:text-base"
        >
          + New Chat
        </button>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {conversations.length === 0 ? (
              <p className="text-slate-400 text-xs md:text-sm text-center py-4">
                No conversations yet
              </p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full text-left p-3 rounded-lg transition-colors text-xs md:text-sm ${
                    activeConversation?.id === conv.id
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "text-slate-400 hover:bg-slate-800/50"
                  }`}
                >
                  <p className="truncate font-medium">{conv.title}</p>
                  <p className="truncate text-xs opacity-75">
                    {conv.messages.length} messages
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 bg-slate-900 rounded-lg border border-slate-800 flex flex-col order-1 md:order-2 min-h-screen md:min-h-auto md:max-h-screen">
        {activeConversation ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {activeConversation.messages.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <p className="text-slate-400 mb-2 md:mb-4 text-sm md:text-base">
                    Start a conversation with our AI financial advisor
                  </p>
                  <p className="text-slate-500 text-xs md:text-sm">
                    Ask about your portfolio, market insights, or investment strategies
                  </p>
                </div>
              ) : (
                activeConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg text-xs md:text-sm break-words ${
                        msg.role === "USER"
                          ? "bg-emerald-500/20 text-emerald-100"
                          : "bg-slate-800 text-slate-100"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              {streaming && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-100 px-4 py-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-800 p-4 md:p-6 bg-slate-900/50">
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs md:text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={loading || streaming}
                  className="input flex-1 text-sm md:text-base"
                />
                <button
                  type="submit"
                  disabled={loading || streaming || !message.trim()}
                  className="btn-primary px-4 md:px-6 text-sm md:text-base"
                >
                  {streaming ? "..." : "Send"}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-slate-400 mb-4 text-sm md:text-base">No conversation selected</p>
              <button onClick={handleNewConversation} className="btn-primary text-sm md:text-base">
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
