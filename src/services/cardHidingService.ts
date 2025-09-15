import AsyncStorage from '@react-native-async-storage/async-storage';

const HIDDEN_CARDS_KEY = 'hidden_exercise_cards';

export interface HiddenCard {
  exerciseId: string;
  hideType: 'permanent' | 'temporary';
  hiddenAt: number; // timestamp
  showAgainAt?: number; // timestamp for temporary hides (7 days later)
}

export class CardHidingService {
  private static async getHiddenCards(): Promise<HiddenCard[]> {
    try {
      const hiddenCardsJson = await AsyncStorage.getItem(HIDDEN_CARDS_KEY);
      if (!hiddenCardsJson) return [];
      
      const hiddenCards: HiddenCard[] = JSON.parse(hiddenCardsJson);
      
      // Clean up expired temporary hides
      const now = Date.now();
      const validCards = hiddenCards.filter(card => {
        if (card.hideType === 'temporary' && card.showAgainAt && now >= card.showAgainAt) {
          return false; // Remove expired temporary hides
        }
        return true;
      });
      
      // Save cleaned up list back to storage if any cards were removed
      if (validCards.length !== hiddenCards.length) {
        await this.saveHiddenCards(validCards);
      }
      
      return validCards;
    } catch (error) {
      console.error('Error getting hidden cards:', error);
      return [];
    }
  }

  private static async saveHiddenCards(hiddenCards: HiddenCard[]): Promise<void> {
    try {
      await AsyncStorage.setItem(HIDDEN_CARDS_KEY, JSON.stringify(hiddenCards));
    } catch (error) {
      console.error('Error saving hidden cards:', error);
    }
  }

  static async hideCard(exerciseId: string, hideType: 'permanent' | 'temporary'): Promise<void> {
    try {
      const hiddenCards = await this.getHiddenCards();
      
      // Remove existing entry for this exercise if it exists
      const filteredCards = hiddenCards.filter(card => card.exerciseId !== exerciseId);
      
      const now = Date.now();
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      
      const newHiddenCard: HiddenCard = {
        exerciseId,
        hideType,
        hiddenAt: now,
        showAgainAt: hideType === 'temporary' ? now + sevenDaysInMs : undefined,
      };
      
      filteredCards.push(newHiddenCard);
      await this.saveHiddenCards(filteredCards);
    } catch (error) {
      console.error('Error hiding card:', error);
    }
  }

  static async unhideCard(exerciseId: string): Promise<void> {
    try {
      const hiddenCards = await this.getHiddenCards();
      const filteredCards = hiddenCards.filter(card => card.exerciseId !== exerciseId);
      await this.saveHiddenCards(filteredCards);
    } catch (error) {
      console.error('Error unhiding card:', error);
    }
  }

  static async isCardHidden(exerciseId: string): Promise<boolean> {
    try {
      const hiddenCards = await this.getHiddenCards();
      return hiddenCards.some(card => card.exerciseId === exerciseId);
    } catch (error) {
      console.error('Error checking if card is hidden:', error);
      return false;
    }
  }

  static async getHiddenCardIds(): Promise<string[]> {
    try {
      const hiddenCards = await this.getHiddenCards();
      return hiddenCards.map(card => card.exerciseId);
    } catch (error) {
      console.error('Error getting hidden card IDs:', error);
      return [];
    }
  }

  static async clearAllHiddenCards(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HIDDEN_CARDS_KEY);
    } catch (error) {
      console.error('Error clearing hidden cards:', error);
    }
  }

  // Debug method to get all hidden cards with their info
  static async getAllHiddenCardsInfo(): Promise<HiddenCard[]> {
    return this.getHiddenCards();
  }
}