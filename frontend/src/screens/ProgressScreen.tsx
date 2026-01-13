import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Trophy, Medal, Award, Star, Crown } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Mock data types
interface Achievement {
  id: string;
  icon: 'trophy' | 'medal' | 'award' | 'star' | 'crown';
  title: string;
  unlocked: boolean;
}

interface ActiveHabit {
  id: string;
  name: string;
  startDate: Date;
  status: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
  penalty: number;
}

// Achievement Component
const AchievementBadge: React.FC<{ achievement: Achievement }> = ({
  achievement,
}) => {
  const IconComponent = {
    trophy: Trophy,
    medal: Medal,
    award: Award,
    star: Star,
    crown: Crown,
  }[achievement.icon];

  return (
    <View style={styles.achievementBadge}>
      <BlurView intensity={60} tint="dark" style={styles.achievementBlur}>
        <View style={styles.achievementIconContainer}>
          <IconComponent
            size={32}
            color={achievement.unlocked ? '#F66729' : '#444'}
            strokeWidth={2}
          />
        </View>
        {achievement.unlocked && (
          <View style={styles.achievementGlow} />
        )}
      </BlurView>
    </View>
  );
};

// Timer Component
const Timer: React.FC<{ startDate: Date }> = ({ startDate }) => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTime({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <View style={styles.timerContainer}>
      <View style={styles.timerSegment}>
        <Text style={styles.timerValue}>{formatTime(time.days)}</Text>
        <Text style={styles.timerLabel}>Days</Text>
      </View>
      <Text style={styles.timerSeparator}>:</Text>
      <View style={styles.timerSegment}>
        <Text style={styles.timerValue}>{formatTime(time.hours)}</Text>
        <Text style={styles.timerLabel}>Hours</Text>
      </View>
      <Text style={styles.timerSeparator}>:</Text>
      <View style={styles.timerSegment}>
        <Text style={styles.timerValue}>{formatTime(time.minutes)}</Text>
        <Text style={styles.timerLabel}>Minutes</Text>
      </View>
      <Text style={styles.timerSeparator}>:</Text>
      <View style={styles.timerSegment}>
        <Text style={styles.timerValue}>{formatTime(time.seconds)}</Text>
        <Text style={styles.timerLabel}>Seconds</Text>
      </View>
    </View>
  );
};

// Habit Card Component
const HabitCard: React.FC<{ habit: ActiveHabit }> = ({ habit }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Beginner':
        return '#4A90E2';
      case 'Intermediate':
        return '#50C878';
      case 'Advanced':
        return '#F66729';
      case 'Elite':
        return '#FFD700';
      default:
        return '#999';
    }
  };

  return (
    <View style={styles.habitCard}>
      <BlurView intensity={80} tint="dark" style={styles.habitCardBlur}>
        <View style={styles.habitCardContent}>
          {/* Left Side - Habit Name */}
          <View style={styles.habitCardLeft}>
            <Text style={styles.habitName}>{habit.name}</Text>
          </View>

          {/* Center - Timer */}
          <View style={styles.habitCardCenter}>
            <Text style={styles.timerLabelText}>
              Timer — habit active since
            </Text>
            <Timer startDate={habit.startDate} />
          </View>

          {/* Right Side - Status & Penalty */}
          <View style={styles.habitCardRight}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(habit.status) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(habit.status) },
                ]}
              >
                {habit.status}
              </Text>
            </View>
            <Text style={styles.penaltyText}>
              Penalty: ${habit.penalty}
            </Text>
          </View>
        </View>
      </BlurView>
    </View>
  );
};

export default function ProgressScreen() {
  // Mock achievements data
  const achievements: Achievement[] = [
    { id: '1', icon: 'trophy', title: 'First Week', unlocked: true },
    { id: '2', icon: 'medal', title: 'Month Strong', unlocked: true },
    { id: '3', icon: 'award', title: 'Hundred Days', unlocked: true },
    { id: '4', icon: 'star', title: 'Elite Status', unlocked: false },
    { id: '5', icon: 'crown', title: 'Legend', unlocked: false },
  ];

  // Mock active habits data
  const activeHabits: ActiveHabit[] = [
    {
      id: '1',
      name: 'No Pornography',
      startDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000 - 30 * 60 * 1000 - 15 * 1000),
      status: 'Intermediate',
      penalty: 25,
    },
    {
      id: '2',
      name: 'Daily Exercise',
      startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000 - 8 * 60 * 60 * 1000 - 20 * 60 * 1000 - 45 * 1000),
      status: 'Advanced',
      penalty: 50,
    },
    {
      id: '3',
      name: 'Meditation',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000 - 10 * 60 * 1000 - 30 * 1000),
      status: 'Beginner',
      penalty: 15,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileContent}>
            <Text style={styles.username}>@henriquekoaski</Text>
            <View style={styles.avatarContainer}>
              <BlurView intensity={60} tint="dark" style={styles.avatarBlur}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitials}>HK</Text>
                </View>
              </BlurView>
            </View>
          </View>
        </View>

        {/* Achievements / Trophy Room Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementsContainer}
          >
            {achievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
              />
            ))}
          </ScrollView>
        </View>

        {/* Active Habits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Habits</Text>
          <View style={styles.habitsList}>
            {activeHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </View>
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 65,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  profileSection: {
    marginBottom: 48,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarBlur: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  achievementsContainer: {
    gap: 16,
    paddingRight: 24,
  },
  achievementBadge: {
    width: 100,
    height: 100,
    borderRadius: 24,
    overflow: 'hidden',
  },
  achievementBlur: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  achievementIconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(246, 103, 41, 0.1)',
    borderRadius: 24,
  },
  habitsList: {
    gap: 16,
  },
  habitCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  habitCardBlur: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  habitCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  habitCardLeft: {
    flex: 1.2,
    justifyContent: 'center',
  },
  habitName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  habitCardCenter: {
    flex: 2.5,
    alignItems: 'flex-start',
  },
  timerLabelText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#888',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  timerSegment: {
    alignItems: 'center',
    minWidth: 45,
  },
  timerValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
  },
  timerLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: '#666',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  timerSeparator: {
    fontSize: 20,
    fontWeight: '700',
    color: '#444',
    marginHorizontal: 3,
  },
  habitCardRight: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  penaltyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.2,
  },
  bottomSpacing: {
    height: 20,
  },
});

