import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import Stage3 from './Stage3';
import './ChatInterface.css';

export default function ChatInterface({
  conversation,
  onSendMessage,
  isLoading,
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!conversation) {
    return (
      <div className="chat-interface">
        <div className="empty-state">
          <h2>Welcome to LLM Council</h2>
          <p>Create a new conversation to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      <div className="messages-container">
        {conversation.messages.length === 0 ? (
          <div className="empty-state">
            <h2>Welcome to LLM Council</h2>
            <p className="subtitle">Get answers from multiple AI models working together</p>
            <div className="how-it-works">
              <h3>How it works:</h3>
              <div className="stage-preview">
                <div className="stage-item">
                  <span className="stage-number">1</span>
                  <div className="stage-info">
                    <strong>Individual Responses</strong>
                    <p>Multiple AI models independently answer your question</p>
                  </div>
                </div>
                <div className="stage-item">
                  <span className="stage-number">2</span>
                  <div className="stage-info">
                    <strong>Peer Review</strong>
                    <p>Each model anonymously evaluates and ranks all responses</p>
                  </div>
                </div>
                <div className="stage-item">
                  <span className="stage-number">3</span>
                  <div className="stage-info">
                    <strong>Final Synthesis</strong>
                    <p>A chairman model synthesizes the best collective answer</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="cta">Ask a question below to get started</p>
          </div>
        ) : (
          conversation.messages.map((msg, index) => (
            <div key={index} className="message-group">
              {msg.role === 'user' ? (
                <div className="user-message">
                  <div className="message-label">You</div>
                  <div className="message-content">
                    <div className="markdown-content">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="assistant-message">
                  <div className="message-label">LLM Council</div>

                  {/* Error Display */}
                  {msg.error && (
                    <div className="error-message">
                      <div className="error-icon">⚠️</div>
                      <div className="error-content">
                        <div className="error-title">Error</div>
                        <div className="error-text">{msg.error}</div>
                      </div>
                    </div>
                  )}

                  {/* Progress Indicator */}
                  {!msg.error && (msg.loading?.stage1 || msg.loading?.stage2 || msg.loading?.stage3) && (
                    <div className="progress-indicator">
                      <div className={`progress-step ${msg.stage1 ? 'completed' : msg.loading?.stage1 ? 'active' : 'pending'}`}>
                        <div className="step-circle">1</div>
                        <div className="step-label">Individual Responses</div>
                      </div>
                      <div className="progress-line"></div>
                      <div className={`progress-step ${msg.stage2 ? 'completed' : msg.loading?.stage2 ? 'active' : 'pending'}`}>
                        <div className="step-circle">2</div>
                        <div className="step-label">Peer Rankings</div>
                      </div>
                      <div className="progress-line"></div>
                      <div className={`progress-step ${msg.stage3 ? 'completed' : msg.loading?.stage3 ? 'active' : 'pending'}`}>
                        <div className="step-circle">3</div>
                        <div className="step-label">Final Synthesis</div>
                      </div>
                    </div>
                  )}

                  {/* Stage 1 */}
                  {msg.loading?.stage1 && (
                    <div className="stage-loading">
                      <div className="spinner"></div>
                      <span>Collecting responses from multiple AI models...</span>
                    </div>
                  )}
                  {msg.stage1 && <Stage1 responses={msg.stage1} />}

                  {/* Stage 2 */}
                  {msg.loading?.stage2 && (
                    <div className="stage-loading">
                      <div className="spinner"></div>
                      <span>Models are evaluating each other's responses anonymously...</span>
                    </div>
                  )}
                  {msg.stage2 && (
                    <Stage2
                      rankings={msg.stage2}
                      labelToModel={msg.metadata?.label_to_model}
                      aggregateRankings={msg.metadata?.aggregate_rankings}
                    />
                  )}

                  {/* Stage 3 */}
                  {msg.loading?.stage3 && (
                    <div className="stage-loading">
                      <div className="spinner"></div>
                      <span>Chairman synthesizing the best collective answer...</span>
                    </div>
                  )}
                  {msg.stage3 && <Stage3 finalResponse={msg.stage3} />}
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Consulting the council...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="input-form" onSubmit={handleSubmit}>
        <textarea
          className="message-input"
          placeholder="Ask your question... (Shift+Enter for new line, Enter to send)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={3}
        />
        <button
          type="submit"
          className="send-button"
          disabled={!input.trim() || isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
}
