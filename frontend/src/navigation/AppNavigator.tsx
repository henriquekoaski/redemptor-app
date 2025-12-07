import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import HomeScreen from "../screens/HomeScreen";
import AuthStack from "./AuthStack";

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  useEffect(() => {
    if (navigationRef.isReady()) {
      if (isAuthenticated) {
        navigationRef.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        navigationRef.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
      }
    }
  }, [isAuthenticated, navigationRef]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName={isAuthenticated ? 'Home' : 'Auth'}
      >
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
