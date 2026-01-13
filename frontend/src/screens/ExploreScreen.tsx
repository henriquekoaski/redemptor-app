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
  FlatList,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { HABITS_BY_CATEGORY, CATEGORY_CARDS, Habit } from '../data/habitsData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.48;
const CARD_HEIGHT = CARD_WIDTH * 1.5;
const FULL_WIDTH_CARD_WIDTH = width - 48; // Full width minus padding (24 on each side)
const CATEGORY_CARD_WIDTH = width * 0.6;
const CATEGORY_CARD_HEIGHT = 100;

interface HabitCardProps {
  habit: Habit;
}

// Habit Card Component - Uses organized habit data with image mapping
const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const { title, imageSource, id } = habit;
  const isFullWidth = id === 'meditate' || id === 'stop_gambling';
  const cardWidth = isFullWidth ? FULL_WIDTH_CARD_WIDTH : CARD_WIDTH;

  return (
    <TouchableOpacity 
      style={[
        styles.habitCard,
        isFullWidth && styles.habitCardFullWidth
      ]} 
      activeOpacity={0.8}
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

interface CategoryCardProps {
  title: string;
  imageSource: ImageSourcePropType;
}

// Category Card Component - Horizontal orientation
const CategoryCard: React.FC<CategoryCardProps> = ({ title, imageSource }) => {
  return (
    <TouchableOpacity style={styles.categoryCard} activeOpacity={0.85}>
      <ImageBackground
        source={imageSource}
        style={styles.categoryCardBackground}
        imageStyle={styles.categoryCardImage}
        resizeMode="cover"
      >
        {/* Gradient overlay for premium text readability */}
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.6)']}
          style={styles.categoryCardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <Text style={styles.categoryCardTitle} numberOfLines={2}>
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
  const emoji = title in CATEGORY_EMOJIS ? CATEGORY_EMOJIS[title] : '✨';
  const displayTitle = emoji ? `${emoji} ${title}` : title;
  
  return (
    <View style={styles.categorySection}>
      <Text style={styles.categoryTitle}>
        {displayTitle}
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

        {/* Category Cards Horizontal List - Hide when searching */}
        {!searchQuery.trim() && (
          <View style={styles.categoryCardsContainer}>
            <FlatList
              data={CATEGORY_CARDS}
              renderItem={({ item }) => (
                <CategoryCard title={item.title} imageSource={item.imageSource} />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryCardsContent}
              snapToInterval={CATEGORY_CARD_WIDTH + 16}
              snapToAlignment="start"
              decelerationRate="fast"
            />
          </View>
        )}

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
    backgroundColor: '#000',
  },
  fixedTitleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 65,
    paddingBottom: 8,
    paddingHorizontal: 24,
    backgroundColor: '#000',
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
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  categoryCardsContainer: {
    marginBottom: 32,
  },
  categoryCardsContent: {
    paddingLeft: 24,
    paddingRight: 24,
    gap: 16,
  },
  categoryCard: {
    width: CATEGORY_CARD_WIDTH,
    height: CATEGORY_CARD_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1C1C1C',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryCardBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
  },
  categoryCardImage: {
    width: CATEGORY_CARD_WIDTH,
    height: CATEGORY_CARD_HEIGHT,
  },
  categoryCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  categoryCardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
    zIndex: 1,
    textAlign: 'center',
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
    borderRadius: 12,
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
  habitCardFullWidth: {
    width: FULL_WIDTH_CARD_WIDTH,
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
    borderRadius: 12,
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
