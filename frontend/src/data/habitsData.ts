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
  'wake_up_early': require('../assets/images/habit-card-covers/habit-cover-bg-wake-up.png'),
  'daily_weekly_planning': require('../assets/images/habit-card-covers/habit-cover-bg-planning.png'),

  // Protect Your Focus habits
  'block_social_media': require('../assets/images/habit-card-covers/habit-cover-bg-block-social-media.png'),
  'block_games': require('../assets/images/habit-card-covers/habit-cover-bg-block-games.png'),
  'block_phone_calls_only': require('../assets/images/habit-card-covers/habit-cover-bg-block-phone.png'),

  // Strong Body, Strong Mind habits
  'block_porn': require('../assets/images/habit-card-covers/habit-cover-bg-block-porn.png'),
  'drink_water': require('../assets/images/habit-card-covers/habit-cover-bg-drink-water.png'),
  'work_out': require('../assets/images/habit-card-covers/habit-cover-bg-work-out.png'),
  'run_or_walk_outside': require('../assets/images/habit-card-covers/habit-cover-bg-walk-run.png'),
  'brush_your_teeth': require('../assets/images/habit-card-covers/habit-cover-bg-brush-teeth.png'),

  // Mindfulness habits
  'meditate': require('../assets/images/habit-card-covers/habit-cover-bg-meditate.png'),

  // Smart Finance habits
  'stop_gambling': require('../assets/images/habit-card-covers/habit-cover-bg-stop-gambling.png'),

  // Life Organization habits
  'make_your_bed': require('../assets/images/habit-card-covers/habit-cover-bg-make-your-bed.png'),
  'organize_home_workspace': require('../assets/images/habit-card-covers/habit-cover-bg-organize-home-work.png'),
};

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
 * Returns the mapped image or a fallback image if not found
 */
export function getHabitImage(habitName: string): ImageSourcePropType {
  const normalizedName = normalizeHabitName(habitName);
  return HABIT_IMAGES_MAP[normalizedName] || require('../assets/images/habit-card-covers/habit-cover-bg-wake-up.png');
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
      { id: 'block_porn_sites', title: 'Block Porn', imageSource: getHabitImage('Block Porn') },
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

