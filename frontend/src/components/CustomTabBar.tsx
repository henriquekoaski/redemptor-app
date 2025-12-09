import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  Animated,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { Home, CalendarRange, Flame, Plus, Search, Route } from 'lucide-react-native';

type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  CreateHabit: undefined;
};

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width * 0.9; // 90% of screen width
const TAB_BAR_HEIGHT = 72;
const ICON_SIZE = 22;
const LABEL_SIZE = 11;
const FLAME_SIZE = 40;
const PLUS_SIZE = 14;

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Get all 5 tabs
  const tabs = state.routes;
  const tabConfig = [
    { name: 'Home', icon: Home, label: 'Home' },
    { name: 'Planner', icon: CalendarRange, label: 'Planner' },
    { name: 'FireAction', icon: Flame, label: '' }, // Center button, no label
    { name: 'Explore', icon: Search, label: 'Explore' },
    { name: 'Journey', icon: Route, label: 'Journey' },
  ];

  const handleFireActionPress = () => {
    // Animate scale on press using React Native Animated
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
    ]).start();

    // Navigate to CreateHabit screen in the root stack
    rootNavigation.navigate('CreateHabit');
  };

  const flameAnimatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  return (
    <View style={styles.container}>
      <BlurView
        intensity={80}
        tint="dark"
        style={styles.blurContainer}
      >
        <View style={styles.tabBar}>
          {tabs.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const config = tabConfig[index];

            // Handle FireAction button separately
            if (route.name === 'FireAction') {
              return (
                <Animated.View
                  key={route.key}
                  style={[styles.fireActionButton, flameAnimatedStyle]}
                >
                  <TouchableOpacity
                    onPress={handleFireActionPress}
                    activeOpacity={0.8}
                    style={styles.fireActionTouchable}
                  >
                    <config.icon
                      size={FLAME_SIZE}
                      color="#FF6B35"
                      strokeWidth={2.5}
                    />
                    <View style={styles.plusOverlay}>
                      <Plus
                        size={PLUS_SIZE}
                        color="#fff"
                        strokeWidth={3}
                      />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            }

            // Regular tabs
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const IconComponent = config.icon;
            const iconColor = isFocused ? '#fff' : '#999';

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={styles.tabButton}
              >
                <IconComponent
                  size={ICON_SIZE}
                  color={iconColor}
                  strokeWidth={isFocused ? 2.5 : 2}
                />
                {config.label ? (
                  <Text
                    style={[
                      styles.tabLabel,
                      isFocused && styles.tabLabelFocused,
                    ]}
                  >
                    {config.label}
                  </Text>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    pointerEvents: 'box-none',
  },
  blurContainer: {
    width: TAB_BAR_WIDTH,
    borderRadius: TAB_BAR_HEIGHT / 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  tabBar: {
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent dark overlay
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  tabLabel: {
    fontSize: LABEL_SIZE,
    color: '#999',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  tabLabelFocused: {
    color: '#fff',
    fontWeight: '600',
  },
  fireActionButton: {
    width: FLAME_SIZE + 8,
    height: FLAME_SIZE + 8,
    marginTop: -FLAME_SIZE * 0.4, // Extends above the bar
    position: 'relative',
  },
  fireActionTouchable: {
    width: FLAME_SIZE + 8,
    height: FLAME_SIZE + 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -PLUS_SIZE / 2,
    marginLeft: -PLUS_SIZE / 2,
    backgroundColor: 'rgba(255, 107, 53, 0.9)',
    borderRadius: PLUS_SIZE / 2,
    width: PLUS_SIZE + 4,
    height: PLUS_SIZE + 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
});
