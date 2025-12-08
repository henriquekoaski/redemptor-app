import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSignUp } from '../../../context/SignUpContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import ProgressBar from '../../../components/ProgressBar';

type AuthStackParamList = {
  SignIn: undefined;
  SignUpEmail: undefined;
  SignUpName: undefined;
  SignUpBirthdate: undefined;
  SignUpGender: undefined;
  SignUpPassword: undefined;
  SignUpOptions: undefined;
  ForgotPassword: undefined;
  Home: undefined;
};

type SignUpBirthdateScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUpBirthdate'>;

const ACCENT_ORANGE = '#F66729';
const DARK_BACKGROUND = '#0D0A10';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SignUpBirthdateScreen() {
  const navigation = useNavigation<SignUpBirthdateScreenNavigationProp>();
  const { signUpData, updateSignUpData } = useSignUp();
  
  // Calculate valid year range: maxYear = current year, minYear = maxYear - 120
  const maxYear = new Date().getFullYear();
  const minYear = maxYear - 120;
  
  // Ensure initial date is within valid range
  const getInitialDate = (): Date => {
    if (signUpData.birthdate) {
      const year = signUpData.birthdate.getFullYear();
      if (year >= minYear && year <= maxYear) {
        return signUpData.birthdate;
      }
      // Clamp to valid range if out of bounds
      const clampedYear = Math.max(minYear, Math.min(maxYear, year));
      return new Date(clampedYear, signUpData.birthdate.getMonth(), signUpData.birthdate.getDate());
    }
    // Default to 18 years ago, but ensure it's within valid range
    const defaultYear = Math.max(minYear, Math.min(maxYear, maxYear - 18));
    return new Date(defaultYear, 0, 1);
  };
  
  const [birthdate, setBirthdate] = useState<Date>(getInitialDate());
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState<{ birthdate?: string }>({});

  const validateForm = () => {
    const newErrors: { birthdate?: string } = {};
    const age = new Date().getFullYear() - birthdate.getFullYear();
    
    if (age < 13) {
      newErrors.birthdate = 'You must be at least 13 years old';
    } else if (age > 120) {
      newErrors.birthdate = 'Please enter a valid birthdate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    updateSignUpData({ birthdate });
    
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('SignUpGender');
    }, 300);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      // Clamp the selected date to valid year range
      const selectedYear = selectedDate.getFullYear();
      const clampedYear = Math.max(minYear, Math.min(maxYear, selectedYear));
      
      // If year was clamped, create new date with clamped year
      const validDate = clampedYear !== selectedYear
        ? new Date(clampedYear, selectedDate.getMonth(), Math.min(selectedDate.getDate(), new Date(clampedYear, selectedDate.getMonth() + 1, 0).getDate()))
        : selectedDate;
      
      setBirthdate(validDate);
      if (errors.birthdate) setErrors({ ...errors, birthdate: undefined });
    }
  };

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.topSection}>
            {/* Top Row: Back Arrow and Progress Bar */}
            <View style={styles.topRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.progressBarContainer}>
                <ProgressBar progress={0.6} />
              </View>
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
                When were you <Text style={styles.titleAccent}>born?</Text>
              </Text>
            </View>

            {/* Date Picker */}
            <View style={styles.form}>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowPicker(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.dateText}>{formatDate(birthdate)}</Text>
                <Ionicons name="calendar-outline" size={20} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
              
              {errors.birthdate && <Text style={styles.errorText}>{errors.birthdate}</Text>}

              {showPicker && (
                <View style={styles.pickerContainer}>
                  {Platform.OS === 'ios' ? (
                    <View style={styles.iosPickerWrapper}>
                      <View style={styles.iosPickerHeader}>
                        <TouchableOpacity onPress={() => setShowPicker(false)}>
                          <Text style={styles.pickerButtonText}>Done</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        value={birthdate}
                        mode="date"
                        display="spinner"
                        onChange={handleDateChange}
                        maximumDate={new Date(maxYear, 11, 31)}
                        minimumDate={new Date(minYear, 0, 1)}
                        textColor="#FFFFFF"
                        style={styles.iosPicker}
                      />
                    </View>
                  ) : (
                    <DateTimePicker
                      value={birthdate}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                      maximumDate={new Date(maxYear, 11, 31)}
                      minimumDate={new Date(minYear, 0, 1)}
                    />
                  )}
                </View>
              )}
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.continueButton, loading && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    justifyContent: 'space-between',
    position: 'relative',
  },
  topSection: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 44,
    flexShrink: 1,
  },
  titleAccent: {
    color: ACCENT_ORANGE,
  },
  form: {
    width: '100%',
    maxWidth: SCREEN_WIDTH * 0.92,
    alignSelf: 'center',
    marginTop: 0,
  },
  datePickerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 0,
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  dateText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  pickerContainer: {
    marginTop: 20,
  },
  iosPickerWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  pickerButtonText: {
    color: ACCENT_ORANGE,
    fontSize: 16,
    fontWeight: '600',
  },
  iosPicker: {
    height: 200,
    backgroundColor: 'transparent',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 8,
    marginLeft: 24,
  },
  continueButton: {
    backgroundColor: ACCENT_ORANGE,
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: SCREEN_WIDTH * 0.85,
    alignSelf: 'center',
    marginBottom: Platform.OS === 'ios' ? 40 : 30,
    ...Platform.select({
      ios: {
        shadowColor: ACCENT_ORANGE,
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
  buttonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  progressBarContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

