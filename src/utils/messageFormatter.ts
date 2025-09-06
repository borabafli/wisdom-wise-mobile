import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../styles/tokens/colors';

export interface FormattedTextProps {
  content: string;
  isWelcome?: boolean;
  textStyle: any;
}

/**
 * Message formatting utility - extracted from MessageItem component
 * Handles rich text formatting for AI messages
 */
export class MessageFormatter {
  /**
   * Clean AI message content by removing suggestion chips
   */
  static cleanAIMessageContent(content: string): string {
    return content.replace(/\s*SUGGESTION_CHIPS:\s*\[[\s\S]*?\]\s*$/gi, '').trim();
  }

  /**
   * Format message content with rich text support
   */
  static formatContent(content: string, textStyle: any, isWelcome = false): React.ReactElement[] {
    const lines = content.split('\n');
    
    return lines.map((line, lineIndex) => {
      if (!line.trim()) {
        return React.createElement(View, { key: lineIndex, style: { height: 8 } });
      }
      
      // Check for titles (lines that start with # or are all caps)
      if (line.startsWith('#') || (line.length > 3 && line === line.toUpperCase() && line.length < 50)) {
        const titleText = line.startsWith('#') ? line.replace(/^#+\s*/, '') : line;
        return React.createElement(
          View, 
          { key: lineIndex, style: { marginVertical: 8 } },
          React.createElement(Text, {
            style: [textStyle, { 
              fontSize: 18, 
              fontWeight: '700', 
              color: '#1e293b',
              textAlign: 'center'
            }]
          }, titleText)
        );
      }
      
      // Check for bold text with **
      if (line.includes('**')) {
        return MessageFormatter.formatBoldText(line, lineIndex, textStyle);
      }
      
      // Check for italic text with * (but not **)
      if (line.includes('*') && !line.includes('**')) {
        return MessageFormatter.formatItalicText(line, lineIndex, textStyle);
      }
      
      // Check for bullet points (various formats)
      if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
        return MessageFormatter.formatBulletPoint(line, lineIndex, textStyle);
      }
      
      // Check for numbered lists
      if (/^\d+\. /.test(line)) {
        return MessageFormatter.formatNumberedList(line, lineIndex, textStyle);
      }
      
      // Check for emoji-heavy lines
      const emojiCount = (line.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
      if (emojiCount > 2 && line.length < 100) {
        return MessageFormatter.formatEmojiText(line, lineIndex, textStyle);
      }
      
      // Regular text
      return React.createElement(Text, {
        key: lineIndex,
        style: [textStyle, { marginVertical: 2 }]
      }, line);
    });
  }

  private static formatBoldText(line: string, lineIndex: number, textStyle: any): React.ReactElement {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return React.createElement(
      View, 
      { key: lineIndex, style: { marginVertical: 2 } },
      React.createElement(Text, { style: textStyle },
        ...parts.map((part, partIndex) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const boldText = part.replace(/\*\*/g, '');
            return React.createElement(Text, {
              key: partIndex,
              style: { fontWeight: '700', color: '#1e293b' }
            }, boldText);
          }
          return part;
        })
      )
    );
  }

  private static formatItalicText(line: string, lineIndex: number, textStyle: any): React.ReactElement {
    const parts = line.split(/(\*[^*]+\*)/g);
    return React.createElement(
      View, 
      { key: lineIndex, style: { marginVertical: 2 } },
      React.createElement(Text, { style: textStyle },
        ...parts.map((part, partIndex) => {
          if (part.startsWith('*') && part.endsWith('*')) {
            const italicText = part.replace(/\*/g, '');
            return React.createElement(Text, {
              key: partIndex,
              style: { fontStyle: 'italic', color: '#374151' }
            }, italicText);
          }
          return part;
        })
      )
    );
  }

  private static formatBulletPoint(line: string, lineIndex: number, textStyle: any): React.ReactElement {
    // Remove bullet point characters (•, -, *)
    const text = line.replace(/^[•\-\*] /, '');
    return React.createElement(
      View, 
      { key: lineIndex, style: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 4 } },
      React.createElement(View, {
        style: { 
          width: 8, 
          height: 8, 
          borderRadius: 4, 
          backgroundColor: colors.chat.bulletPoint, 
          marginTop: 7, 
          marginRight: 12 
        }
      }),
      React.createElement(Text, {
        style: [textStyle, { flex: 1, lineHeight: 22 }]
      }, text)
    );
  }

  private static formatNumberedList(line: string, lineIndex: number, textStyle: any): React.ReactElement {
    const match = line.match(/^(\d+\.) (.+)$/);
    if (match) {
      return React.createElement(
        View, 
        { key: lineIndex, style: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 3 } },
        React.createElement(Text, {
          style: [textStyle, { fontWeight: '600', color: colors.chat.bulletPoint, marginRight: 8 }]
        }, match[1]),
        React.createElement(Text, {
          style: [textStyle, { flex: 1 }]
        }, match[2])
      );
    }
    return React.createElement(Text, {
      key: lineIndex,
      style: [textStyle, { marginVertical: 2 }]
    }, line);
  }

  private static formatEmojiText(line: string, lineIndex: number, textStyle: any): React.ReactElement {
    return React.createElement(
      View, 
      { key: lineIndex, style: { marginVertical: 4 } },
      React.createElement(Text, {
        style: [textStyle, { 
          fontSize: 16, 
          textAlign: 'center',
          lineHeight: 24
        }]
      }, line)
    );
  }
}

export default MessageFormatter;