import { useState, useRef, useEffect } from "react";
import { queryAiAssistant } from "@/lib/openai";
import { demoUser } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: "ai" | "user";
  content: string;
}

export default function AIAssistantWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      type: "ai",
      content: "Hello! I'm your ESG AI Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await queryAiAssistant(demoUser.id, input);
      
      const aiMessage: Message = {
        id: response.message.id.toString(),
        type: "ai",
        content: response.message.response,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error querying AI:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from the AI assistant.",
        variant: "destructive",
      });

      // Add fallback message
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: "I'm having trouble connecting right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <i className="ri-robot-line mr-2 text-primary"></i> ESG AI Assistant
        </h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: "250px" }}>
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${
                message.type === "ai" ? "ai-message" : "user-message"
              } chatbot-message`}
            >
              <p>{message.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="ai-message chatbot-message">
              <p>Thinking...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Ask about your ESG data..."
            className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            className="bg-primary hover:bg-primary-dark text-white rounded-r-lg px-4 py-2 disabled:opacity-50"
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
          >
            <i className="ri-send-plane-fill"></i>
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            className="text-xs bg-neutral text-primary rounded-full px-3 py-1"
            onClick={() => handleSuggestedQuery("Show me GRI water metrics")}
          >
            GRI water metrics
          </button>
          <button
            className="text-xs bg-neutral text-primary rounded-full px-3 py-1"
            onClick={() => handleSuggestedQuery("What's our carbon footprint?")}
          >
            Carbon footprint
          </button>
          <button
            className="text-xs bg-neutral text-primary rounded-full px-3 py-1"
            onClick={() => handleSuggestedQuery("Explain social metrics")}
          >
            Social metrics
          </button>
        </div>
      </div>
    </div>
  );
}
