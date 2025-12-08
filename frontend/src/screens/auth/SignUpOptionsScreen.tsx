import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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

type SignUpOptionsScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUpOptions'>;

const ACCENT_ORANGE = '#F66729';
const DARK_BACKGROUND = '#0D0A10';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SignUpOptionsScreen() {
  const navigation = useNavigation<SignUpOptionsScreenNavigationProp>();

  const handleAppleSignUp = () => {
    // TODO: Implement Apple sign up
    console.log('Apple sign up pressed');
  };

  const handleEmailSignUp = () => {
    navigation.navigate('SignUpEmail');
  };

  const handleSignIn = () => {
    navigation.navigate('SignIn');
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
            {/* Back Arrow */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
                Create your <Text style={styles.titleAccent}>Account</Text>
              </Text>
              <Text style={styles.subtitle}>
                Choose how you want to create your account.
              </Text>
            </View>

            {/* Buttons Container */}
            <View style={styles.buttonsContainer}>
              {/* Apple Button */}
              <TouchableOpacity
                style={styles.appleButton}
                onPress={handleAppleSignUp}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-apple" size={22} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.appleButtonText}>Sign up with Apple</Text>
              </TouchableOpacity>

              {/* Email Button */}
              <TouchableOpacity
                style={styles.emailButton}
                onPress={handleEmailSignUp}
                activeOpacity={0.8}
              >
                <Ionicons name="mail" size={22} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.emailButtonText}>Sign up with Email</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Navigation */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleSignIn} activeOpacity={0.7}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
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
  },
  topSection: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  titleContainer: {
    marginBottom: 20,
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
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 12,
    fontWeight: '400',
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: SCREEN_WIDTH * 0.92,
    alignSelf: 'center',
    marginTop: 20,
  },
  appleButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    borderWidth: 0,
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
  appleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  emailButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT_ORANGE,
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 24,
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
  emailButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  buttonIcon: {
    marginRight: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 15,
  },
  footerLink: {
    color: ACCENT_ORANGE,
    fontSize: 15,
    fontWeight: '600',
  },
});

