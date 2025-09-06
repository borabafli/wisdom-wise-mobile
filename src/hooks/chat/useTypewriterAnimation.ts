import { useState, useRef, useCallback, useEffect } from 'react';
import { Message } from '../../services/storageService';

interface UseTypewriterAnimationReturn {
  typewriterText: string;
  isTypewriting: boolean;
  currentTypewriterMessage: Message | null;
  startTypewriterAnimation: (message: Message, fullText: string, speed?: number, onComplete?: () => void) => void;
  skipTypewriterAnimation: () => void;
  stopTypewriterAnimation: () => void;
}

export const useTypewriterAnimation = (
  onMessagesUpdate: (updater: (messages: Message[]) => Message[]) => void,
  scrollViewRef: React.RefObject<any>
): UseTypewriterAnimationReturn => {
  const [typewriterText, setTypewriterText] = useState('');
  const [isTypewriting, setIsTypewriting] = useState(false);
  const [currentTypewriterMessage, setCurrentTypewriterMessage] = useState<Message | null>(null);
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter animation for AI messages - modern and fast
  const startTypewriterAnimation = useCallback((
    message: Message, 
    fullText: string, 
    speed = 25, // Faster default speed for streaming
    onComplete?: () => void
  ) => {
    setCurrentTypewriterMessage(message);
    setTypewriterText('');
    setIsTypewriting(true);
    
    // Clear any existing timeout
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }
    
    let currentIndex = 0;
    
    // Split text into words for word-by-word streaming
    const words = fullText.split(/(\s+)/); // Keep whitespace
    let wordIndex = 0;
    
    const typeNextWord = () => {
      if (wordIndex < words.length) {
        // Add the next word (including whitespace)
        wordIndex++;
        const currentText = words.slice(0, wordIndex).join('');
        setTypewriterText(currentText);
        
        // Auto-scroll during typing
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 30);
        
        // ChatGPT-like streaming speed - very fast word appearance
        const streamingSpeed = Math.max(speed * 0.2, 10); // Very fast streaming like ChatGPT
        typewriterTimeoutRef.current = setTimeout(typeNextWord, streamingSpeed);
      } else {
        // Animation complete
        setIsTypewriting(false);
        setCurrentTypewriterMessage(null);
        setTypewriterText('');
        
        // Update the actual message content
        onMessagesUpdate(prevMessages => 
          prevMessages.map(msg => 
            msg.id === message.id 
              ? { ...msg, content: fullText, text: fullText }
              : msg
          )
        );
        
        // Final scroll to ensure everything is visible
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Call completion callback if provided
        onComplete?.();
      }
    };
    
    typeNextWord();
  }, [onMessagesUpdate, scrollViewRef]);

  // Stop typewriter animation and show full text immediately
  const skipTypewriterAnimation = useCallback(() => {
    if (currentTypewriterMessage && typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
      typewriterTimeoutRef.current = null;
      
      // Get the full text that should be displayed
      const fullText = currentTypewriterMessage.content || currentTypewriterMessage.text || '';
      
      // Update the message immediately with full content
      onMessagesUpdate(prevMessages => 
        prevMessages.map(msg => 
          msg.id === currentTypewriterMessage.id 
            ? { ...msg, content: fullText, text: fullText }
            : msg
        )
      );
      
      // Clean up animation state
      setIsTypewriting(false);
      setCurrentTypewriterMessage(null);
      setTypewriterText('');
    }
  }, [currentTypewriterMessage, onMessagesUpdate]);

  // Stop typewriter animation if needed (cleanup version)
  const stopTypewriterAnimation = useCallback(() => {
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
      typewriterTimeoutRef.current = null;
    }
    setIsTypewriting(false);
    setCurrentTypewriterMessage(null);
    setTypewriterText('');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
    };
  }, []);

  return {
    typewriterText,
    isTypewriting,
    currentTypewriterMessage,
    startTypewriterAnimation,
    skipTypewriterAnimation,
    stopTypewriterAnimation,
  };
};

export default useTypewriterAnimation;