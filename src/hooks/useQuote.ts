import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Quote, getRandomQuote, getRandomQuoteByCategory } from '../constants/quotes';

const QUOTE_STORAGE_KEY = 'dailyQuote';
const QUOTE_DATE_KEY = 'dailyQuoteDate';

/**
 * Custom hook for managing daily quotes
 */
export const useQuote = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if we need a new quote for today
  const shouldGetNewQuote = useCallback(async (): Promise<boolean> => {
    try {
      const lastQuoteDate = await AsyncStorage.getItem(QUOTE_DATE_KEY);
      const today = new Date().toDateString();
      
      return !lastQuoteDate || lastQuoteDate !== today;
    } catch (error) {
      console.warn('Error checking quote date:', error);
      return true; // Default to getting new quote if error
    }
  }, []);

  // Load or generate daily quote
  const loadDailyQuote = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const needNewQuote = await shouldGetNewQuote();
      
      if (needNewQuote) {
        // Generate new quote for today
        const newQuote = getRandomQuote();
        const today = new Date().toDateString();
        
        // Save new quote and date
        await AsyncStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(newQuote));
        await AsyncStorage.setItem(QUOTE_DATE_KEY, today);
        
        setCurrentQuote(newQuote);
      } else {
        // Load existing quote for today
        const savedQuote = await AsyncStorage.getItem(QUOTE_STORAGE_KEY);
        if (savedQuote) {
          setCurrentQuote(JSON.parse(savedQuote));
        } else {
          // Fallback - generate new quote
          const newQuote = getRandomQuote();
          setCurrentQuote(newQuote);
        }
      }
    } catch (error) {
      console.warn('Error loading daily quote:', error);
      // Fallback to random quote without storage
      setCurrentQuote(getRandomQuote());
    } finally {
      setIsLoading(false);
    }
  }, [shouldGetNewQuote]);

  // Get a quote from specific category
  const getQuoteByCategory = useCallback((category: Quote['category']) => {
    return getRandomQuoteByCategory(category);
  }, []);

  // Force refresh quote (for testing or manual refresh)
  const refreshQuote = useCallback(async () => {
    try {
      const newQuote = getRandomQuote();
      const today = new Date().toDateString();
      
      await AsyncStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(newQuote));
      await AsyncStorage.setItem(QUOTE_DATE_KEY, today);
      
      setCurrentQuote(newQuote);
    } catch (error) {
      console.warn('Error refreshing quote:', error);
      setCurrentQuote(getRandomQuote());
    }
  }, []);

  // Initialize quote on first load
  useEffect(() => {
    loadDailyQuote();
  }, [loadDailyQuote]);

  return {
    currentQuote,
    isLoading,
    refreshQuote,
    getQuoteByCategory,
  };
};