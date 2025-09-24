import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft } from 'lucide-react-native';
import { JournalEntry } from '../services/journalStorageService';
import { useTranslation } from 'react-i18next';

interface JournalEntryDetailScreenProps {
  route: {
    params: {
      entry: JournalEntry;
    };
  };
  navigation: any;
}

const JournalEntryDetailScreen: React.FC<JournalEntryDetailScreenProps> = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { entry } = route.params;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaWrapper style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <StatusBar style="dark" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={{
          fontFamily: 'Ubuntu-Medium',
          fontSize: 18,
          fontWeight: '600',
          color: '#374151',
          textAlign: 'center',
          flex: 1,
        }}>
          {t('journal.journalEntry')}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Date and Time */}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: '#E5E7EB',
        }}>
          <Text style={{
            fontFamily: 'Ubuntu-Medium',
            fontSize: 16,
            color: '#374151',
            marginBottom: 4,
          }}>
            {formatDate(entry.date)}
          </Text>
          <Text style={{
            fontFamily: 'Ubuntu-Regular',
            fontSize: 14,
            color: '#6B7280',
          }}>
            {formatTime(entry.date)}
          </Text>
          {entry.isPolished && (
            <View style={{
              backgroundColor: '#FEF3C7',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
              alignSelf: 'flex-start',
              marginTop: 8,
            }}>
              <Text style={{
                fontFamily: 'Ubuntu-Medium',
                fontSize: 12,
                color: '#92400E',
              }}>
                {t('journal.polished')}
              </Text>
            </View>
          )}
        </View>

        {/* Initial Prompt */}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: '#E5E7EB',
        }}>
          <Text style={{
            fontFamily: 'Ubuntu-Medium',
            fontSize: 14,
            color: '#6B7280',
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}>
            {t('journal.initialPrompt')}
          </Text>
          <Text style={{
            fontFamily: 'Ubuntu-Regular',
            fontSize: 16,
            lineHeight: 24,
            color: '#374151',
          }}>
            {entry.initialPrompt}
          </Text>
        </View>

        {/* Journal Entries */}
        {entry.entries.map((journalEntry, index) => (
          <View key={index} style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#E5E7EB',
          }}>
            <Text style={{
              fontFamily: 'Ubuntu-Medium',
              fontSize: 14,
              color: '#6B7280',
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}>
              {t('journal.question')} {index + 1}
            </Text>
            <Text style={{
              fontFamily: 'Ubuntu-Medium',
              fontSize: 16,
              lineHeight: 24,
              color: '#374151',
              marginBottom: 12,
            }}>
              {journalEntry.prompt}
            </Text>
            <Text style={{
              fontFamily: 'Ubuntu-Regular',
              fontSize: 16,
              lineHeight: 24,
              color: '#4B5563',
            }}>
              {journalEntry.response}
            </Text>
          </View>
        ))}

        {/* Summary */}
        <View style={{
          backgroundColor: '#F0F9FF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: '#BAE6FD',
        }}>
          <Text style={{
            fontFamily: 'Ubuntu-Medium',
            fontSize: 14,
            color: '#0369A1',
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}>
            {t('journal.summary')}
          </Text>
          <Text style={{
            fontFamily: 'Ubuntu-Regular',
            fontSize: 16,
            lineHeight: 24,
            color: '#0F172A',
          }}>
            {entry.summary}
          </Text>
        </View>

        {/* Insights */}
        {entry.insights.length > 0 && (
          <View style={{
            backgroundColor: '#F0FDF4',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#BBF7D0',
          }}>
            <Text style={{
              fontFamily: 'Ubuntu-Medium',
              fontSize: 14,
              color: '#15803D',
              marginBottom: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}>
              {t('journal.keyInsightsTitle')}
            </Text>
            {entry.insights.map((insight, index) => (
              <View key={index} style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: index < entry.insights.length - 1 ? 8 : 0,
              }}>
                <Text style={{
                  fontFamily: 'Ubuntu-Regular',
                  fontSize: 16,
                  color: '#15803D',
                  marginRight: 8,
                }}>
                  •
                </Text>
                <Text style={{
                  fontFamily: 'Ubuntu-Regular',
                  fontSize: 16,
                  lineHeight: 24,
                  color: '#0F172A',
                  flex: 1,
                }}>
                  {insight}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default JournalEntryDetailScreen;