import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Alert,
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

type SignUpPasswordScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUpPassword'>;

const ACCENT_ORANGE = '#F66729';
const DARK_BACKGROUND = '#0D0A10';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SignUpPasswordScreen() {
  const navigation = useNavigation<SignUpPasswordScreenNavigationProp>();
  const { signUpData, updateSignUpData, resetSignUpData } = useSignUp();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  // Password validation regex patterns
  const hasMinLength = (pwd: string) => pwd.length >= 8;
  const hasUppercase = (pwd: string) => /[A-Z]/.test(pwd);
  const hasLowercase = (pwd: string) => /[a-z]/.test(pwd);
  const hasNumber = (pwd: string) => /[0-9]/.test(pwd);
  const hasSpecialChar = (pwd: string) => /[!@#$%&*]/.test(pwd);

  const validatePassword = (pwd: string): boolean => {
    return (
      hasMinLength(pwd) &&
      hasUppercase(pwd) &&
      hasLowercase(pwd) &&
      hasNumber(pwd) &&
      hasSpecialChar(pwd)
    );
  };

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    // Validate password
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password does not meet the required criteria';
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinish = () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    updateSignUpData({ password });
    
    setTimeout(() => {
      setLoading(false);
      
      Alert.alert(
        'Account created',
        'Your account has been created successfully. Please confirm your email.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            },
          },
        ]
      );
    }, 500);
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
                <ProgressBar progress={1.0} />
              </View>
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
                Create a <Text style={styles.titleAccent}>password</Text>
              </Text>
            </View>

            {/* Password Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Your password must contain:</Text>
              <Text style={styles.instructionItem}>• At least 8 characters</Text>
              <Text style={styles.instructionItem}>• At least one uppercase letter</Text>
              <Text style={styles.instructionItem}>• At least one lowercase letter</Text>
              <Text style={styles.instructionItem}>• At least one number</Text>
              <Text style={styles.instructionItem}>• At least one special character (!@#$%&*)</Text>
            </View>

            {/* Password Input Fields */}
            <View style={styles.form}>
              {/* Password Field */}
              <View style={styles.inputContainer}>
                <View style={styles.passwordInputWrapper}>
                  <TextInput
                    style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                    placeholder="Password"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) {
                        setErrors({ ...errors, password: undefined });
                      }
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color="rgba(255, 255, 255, 0.6)"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              {/* Confirm Password Field */}
              <View style={styles.inputContainer}>
                <View style={styles.passwordInputWrapper}>
                  <TextInput
                    style={[styles.input, styles.passwordInput, errors.confirmPassword && styles.inputError]}
                    placeholder="Re-enter your password"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (errors.confirmPassword) {
                        setErrors({ ...errors, confirmPassword: undefined });
                      }
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color="rgba(255, 255, 255, 0.6)"
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              </View>
            </View>
          </View>

          {/* Finish Button */}
          <TouchableOpacity
            style={[
              styles.finishButton,
              (loading || (password.length > 0 && (!validatePassword(password) || password !== confirmPassword))) && styles.buttonDisabled,
            ]}
            onPress={handleFinish}
            disabled={loading || (password.length > 0 && (!validatePassword(password) || password !== confirmPassword))}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.finishButtonText}>Finish</Text>
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
  instructionsContainer: {
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    marginBottom: 8,
  },
  instructionItem: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
    marginTop: 4,
    lineHeight: 20,
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
  inputContainer: {
    marginBottom: 18,
  },
  passwordInputWrapper: {
    position: 'relative',
  },
  input: {
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
  passwordInput: {
    paddingRight: 60,
  },
  eyeIcon: {
    position: 'absolute',
    right: 24,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    zIndex: 1,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 8,
    marginLeft: 24,
  },
  finishButton: {
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
  finishButtonText: {
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

