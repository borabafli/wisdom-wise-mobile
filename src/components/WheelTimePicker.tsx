import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { wheelTimePickerStyles as styles, ITEM_HEIGHT } from '../styles/components/WheelTimePicker.styles';
import { spacing } from '../styles/tokens/spacing';

interface WheelTimePickerProps {
  selectedHour: number;
  selectedMinute: number;
  selectedPeriod: 'AM' | 'PM';
  onHourChange: (hour: number) => void;
  onMinuteChange: (minute: number) => void;
  onPeriodChange: (period: 'AM' | 'PM') => void;
}

const { height } = Dimensions.get('window');
const VISIBLE_ITEMS = 3;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const WheelTimePicker: React.FC<WheelTimePickerProps> = ({
  selectedHour,
  selectedMinute,
  selectedPeriod,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
}) => {
  // Data arrays
  const hours = Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
  const minutes = Array.from({ length: 60 }, (_, i) => i).filter(i => i % 15 === 0);
  const periods = ['AM', 'PM'];

  // Scroll references
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);
  const periodScrollRef = useRef<ScrollView>(null);

  // Initialize scroll positions
  useEffect(() => {
    const centerSelectedItems = () => {
      // Center hour
      const hourIndex = hours.findIndex(h => h === selectedHour);
      if (hourIndex !== -1 && hourScrollRef.current) {
        hourScrollRef.current.scrollTo({
          y: hourIndex * ITEM_HEIGHT,
          animated: false,
        });
      }

      // Center minute
      const minuteIndex = minutes.findIndex(m => m === selectedMinute);
      if (minuteIndex !== -1 && minuteScrollRef.current) {
        minuteScrollRef.current.scrollTo({
          y: minuteIndex * ITEM_HEIGHT,
          animated: false,
        });
      }

      // Center period
      const periodIndex = periods.findIndex(p => p === selectedPeriod);
      if (periodIndex !== -1 && periodScrollRef.current) {
        periodScrollRef.current.scrollTo({
          y: periodIndex * ITEM_HEIGHT,
          animated: false,
        });
      }
    };

    // Delay to ensure components are mounted
    const timer = setTimeout(centerSelectedItems, 100);
    return () => clearTimeout(timer);
  }, [selectedHour, selectedMinute, selectedPeriod]);

  const handleScrollEnd = (
    values: any[],
    onChange: (value: any) => void,
    event: any
  ) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, values.length - 1));
    const newValue = values[clampedIndex];

    // Add haptic feedback if available
    try {
      const { HapticFeedback } = require('expo-haptics');
      HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Haptic feedback not available, continue silently
    }

    onChange(newValue);
  };

  const renderWheelItem = (
    value: any,
    index: number,
    selectedValue: any
  ) => {
    const isSelected = value === selectedValue;

    return (
      <View
        key={index}
        style={styles.wheelItem}
      >
        <Text
          style={[
            styles.wheelItemText,
            isSelected && styles.wheelItemTextSelected,
          ]}
        >
          {typeof value === 'number' ? value.toString().padStart(2, '0') : value}
        </Text>
      </View>
    );
  };

  const renderWheelColumn = (
    values: any[],
    selectedValue: any,
    onChange: (value: any) => void,
    scrollRef: React.RefObject<ScrollView>
  ) => {
    return (
      <View style={styles.wheelColumn}>
        <ScrollView
          ref={scrollRef}
          style={styles.wheelScroll}
          contentContainerStyle={styles.wheelScrollContent}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={(event) =>
            handleScrollEnd(values, onChange, event)
          }
          onScrollEndDrag={(event) =>
            handleScrollEnd(values, onChange, event)
          }
        >
          {/* Padding top and bottom for centering - 3 visible items */}
          <View style={{ height: ITEM_HEIGHT * 1 }} />
          {values.map((value, index) =>
            renderWheelItem(value, index, selectedValue)
          )}
          <View style={{ height: ITEM_HEIGHT * 1 }} />
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background focus band */}
      <View style={styles.focusBand} />

      <View style={styles.wheelPickerContainer}>
        {/* Hours */}
        {renderWheelColumn(hours, selectedHour, onHourChange, hourScrollRef)}

        {/* First Separator */}
        <Text style={styles.separator}>:</Text>

        {/* Minutes */}
        {renderWheelColumn(minutes, selectedMinute, onMinuteChange, minuteScrollRef)}

        {/* Second Separator - invisible spacer */}
        <View style={{ width: spacing[8] }} />

        {/* Period */}
        {renderWheelColumn(periods, selectedPeriod, onPeriodChange, periodScrollRef)}
      </View>
    </View>
  );
};

export default WheelTimePicker;