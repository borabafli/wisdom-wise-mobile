import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaWrapper } from './SafeAreaWrapper';
import { Home, BookOpen, Brain, User, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QuickActionsPopup from './QuickActionsPopup';
import { customTabBarStyles as styles } from '../styles/components/CustomTabBar.styles';
import { colors, gradients } from '../styles/tokens';

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
  const [showQuickActions, setShowQuickActions] = useState(false);

  const tabs = [
    { name: 'Home', icon: Home, label: 'Home' },
    { name: 'Exercises', icon: BookOpen, label: 'Exercises' },
    { name: 'Insights', icon: Brain, label: 'Insights' },
    { name: 'Profile', icon: User, label: 'Profile' }
  ];

  return (
    <>
      <SafeAreaWrapper style={styles.container} edges={['bottom']}>
        <LinearGradient
          colors={[...gradients.card.primary]}
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
                    color={isFocused ? colors.primary[700] : colors.text.secondary} 
                    strokeWidth={isFocused ? 2.5 : 2} 
                  />
                  <Text 
                    style={[
                      styles.tabLabel,
                      { color: isFocused ? colors.primary[700] : colors.text.secondary }
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Center Plus Button - Show on all tabs */}
            <TouchableOpacity
              onPress={() => setShowQuickActions(true)}
              style={styles.centerButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[...gradients.button.primary]}
                style={styles.plusButton}
              >
                <Plus size={24} color="#ffffff" strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>

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
                    color={isFocused ? colors.primary[700] : colors.text.secondary} 
                    strokeWidth={isFocused ? 2.5 : 2} 
                  />
                  <Text 
                    style={[
                      styles.tabLabel,
                      { color: isFocused ? colors.primary[700] : colors.text.secondary }
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </LinearGradient>
      </SafeAreaWrapper>

      {/* Quick Actions Popup */}
      <QuickActionsPopup 
        visible={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        onActionSelect={(action) => {
          setShowQuickActions(false);
          if (onActionSelect) {
            onActionSelect(action);
          } else {
            // Fallback behavior
            switch (action) {
              case 'chat':
              case 'voice-session':
              case 'featured-breathing':
                onNewSession();
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


export default CustomTabBar;