import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Animated, TouchableOpacity, Modal, Pressable, Dimensions, TextInput, Switch, ScrollView, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Calendar } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const MODAL_WIDTH = width * 0.9;

interface Task {
  id: string;
  name: string;
  icon: string;
  isTimed: boolean;
  time: string;
  isRepeat: boolean;
  repeatSameDay: boolean;
  sameDayTimes: string[];
  repeatWeek: boolean;
  selectedDays: number[];
  createdAt: Date;
}

export default function PlannerScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskIcon, setTaskIcon] = useState('');
  const [isTimed, setIsTimed] = useState(false);
  const [taskTime, setTaskTime] = useState('');
  const [isRepeat, setIsRepeat] = useState(false);
  const [repeatSameDay, setRepeatSameDay] = useState(false);
  const [sameDayTimes, setSameDayTimes] = useState(['']);
  const [repeatWeek, setRepeatWeek] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const modalSlideAnim = useRef(new Animated.Value(0)).current;
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const modalTranslateY = useRef(new Animated.Value(600)).current;
  const nameInputBorderColor = useRef(new Animated.Value(0)).current;
  const descriptionInputBorderColor = useRef(new Animated.Value(0)).current;
  const calendarTranslateY = useRef(new Animated.Value(-600)).current;
  const calendarOpacity = useRef(new Animated.Value(0)).current;
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        Animated.timing(keyboardOffset, {
          toValue: -e.endCoordinates.height / 2,
          duration: e.duration || 250,
          useNativeDriver: false,
        }).start();
      }
    );
    
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      (e) => {
        Animated.timing(keyboardOffset, {
          toValue: 0,
          duration: e.duration || 250,
          useNativeDriver: false,
        }).start();
      }
    );
    
    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);
  
  // Swipe gesture tracking
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const formatDayName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getDateLabel = (date: Date): string | null => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Compare dates without time
    const normalizeDate = (d: Date) => {
      const normalized = new Date(d);
      normalized.setHours(0, 0, 0, 0);
      return normalized;
    };

    const normalizedDate = normalizeDate(date);
    const normalizedToday = normalizeDate(today);
    const normalizedYesterday = normalizeDate(yesterday);
    const normalizedTomorrow = normalizeDate(tomorrow);

    if (normalizedDate.getTime() === normalizedToday.getTime()) {
      return 'today';
    } else if (normalizedDate.getTime() === normalizedYesterday.getTime()) {
      return 'yesterday';
    } else if (normalizedDate.getTime() === normalizedTomorrow.getTime()) {
      return 'tomorrow';
    }
    return null;
  };

  const changeDate = (direction: 'left' | 'right') => {
    // Animate out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: direction === 'left' ? -50 : 50,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Update date
      const newDate = new Date(currentDate);
      if (direction === 'left') {
        newDate.setDate(newDate.getDate() + 1);
      } else {
        newDate.setDate(newDate.getDate() - 1);
      }
      setCurrentDate(newDate);
      
      // Reset slide position
      slideAnim.setValue(direction === 'left' ? 50 : -50);
      
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleTouchStart = (event: any) => {
    const touch = event.nativeEvent.touches[0];
    touchStartX.current = touch.pageX;
    touchStartY.current = touch.pageY;
  };

  const handleTouchEnd = (event: any) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touch = event.nativeEvent.changedTouches[0];
    const deltaX = touch.pageX - touchStartX.current;
    const deltaY = touch.pageY - touchStartY.current;
    const swipeThreshold = 50;

    // Only process horizontal swipes (horizontal movement > vertical movement)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
      if (showCalendarModal) {
        // Calendar is open - change month
        if (deltaX > 0) {
          // Swipe right - go to previous month
          changeCalendarMonth('prev');
        } else {
          // Swipe left - go to next month
          changeCalendarMonth('next');
        }
      } else {
        // Calendar is closed - change day
        if (deltaX > 0) {
          // Swipe right - go to previous day
          changeDate('right');
        } else {
          // Swipe left - go to next day
          changeDate('left');
        }
      }
    }

    // Reset touch positions
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const openTaskModal = () => {
    setShowTaskModal(true);
    modalTranslateY.setValue(600);
    Animated.parallel([
      Animated.spring(modalSlideAnim, {
        toValue: 1,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(modalTranslateY, {
        toValue: 0,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }),
    ]).start();
  };

  const closeTaskModal = () => {
    Keyboard.dismiss();
    Animated.parallel([
      Animated.spring(modalSlideAnim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(modalTranslateY, {
        toValue: 600,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setShowTaskModal(false);
      // Reset form
      setTaskName('');
      setTaskDescription('');
      setTaskIcon('');
      setIsTimed(false);
      setTaskTime('');
      setIsRepeat(false);
      setRepeatSameDay(false);
      setSameDayTimes(['']);
      setRepeatWeek(false);
      setSelectedDays([]);
      // Reset animated values
      nameInputBorderColor.setValue(0);
      descriptionInputBorderColor.setValue(0);
      keyboardOffset.setValue(0);
    });
  };

  const handleCreateTask = () => {
    if (!taskName.trim()) {
      return;
    }

    const newTask: Task = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
      name: taskName,
      icon: taskIcon || '📝',
      isTimed,
      time: taskTime,
      isRepeat,
      repeatSameDay,
      sameDayTimes: sameDayTimes.filter(t => t.trim() !== ''),
      repeatWeek,
      selectedDays,
      createdAt: new Date(),
    };

    setTasks(prev => [...prev, newTask]);
    closeTaskModal();
  };

  const getTasksForCurrentDate = () => {
    const currentDayOfWeek = currentDate.getDay();
    const currentDateStr = currentDate.toDateString();

    return tasks.filter(task => {
      if (!task.isRepeat) {
        return task.createdAt.toDateString() === currentDateStr;
      }
      
      if (task.repeatSameDay && task.sameDayTimes.length > 0) {
        return true;
      }
      
      if (task.repeatWeek && task.selectedDays.includes(currentDayOfWeek)) {
        return true;
      }
      
      return false;
    });
  };

  const getAnytimeTasks = () => {
    return getTasksForCurrentDate().filter(task => {
      // Tasks without time or without scheduled times
      if (task.isTimed && task.time) {
        return false;
      }
      if (task.repeatSameDay && task.sameDayTimes.length > 0) {
        return false;
      }
      return true;
    });
  };

  const getScheduledTasks = () => {
    return getTasksForCurrentDate().filter(task => {
      // Tasks with time or scheduled times
      if (task.isTimed && task.time) {
        return true;
      }
      if (task.repeatSameDay && task.sameDayTimes.length > 0) {
        return true;
      }
      return false;
    });
  };

  const renderTaskCard = (task: Task) => (
    <View key={task.id} style={styles.taskCardWrapper}>
      <BlurView
        intensity={80}
        tint="dark"
        style={styles.taskCardBlur}
      >
        <View style={styles.taskCard}>
          {task.icon && (
            <Text style={styles.taskIcon}>{task.icon}</Text>
          )}
          <View style={styles.taskContent}>
            <Text style={styles.taskName}>{task.name}</Text>
            {task.isTimed && task.time && (
              <View style={styles.taskTimeContainer}>
                <Ionicons name="time-outline" size={14} color="rgba(255, 255, 255, 0.6)" />
                <Text style={styles.taskTime}>{task.time}</Text>
              </View>
            )}
            {task.isRepeat && (
              <View style={styles.taskRepeatContainer}>
                {task.repeatSameDay && task.sameDayTimes.length > 0 && (
                  <Text style={styles.taskRepeatText}>Daily</Text>
                )}
                {task.repeatWeek && task.selectedDays.length > 0 && (
                  <Text style={styles.taskRepeatText}>Weekly</Text>
                )}
              </View>
            )}
          </View>
        </View>
      </BlurView>
    </View>
  );

  const addSameDayTime = () => {
    setSameDayTimes([...sameDayTimes, '']);
  };

  const updateSameDayTime = (index: number, value: string) => {
    const newTimes = [...sameDayTimes];
    newTimes[index] = value;
    setSameDayTimes(newTimes);
  };

  const toggleDay = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter(d => d !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex]);
    }
  };

  const formatTime = (time: string) => {
    // Simple time formatting helper
    return time;
  };

  const getTasksForDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    const dateStr = date.toDateString();

    return tasks.filter(task => {
      if (!task.isRepeat) {
        return task.createdAt.toDateString() === dateStr;
      }
      
      if (task.repeatSameDay && task.sameDayTimes.length > 0) {
        return true;
      }
      
      if (task.repeatWeek && task.selectedDays.includes(dayOfWeek)) {
        return true;
      }
      
      return false;
    });
  };


  // Calendar functions
  const openCalendarModal = () => {
    setCalendarMonth(new Date(currentDate));
    setShowCalendarModal(true);
    Animated.parallel([
      Animated.spring(calendarTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(calendarOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeCalendarModal = () => {
    Animated.parallel([
      Animated.spring(calendarTranslateY, {
        toValue: -600,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(calendarOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowCalendarModal(false);
    });
  };

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
    closeCalendarModal();
  };

  const changeCalendarMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(calendarMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCalendarMonth(newMonth);
  };

  const getCalendarDays = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Previous month's days to fill the first week
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    const days: (Date | null)[] = [];
    
    // Add previous month's trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, daysInPrevMonth - i));
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add next month's leading days to fill the last week
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return (
      date.getMonth() === calendarMonth.getMonth() &&
      date.getFullYear() === calendarMonth.getFullYear()
    );
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const formatMonthYearCapitalized = (date: Date) => {
    const formatted = formatMonthYear(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  return (
    <View 
      style={styles.container}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Upper Tap Bar */}
      <View style={styles.upperTapBar}>
        <BlurView
          intensity={80}
          tint="dark"
          style={styles.upperTapBarBlur}
        >
          <View style={styles.upperTapBarContent}>
            <TouchableOpacity 
              style={styles.upperTapBarButton}
              activeOpacity={0.8}
            >
              <Ionicons name="grid-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.upperTapBarDivider} />
            <TouchableOpacity 
              style={styles.upperTapBarButton}
              activeOpacity={0.8}
              onPress={openCalendarModal}
            >
              <Calendar size={18} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>

      <Animated.View 
        style={[
          styles.dateContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {getDateLabel(currentDate) && (
          <View style={styles.bookmarkContainer}>
            <View style={styles.pennantRectangle}>
              <Text style={styles.bookmarkText}>{getDateLabel(currentDate)}</Text>
            </View>
            <View style={styles.vCutoutTop} />
            <View style={styles.vCutoutBottom} />
          </View>
        )}
        <View style={styles.dateRow}>
          <View style={styles.dateTextContainer}>
            <Text style={styles.dayName}>{formatDayName(currentDate)}</Text>
            <Text style={styles.date}>{formatDate(currentDate)}</Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.tasksContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tasksContent}
      >
        {/* Scheduled Category */}
        {getScheduledTasks().length > 0 && (
          <View style={styles.categorySection}>
            <Text style={styles.categoryTitle}>Scheduled</Text>
            {getScheduledTasks().map((task) => renderTaskCard(task))}
          </View>
        )}

        {/* Anytime Category */}
        {getAnytimeTasks().length > 0 && (
          <View style={styles.categorySection}>
            <Text style={styles.categoryTitle}>Anytime</Text>
            {getAnytimeTasks().map((task) => renderTaskCard(task))}
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={openTaskModal}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={showTaskModal}
        transparent={true}
        animationType="none"
        onRequestClose={closeTaskModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeTaskModal}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [
                  {
                    translateY: Animated.add(modalTranslateY, keyboardOffset),
                  },
                ],
              },
            ]}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <BlurView
                intensity={80}
                tint="dark"
                style={styles.modalBlur}
              >
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <View style={styles.headerFieldsContainer}>
                      {/* Name Field */}
                      <View style={styles.nameField}>
                        <TextInput
                          style={styles.nameInputModalLarge}
                          placeholder="Name"
                          placeholderTextColor="rgba(255, 255, 255, 0.5)"
                          value={taskName}
                          onChangeText={setTaskName}
                          autoFocus={true}
                          selectionColor="#F66729"
                        />
                      </View>

                      {/* Description Field */}
                      <View style={styles.descriptionField}>
                        <TextInput
                          style={styles.nameInputModal}
                          placeholder="Description (Optional)"
                          placeholderTextColor="rgba(255, 255, 255, 0.5)"
                          value={taskDescription}
                          onChangeText={setTaskDescription}
                          selectionColor="#F66729"
                        />
                      </View>
                    </View>
                    <TouchableOpacity onPress={closeTaskModal} style={styles.closeButton}>
                      <Ionicons name="close" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>

                    {/* Timed Section */}
                    <View style={styles.section}>
                      <View style={styles.toggleRow}>
                        <Text style={styles.fieldLabel}>Timed</Text>
                        <Switch
                          value={isTimed}
                          onValueChange={setIsTimed}
                          trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: '#F66729' }}
                          thumbColor="#FFFFFF"
                          ios_backgroundColor="rgba(255, 255, 255, 0.2)"
                        />
                      </View>
                      {isTimed && (
                        <View style={styles.timeInputContainer}>
                          <TextInput
                            style={styles.timeInput}
                            placeholder="2:30 PM"
                            placeholderTextColor="rgba(255, 255, 255, 0.4)"
                            value={taskTime}
                            onChangeText={setTaskTime}
                          />
                        </View>
                      )}
                    </View>

                    {/* Repeat Section */}
                    <View style={styles.section}>
                      <View style={styles.toggleRow}>
                        <Text style={styles.fieldLabel}>Repeat</Text>
                        <Switch
                          value={isRepeat}
                          onValueChange={setIsRepeat}
                          trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: '#F66729' }}
                          thumbColor="#FFFFFF"
                          ios_backgroundColor="rgba(255, 255, 255, 0.2)"
                        />
                      </View>

                      {isRepeat && (
                        <>
                          {/* In this same day */}
                          <View style={styles.subSection}>
                            <View style={styles.toggleRow}>
                              <Text style={styles.fieldLabel}>In this same day</Text>
                              <Switch
                                value={repeatSameDay}
                                onValueChange={setRepeatSameDay}
                                trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: '#F66729' }}
                                thumbColor="#FFFFFF"
                                ios_backgroundColor="rgba(255, 255, 255, 0.2)"
                              />
                            </View>
                            {repeatSameDay && (
                              <View style={styles.timesList}>
                                {sameDayTimes.map((time, index) => (
                                  <View key={index} style={styles.timeRow}>
                                    <View style={styles.timeRowInput}>
                                      <TextInput
                                        style={styles.timeInput}
                                        placeholder="2:30 PM"
                                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                                        value={time}
                                        onChangeText={(value) => updateSameDayTime(index, value)}
                                      />
                                    </View>
                                    {index === sameDayTimes.length - 1 && (
                                      <TouchableOpacity style={styles.addTimeButton} onPress={addSameDayTime}>
                                        <Ionicons name="add" size={20} color="#FFFFFF" />
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                ))}
                              </View>
                            )}
                          </View>

                          {/* In this week */}
                          <View style={styles.subSection}>
                            <View style={styles.toggleRow}>
                              <Text style={styles.fieldLabel}>In this week</Text>
                              <Switch
                                value={repeatWeek}
                                onValueChange={setRepeatWeek}
                                trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: '#F66729' }}
                                thumbColor="#FFFFFF"
                                ios_backgroundColor="rgba(255, 255, 255, 0.2)"
                              />
                            </View>
                            {repeatWeek && (
                              <View style={styles.daysContainer}>
                                {daysOfWeek.map((day, index) => (
                                  <TouchableOpacity
                                    key={index}
                                    style={[
                                      styles.dayChip,
                                      selectedDays.includes(index) && styles.dayChipSelected,
                                    ]}
                                    onPress={() => toggleDay(index)}
                                  >
                                    <Text
                                      style={[
                                        styles.dayChipText,
                                        selectedDays.includes(index) && styles.dayChipTextSelected,
                                      ]}
                                    >
                                      {day}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            )}
                          </View>
                        </>
                      )}
                    </View>
                  </ScrollView>
                  
                  <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleCreateTask}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.createButtonText}>Create</Text>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Calendar Modal - Emerges from top */}
      <Modal
        visible={showCalendarModal}
        transparent={true}
        animationType="none"
        onRequestClose={closeCalendarModal}
      >
        <Pressable style={styles.calendarModalOverlay} onPress={closeCalendarModal}>
          <Animated.View
            style={[
              styles.calendarModalContainer,
              {
                opacity: calendarOpacity,
                transform: [{ translateY: calendarTranslateY }],
              },
            ]}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <BlurView
                intensity={80}
                tint="dark"
                style={styles.calendarModalBlur}
              >
                <View 
                  style={styles.calendarModalContent}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Calendar Header */}
                  <View style={styles.calendarHeader}>
                    <TouchableOpacity
                      onPress={() => changeCalendarMonth('prev')}
                      style={styles.calendarNavButton}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.calendarMonthYear}>
                      {formatMonthYearCapitalized(calendarMonth)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => changeCalendarMonth('next')}
                      style={styles.calendarNavButton}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  {/* Calendar Days of Week Header */}
                  <View style={styles.calendarWeekHeader}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                      <View key={index} style={styles.calendarWeekDayHeader}>
                        <Text style={styles.calendarWeekDayText}>{day}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Calendar Grid */}
                  <View style={styles.calendarGrid}>
                    {getCalendarDays().map((date, index) => {
                      if (!date) return null;
                      const isSelected = isSameDay(date, currentDate);
                      const isCurrentMonthDay = isCurrentMonth(date);
                      const isToday = isSameDay(date, new Date());
                      const dayTasks = getTasksForDate(date);
                      const hasTasks = dayTasks.length > 0;

                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.calendarDay,
                            !isCurrentMonthDay && styles.calendarDayOtherMonth,
                            isSelected && styles.calendarDaySelected,
                          ]}
                          onPress={() => handleDateSelect(date)}
                          activeOpacity={0.7}
                          disabled={!isCurrentMonthDay}
                        >
                          <Text
                            style={[
                              styles.calendarDayText,
                              !isCurrentMonthDay && styles.calendarDayTextOtherMonth,
                              isSelected && styles.calendarDayTextSelected,
                              isToday && !isSelected && styles.calendarDayTextToday,
                            ]}
                          >
                            {date.getDate()}
                          </Text>
                          {hasTasks && !isSelected && (
                            <View style={styles.calendarTaskIndicator}>
                              {dayTasks.length === 1 ? (
                                <View style={styles.calendarTaskDot} />
                              ) : (
                                <View style={styles.calendarTaskDots}>
                                  {dayTasks.slice(0, 3).map((_, i) => (
                                    <View 
                                      key={i} 
                                      style={[
                                        styles.calendarTaskDot,
                                        i > 0 && { marginLeft: 3 }
                                      ]} 
                                    />
                                  ))}
                                </View>
                              )}
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </BlurView>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
  },
  upperTapBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 24,
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
  upperTapBarBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  upperTapBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
  },
  upperTapBarButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upperTapBarDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 4,
  },
  dateContainer: {
    alignItems: 'flex-start',
    marginTop: 24,
    marginBottom: 24,
  },
  tasksContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  tasksContent: {
    paddingBottom: 120,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 0.3,
    paddingHorizontal: 4,
  },
  taskCardWrapper: {
    marginBottom: 12,
    borderRadius: 16,
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
  taskCardBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  taskCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  taskTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  taskTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 4,
  },
  taskRepeatContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  taskRepeatText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
    marginRight: 8,
  },
  dayName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  date: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.3,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  dateTextContainer: {
    flex: 1,
  },
  bookmarkContainer: {
    position: 'relative',
    marginBottom: 8,
    alignSelf: 'flex-start',
    height: 24,
  },
  pennantRectangle: {
    backgroundColor: '#F66729',
    paddingHorizontal: 12,
    paddingVertical: 6,
    height: 24,
    justifyContent: 'center',
    paddingRight: 24,
  },
  vCutoutTop: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderTopWidth: 0,
    borderBottomWidth: 12,
    borderLeftWidth: 18,
    borderRightWidth: 0,
    borderTopColor: 'transparent',
    borderBottomColor: '#1A1A1A',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  vCutoutBottom: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderBottomWidth: 0,
    borderLeftWidth: 18,
    borderRightWidth: 0,
    borderTopColor: '#1A1A1A',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  bookmarkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F66729',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  modalContainer: {
    width: MODAL_WIDTH,
    marginBottom: 20,
  },
  modalBlur: {
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
  modalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 36,
    padding: 24,
    minHeight: 200,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerFieldsContainer: {
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  modalBody: {
    maxHeight: 500,
  },
  nameField: {
    marginTop: 0,
    marginBottom: 0,
  },
  descriptionField: {
    marginTop: -25,
    marginBottom: 0,
  },
  nameInputModalWrapper: {
    width: '100%',
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
  },
  nameInputModal: {
    width: '100%',
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  nameInputModalLarge: {
    width: '100%',
    paddingVertical: 20,
    fontSize: 24,
    fontWeight: '500',
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  nameInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 0,
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 56,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  section: {
    marginBottom: 24,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeInputContainer: {
    marginTop: 8,
  },
  timeInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 0,
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 56,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  subSection: {
    marginTop: 16,
    marginLeft: 16,
  },
  timesList: {
    marginTop: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeRowInput: {
    flex: 1,
  },
  addTimeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F66729',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  dayChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginRight: 8,
    marginBottom: 8,
  },
  dayChipSelected: {
    backgroundColor: '#F66729',
    borderColor: '#F66729',
  },
  dayChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  dayChipTextSelected: {
    color: '#FFFFFF',
  },
  createButton: {
    backgroundColor: '#F66729',
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
        elevation: 4,
      },
    }),
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  calendarModalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  calendarModalContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  calendarModalBlur: {
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
  calendarModalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 36,
    padding: 24,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  calendarNavButton: {
    padding: 8,
  },
  calendarMonthYear: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textTransform: 'capitalize',
  },
  calendarWeekHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  calendarWeekDayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  calendarWeekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'lowercase',
    letterSpacing: 0.3,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  calendarDayOtherMonth: {
    opacity: 0.3,
  },
  calendarDaySelected: {
    backgroundColor: '#F66729',
    borderRadius: 20,
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  calendarDayTextOtherMonth: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  calendarDayTextToday: {
    color: '#F66729',
    fontWeight: '500',
  },
  calendarTaskIndicator: {
    position: 'absolute',
    bottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarTaskDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarTaskDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9D4EDD',
  },
});
