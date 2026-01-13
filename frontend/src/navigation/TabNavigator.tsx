import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from '../components/CustomTabBar';
import HomeScreen from '../screens/HomeScreen';
import PlannerScreen from '../screens/PlannerScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ProgressScreen from '../screens/ProgressScreen';

export type TabParamList = {
  Home: undefined;
  Planner: undefined;
  FireAction: undefined;
  Explore: undefined;
  Progress: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => null, // Icon handled in CustomTabBar
        }}
      />
      <Tab.Screen
        name="Planner"
        component={PlannerScreen}
        options={{
          tabBarIcon: () => null, // Icon handled in CustomTabBar
        }}
      />
      <Tab.Screen
        name="FireAction"
        component={HomeScreen} // Placeholder, navigation handled in CustomTabBar
        options={{
          tabBarIcon: () => null, // Icon handled in CustomTabBar
          tabBarButton: () => null, // Button handled in CustomTabBar
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // Prevent default navigation
          },
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: () => null, // Icon handled in CustomTabBar
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: () => null, // Icon handled in CustomTabBar
        }}
      />
    </Tab.Navigator>
  );
}
