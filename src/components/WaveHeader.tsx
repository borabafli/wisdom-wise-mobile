import React from 'react';
import { View, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface WaveHeaderProps {
  height?: number;
  colors?: string[];
}

export const WaveHeader: React.FC<WaveHeaderProps> = ({ 
  height = 350, 
  colors = ['#4A98BC', '#6BB6D6', '#87CEEB'] 
}) => {
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: -1 }}>
      <ImageBackground
        source={require('../../assets/images/wave-bg.png')}
        style={{ 
          height: height,
          width: '100%',
        }}
        resizeMode="stretch" // Stretch to fill entire width
        imageStyle={{
          width: '100%',
          height: '100%',
        }}
      />
    </View>
  );
};

export default WaveHeader;