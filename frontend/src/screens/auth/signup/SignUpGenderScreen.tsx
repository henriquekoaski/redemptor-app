import React, { useState } from 'react';
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

type SignUpGenderScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUpGender'>;

const ACCENT_ORANGE = '#F66729';
const SELECTED_ORANGE = '#D9551F';
const PRESSED_ORANGE = '#E96027';
const DARK_BACKGROUND = '#0D0A10';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SignUpGenderScreen() {
  const navigation = useNavigation<SignUpGenderScreenNavigationProp>();
  const { signUpData, updateSignUpData } = useSignUp();
  
  const [gender, setGender] = useState(signUpData.gender || '');
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ gender?: string }>({});

  const validateForm = () => {
    const newErrors: { gender?: string } = {};

    if (!gender.trim()) {
      newErrors.gender = 'Please select an option';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    updateSignUpData({ gender });
    
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('SignUpPassword');
    }, 300);
  };

  const handleGenderSelect = (selectedGender: string) => {
    setGender(selectedGender);
    if (errors.gender) setErrors({ ...errors, gender: undefined });
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
                <ProgressBar progress={0.8} />
              </View>
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
                How do you <Text style={styles.titleAccent}>identify?</Text>
              </Text>
            </View>

            {/* Gender Options */}
            <View style={styles.form}>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    gender === 'Male' && styles.optionButtonSelected,
                    pressedButton === 'Male' && styles.optionButtonPressed,
                  ]}
                  onPress={() => handleGenderSelect('Male')}
                  onPressIn={() => setPressedButton('Male')}
                  onPressOut={() => setPressedButton(null)}
                  activeOpacity={gender === 'Male' ? 1 : 0.8}
                >
                  <Text
                    style={[
                      styles.optionText,
                      gender === 'Male' && styles.optionTextSelected,
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    gender === 'Female' && styles.optionButtonSelected,
                    pressedButton === 'Female' && styles.optionButtonPressed,
                  ]}
                  onPress={() => handleGenderSelect('Female')}
                  onPressIn={() => setPressedButton('Female')}
                  onPressOut={() => setPressedButton(null)}
                  activeOpacity={gender === 'Female' ? 1 : 0.8}
                >
                  <Text
                    style={[
                      styles.optionText,
                      gender === 'Female' && styles.optionTextSelected,
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    gender === 'Other' && styles.optionButtonSelected,
                    pressedButton === 'Other' && styles.optionButtonPressed,
                  ]}
                  onPress={() => handleGenderSelect('Other')}
                  onPressIn={() => setPressedButton('Other')}
                  onPressOut={() => setPressedButton(null)}
                  activeOpacity={gender === 'Other' ? 1 : 0.8}
                >
                  <Text
                    style={[
                      styles.optionText,
                      gender === 'Other' && styles.optionTextSelected,
                    ]}
                  >
                    Other
                  </Text>
                </TouchableOpacity>
              </View>

              {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
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
  optionsContainer: {
    marginBottom: 18,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 0,
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
  optionButtonSelected: {
    backgroundColor: SELECTED_ORANGE,
    ...Platform.select({
      ios: {
        shadowColor: SELECTED_ORANGE,
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
  optionButtonPressed: {
    backgroundColor: PRESSED_ORANGE,
    ...Platform.select({
      ios: {
        shadowColor: PRESSED_ORANGE,
      },
    }),
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
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

