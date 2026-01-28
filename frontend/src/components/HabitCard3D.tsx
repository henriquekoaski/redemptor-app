import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ImageBackground, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import HabitTimer from './HabitTimer';
import { ActiveHabit } from '../context/HabitsContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

interface HabitCard3DProps {
  habit: ActiveHabit;
  index: number;
  scrollX: Animated.Value;
}

export default function HabitCard3D({ habit, index, scrollX }: HabitCard3DProps) {
  const cardSpacing = CARD_WIDTH + 16; // CARD_WIDTH + margin (8 on each side)
  const inputRange = [(index - 1) * cardSpacing, index * cardSpacing, (index + 1) * cardSpacing];
  
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.88, 1, 0.88],
    extrapolate: 'clamp',
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.5, 1, 0.5],
    extrapolate: 'clamp',
  });

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [20, 0, 20],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          width: CARD_WIDTH,
          transform: [{ scale }, { translateY }],
          opacity,
        },
      ]}
    >
      <BlurView intensity={100} tint="dark" style={styles.blurContainer}>
        <View style={styles.cardContent}>
          {/* Background Image */}
          <ImageBackground
            source={habit.imageSource}
            style={styles.cardBackground}
            imageStyle={styles.cardImageStyle}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)']}
              style={styles.imageOverlay}
            />
            
            {/* Card Content */}
            <View style={styles.contentContainer}>
              {/* Habit Name - At the top */}
              <View style={styles.nameSection}>
                <Text style={styles.habitName} numberOfLines={2}>
                  {habit.title}
                </Text>
              </View>

              {/* Middle Info Row */}
              <View style={styles.middleRow}>
                {/* Punishment */}
                <View style={styles.punishmentSection}>
                  <Text style={styles.punishmentLabel}>Punishment</Text>
                  <Text style={styles.punishmentValue}>${habit.punishment}</Text>
                </View>

                {/* Status */}
                <View style={styles.statusSection}>
                  <Text style={styles.statusLabel}>Status</Text>
                  <Text style={styles.statusEmoji}>🔥</Text>
                </View>
              </View>

              {/* Timer Section - At the bottom */}
              <View style={styles.timerSection}>
                <Text style={styles.timerLabel}>Time Elapsed</Text>
                <View style={styles.timerWrapper}>
                  <HabitTimer startDate={habit.startDate} />
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    height: CARD_HEIGHT,
    marginHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#F66729',
        shadowOffset: {
          width: 0,
          height: 25,
        },
        shadowOpacity: 0.5,
        shadowRadius: 35,
      },
      android: {
        elevation: 25,
      },
    }),
  },
  blurContainer: {
    borderRadius: 28,
    overflow: 'hidden',
    height: '100%',
  },
  cardContent: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(246, 103, 41, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  cardBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  cardImageStyle: {
    borderRadius: 28,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
  },
  contentContainer: {
    flex: 1,
    padding: 28,
    justifyContent: 'space-between',
  },
  nameSection: {
    marginBottom: 24,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  timerSection: {
    marginTop: 'auto',
  },
  habitName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 36,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  timerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  timerWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(246, 103, 41, 0.3)',
  },
  punishmentSection: {
    flex: 1,
  },
  punishmentLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  punishmentValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statusSection: {
    alignItems: 'flex-end',
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  statusEmoji: {
    fontSize: 32,
    textShadowColor: '#F66729',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
});

