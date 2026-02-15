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
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HABITS_BY_CATEGORY, Habit } from '../data/habitsData';
import { ExploreStackParamList } from '../navigation/ExploreStack';

type ExploreScreenNavigationProp = NativeStackNavigationProp<ExploreStackParamList, 'HabitDetail'>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.48;
const CARD_HEIGHT = CARD_WIDTH * 1.5;
const FULL_WIDTH_CARD_WIDTH = width - 48; // Full width minus padding (24 on each side)

interface HabitCardProps {
  habit: Habit;
}

// Habit Card Component - Uses organized habit data with image mapping
const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const navigation = useNavigation<ExploreScreenNavigationProp>();
  const { title, imageSource, id } = habit;
  const isFullWidth = id === 'meditate' || id === 'stop_gambling';
  const cardWidth = isFullWidth ? FULL_WIDTH_CARD_WIDTH : CARD_WIDTH;

  const handlePress = () => {
    navigation.navigate('HabitDetail', { habit });
  };

  return (
    <TouchableOpacity 
      style={[
        styles.habitCard,
        isFullWidth && styles.habitCardFullWidth
      ]} 
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <ImageBackground
        source={imageSource}
        style={styles.habitCardBackground}
        imageStyle={[
          styles.habitCardImage,
          { width: cardWidth, height: CARD_HEIGHT }
        ]}
        resizeMode="cover"
      >
        {/* Dark overlay for text readability */}
        <View style={styles.habitCardOverlay} />
        <Text style={styles.habitCardTitle} numberOfLines={2}>
          {title}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

// Emoji mapping for each category
const CATEGORY_EMOJIS: Record<string, string> = {
  'High Performance': '⚡',
  '🧠 Protect Your Focus': '', // Emoji already in title
  '🔥Strong Body, Strong Mind': '', // Emoji already in title
  '🧘 Mindfulness': '', // Emoji already in title
  '💰 Smart Finance': '', // Emoji already in title
  '🧩 Life Organization': '', // Emoji already in title
};

interface CategorySectionProps {
  title: string;
  habits: Habit[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, habits }) => {
  const cleanTitle = title.replace(/[🧠🔥🧘💰🧩⚡]/g, '').trim();
  
  return (
    <View style={styles.categorySection}>
      <Text style={styles.categoryTitle}>
        {cleanTitle}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScrollContent}
        style={styles.horizontalScroll}
      >
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </ScrollView>
    </View>
  );
};

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');

  // Filter habits based on search query - return flat list of habits when searching
  const filteredHabits = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    const allHabits: Habit[] = [];
    
    HABITS_BY_CATEGORY.forEach((category) => {
      category.habits.forEach((habit) => {
        const habitTitle = habit.title.toLowerCase();
        const categoryTitle = category.title.toLowerCase().replace(/[🧠🔥🧘💰🧩⚡]/g, '').trim();
        
        if (habitTitle.includes(query) || categoryTitle.includes(query)) {
          allHabits.push(habit);
        }
      });
    });

    return allHabits;
  }, [searchQuery]);

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
        <View style={styles.searchContainerWrapper}>
          <BlurView
            intensity={80}
            tint="dark"
            style={styles.searchBlurContainer}
          >
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
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={styles.clearButton}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              )}
            </View>
          </BlurView>
        </View>

        {/* Search Results - Show only habit cards when searching */}
        {searchQuery.trim() ? (
          filteredHabits.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
              style={styles.horizontalScroll}
            >
              {filteredHabits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No habits found</Text>
            </View>
          )
        ) : (
          /* Category Sections - Show when not searching */
          HABITS_BY_CATEGORY.map((category) => (
            <CategorySection
              key={category.id}
              title={category.title}
              habits={category.habits}
            />
          ))
        )}

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0C',
  },
  fixedTitleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 65,
    paddingBottom: 8,
    paddingHorizontal: 24,
    backgroundColor: '#0B0B0C',
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
  searchContainerWrapper: {
    marginHorizontal: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  searchBlurContainer: {
    width: '100%',
    borderRadius: 36,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 36,
    height: 48,
    paddingHorizontal: 20,
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
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginBottom: 20,
    paddingHorizontal: 24,
    letterSpacing: 0.5,
    textTransform: 'none',
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
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1C1C1C', // Fallback background color
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  habitCardFullWidth: {
    width: FULL_WIDTH_CARD_WIDTH,
  },
  habitCardBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    padding: 24,
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
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 16,
  },
  habitCardTitle: {
    fontSize: 21,
    fontWeight: '500',
    color: '#fff',
    lineHeight: 28,
    zIndex: 1,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 3,
  },
  bottomSpacing: {
    height: 20,
  },
  noResultsContainer: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '400',
  },
});
