import { useMemo } from 'react';
import { MessageFormatter } from '../utils/messageFormatter';

/**
 * Hook for message formatting logic - extracted from MessageItem component
 * Provides optimized formatting functions for different message types
 */
export const useMessageFormatting = () => {
  const formatMessageContent = useMemo(() => {
    return (content: string, textStyle: any, isWelcome = false) => {
      const cleanedContent = MessageFormatter.cleanAIMessageContent(content);
      return MessageFormatter.formatContent(cleanedContent, textStyle, isWelcome);
    };
  }, []);

  const cleanAIContent = useMemo(() => {
    return (content: string) => {
      return MessageFormatter.cleanAIMessageContent(content);
    };
  }, []);

  return {
    formatMessageContent,
    cleanAIContent
  };
};

export default useMessageFormatting;