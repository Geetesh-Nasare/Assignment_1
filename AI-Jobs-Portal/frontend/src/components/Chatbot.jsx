import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { chatbotAPI } from '../services/api';
import styled from 'styled-components';
import { 
  FaRobot, 
  FaTimes, 
  FaPaperPlane, 
  FaComments,
  FaGraduationCap,
  FaUserTie
} from 'react-icons/fa';

const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const ChatButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: ${props => props.theme.shadows.lg};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: ${props => props.theme.shadows.xl};
  }
`;

const ChatWindow = styled.div`
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: ${props => props.theme.colors.white};
  border-radius: 1rem;
  box-shadow: ${props => props.theme.shadows.xl};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(20px)'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    width: calc(100vw - 40px);
    right: -20px;
  }
`;

const ChatHeader = styled.div`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.white};
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem;
`;

const ChatTypeSelector = styled.div`
  display: flex;
  background: ${props => props.theme.colors.gray[100]};
  margin: 0.5rem 1rem;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const ChatTypeButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  border: none;
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.gray[600]};
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  ${props => props.isUser && 'flex-direction: row-reverse;'}
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background: ${props => props.isUser ? props.theme.colors.primary : props.theme.colors.gray[100]};
  color: ${props => props.isUser ? props.theme.colors.white : props.theme.colors.gray[800]};
  font-size: 0.875rem;
  line-height: 1.4;
  word-wrap: break-word;
`;

const MessageInput = styled.div`
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SendButton = styled.button`
  padding: 0.75rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.gray[500]};
  font-size: 0.75rem;
  font-style: italic;
`;

const Dot = styled.div`
  width: 4px;
  height: 4px;
  background: ${props => props.theme.colors.gray[500]};
  border-radius: 50%;
  animation: pulse 1.4s infinite;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes pulse {
    0%, 60%, 100% {
      opacity: 0.3;
    }
    30% {
      opacity: 1;
    }
  }
`;

const Chatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatType, setChatType] = useState('general');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      setMessages([{
        id: 1,
        text: "Hello! I'm your AI career assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatbotAPI.chat(inputMessage, chatType);
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const chatTypes = [
    { key: 'general', label: 'General', icon: FaComments },
    { key: 'interview', label: 'Interview', icon: FaUserTie },
    { key: 'career_advice', label: 'Career', icon: FaGraduationCap }
  ];

  if (!user) return null;

  return (
    <ChatbotContainer>
      <ChatButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaRobot />}
      </ChatButton>

      <ChatWindow isOpen={isOpen}>
        <ChatHeader>
          <ChatTitle>
            <FaRobot />
            AI Career Assistant
          </ChatTitle>
          <CloseButton onClick={() => setIsOpen(false)}>
            <FaTimes />
          </CloseButton>
        </ChatHeader>

        <ChatTypeSelector>
          {chatTypes.map(type => (
            <ChatTypeButton
              key={type.key}
              active={chatType === type.key}
              onClick={() => setChatType(type.key)}
            >
              <type.icon />
              {type.label}
            </ChatTypeButton>
          ))}
        </ChatTypeSelector>

        <MessagesContainer>
          {messages.map(message => (
            <Message key={message.id} isUser={message.isUser}>
              <MessageBubble isUser={message.isUser}>
                {message.text}
              </MessageBubble>
            </Message>
          ))}
          
          {isLoading && (
            <Message>
              <TypingIndicator>
                AI is typing
                <Dot />
                <Dot />
                <Dot />
              </TypingIndicator>
            </Message>
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <MessageInput>
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <SendButton
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
          >
            <FaPaperPlane />
          </SendButton>
        </MessageInput>
      </ChatWindow>
    </ChatbotContainer>
  );
};

export default Chatbot;