import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import HabitTimer from './HabitTimer';
import { ActiveHabit } from '../context/HabitsContext';

interface HabitBarProps {
  habit: ActiveHabit;
}

export default function HabitBar({ habit }: HabitBarProps) {
  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        <View style={styles.content}>
          {/* Habit Name */}
          <View style={styles.nameContainer}>
            <Text style={styles.habitName} numberOfLines={1}>
              {habit.title}
            </Text>
          </View>

          {/* Timer */}
          <View style={styles.timerContainer}>
            <HabitTimer startDate={habit.startDate} />
          </View>

          {/* Punishment */}
          <View style={styles.punishmentContainer}>
            <Text style={styles.punishmentValue}>${habit.punishment}</Text>
          </View>

          {/* Status */}
          <View style={styles.statusContainer}>
            <Text style={styles.statusEmoji}>🔥</Text>
          </View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  blurContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  nameContainer: {
    flex: 2,
    marginRight: 12,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  timerContainer: {
    flex: 3,
    alignItems: 'center',
    marginRight: 12,
  },
  punishmentContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 12,
  },
  punishmentValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statusContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusEmoji: {
    fontSize: 24,
    textShadowColor: '#F66729',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});

