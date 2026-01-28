import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Dimensions, Animated } from 'react-native';
import { useHabits } from '../context/HabitsContext';
import HabitCard3D from '../components/HabitCard3D';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_SPACING = CARD_WIDTH + 16;

export default function ProgressScreen() {
  const { activeHabits } = useHabits();
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          My <Text style={styles.headerTitleAccent}>Habits</Text>
        </Text>
      </View>

      {/* Habits Carousel */}
      {activeHabits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No habits added yet</Text>
          <Text style={styles.emptySubtext}>
            Add habits from the Explore page to track your progress
          </Text>
        </View>
      ) : (
        <View style={styles.carouselContainer}>
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_SPACING}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            {activeHabits.map((habit, index) => (
              <HabitCard3D
                key={habit.id}
                habit={habit}
                index={index}
                scrollX={scrollX}
              />
            ))}
          </Animated.ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 65 : 45,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: '#000',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerTitleAccent: {
    color: '#F66729',
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  carouselContent: {
    paddingLeft: (width - CARD_WIDTH) / 2 - 8,
    paddingRight: (width - CARD_WIDTH) / 2 - 8,
    paddingBottom: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  bottomSpacing: {
    height: 20,
  },
});
