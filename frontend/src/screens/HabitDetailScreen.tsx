import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Habit } from '../data/habitsData';
import { ExploreStackParamList } from '../navigation/ExploreStack';
import { useHabits } from '../context/HabitsContext';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.65;

type HabitDetailRouteProp = RouteProp<ExploreStackParamList, 'HabitDetail'>;
type HabitDetailNavigationProp = NativeStackNavigationProp<ExploreStackParamList, 'HabitDetail'>;

export default function HabitDetailScreen() {
  const navigation = useNavigation<HabitDetailNavigationProp>();
  const route = useRoute<HabitDetailRouteProp>();
  const { habit } = route.params;
  const { addHabit, activeHabits } = useHabits();
  
  const isHabitAdded = activeHabits.some(h => h.id === habit.id);

  return (
    <View style={styles.container}>
      {/* Header with back button - positioned absolutely over image */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <BlurView intensity={80} tint="dark" style={styles.backButtonBlur}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </BlurView>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Habit Image at the top */}
        <View style={styles.imageContainer}>
          <Image
            source={habit.imageSource}
            style={styles.habitImage}
            resizeMode="cover"
          />
          {/* Gradient overlay at bottom of image for smooth transition */}
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.9)', '#000']}
            locations={[0.5, 0.7, 0.9, 1]}
            style={styles.gradientOverlay}
          />
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{habit.title}</Text>
        </View>

        {/* Details Section */}
        <BlurView intensity={80} tint="dark" style={styles.detailsCard}>
          <View style={styles.detailsContent}>
            <Text style={styles.sectionTitle}>About this habit</Text>
            <Text style={styles.description}>
              Start building this habit to improve your daily routine and achieve your goals. 
              Track your progress and stay consistent to see long-term benefits.
            </Text>

            <View style={styles.benefitsSection}>
              <Text style={styles.sectionTitle}>Benefits</Text>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#F66729" />
                <Text style={styles.benefitText}>Improves daily productivity</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#F66729" />
                <Text style={styles.benefitText}>Builds consistency and discipline</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#F66729" />
                <Text style={styles.benefitText}>Helps achieve long-term goals</Text>
              </View>
            </View>

            {/* Add Habit Button */}
            <TouchableOpacity
              style={[styles.addButton, isHabitAdded && styles.addButtonAdded]}
              activeOpacity={0.8}
              onPress={() => {
                if (!isHabitAdded) {
                  addHabit(habit);
                }
                navigation.goBack();
              }}
              disabled={isHabitAdded}
            >
              <Text style={styles.addButtonText}>
                {isHabitAdded ? 'Already Added' : 'Add to My Habits'}
              </Text>
              {!isHabitAdded && <Ionicons name="add-circle" size={24} color="#FFFFFF" />}
            </TouchableOpacity>
          </View>
        </BlurView>

        {/* Bottom spacing */}
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
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 24,
    zIndex: 10,
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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  backButtonBlur: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    position: 'relative',
  },
  habitImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  titleSection: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 44,
  },
  detailsCard: {
    marginHorizontal: 24,
    borderRadius: 24,
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
  detailsContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 24,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
    marginBottom: 32,
    letterSpacing: 0.2,
  },
  benefitsSection: {
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 12,
    letterSpacing: 0.2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F66729',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#F66729',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
    letterSpacing: 0.3,
  },
  addButtonAdded: {
    backgroundColor: 'rgba(246, 103, 41, 0.5)',
    opacity: 0.7,
  },
  bottomSpacing: {
    height: 120,
  },
});

