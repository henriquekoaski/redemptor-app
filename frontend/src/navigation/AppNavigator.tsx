import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import TabNavigator from "./TabNavigator";
import AuthStack from "./AuthStack";
import CreateHabitScreen from "../screens/CreateHabitScreen";

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  CreateHabit: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  // TEMPORÁRIO: Desabilitado durante desenvolvimento para iniciar direto na Home
  // useEffect(() => {
  //   if (navigationRef.isReady()) {
  //     if (isAuthenticated) {
  //       navigationRef.reset({
  //         index: 0,
  //         routes: [{ name: 'Home' }],
  //       });
  //     } else {
  //       navigationRef.reset({
  //         index: 0,
  //         routes: [{ name: 'Auth' }],
  //       });
  //     }
  //   }
  // }, [isAuthenticated, navigationRef]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName="MainTabs" // TEMPORÁRIO: Forçado para MainTabs durante desenvolvimento
      >
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen 
          name="CreateHabit" 
          component={CreateHabitScreen}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
