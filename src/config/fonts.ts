import * as Font from 'expo-font';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import {
  SourceSerifPro_400Regular,
  SourceSerifPro_600SemiBold,
  SourceSerifPro_700Bold,
} from '@expo-google-fonts/source-serif-pro';
import {
  Lora_400Regular,
  Lora_500Medium,
  Lora_600SemiBold,
  Lora_700Bold,
} from '@expo-google-fonts/lora';
import {
  CrimsonText_400Regular,
  CrimsonText_600SemiBold,
} from '@expo-google-fonts/crimson-text';

export const fontConfig = {
  // Primary UI font - Clean, readable for interface elements
  'Inter-Light': Inter_300Light,
  'Inter-Regular': Inter_400Regular,
  'Inter-Medium': Inter_500Medium,
  'Inter-SemiBold': Inter_600SemiBold,
  'Inter-Bold': Inter_700Bold,

  // Display font - Friendly, warm for main headings and welcome messages
  'Poppins-Regular': Poppins_400Regular,
  'Poppins-Medium': Poppins_500Medium,
  'Poppins-SemiBold': Poppins_600SemiBold,
  'Poppins-Bold': Poppins_700Bold,
  'Poppins-ExtraBold': Poppins_800ExtraBold,

  // Body font - Comfortable reading for longer text content
  'Nunito-Regular': Nunito_400Regular,
  'Nunito-Medium': Nunito_500Medium,
  'Nunito-SemiBold': Nunito_600SemiBold,
  'Nunito-Bold': Nunito_700Bold,

  // Meditation/Therapy font - Calming, therapeutic for exercise content
  'SourceSerifPro-Regular': SourceSerifPro_400Regular,
  'SourceSerifPro-SemiBold': SourceSerifPro_600SemiBold,
  'SourceSerifPro-Bold': SourceSerifPro_700Bold,

  // Mindful/Quotes font - Elegant, inspirational for quotes and reflections
  'Lora-Regular': Lora_400Regular,
  'Lora-Medium': Lora_500Medium,
  'Lora-SemiBold': Lora_600SemiBold,
  'Lora-Bold': Lora_700Bold,

  // Emphasis font - Gentle serif for special content
  'CrimsonText-Regular': CrimsonText_400Regular,
  'CrimsonText-SemiBold': CrimsonText_600SemiBold,
};

export const loadFonts = async () => {
  await Font.loadAsync(fontConfig);
};