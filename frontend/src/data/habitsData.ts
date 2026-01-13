/**
 * Habits Data Configuration
 * 
 * This file organizes all habits and their associated images.
 * To add a new habit image:
 * 1. Add the image file to ../assets/images/ with naming: habit_[habitName].png
 *    Example: habit_morning_routine.png for "Morning Routine"
 * 2. Add the mapping below in HABIT_IMAGES_MAP
 * 3. Add the habit to the appropriate category in HABITS_BY_CATEGORY
 */

import { ImageSourcePropType } from 'react-native';

// Image mapping: maps habit name (normalized) to image source
// Normalize habit names: lowercase, replace spaces with underscores
export const HABIT_IMAGES_MAP: Record<string, ImageSourcePropType> = {
  // High Performance habits
  'wake_up_early': require('../assets/images/habit_wake_up_early.png'),
  'daily_weekly_planning': require('../assets/images/habit_background_1.png'),
  
  // Productivity habits (legacy)
  'morning_routine': require('../assets/images/habit_background_1.png'),
  'time_blocking': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'deep_work': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'task_planning': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'email_management': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'goal_setting': require('../assets/images/habit_background_1.png'), // TODO: Add specific image

  // Protect Your Focus habits
  'block_social_media': require('../assets/images/habit_background_1.png'),
  'block_games': require('../assets/images/habit_background_1.png'),
  'block_phone_calls_only': require('../assets/images/habit_background_1.png'),
  
  // Health & Fitness habits (legacy)
  'daily_exercise': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'meditation': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'healthy_eating': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'water_intake': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'sleep_schedule': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'stretching': require('../assets/images/habit_background_1.png'), // TODO: Add specific image

  // Strong Body, Strong Mind habits
  'block_porn_sites': require('../assets/images/habit_background_1.png'),
  'drink_water': require('../assets/images/habit_background_1.png'),
  'work_out': require('../assets/images/habit_background_1.png'),
  'run_or_walk_outside': require('../assets/images/habit_background_1.png'),
  'brush_your_teeth': require('../assets/images/habit_background_1.png'),
  
  // Mindfulness habits (legacy)
  'gratitude_journal': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'breathing_exercises': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'mindful_walking': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'digital_detox': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'nature_connection': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'self_reflection': require('../assets/images/habit_background_1.png'), // TODO: Add specific image

  // Mindfulness habits
  'meditate': require('../assets/images/habit_background_1.png'),
  
  // Learning habits (legacy)
  'reading_books': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'online_courses': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'language_practice': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'skill_development': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'news_reading': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'podcast_listening': require('../assets/images/habit_background_1.png'), // TODO: Add specific image

  // Smart Finance habits
  'stop_gambling': require('../assets/images/habit_stop_gambling.png'),
  
  // Relationships habits (legacy)
  'family_time': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'friend_check_ins': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'date_night': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'random_acts_of_kindness': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'social_activities': require('../assets/images/habit_background_1.png'), // TODO: Add specific image
  'quality_conversations': require('../assets/images/habit_background_1.png'), // TODO: Add specific image

  // Life Organization habits
  'make_your_bed': require('../assets/images/habit_background_1.png'),
  'organize_home_workspace': require('../assets/images/habit_background_1.png'),
};

// Default fallback image
export const DEFAULT_HABIT_IMAGE = require('../assets/images/habit_background_1.png');

/**
 * Normalizes habit name for image lookup
 * Converts to lowercase and replaces spaces/special chars with underscores
 */
export function normalizeHabitName(habitName: string): string {
  return habitName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Gets the image source for a habit by its name
 * Returns the mapped image or a default fallback
 */
export function getHabitImage(habitName: string): ImageSourcePropType {
  const normalizedName = normalizeHabitName(habitName);
  return HABIT_IMAGES_MAP[normalizedName] || DEFAULT_HABIT_IMAGE;
}

/**
 * Habit interface for structured habit data
 */
export interface Habit {
  id: string;
  title: string;
  imageSource: ImageSourcePropType;
}

/**
 * Category interface
 */
export interface HabitCategory {
  id: string;
  title: string;
  habits: Habit[];
}

/**
 * Organized habits by category
 * Each habit has its own image mapping
 */
export const HABITS_BY_CATEGORY: HabitCategory[] = [
  {
    id: 'high_performance',
    title: 'High Performance',
    habits: [
      { id: 'wake_up_early', title: 'Wake Up Early', imageSource: getHabitImage('Wake Up Early') },
      { id: 'daily_weekly_planning', title: 'Daily & Weekly Planning', imageSource: getHabitImage('Daily & Weekly Planning') },
    ],
  },
  {
    id: 'protect_your_focus',
    title: '🧠 Protect Your Focus',
    habits: [
      { id: 'block_social_media', title: 'Block Social Media', imageSource: getHabitImage('Block Social Media') },
      { id: 'block_games', title: 'Block Games', imageSource: getHabitImage('Block Games') },
      { id: 'block_phone_calls_only', title: 'Block Phone (Calls Only)', imageSource: getHabitImage('Block Phone (Calls Only)') },
    ],
  },
  {
    id: 'mindfulness',
    title: '🧘 Mindfulness',
    habits: [
      { id: 'meditate', title: 'Meditate', imageSource: getHabitImage('Meditate') },
    ],
  },
  {
    id: 'strong_body_strong_mind',
    title: '🔥Strong Body, Strong Mind',
    habits: [
      { id: 'block_porn_sites', title: 'Block Porn Sites', imageSource: getHabitImage('Block Porn Sites') },
      { id: 'drink_water', title: 'Drink Water', imageSource: getHabitImage('Drink Water') },
      { id: 'work_out', title: 'Work Out', imageSource: getHabitImage('Work Out') },
      { id: 'run_or_walk_outside', title: 'Walk/Run', imageSource: getHabitImage('Walk/Run') },
      { id: 'brush_your_teeth', title: 'Brush Your Teeth', imageSource: getHabitImage('Brush Your Teeth') },
    ],
  },
  {
    id: 'smart_finance',
    title: '💰 Smart Finance',
    habits: [
      { id: 'stop_gambling', title: 'Stop Gambling', imageSource: getHabitImage('Stop Gambling') },
    ],
  },
  {
    id: 'life_organization',
    title: '🧩 Life Organization',
    habits: [
      { id: 'make_your_bed', title: 'Make Your Bed', imageSource: getHabitImage('Make Your Bed') },
      { id: 'organize_home_workspace', title: 'Organize Home / Workspace', imageSource: getHabitImage('Organize Home / Workspace') },
    ],
  },
];

/**
 * Category cards data for the horizontal scrolling section
 */
export interface CategoryCard {
  id: string;
  title: string;
  imageSource: ImageSourcePropType;
}

export const CATEGORY_CARDS: CategoryCard[] = [
  { id: 'life_organization', title: 'Life Organization', imageSource: require('../assets/images/category_life_organization.png') },
  { id: 'smart_finance', title: 'Smart Finance', imageSource: getHabitImage('Stop Gambling') },
  { id: 'strong_body_strong_mind', title: 'Strong Body, Strong Mind', imageSource: getHabitImage('Work Out') },
  { id: 'mindfulness', title: 'Mindfulness', imageSource: getHabitImage('Meditate') },
  { id: 'protect_your_focus', title: 'Protect Your Focus', imageSource: getHabitImage('Block Social Media') },
  { id: 'high_performance', title: 'High Performance', imageSource: getHabitImage('Wake Up Early') },
];
