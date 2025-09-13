import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Platform, Image, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaWrapper } from './SafeAreaWrapper';
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
  const insets = useSafeAreaInsets();


  // Debug logging to track modal state
  React.useEffect(() => {
    console.log('QuickActions modal state:', showQuickActions);
  }, [showQuickActions]);

  // Tab icon component with smooth fade transition
  const TabIcon: React.FC<{ 
    selectedIcon: any; 
    unselectedIcon: any; 
    isFocused: boolean; 
  }> = ({ selectedIcon, unselectedIcon, isFocused }) => {
    const fadeAnim = React.useRef(new Animated.Value(isFocused ? 1 : 0)).current;
    
    React.useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [isFocused]);

    return (
      <View style={{ width: 44, height: 44, position: 'relative' }}>
        <Animated.View
          style={{
            position: 'absolute',
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          }}
        >
          <Image 
            source={unselectedIcon} 
            style={{ width: 44, height: 44 }}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.View
          style={{
            position: 'absolute',
            opacity: fadeAnim,
          }}
        >
          <Image 
            source={selectedIcon} 
            style={{ width: 44, height: 44 }}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    );
  };

  const tabs = [
    { 
      name: 'Home', 
      label: 'Home',
      selectedIcon: require('../../assets/navigation-icons/selected-home.png'),
      unselectedIcon: require('../../assets/navigation-icons/unselected-home.png')
    },
    { 
      name: 'Exercises', 
      label: 'Exercises',
      selectedIcon: require('../../assets/navigation-icons/selected-exercises.png'),
      unselectedIcon: require('../../assets/navigation-icons/unselected-exercises.png')
    },
    { 
      name: 'Insights', 
      label: 'Insights',
      selectedIcon: require('../../assets/navigation-icons/selected-insights.png'),
      unselectedIcon: require('../../assets/navigation-icons/unselected-insights.png')
    },
    { 
      name: 'Profile', 
      label: 'Profile',
      selectedIcon: require('../../assets/navigation-icons/selected-profile.png'),
      unselectedIcon: require('../../assets/navigation-icons/unselected-profile.png')
    }
  ];

  return (
    <>
      
      <LinearGradient
        colors={[...gradients.card.primary]}
        style={[styles.tabBarGradient, { paddingBottom: (insets.bottom || 0) + 40 }]}
      >
        <View style={styles.tabBarContent}>
            {/* First 2 tabs */}
            {tabs.slice(0, 2).map((tab, index) => {
              const isFocused = state.index === index;

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
                  style={styles.tabButton}
                  activeOpacity={0.7}
                >
                  <TabIcon 
                    selectedIcon={tab.selectedIcon}
                    unselectedIcon={tab.unselectedIcon}
                    isFocused={isFocused}
                  />
                  <Text 
                    style={[
                      styles.tabLabel,
                      { color: isFocused ? '#0d9488' : '#6B7280' }
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
              <Image 
                source={require('../../assets/navigation-icons/plus-button.png')} 
                style={{ width: 64, height: 64 }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Last 2 tabs */}
            {tabs.slice(2).map((tab, index) => {
              const actualIndex = index + 2; // Adjust for slice
              const isFocused = state.index === actualIndex;

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
                  style={styles.tabButton}
                  activeOpacity={0.7}
                >
                  <TabIcon 
                    selectedIcon={tab.selectedIcon}
                    unselectedIcon={tab.unselectedIcon}
                    isFocused={isFocused}
                  />
                  <Text 
                    style={[
                      styles.tabLabel,
                      { color: isFocused ? '#0d9488' : '#6B7280' }
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
      </LinearGradient>

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