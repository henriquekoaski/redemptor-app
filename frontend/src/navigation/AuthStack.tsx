import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpOptionsScreen from '../screens/auth/SignUpOptionsScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import SignUpEmailScreen from '../screens/auth/signup/SignUpEmailScreen';
import SignUpNameScreen from '../screens/auth/signup/SignUpNameScreen';
import SignUpBirthdateScreen from '../screens/auth/signup/SignUpBirthdateScreen';
import SignUpGenderScreen from '../screens/auth/signup/SignUpGenderScreen';
import SignUpPasswordScreen from '../screens/auth/signup/SignUpPasswordScreen';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUpEmail: undefined;
  SignUpName: undefined;
  SignUpBirthdate: undefined;
  SignUpGender: undefined;
  SignUpPassword: undefined;
  SignUpOptions: undefined;
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000' },
      }}
      initialRouteName="SignIn"
    >
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUpOptions" component={SignUpOptionsScreen} />
      <Stack.Screen name="SignUpEmail" component={SignUpEmailScreen} />
      <Stack.Screen name="SignUpName" component={SignUpNameScreen} />
      <Stack.Screen name="SignUpBirthdate" component={SignUpBirthdateScreen} />
      <Stack.Screen name="SignUpGender" component={SignUpGenderScreen} />
      <Stack.Screen name="SignUpPassword" component={SignUpPasswordScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

