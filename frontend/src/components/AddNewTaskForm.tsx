import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, RepeatType, TaskLabel } from '../types/task';

const ACCENT_ORANGE = '#F66729';

interface AddNewTaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

const COLOR_OPTIONS = [
  '#F66729', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA15E', '#BC6C25', '#6C5CE7', '#A29BFE',
  '#FD79A8', '#FDCB6E', '#00B894', '#00CEC9', '#74B9FF',
];

const DAYS_OF_WEEK = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

export default function AddNewTaskForm({ visible, onClose, onSubmit }: AddNewTaskFormProps) {
  const [taskName, setTaskName] = useState('');
  const [hasSpecificTime, setHasSpecificTime] = useState(false);
  const [time, setTime] = useState('09:00');
  const [repeatType, setRepeatType] = useState<RepeatType>('none');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [hasLabel, setHasLabel] = useState(false);
  const [labelName, setLabelName] = useState('');
  const [labelColor, setLabelColor] = useState(COLOR_OPTIONS[0]);


  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const validateTime = (timeStr: string): boolean => {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeStr);
  };

  const isFormValid = () => {
    if (!taskName.trim()) return false;
    if (hasSpecificTime && !validateTime(time)) return false;
    if ((repeatType === 'weekly' || repeatType === 'both') && selectedDays.length === 0) return false;
    return true;
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      return;
    }

    const task: Omit<Task, 'id' | 'createdAt'> = {
      name: taskName.trim(),
      hasSpecificTime,
      time: hasSpecificTime ? time : undefined,
      repeatType,
      daysOfWeek: (repeatType === 'weekly' || repeatType === 'both') && selectedDays.length > 0
        ? selectedDays
        : undefined,
      label: hasLabel && labelName.trim()
        ? { name: labelName.trim(), color: labelColor }
        : undefined,
    };

    onSubmit(task);
    resetForm();
  };

  const resetForm = () => {
    setTaskName('');
    setHasSpecificTime(false);
    setTime('09:00');
    setRepeatType('none');
    setSelectedDays([]);
    setHasLabel(false);
    setLabelName('');
    setLabelColor(COLOR_OPTIONS[0]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New Task</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Task Name */}
            <View style={styles.section}>
              <Text style={styles.label}>Task Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter task name"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={taskName}
                onChangeText={setTaskName}
                autoFocus
              />
            </View>

            {/* Specific Time Toggle */}
            <View style={styles.section}>
              <View style={styles.toggleRow}>
                <Text style={styles.label}>Specific Time</Text>
                <TouchableOpacity
                  style={[styles.toggle, hasSpecificTime && styles.toggleActive]}
                  onPress={() => setHasSpecificTime(!hasSpecificTime)}
                >
                  <View style={[styles.toggleCircle, hasSpecificTime && styles.toggleCircleActive]} />
                </TouchableOpacity>
              </View>
              {hasSpecificTime && (
                <View style={styles.timeContainer}>
                  <TextInput
                    style={styles.timeInput}
                    value={time}
                    onChangeText={(text) => {
                      // Format as user types: HH:mm
                      const formatted = text
                        .replace(/\D/g, '')
                        .replace(/(\d{2})(\d)/, '$1:$2')
                        .slice(0, 5);
                      setTime(formatted);
                    }}
                    placeholder="09:00"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              )}
            </View>

            {/* Repeat Type */}
            <View style={styles.section}>
              <Text style={styles.label}>Repeat</Text>
              <View style={styles.optionsRow}>
                {(['none', 'daily', 'weekly', 'both'] as RepeatType[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.optionButton,
                      repeatType === type && styles.optionButtonActive,
                    ]}
                    onPress={() => {
                      setRepeatType(type);
                      if (type === 'none' || type === 'daily') {
                        setSelectedDays([]);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        repeatType === type && styles.optionButtonTextActive,
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Days of Week (if weekly or both) */}
            {(repeatType === 'weekly' || repeatType === 'both') && (
              <View style={styles.section}>
                <Text style={styles.label}>Days of Week</Text>
                <View style={styles.daysContainer}>
                  {DAYS_OF_WEEK.map((day) => (
                    <TouchableOpacity
                      key={day.value}
                      style={[
                        styles.dayButton,
                        selectedDays.includes(day.value) && styles.dayButtonActive,
                      ]}
                      onPress={() => toggleDay(day.value)}
                    >
                      <Text
                        style={[
                          styles.dayButtonText,
                          selectedDays.includes(day.value) && styles.dayButtonTextActive,
                        ]}
                      >
                        {day.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Label Toggle */}
            <View style={styles.section}>
              <View style={styles.toggleRow}>
                <Text style={styles.label}>Add Label</Text>
                <TouchableOpacity
                  style={[styles.toggle, hasLabel && styles.toggleActive]}
                  onPress={() => setHasLabel(!hasLabel)}
                >
                  <View style={[styles.toggleCircle, hasLabel && styles.toggleCircleActive]} />
                </TouchableOpacity>
              </View>

              {hasLabel && (
                <>
                  <TextInput
                    style={[styles.input, { marginTop: 12 }]}
                    placeholder="Label name"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    value={labelName}
                    onChangeText={setLabelName}
                  />
                  <Text style={[styles.label, { marginTop: 16, marginBottom: 12 }]}>Color</Text>
                  <View style={styles.colorContainer}>
                    {COLOR_OPTIONS.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorOption,
                          { backgroundColor: color },
                          labelColor === color && styles.colorOptionActive,
                        ]}
                        onPress={() => setLabelColor(color)}
                      >
                        {labelColor === color && (
                          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </View>
          </ScrollView>

          {/* Submit Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitButton, !isFormValid() && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!isFormValid()}
            >
              <Text style={styles.submitButtonText}>Create Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    maxHeight: 500,
  },
  section: {
    padding: 24,
    paddingBottom: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: ACCENT_ORANGE,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
  timeContainer: {
    marginTop: 12,
  },
  timeInput: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonActive: {
    backgroundColor: ACCENT_ORANGE,
    borderColor: ACCENT_ORANGE,
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  optionButtonTextActive: {
    color: '#FFFFFF',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
    marginBottom: 8,
  },
  dayButtonActive: {
    backgroundColor: ACCENT_ORANGE,
    borderColor: ACCENT_ORANGE,
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  dayButtonTextActive: {
    color: '#FFFFFF',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionActive: {
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.1 }],
  },
  footer: {
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  submitButton: {
    backgroundColor: ACCENT_ORANGE,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#2A2A2A',
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});

