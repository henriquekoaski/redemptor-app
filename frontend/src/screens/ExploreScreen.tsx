import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

interface HabitCardProps {
  title: string;
  imageIndex: number;
}

// Helper function to get image source based on index
// Note: Add your images to ../assets/images/ with names habit_background_1.png through habit_background_6.png
const getHabitImageSource = (index: number): any => {
  const imageNumber = (index % 6) + 1;
  
  // Image map - add more images as you create them
  const imageMap: { [key: number]: any } = {
    1: require('../assets/images/habit_background_1.png'),
    // Uncomment as you add more images:
    // 2: require('../assets/images/habit_background_2.png'),
    // 3: require('../assets/images/habit_background_3.png'),
    // 4: require('../assets/images/habit_background_4.png'),
    // 5: require('../assets/images/habit_background_5.png'),
    // 6: require('../assets/images/habit_background_6.png'),
  };
  
  // Use image 1 for all cards until more images are added
  return imageMap[imageNumber] || imageMap[1] || null;
};

const HabitCard: React.FC<HabitCardProps> = ({ title, imageIndex }) => {
  const imageSource = getHabitImageSource(imageIndex);
  const hasImage = imageSource !== null;

  return (
    <TouchableOpacity style={styles.habitCard} activeOpacity={0.8}>
      {hasImage ? (
        <ImageBackground
          source={imageSource}
          style={styles.habitCardBackground}
          imageStyle={styles.habitCardImage}
          resizeMode="cover"
        >
          {/* Dark overlay for text readability */}
          <View style={styles.habitCardOverlay} />
          <Text style={styles.habitCardTitle} numberOfLines={2}>
            {title}
          </Text>
        </ImageBackground>
      ) : (
        <View style={styles.habitCardBackground}>
          {/* Dark overlay for text readability (same visual even without image) */}
          <View style={styles.habitCardOverlay} />
          <Text style={styles.habitCardTitle} numberOfLines={2}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

interface CategorySectionProps {
  title: string;
  habits: string[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, habits }) => {
  return (
    <View style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScrollContent}
        style={styles.horizontalScroll}
      >
        {habits.map((habit, index) => (
          <HabitCard key={index} title={habit} imageIndex={index} />
        ))}
      </ScrollView>
    </View>
  );
};

export default function ExploreScreen() {
  // Sample data for categories and habits
  const categories = [
    {
      title: 'Productivity',
      habits: [
        'Morning Routine',
        'Time Blocking',
        'Deep Work',
        'Task Planning',
        'Email Management',
        'Goal Setting',
      ],
    },
    {
      title: 'Health & Fitness',
      habits: [
        'Daily Exercise',
        'Meditation',
        'Healthy Eating',
        'Water Intake',
        'Sleep Schedule',
        'Stretching',
      ],
    },
    {
      title: 'Mindfulness',
      habits: [
        'Gratitude Journal',
        'Breathing Exercises',
        'Mindful Walking',
        'Digital Detox',
        'Nature Connection',
        'Self Reflection',
      ],
    },
    {
      title: 'Learning',
      habits: [
        'Reading Books',
        'Online Courses',
        'Language Practice',
        'Skill Development',
        'News Reading',
        'Podcast Listening',
      ],
    },
    {
      title: 'Relationships',
      habits: [
        'Family Time',
        'Friend Check-ins',
        'Date Night',
        'Random Acts of Kindness',
        'Social Activities',
        'Quality Conversations',
      ],
    },
    {
      title: 'Creativity',
      habits: [
        'Creative Writing',
        'Drawing & Sketching',
        'Music Practice',
        'Photography',
        'Crafting',
        'Brainstorming',
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Fixed Title */}
      <View style={styles.fixedTitleContainer}>
        <Text style={styles.headerTitle}>
          Explore new <Text style={styles.headerTitleAccent}>habits</Text>
        </Text>
      </View>

      {/* Main Content Scroll */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search habits..."
            placeholderTextColor="#666"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Category Sections */}
        {categories.map((category, index) => (
          <CategorySection
            key={index}
            title={category.title}
            habits={category.habits}
          />
        ))}

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  fixedTitleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 65,
    paddingBottom: 8,
    paddingHorizontal: 24,
    backgroundColor: '#111',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
    justifyContent: 'flex-end',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
    marginBottom: 0,
  },
  headerTitleAccent: {
    color: '#F66729',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 110, // Space for fixed title
    paddingBottom: 120, // Space for floating tab bar
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 30,
    height: 48,
    paddingHorizontal: 20,
    marginHorizontal: 24,
    marginBottom: 32,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: '400',
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 24,
    letterSpacing: -0.3,
  },
  horizontalScroll: {
    marginLeft: 24,
  },
  horizontalScrollContent: {
    paddingRight: 24,
    gap: 16,
  },
  habitCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1C1C1C', // Fallback background color
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  habitCardBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: '#1C1C1C', // Fallback in case image doesn't load
  },
  habitCardImage: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  habitCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 24,
  },
  habitCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 24,
    zIndex: 1,
  },
  bottomSpacing: {
    height: 20,
  },
});
