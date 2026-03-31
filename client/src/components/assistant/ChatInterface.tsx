import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryAiAssistant, getAiAssistantHistory } from "@/lib/openai";
import { demoUser } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: "ai" | "user";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch chat history
  const { data: chatHistory, isLoading: isHistoryLoading } = useQuery({
    queryKey: [`/api/ai-assistant/history/${demoUser.id}`],
    onSuccess: (data) => {
      // Convert history to messages format
      if (data && data.length > 0) {
        const historyMessages: Message[] = [];
        data.forEach((item: { id: number; query: string; response: string }) => {
          historyMessages.push({
            id: `user-${item.id}`,
            type: "user",
            content: item.query,
          });
          historyMessages.push({
            id: `ai-${item.id}`,
            type: "ai",
            content: item.response,
          });
        });
        setMessages(historyMessages);
      } else {
        // If no history, set initial welcome message
        setMessages([
          {
            id: "initial",
            type: "ai",
            content: "Hello! I'm your ESG AI Assistant. How can I help you today?",
          },
        ]);
      }
    },
  });

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
      
      // Invalidate chat history query to refresh
      queryClient.invalidateQueries({ queryKey: [`/api/ai-assistant/history/${demoUser.id}`] });
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

  if (isHistoryLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading chat history...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-[calc(100vh-16rem)] flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <i className="ri-robot-line mr-2 text-primary"></i> ESG AI Assistant
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Ask questions about ESG data, GRI standards, or get help with your sustainability reporting.
        </p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${
                message.type === "ai" ? "ai-message" : "user-message"
              } chatbot-message`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
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
          <textarea
            placeholder="Ask about ESG data, GRI standards, or sustainability reporting..."
            className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={2}
          />
          <button
            className="bg-primary hover:bg-primary-dark text-white rounded-r-lg px-4 py-7 disabled:opacity-50"
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
          >
            <i className="ri-send-plane-fill"></i>
          </button>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested Questions:</h4>
          <div className="flex flex-wrap gap-2">
            <button
              className="text-sm bg-neutral text-primary rounded-full px-3 py-1"
              onClick={() => setInput("Explain the key GRI environmental standards")}
            >
              Explain GRI environmental standards
            </button>
            <button
              className="text-sm bg-neutral text-primary rounded-full px-3 py-1"
              onClick={() => setInput("How do I calculate and report Scope 1 emissions?")}
            >
              How to report Scope 1 emissions
            </button>
            <button
              className="text-sm bg-neutral text-primary rounded-full px-3 py-1"
              onClick={() => setInput("What are the best practices for water usage reporting?")}
            >
              Water usage reporting best practices
            </button>
            <button
              className="text-sm bg-neutral text-primary rounded-full px-3 py-1"
              onClick={() => setInput("How to structure diversity and inclusion metrics")}
            >
              Diversity and inclusion metrics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
