import { useState, useEffect } from 'react';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import MainContent from './components/MainContent';
import { api } from './api';
import './App.css';

// Default council configuration (would come from backend in future)
const DEFAULT_COUNCIL_MODELS = [
  'openai/gpt-5.1',
  'google/gemini-3-pro-preview',
  'anthropic/claude-sonnet-4.5',
  'x-ai/grok-4',
];
const DEFAULT_CHAIRMAN_MODEL = 'google/gemini-3-pro-preview';

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfigSidebar, setShowConfigSidebar] = useState(false);
  const [telemetry, setTelemetry] = useState({ latency: null, tokensPerSecond: null });

  // Get the latest assistant message for display
  const latestMessage = currentConversation?.messages?.filter(m => m.role === 'assistant').slice(-1)[0] || null;

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load conversation details when selected
  useEffect(() => {
    if (currentConversationId) {
      loadConversation(currentConversationId);
    }
  }, [currentConversationId]);

  const loadConversations = async () => {
    try {
      const convs = await api.listConversations();
      setConversations(convs);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadConversation = async (id) => {
    try {
      const conv = await api.getConversation(id);
      setCurrentConversation(conv);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleNewSession = async () => {
    try {
      const newConv = await api.createConversation();
      setConversations([
        { id: newConv.id, created_at: newConv.created_at, message_count: 0 },
        ...conversations,
      ]);
      setCurrentConversationId(newConv.id);
      setCurrentConversation(newConv);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const handleSubmitQuery = async (content) => {
    // If no conversation exists, create one first
    let convId = currentConversationId;
    if (!convId) {
      try {
        const newConv = await api.createConversation();
        setConversations([
          { id: newConv.id, created_at: newConv.created_at, message_count: 0 },
          ...conversations,
        ]);
        setCurrentConversationId(newConv.id);
        setCurrentConversation(newConv);
        convId = newConv.id;
      } catch (error) {
        console.error('Failed to create conversation:', error);
        return;
      }
    }

    setIsLoading(true);
    const startTime = Date.now();

    try {
      // Optimistically add user message to UI
      const userMessage = { role: 'user', content };
      setCurrentConversation((prev) => ({
        ...prev,
        messages: [...(prev?.messages || []), userMessage],
      }));

      // Create a partial assistant message that will be updated progressively
      const assistantMessage = {
        role: 'assistant',
        stage1: null,
        stage2: null,
        stage3: null,
        metadata: null,
        error: null,
        loading: {
          stage1: false,
          stage2: false,
          stage3: false,
        },
      };

      // Add the partial assistant message
      setCurrentConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
      }));

      // Send message with streaming
      await api.sendMessageStream(convId, content, (eventType, event) => {
        switch (eventType) {
          case 'stage1_start':
            setCurrentConversation((prev) => {
              const messages = [...prev.messages];
              const lastMsg = messages[messages.length - 1];
              lastMsg.loading.stage1 = true;
              return { ...prev, messages };
            });
            break;

          case 'stage1_complete':
            setCurrentConversation((prev) => {
              const messages = [...prev.messages];
              const lastMsg = messages[messages.length - 1];
              lastMsg.stage1 = event.data;
              lastMsg.loading.stage1 = false;
              return { ...prev, messages };
            });
            // Update telemetry
            setTelemetry(t => ({
              ...t,
              latency: Date.now() - startTime,
            }));
            break;

          case 'stage2_start':
            setCurrentConversation((prev) => {
              const messages = [...prev.messages];
              const lastMsg = messages[messages.length - 1];
              lastMsg.loading.stage2 = true;
              return { ...prev, messages };
            });
            break;

          case 'stage2_complete':
            setCurrentConversation((prev) => {
              const messages = [...prev.messages];
              const lastMsg = messages[messages.length - 1];
              lastMsg.stage2 = event.data;
              lastMsg.metadata = event.metadata;
              lastMsg.loading.stage2 = false;
              return { ...prev, messages };
            });
            break;

          case 'stage3_start':
            setCurrentConversation((prev) => {
              const messages = [...prev.messages];
              const lastMsg = messages[messages.length - 1];
              lastMsg.loading.stage3 = true;
              return { ...prev, messages };
            });
            break;

          case 'stage3_complete':
            setCurrentConversation((prev) => {
              const messages = [...prev.messages];
              const lastMsg = messages[messages.length - 1];
              lastMsg.stage3 = event.data;
              lastMsg.loading.stage3 = false;
              return { ...prev, messages };
            });
            break;

          case 'title_complete':
            // Reload conversations to get updated title
            loadConversations();
            break;

          case 'complete':
            // Stream complete, reload conversations list
            loadConversations();
            setIsLoading(false);
            break;

          case 'error':
            console.error('Stream error:', event.message);
            setCurrentConversation((prev) => {
              const messages = [...prev.messages];
              const lastMsg = messages[messages.length - 1];
              lastMsg.error = event.message || 'An error occurred while processing your request';
              lastMsg.loading = { stage1: false, stage2: false, stage3: false };
              return { ...prev, messages };
            });
            setIsLoading(false);
            break;

          default:
            console.log('Unknown event type:', eventType);
        }
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setCurrentConversation((prev) => {
        const messages = [...prev.messages];
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          lastMsg.error = error.message || 'Failed to communicate with the server. Please try again.';
          lastMsg.loading = { stage1: false, stage2: false, stage3: false };
        }
        return { ...prev, messages };
      });
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    // TODO: Implement regeneration
    console.log('Regenerate requested');
  };

  const handleExport = () => {
    // TODO: Implement export
    console.log('Export requested');
  };

  const handleConfigChange = (config) => {
    // TODO: Implement config update to backend
    console.log('Config changed:', config);
  };

  return (
    <>
      <Header
        currentSession={currentConversation}
        onNewSession={handleNewSession}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <LeftSidebar
          councilModels={DEFAULT_COUNCIL_MODELS}
          chairmanModel={DEFAULT_CHAIRMAN_MODEL}
          telemetry={telemetry}
        />

        <MainContent
          session={currentConversation}
          message={latestMessage}
          onSubmit={handleSubmitQuery}
          isLoading={isLoading}
          onRegenerate={handleRegenerate}
          onExport={handleExport}
        />

        <RightSidebar
          isOpen={showConfigSidebar}
          onClose={() => setShowConfigSidebar(false)}
          onConfigChange={handleConfigChange}
        />
      </div>
    </>
  );
}

export default App;
