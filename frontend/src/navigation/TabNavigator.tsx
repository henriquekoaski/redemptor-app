import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from '../components/CustomTabBar';
import HomeScreen from '../screens/HomeScreen';
import PlannerScreen from '../screens/PlannerScreen';
import ExploreScreen from '../screens/ExploreScreen';
import JourneyScreen from '../screens/JourneyScreen';

export type TabParamList = {
  Home: undefined;
  Planner: undefined;
  FireAction: undefined;
  Explore: undefined;
  Journey: undefined;
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
        name="Journey"
        component={JourneyScreen}
        options={{
          tabBarIcon: () => null, // Icon handled in CustomTabBar
        }}
      />
    </Tab.Navigator>
  );
}
