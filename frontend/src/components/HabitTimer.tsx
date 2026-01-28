import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HabitTimerProps {
  startDate: Date;
}

export default function HabitTimer({ startDate }: HabitTimerProps) {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeElapsed({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <View style={styles.timerContainer}>
      <View style={styles.timeUnit}>
        <Text style={styles.timeValue}>{formatNumber(timeElapsed.days)}</Text>
        <Text style={styles.timeLabel}>days</Text>
      </View>
      <Text style={styles.separator}>:</Text>
      <View style={styles.timeUnit}>
        <Text style={styles.timeValue}>{formatNumber(timeElapsed.hours)}</Text>
        <Text style={styles.timeLabel}>hours</Text>
      </View>
      <Text style={styles.separator}>:</Text>
      <View style={styles.timeUnit}>
        <Text style={styles.timeValue}>{formatNumber(timeElapsed.minutes)}</Text>
        <Text style={styles.timeLabel}>min</Text>
      </View>
      <Text style={styles.separator}>:</Text>
      <View style={styles.timeUnit}>
        <Text style={styles.timeValue}>{formatNumber(timeElapsed.seconds)}</Text>
        <Text style={styles.timeLabel}>sec</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeUnit: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F66729',
    letterSpacing: 1,
    textShadowColor: '#F66729',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  timeLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(246, 103, 41, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  separator: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F66729',
    marginHorizontal: 2,
    textShadowColor: '#F66729',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});

