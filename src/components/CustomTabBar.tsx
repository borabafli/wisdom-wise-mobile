import React, { useState, useRef, useCallback } from 'react';
import { View, TouchableOpacity, Text, Platform, Image, Animated, Easing, PanResponder } from 'react-native';
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
  const [circleAnimations, setCircleAnimations] = useState<{[key: string]: Animated.Value}>({});
  const insets = useSafeAreaInsets();
  
  // Simple single circle animation effect
  const createCircleEffect = useCallback((tabIndex: number) => {
    const circleAnim = new Animated.Value(0);
    const key = `${tabIndex}-${Date.now()}`;
    
    setCircleAnimations(prev => ({ 
      ...prev, 
      [key]: circleAnim
    }));
    
    // Animate single circle - slower for more graceful effect
    Animated.timing(circleAnim, {
      toValue: 1,
      duration: 900, // Slower from 700ms
      useNativeDriver: true,
    }).start((finished) => {
      // Clean up after animation only if it completed
      if (finished) {
        setCircleAnimations(prev => {
          const newAnims = { ...prev };
          delete newAnims[key];
          return newAnims;
        });
      }
    });
    
    return key;
  }, []);
  
  // Simple touch handling for circle effect
  const handleTabPress = useCallback((tabIndex: number, onPress: () => void) => {
    // Create circle effect
    createCircleEffect(tabIndex);
    
    // Call original onPress
    onPress();
  }, [createCircleEffect]);


  // Debug logging to track modal state
  React.useEffect(() => {
    console.log('QuickActions modal state:', showQuickActions);
  }, [showQuickActions]);

  // Cleanup animations on unmount
  React.useEffect(() => {
    return () => {
      // Clear any remaining animations
      setCircleAnimations({});
    };
  }, []);

  // Simple tab icon component with basic fade transition
  const TabIcon: React.FC<{ 
    selectedIcon: any; 
    unselectedIcon: any; 
    isFocused: boolean; 
  }> = ({ selectedIcon, unselectedIcon, isFocused }) => {
    const fadeAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
    
    React.useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }, [isFocused]);

    return (
      <View style={{ width: 30, height: 30, position: 'relative' }}>
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
            style={{ width: 30, height: 30 }}
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
            style={{ width: 30, height: 30 }}
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
      selectedIcon: require('../../assets/navigation-icons/First Version/selected-home-blue.png'),
      unselectedIcon: require('../../assets/navigation-icons/First Version/unselected-home-blue.png')
    },
    {
      name: 'Exercises',
      label: 'Exercises',
      selectedIcon: require('../../assets/navigation-icons/First Version/selected-exercises-blue.png'),
      unselectedIcon: require('../../assets/navigation-icons/First Version/unselected-exercises-blue.png')
    },
    {
      name: 'Journal',
      label: 'Journal',
      selectedIcon: require('../../assets/navigation-icons/First Version/selected-journal-blue.png'),
      unselectedIcon: require('../../assets/navigation-icons/First Version/unselected-journal-blue.png')
    },
    {
      name: 'Insights',
      label: 'Insights',
      selectedIcon: require('../../assets/navigation-icons/First Version/selected-insights-blue.png'),
      unselectedIcon: require('../../assets/navigation-icons/First Version/unselected-insights-blue.png')
    },
    {
      name: 'Profile',
      label: 'Profile',
      selectedIcon: require('../../assets/navigation-icons/First Version/selected-profile-blue.png'),
      unselectedIcon: require('../../assets/navigation-icons/First Version/unselected-profile-blue.png')
    }
  ];

  return (
    <>
      
      <LinearGradient
        colors={['#ffffff', '#ffffff']}
        style={[styles.tabBarGradient, { paddingBottom: (insets.bottom || 0) + 40 }]}
      >
        <View style={styles.tabBarContent}>
            {/* All 5 tabs */}
            {tabs.map((tab, index) => {
              const isFocused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: state.routes[index].key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  handleTabPress(index, () => navigation.navigate(tab.name));
                } else {
                  handleTabPress(index, () => {});
                }
              };

              return (
                <TouchableOpacity
                  key={tab.name}
                  onPress={onPress}
                  style={[styles.tabButton]}
                  activeOpacity={0.7}
                >
                  {/* Circle animation */}
                  {Object.entries(circleAnimations).map(([key, anim]) => {
                    if (!key.startsWith(`${index}-`) || !anim) return null;
                    return (
                      <Animated.View
                        key={key}
                        style={[
                          styles.tabCircle1, // Use the first circle style
                          {
                            opacity: anim.interpolate({
                              inputRange: [0, 0.5, 1],
                              outputRange: [0.8, 0.4, 0],
                            }),
                            transform: [
                              {
                                scale: anim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0.85, 1],
                                })
                              }
                            ],
                          }
                        ]}
                      />
                    );
                  })}

                  <View style={{ zIndex: 10 }}>
                    <TabIcon
                      selectedIcon={tab.selectedIcon}
                      unselectedIcon={tab.unselectedIcon}
                      isFocused={isFocused}
                    />
                  </View>
                  <Text
                    style={[
                      styles.tabLabel,
                      {
                        color: isFocused ? '#0d9488' : '#6B7280',
                        fontWeight: isFocused ? '600' : '500',
                        zIndex: 10,
                      }
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