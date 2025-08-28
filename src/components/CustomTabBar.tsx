import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, BookOpen, Brain, User, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ActionPalette from './ActionPalette';

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  onNewSession: () => void;
  onActionSelect: (actionId: string) => void;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({ 
  state, 
  descriptors, 
  navigation, 
  onNewSession, 
  onActionSelect 
}) => {
  const [showActionPalette, setShowActionPalette] = useState(false);

  const tabs = [
    { name: 'Home', icon: Home, label: 'Home' },
    { name: 'Exercises', icon: BookOpen, label: 'Exercises' },
    { name: 'Insights', icon: Brain, label: 'Insights' },
    { name: 'Profile', icon: User, label: 'Profile' }
  ];

  return (
    <>
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(239, 246, 255, 0.9)']}
          style={styles.tabBarGradient}
        >
          <View style={styles.tabBarContent}>
            {/* First 2 tabs */}
            {tabs.slice(0, 2).map((tab, index) => {
              const isFocused = state.index === index;
              const Icon = tab.icon;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: state.routes[index].key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(tab.name);
                }
              };

              return (
                <TouchableOpacity
                  key={tab.name}
                  onPress={onPress}
                  style={[
                    styles.tabButton,
                    isFocused && styles.tabButtonActive
                  ]}
                  activeOpacity={0.7}
                >
                  <Icon 
                    size={22} 
                    color={isFocused ? '#1d4ed8' : '#64748b'} 
                    strokeWidth={isFocused ? 2.5 : 2} 
                  />
                  <Text 
                    style={[
                      styles.tabLabel,
                      { color: isFocused ? '#1d4ed8' : '#64748b' }
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Center Plus Button */}
            {(state.index === 0 || state.index === 1) && (
              <TouchableOpacity
                onPress={() => setShowActionPalette(true)}
                style={styles.centerButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(56, 189, 248, 0.9)', 'rgba(37, 99, 235, 0.9)']}
                  style={styles.plusButton}
                >
                  <Plus size={24} color="white" strokeWidth={2.5} />
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Last 2 tabs */}
            {tabs.slice(2).map((tab, index) => {
              const actualIndex = index + 2; // Adjust for slice
              const isFocused = state.index === actualIndex;
              const Icon = tab.icon;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: state.routes[actualIndex].key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(tab.name);
                }
              };

              return (
                <TouchableOpacity
                  key={tab.name}
                  onPress={onPress}
                  style={[
                    styles.tabButton,
                    isFocused && styles.tabButtonActive
                  ]}
                  activeOpacity={0.7}
                >
                  <Icon 
                    size={22} 
                    color={isFocused ? '#1d4ed8' : '#64748b'} 
                    strokeWidth={isFocused ? 2.5 : 2} 
                  />
                  <Text 
                    style={[
                      styles.tabLabel,
                      { color: isFocused ? '#1d4ed8' : '#64748b' }
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </LinearGradient>
      </View>
      <SafeAreaView edges={['bottom']} style={styles.bottomSafeArea} />

      {/* Action Palette */}
      <ActionPalette 
        isVisible={showActionPalette}
        onClose={() => setShowActionPalette(false)}
        onOptionSelect={(optionId) => {
          setShowActionPalette(false);
          if (onActionSelect) {
            onActionSelect(optionId);
          } else {
            // Fallback behavior
            switch (optionId) {
              case 'guided-session':
                onNewSession();
                break;
              case 'exercise-library':
                navigation.navigate('Exercises');
                break;
              default:
                onNewSession();
            }
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  tabBarGradient: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(186, 230, 253, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tabBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 16,
    minWidth: 60,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  centerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginTop: -24,
  },
  plusButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  bottomSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(239, 246, 255, 0.9)',
    zIndex: 49,
  },
});

export default CustomTabBar;