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
    speed = 8,
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
    
    const typeNextCharacter = () => {
      if (currentIndex < fullText.length) {
        // Modern approach: type 1-3 characters at once for more natural feel
        const charsToAdd = Math.min(
          fullText.length - currentIndex,
          Math.random() > 0.7 ? 3 : Math.random() > 0.4 ? 2 : 1
        );
        
        currentIndex += charsToAdd;
        setTypewriterText(fullText.substring(0, currentIndex));
        
        // Auto-scroll during typing (less frequently to avoid performance issues)
        if (currentIndex % 8 === 0) {
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 30);
        }
        
        // Variable speed for more natural typing rhythm
        const variableSpeed = speed + Math.random() * 4;
        typewriterTimeoutRef.current = setTimeout(typeNextCharacter, variableSpeed);
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
    
    typeNextCharacter();
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