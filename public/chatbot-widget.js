// SmartFlow Africa Chatbot Widget
(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    webhookUrl: 'https://smartflowafrica.com/webhook/chatbot',
    botName: 'SmartFlow Assistant',
    welcomeMessage: "Hi there! 👋 Welcome to SmartFlow Africa!\n\nWe automate business operations across Nigeria - from restaurants to healthcare, retail to hospitality.\n\nWhat industry are you in?",
    welcomeQuickReplies: ['🍽️ Restaurants & Food', '🏨 Hotels & Hospitality', '🏥 Healthcare & Clinics', '🏪 Retail & E-commerce', '� Other'],
    autoGreetingDelay: 30000,
    badgeDelay: 3000,
    typingDelay: 1500,
    debounceDelay: 500,
    requestTimeout: 10000,
    maxRetries: 2,
  };

  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const state = {
    isOpen: false,
    hasOpened: false,
    conversationId: null,
    messages: [],
    isTyping: false,
    userInfo: {},
  };

  // ============================================
  // INJECT STYLES
  // ============================================
  const styles = `
    #smartflow-chatbot * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .sf-chat-button {
      position: fixed !important;
      bottom: 24px !important;
      right: 24px !important;
      width: 68px !important;
      height: 68px !important;
      border-radius: 50% !important;
      background: linear-gradient(135deg, #0066FF 0%, #0052E0 50%, #00D9A6 100%) !important;
      border: none !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 8px 32px rgba(0, 102, 255, 0.35), 0 4px 16px rgba(0, 217, 166, 0.2) !important;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
      z-index: 2147483646 !important;
      animation: sf-pulse 3s ease-in-out infinite !important;
      backdrop-filter: blur(10px) !important;
    }

    .sf-chat-button:hover {
      transform: scale(1.12) rotate(5deg) !important;
      box-shadow: 0 12px 48px rgba(0, 102, 255, 0.5), 0 8px 24px rgba(0, 217, 166, 0.3) !important;
    }

    .sf-chat-button:active {
      transform: scale(1.05) !important;
      transition: all 0.1s ease !important;
    }

    .sf-chat-button svg {
      width: 32px !important;
      height: 32px !important;
      fill: white !important;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)) !important;
      transition: transform 0.3s ease !important;
    }

    .sf-chat-button:hover svg {
      transform: scale(1.1) !important;
    }

    @keyframes sf-pulse {
      0%, 100% { 
        transform: scale(1);
        box-shadow: 0 8px 32px rgba(0, 102, 255, 0.35), 0 4px 16px rgba(0, 217, 166, 0.2);
      }
      50% { 
        transform: scale(1.06);
        box-shadow: 0 12px 40px rgba(0, 102, 255, 0.45), 0 6px 20px rgba(0, 217, 166, 0.3);
      }
    }

    .sf-notification-badge {
      position: absolute !important;
      top: -2px !important;
      right: -2px !important;
      background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%) !important;
      color: white !important;
      width: 24px !important;
      height: 24px !important;
      border-radius: 50% !important;
      border: 3px solid white !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 12px !important;
      font-weight: 700 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      animation: sf-badge-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), sf-badge-pulse 2s ease-in-out 0.4s infinite !important;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4) !important;
    }

    @keyframes sf-badge-appear {
      from { 
        transform: scale(0) rotate(-180deg);
        opacity: 0;
      }
      to { 
        transform: scale(1) rotate(0deg);
        opacity: 1;
      }
    }

    @keyframes sf-badge-pulse {
      0%, 100% { 
        transform: scale(1);
      }
      50% { 
        transform: scale(1.15);
      }
    }

    .sf-chat-window {
      position: fixed !important;
      bottom: 110px !important;
      right: 24px !important;
      width: 420px !important;
      height: 650px !important;
      max-height: calc(100vh - 140px) !important;
      background: #FFFFFF !important;
      border-radius: 20px !important;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2), 0 8px 32px rgba(0, 102, 255, 0.15) !important;
      display: none !important;
      flex-direction: column !important;
      z-index: 2147483647 !important;
      animation: sf-slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif !important;
      overflow: hidden !important;
      border: 1px solid rgba(0, 102, 255, 0.1) !important;
    }

    .sf-chat-window.sf-open {
      display: flex !important;
    }

    @keyframes sf-slide-up {
      from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .sf-chat-header {
      background: linear-gradient(135deg, #0066FF 0%, #0052E0 50%, #00D9A6 100%) !important;
      color: white !important;
      padding: 24px !important;
      border-radius: 20px 20px 0 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      box-shadow: 0 4px 20px rgba(0, 102, 255, 0.15) !important;
      position: relative !important;
      overflow: hidden !important;
    }

    .sf-chat-header::before {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%) !important;
      animation: sf-header-shine 3s ease-in-out infinite !important;
    }

    @keyframes sf-header-shine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .sf-chat-header-left {
      display: flex !important;
      align-items: center !important;
      gap: 14px !important;
      z-index: 1 !important;
      position: relative !important;
    }

    .sf-bot-avatar {
      width: 46px !important;
      height: 46px !important;
      background: rgba(255, 255, 255, 0.25) !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-weight: 700 !important;
      font-size: 18px !important;
      letter-spacing: -0.5px !important;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15), inset 0 2px 8px rgba(255, 255, 255, 0.2) !important;
      border: 2px solid rgba(255, 255, 255, 0.3) !important;
      transition: all 0.3s ease !important;
    }

    .sf-bot-avatar:hover {
      transform: rotate(360deg) scale(1.05) !important;
    }

    .sf-bot-info h3 {
      font-size: 17px !important;
      font-weight: 700 !important;
      margin-bottom: 4px !important;
      letter-spacing: -0.3px !important;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    }

    .sf-bot-status {
      font-size: 13px !important;
      opacity: 0.95 !important;
      display: flex !important;
      align-items: center !important;
      gap: 7px !important;
      font-weight: 500 !important;
    }

    .sf-status-dot {
      width: 9px !important;
      height: 9px !important;
      background: #10B981 !important;
      border-radius: 50% !important;
      animation: sf-pulse-dot 2s ease-in-out infinite !important;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7) !important;
    }

    @keyframes sf-pulse-dot {
      0%, 100% { 
        opacity: 1;
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      }
      50% { 
        opacity: 0.7;
        box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
      }
    }

    .sf-chat-controls {
      display: flex !important;
      gap: 10px !important;
      z-index: 1 !important;
      position: relative !important;
    }

    .sf-control-btn {
      background: rgba(255, 255, 255, 0.2) !important;
      border: none !important;
      width: 36px !important;
      height: 36px !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
      backdrop-filter: blur(10px) !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
    }

    .sf-control-btn:hover {
      background: rgba(255, 255, 255, 0.35) !important;
      transform: scale(1.15) rotate(90deg) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
    }

    .sf-control-btn:active {
      transform: scale(0.95) !important;
      transition: all 0.1s ease !important;
    }

    .sf-control-btn svg {
      width: 20px !important;
      height: 20px !important;
      fill: white !important;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)) !important;
      transition: transform 0.3s ease !important;
    }

    .sf-messages-area {
      flex: 1 !important;
      overflow-y: auto !important;
      padding: 24px !important;
      background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%) !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 18px !important;
      scroll-behavior: smooth !important;
    }

    .sf-messages-area::-webkit-scrollbar {
      width: 8px !important;
    }

    .sf-messages-area::-webkit-scrollbar-track {
      background: rgba(226, 232, 240, 0.3) !important;
      border-radius: 10px !important;
      margin: 8px 0 !important;
    }

    .sf-messages-area::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #0066FF 0%, #00D9A6 100%) !important;
      border-radius: 10px !important;
      border: 2px solid transparent !important;
      background-clip: padding-box !important;
      transition: all 0.3s ease !important;
    }

    .sf-messages-area::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #0052E0 0%, #00C494 100%) !important;
      background-clip: padding-box !important;
      box-shadow: 0 0 8px rgba(0, 102, 255, 0.4) !important;
    }

    .sf-messages-area::-webkit-scrollbar-thumb:active {
      background: linear-gradient(180deg, #0041B8 0%, #00A87C 100%) !important;
      background-clip: padding-box !important;
    }

    .sf-message {
      display: flex !important;
      flex-direction: column !important;
      max-width: 75% !important;
      animation: sf-message-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    }

    @keyframes sf-message-appear {
      from {
        opacity: 0;
        transform: translateY(15px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .sf-message.sf-user {
      align-self: flex-end !important;
      align-items: flex-end !important;
    }

    .sf-message.sf-bot {
      align-self: flex-start !important;
      align-items: flex-start !important;
    }

    .sf-message-bubble {
      padding: 14px 18px !important;
      border-radius: 20px !important;
      font-size: 15px !important;
      line-height: 1.6 !important;
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
      font-weight: 400 !important;
      letter-spacing: -0.2px !important;
      transition: all 0.3s ease !important;
    }

    .sf-message-bubble:hover {
      transform: translateY(-1px) !important;
    }

    .sf-message.sf-user .sf-message-bubble {
      background: linear-gradient(135deg, #0066FF 0%, #0052E0 100%) !important;
      color: white !important;
      border-radius: 20px 20px 4px 20px !important;
      box-shadow: 0 4px 16px rgba(0, 102, 255, 0.25), 0 2px 8px rgba(0, 102, 255, 0.15) !important;
    }

    .sf-message.sf-user .sf-message-bubble:hover {
      box-shadow: 0 6px 20px rgba(0, 102, 255, 0.35), 0 3px 10px rgba(0, 102, 255, 0.2) !important;
    }

    .sf-message.sf-bot .sf-message-bubble {
      background: white !important;
      color: #1F2937 !important;
      border-radius: 20px 20px 20px 4px !important;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04) !important;
      border: 1px solid rgba(0, 102, 255, 0.08) !important;
    }

    .sf-message.sf-bot .sf-message-bubble:hover {
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06) !important;
      border-color: rgba(0, 102, 255, 0.15) !important;
    }

    .sf-message-timestamp {
      font-size: 12px !important;
      color: #94A3B8 !important;
      margin-top: 6px !important;
      padding: 0 6px !important;
      font-weight: 500 !important;
      letter-spacing: 0.2px !important;
    }

    .sf-typing-indicator {
      display: flex !important;
      gap: 6px !important;
      padding: 16px 20px !important;
      background: white !important;
      border-radius: 20px 20px 20px 4px !important;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04) !important;
      width: fit-content !important;
      border: 1px solid rgba(0, 102, 255, 0.08) !important;
      animation: sf-typing-appear 0.3s ease !important;
    }

    @keyframes sf-typing-appear {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .sf-typing-dot {
      width: 10px !important;
      height: 10px !important;
      background: linear-gradient(135deg, #0066FF 0%, #00D9A6 100%) !important;
      border-radius: 50% !important;
      animation: sf-typing-bounce 1.4s ease-in-out infinite !important;
      box-shadow: 0 2px 4px rgba(0, 102, 255, 0.3) !important;
    }

    .sf-typing-dot:nth-child(2) {
      animation-delay: 0.2s !important;
    }

    .sf-typing-dot:nth-child(3) {
      animation-delay: 0.4s !important;
    }

    @keyframes sf-typing-bounce {
      0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.7;
      }
      30% {
        transform: translateY(-10px);
        opacity: 1;
      }
    }

    .sf-quick-replies {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 10px !important;
      margin-top: 12px !important;
    }

    .sf-quick-reply-btn {
      background: white !important;
      border: 2px solid #0066FF !important;
      color: #0066FF !important;
      padding: 10px 18px !important;
      border-radius: 24px !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
      font-family: inherit !important;
      box-shadow: 0 2px 8px rgba(0, 102, 255, 0.15) !important;
      letter-spacing: -0.2px !important;
      position: relative !important;
      overflow: hidden !important;
    }

    .sf-quick-reply-btn::before {
      content: '' !important;
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      width: 0 !important;
      height: 0 !important;
      border-radius: 50% !important;
      background: rgba(0, 102, 255, 0.1) !important;
      transform: translate(-50%, -50%) !important;
      transition: width 0.5s ease, height 0.5s ease !important;
    }

    .sf-quick-reply-btn:hover::before {
      width: 300px !important;
      height: 300px !important;
    }

    .sf-quick-reply-btn:hover {
      background: linear-gradient(135deg, #0066FF 0%, #0052E0 100%) !important;
      color: white !important;
      transform: translateY(-2px) scale(1.05) !important;
      box-shadow: 0 6px 20px rgba(0, 102, 255, 0.35) !important;
      border-color: #0066FF !important;
    }

    .sf-quick-reply-btn:active {
      transform: translateY(0) scale(1) !important;
      transition: all 0.1s ease !important;
    }

    .sf-quick-reply-btn:focus {
      outline: 3px solid rgba(0, 102, 255, 0.3) !important;
      outline-offset: 2px !important;
    }

    .sf-input-area {
      padding: 20px 24px !important;
      background: white !important;
      border-top: 1px solid rgba(0, 102, 255, 0.12) !important;
      border-radius: 0 0 20px 20px !important;
      display: flex !important;
      gap: 14px !important;
      align-items: flex-end !important;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.04) !important;
    }

    .sf-input-wrapper {
      flex: 1 !important;
      position: relative !important;
    }

    .sf-message-input {
      width: 100% !important;
      min-height: 48px !important;
      max-height: 140px !important;
      padding: 14px 18px !important;
      border: 2px solid #E2E8F0 !important;
      border-radius: 24px !important;
      font-size: 15px !important;
      font-family: inherit !important;
      resize: none !important;
      outline: none !important;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
      line-height: 1.5 !important;
      letter-spacing: -0.2px !important;
      font-weight: 400 !important;
      background: #F8FAFC !important;
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.04) !important;
    }

    .sf-message-input::placeholder {
      color: #94A3B8 !important;
      font-weight: 400 !important;
    }

    .sf-message-input:hover {
      border-color: #CBD5E1 !important;
      background: white !important;
    }

    .sf-message-input:focus {
      border-color: #0066FF !important;
      background: white !important;
      box-shadow: 0 0 0 4px rgba(0, 102, 255, 0.1), inset 0 2px 6px rgba(0, 0, 0, 0.04) !important;
      transform: translateY(-1px) !important;
    }

    .sf-send-btn {
      width: 48px !important;
      height: 48px !important;
      background: linear-gradient(135deg, #0066FF 0%, #0052E0 100%) !important;
      border: none !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
      flex-shrink: 0 !important;
      box-shadow: 0 4px 16px rgba(0, 102, 255, 0.3) !important;
      position: relative !important;
      overflow: hidden !important;
    }

    .sf-send-btn::before {
      content: '' !important;
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      width: 100% !important;
      height: 100% !important;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%) !important;
      transform: translate(-50%, -50%) scale(0) !important;
      transition: transform 0.5s ease !important;
    }

    .sf-send-btn:hover::before {
      transform: translate(-50%, -50%) scale(1.5) !important;
    }

    .sf-send-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #0052E0 0%, #0041B8 100%) !important;
      transform: scale(1.1) rotate(15deg) !important;
      box-shadow: 0 6px 24px rgba(0, 102, 255, 0.45) !important;
    }

    .sf-send-btn:active:not(:disabled) {
      transform: scale(1) !important;
      transition: all 0.1s ease !important;
    }

    .sf-send-btn:disabled {
      opacity: 0.5 !important;
      cursor: not-allowed !important;
      box-shadow: 0 2px 8px rgba(0, 102, 255, 0.15) !important;
      background: linear-gradient(135deg, #94A3B8 0%, #64748B 100%) !important;
    }

    .sf-send-btn:focus {
      outline: 3px solid rgba(0, 102, 255, 0.3) !important;
      outline-offset: 3px !important;
    }

    .sf-send-btn svg {
      width: 22px !important;
      height: 22px !important;
      fill: white !important;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)) !important;
      transition: transform 0.3s ease !important;
      position: relative !important;
      z-index: 1 !important;
    }

    .sf-send-btn:hover svg {
      transform: translateX(2px) !important;
    }

    .sf-hidden {
      display: none !important;
    }

    /* ============================================ */
    /* RESPONSIVE DESIGN - ALL DEVICES */
    /* ============================================ */

    /* Extra Small Phones (Portrait) - 320px to 374px */
    @media (max-width: 374px) {
      .sf-chat-button {
        bottom: 16px !important;
        right: 16px !important;
        width: 56px !important;
        height: 56px !important;
      }

      .sf-chat-button svg {
        width: 26px !important;
        height: 26px !important;
      }

      .sf-chat-window {
        bottom: 0 !important;
        right: 0 !important;
        left: 0 !important;
        top: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        max-height: 100vh !important;
        border-radius: 0 !important;
        border: none !important;
      }

      .sf-chat-header {
        border-radius: 0 !important;
        padding: 16px !important;
        padding-top: max(16px, env(safe-area-inset-top)) !important;
      }

      .sf-bot-avatar {
        width: 38px !important;
        height: 38px !important;
        font-size: 16px !important;
      }

      .sf-bot-info h3 {
        font-size: 15px !important;
      }

      .sf-bot-status {
        font-size: 12px !important;
      }

      .sf-control-btn {
        width: 32px !important;
        height: 32px !important;
      }

      .sf-messages-area {
        padding: 12px !important;
        gap: 14px !important;
      }

      .sf-message {
        max-width: 90% !important;
      }

      .sf-message-bubble {
        font-size: 14px !important;
        padding: 10px 14px !important;
        border-radius: 16px !important;
      }

      .sf-message.sf-user .sf-message-bubble {
        border-radius: 16px 16px 4px 16px !important;
      }

      .sf-message.sf-bot .sf-message-bubble {
        border-radius: 16px 16px 16px 4px !important;
      }

      .sf-input-area {
        border-radius: 0 !important;
        padding: 12px !important;
        padding-bottom: max(12px, env(safe-area-inset-bottom)) !important;
        gap: 10px !important;
      }

      .sf-message-input {
        font-size: 16px !important;
        min-height: 42px !important;
        padding: 12px 14px !important;
      }

      .sf-send-btn {
        width: 42px !important;
        height: 42px !important;
      }

      .sf-quick-reply-btn {
        font-size: 12px !important;
        padding: 8px 14px !important;
      }
    }

    /* Small Phones (Portrait) - 375px to 479px (iPhone SE, iPhone 12/13/14 mini) */
    @media (min-width: 375px) and (max-width: 479px) {
      .sf-chat-button {
        bottom: 18px !important;
        right: 18px !important;
        width: 60px !important;
        height: 60px !important;
      }

      .sf-chat-window {
        bottom: 0 !important;
        right: 0 !important;
        left: 0 !important;
        top: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        max-height: 100vh !important;
        border-radius: 0 !important;
        border: none !important;
      }

      .sf-chat-header {
        border-radius: 0 !important;
        padding: 18px !important;
        padding-top: max(18px, env(safe-area-inset-top)) !important;
      }

      .sf-messages-area {
        padding: 14px !important;
        gap: 15px !important;
      }

      .sf-message {
        max-width: 88% !important;
      }

      .sf-message-bubble {
        font-size: 14px !important;
        padding: 11px 15px !important;
      }

      .sf-input-area {
        border-radius: 0 !important;
        padding: 14px !important;
        padding-bottom: max(14px, env(safe-area-inset-bottom)) !important;
        gap: 11px !important;
      }

      .sf-message-input {
        font-size: 16px !important;
        min-height: 44px !important;
      }

      .sf-send-btn {
        width: 44px !important;
        height: 44px !important;
      }

      .sf-quick-reply-btn {
        font-size: 13px !important;
        padding: 9px 15px !important;
      }
    }

    /* Standard Phones (Portrait) - 480px to 767px (Most iPhones, Android phones) */
    @media (min-width: 480px) and (max-width: 767px) {
      .sf-chat-button {
        bottom: 20px !important;
        right: 20px !important;
        width: 64px !important;
        height: 64px !important;
      }

      .sf-chat-window {
        bottom: 0 !important;
        right: 0 !important;
        left: 0 !important;
        top: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        max-height: 100vh !important;
        border-radius: 0 !important;
        border: none !important;
      }

      .sf-chat-header {
        border-radius: 0 !important;
        padding: 20px !important;
        padding-top: max(20px, env(safe-area-inset-top)) !important;
      }

      .sf-messages-area {
        padding: 16px !important;
        gap: 16px !important;
      }

      .sf-message {
        max-width: 85% !important;
      }

      .sf-message-bubble {
        font-size: 14px !important;
        padding: 12px 16px !important;
      }

      .sf-input-area {
        border-radius: 0 !important;
        padding: 16px !important;
        padding-bottom: max(16px, env(safe-area-inset-bottom)) !important;
        gap: 12px !important;
      }

      .sf-message-input {
        font-size: 16px !important;
        min-height: 46px !important;
      }

      .sf-send-btn {
        width: 46px !important;
        height: 46px !important;
      }

      .sf-quick-reply-btn {
        font-size: 13px !important;
        padding: 9px 16px !important;
      }
    }

    /* Tablets (Portrait) - 768px to 991px (iPad, Android tablets) */
    @media (min-width: 768px) and (max-width: 991px) {
      .sf-chat-button {
        bottom: 24px !important;
        right: 24px !important;
        width: 66px !important;
        height: 66px !important;
      }

      .sf-chat-window {
        width: 400px !important;
        height: 620px !important;
        bottom: 108px !important;
        right: 24px !important;
        max-height: calc(100vh - 140px) !important;
      }

      .sf-chat-header {
        padding: 22px !important;
      }

      .sf-messages-area {
        padding: 20px !important;
        gap: 17px !important;
      }

      .sf-message {
        max-width: 78% !important;
      }

      .sf-message-bubble {
        font-size: 14px !important;
        padding: 13px 17px !important;
      }

      .sf-input-area {
        padding: 18px 20px !important;
      }

      .sf-send-btn {
        width: 46px !important;
        height: 46px !important;
      }
    }

    /* Tablets (Landscape) & Small Laptops - 992px to 1199px */
    @media (min-width: 992px) and (max-width: 1199px) {
      .sf-chat-button {
        bottom: 24px !important;
        right: 24px !important;
        width: 68px !important;
        height: 68px !important;
      }

      .sf-chat-window {
        width: 410px !important;
        height: 640px !important;
        bottom: 110px !important;
        right: 24px !important;
        max-height: calc(100vh - 140px) !important;
      }

      .sf-chat-header {
        padding: 23px !important;
      }

      .sf-messages-area {
        padding: 22px !important;
        gap: 17px !important;
      }

      .sf-message {
        max-width: 76% !important;
      }
    }

    /* Standard Laptops & Desktops - 1200px to 1439px */
    @media (min-width: 1200px) and (max-width: 1439px) {
      .sf-chat-window {
        width: 420px !important;
        height: 650px !important;
      }

      .sf-message {
        max-width: 75% !important;
      }
    }

    /* Large Desktops - 1440px to 1919px */
    @media (min-width: 1440px) and (max-width: 1919px) {
      .sf-chat-window {
        width: 440px !important;
        height: 680px !important;
        bottom: 110px !important;
        right: 30px !important;
      }

      .sf-chat-button {
        bottom: 30px !important;
        right: 30px !important;
        width: 70px !important;
        height: 70px !important;
      }

      .sf-chat-header {
        padding: 26px !important;
      }

      .sf-messages-area {
        padding: 26px !important;
        gap: 20px !important;
      }

      .sf-message-bubble {
        font-size: 15px !important;
        padding: 15px 19px !important;
      }
    }

    /* Ultra-Wide & 4K Screens - 1920px and above */
    @media (min-width: 1920px) {
      .sf-chat-window {
        width: 460px !important;
        height: 700px !important;
        bottom: 120px !important;
        right: 40px !important;
      }

      .sf-chat-button {
        bottom: 40px !important;
        right: 40px !important;
        width: 72px !important;
        height: 72px !important;
      }

      .sf-chat-button svg {
        width: 34px !important;
        height: 34px !important;
      }

      .sf-chat-header {
        padding: 28px !important;
      }

      .sf-bot-avatar {
        width: 48px !important;
        height: 48px !important;
        font-size: 19px !important;
      }

      .sf-bot-info h3 {
        font-size: 18px !important;
      }

      .sf-messages-area {
        padding: 28px !important;
        gap: 20px !important;
      }

      .sf-message-bubble {
        font-size: 16px !important;
        padding: 16px 20px !important;
      }

      .sf-input-area {
        padding: 22px 26px !important;
      }

      .sf-message-input {
        font-size: 16px !important;
        min-height: 52px !important;
        padding: 16px 20px !important;
      }

      .sf-send-btn {
        width: 52px !important;
        height: 52px !important;
      }

      .sf-send-btn svg {
        width: 24px !important;
        height: 24px !important;
      }
    }

    /* Phone Landscape Mode - Special handling */
    @media (max-width: 991px) and (orientation: landscape) and (max-height: 500px) {
      .sf-chat-window {
        bottom: 0 !important;
        right: 0 !important;
        left: 0 !important;
        top: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        max-height: 100vh !important;
        border-radius: 0 !important;
      }

      .sf-chat-header {
        padding: 12px 16px !important;
        padding-left: max(16px, env(safe-area-inset-left)) !important;
        padding-right: max(16px, env(safe-area-inset-right)) !important;
      }

      .sf-bot-avatar {
        width: 36px !important;
        height: 36px !important;
        font-size: 15px !important;
      }

      .sf-bot-info h3 {
        font-size: 14px !important;
      }

      .sf-bot-status {
        font-size: 11px !important;
      }

      .sf-messages-area {
        padding: 12px 16px !important;
      }

      .sf-input-area {
        padding: 10px 16px !important;
        padding-left: max(16px, env(safe-area-inset-left)) !important;
        padding-right: max(16px, env(safe-area-inset-right)) !important;
      }

      .sf-message-input {
        min-height: 38px !important;
      }
    }

    /* Accessibility - Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .sf-chat-button,
      .sf-chat-window,
      .sf-message,
      .sf-typing-indicator,
      .sf-quick-reply-btn,
      .sf-control-btn,
      .sf-send-btn,
      .sf-notification-badge {
        animation: none !important;
        transition: none !important;
      }
    }

    /* High Contrast Mode */
    @media (prefers-contrast: high) {
      .sf-chat-button {
        border: 3px solid white !important;
      }

      .sf-message-bubble {
        border: 2px solid currentColor !important;
      }

      .sf-message-input {
        border: 3px solid #0066FF !important;
      }
    }

    /* Dark Mode Support (Future Enhancement) */
    @media (prefers-color-scheme: dark) {
      .sf-messages-area {
        background: linear-gradient(180deg, #1E293B 0%, #0F172A 100%) !important;
      }

      .sf-message.sf-bot .sf-message-bubble {
        background: #334155 !important;
        color: #F1F5F9 !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }

      .sf-message-input {
        background: #334155 !important;
        border-color: #475569 !important;
        color: white !important;
      }

      .sf-message-input::placeholder {
        color: #94A3B8 !important;
      }

      .sf-message-timestamp {
        color: #CBD5E1 !important;
      }
    }
  `;

  // Inject styles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  
  function generateId() {
    return 'sf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  function saveToStorage(key, data) {
    try {
      localStorage.setItem('smartflow_' + key, JSON.stringify(data));
    } catch (e) {
      console.error('LocalStorage save failed:', e);
    }
  }

  function loadFromStorage(key) {
    try {
      const data = localStorage.getItem('smartflow_' + key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('LocalStorage load failed:', e);
      return null;
    }
  }

  // ============================================
  // DOM CREATION
  // ============================================
  
  function createChatButton() {
    const button = document.createElement('button');
    button.className = 'sf-chat-button';
    button.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      </svg>
    `;
    
    button.addEventListener('click', toggleChat);
    return button;
  }

  function createNotificationBadge() {
    const badge = document.createElement('div');
    badge.className = 'sf-notification-badge sf-hidden';
    badge.textContent = '1';
    return badge;
  }

  function createChatWindow() {
    const window = document.createElement('div');
    window.className = 'sf-chat-window';
    window.innerHTML = `
      <div class="sf-chat-header">
        <div class="sf-chat-header-left">
          <div class="sf-bot-avatar">SF</div>
          <div class="sf-bot-info">
            <h3>${CONFIG.botName}</h3>
            <div class="sf-bot-status">
              <span class="sf-status-dot"></span>
              <span>Online</span>
            </div>
          </div>
        </div>
        <div class="sf-chat-controls">
          <button class="sf-control-btn" id="sf-close-btn" title="Close">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="sf-messages-area" id="sf-messages"></div>
      <div class="sf-input-area">
        <div class="sf-input-wrapper">
          <textarea 
            class="sf-message-input" 
            id="sf-input" 
            placeholder="Type your message..."
            rows="1"
            maxlength="1000"
          ></textarea>
        </div>
        <button class="sf-send-btn" id="sf-send-btn">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    `;

    window.querySelector('#sf-close-btn').addEventListener('click', closeChat);
    window.querySelector('#sf-send-btn').addEventListener('click', sendMessage);
    
    const input = window.querySelector('#sf-input');
    input.addEventListener('keydown', handleInputKeydown);
    input.addEventListener('input', handleInputChange);

    return window;
  }

  // ============================================
  // MESSAGE FUNCTIONS
  // ============================================
  
  function addMessage(text, sender = 'bot', quickReplies = null, timestamp = new Date()) {
    const message = {
      id: generateId(),
      text,
      sender,
      quickReplies,
      timestamp
    };

    state.messages.push(message);
    saveToStorage('messages', state.messages);
    renderMessage(message);
    scrollToBottom();
  }

  function renderMessage(message) {
    const messagesArea = document.getElementById('sf-messages');
    const messageEl = document.createElement('div');
    messageEl.className = `sf-message sf-${message.sender}`;
    
    messageEl.innerHTML = `
      <div class="sf-message-bubble">${escapeHtml(message.text)}</div>
      <div class="sf-message-timestamp">${formatTime(message.timestamp)}</div>
    `;

    if (message.quickReplies && message.quickReplies.length > 0) {
      const quickRepliesEl = document.createElement('div');
      quickRepliesEl.className = 'sf-quick-replies';
      
      message.quickReplies.forEach(reply => {
        const btn = document.createElement('button');
        btn.className = 'sf-quick-reply-btn';
        btn.textContent = reply;
        btn.addEventListener('click', () => handleQuickReply(reply));
        quickRepliesEl.appendChild(btn);
      });

      messageEl.appendChild(quickRepliesEl);
    }

    messagesArea.appendChild(messageEl);
  }

  function showTypingIndicator() {
    const messagesArea = document.getElementById('sf-messages');
    const indicator = document.createElement('div');
    indicator.className = 'sf-message sf-bot';
    indicator.id = 'sf-typing-indicator';
    indicator.innerHTML = `
      <div class="sf-typing-indicator">
        <div class="sf-typing-dot"></div>
        <div class="sf-typing-dot"></div>
        <div class="sf-typing-dot"></div>
      </div>
    `;
    messagesArea.appendChild(indicator);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const indicator = document.getElementById('sf-typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
  }

  function scrollToBottom() {
    const messagesArea = document.getElementById('sf-messages');
    setTimeout(() => {
      messagesArea.scrollTop = messagesArea.scrollHeight;
    }, 100);
  }

  // ============================================
  // CHAT FUNCTIONS
  // ============================================
  
  function toggleChat() {
    if (state.isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }

  function openChat() {
    const chatWindow = document.querySelector('.sf-chat-window');
    const badge = document.querySelector('.sf-notification-badge');
    
    chatWindow.classList.add('sf-open');
    badge.classList.add('sf-hidden');
    state.isOpen = true;

    if (!state.hasOpened) {
      state.hasOpened = true;
      saveToStorage('has_opened', true);
      addMessage(CONFIG.welcomeMessage, 'bot', CONFIG.welcomeQuickReplies);
    }

    document.getElementById('sf-input').focus();
  }

  function closeChat() {
    const chatWindow = document.querySelector('.sf-chat-window');
    chatWindow.classList.remove('sf-open');
    state.isOpen = false;
  }

  function handleInputKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleInputChange(e) {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  function handleQuickReply(reply) {
    document.querySelectorAll('.sf-quick-replies').forEach(el => el.remove());
    addMessage(reply, 'user');
    getBotResponse(reply);
  }

  async function sendMessage() {
    const input = document.getElementById('sf-input');
    const message = input.value.trim();

    if (!message) return;

    addMessage(message, 'user');
    input.value = '';
    input.style.height = 'auto';

    await getBotResponse(message);
  }

  async function getBotResponse(message) {
    showTypingIndicator();

    try {
      await new Promise(resolve => setTimeout(resolve, CONFIG.typingDelay));
      hideTypingIndicator();
      addMessage("Thanks for your message! Our team will be in touch soon. In the meantime, feel free to explore our website or book a demo!", 'bot', ['📅 Book a demo', '💰 View pricing', '📚 Learn more']);
    } catch (error) {
      hideTypingIndicator();
      addMessage("Sorry, I'm having trouble connecting. Please try again or contact us at hello@smartflowafrica.com", 'bot');
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  
  function loadState() {
    state.conversationId = loadFromStorage('conversation_id');
    if (!state.conversationId) {
      state.conversationId = generateId();
      saveToStorage('conversation_id', state.conversationId);
    }

    const savedMessages = loadFromStorage('messages');
    if (savedMessages && savedMessages.length > 0) {
      state.messages = savedMessages;
      savedMessages.forEach(msg => renderMessage(msg));
    }

    state.hasOpened = loadFromStorage('has_opened') || false;
  }

  function setupAutoGreeting() {
    if (!state.hasOpened) {
      setTimeout(() => {
        if (!state.hasOpened && !state.isOpen) {
          const badge = document.querySelector('.sf-notification-badge');
          badge.classList.remove('sf-hidden');
        }
      }, CONFIG.badgeDelay);
    }
  }

  function init() {
    const container = document.createElement('div');
    container.id = 'smartflow-chatbot';
    document.body.appendChild(container);
    
    const button = createChatButton();
    const badge = createNotificationBadge();
    const window = createChatWindow();
    
    button.appendChild(badge);
    container.appendChild(button);
    container.appendChild(window);

    loadState();
    setupAutoGreeting();

    console.log('SmartFlow Chatbot initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
