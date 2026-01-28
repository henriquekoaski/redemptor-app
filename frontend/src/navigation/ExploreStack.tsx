import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExploreScreen from '../screens/ExploreScreen';
import HabitDetailScreen from '../screens/HabitDetailScreen';
import { Habit } from '../data/habitsData';

export type ExploreStackParamList = {
  ExploreMain: undefined;
  HabitDetail: { habit: Habit };
};

const Stack = createNativeStackNavigator<ExploreStackParamList>();

export default function ExploreStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ExploreMain" component={ExploreScreen} />
      <Stack.Screen 
        name="HabitDetail" 
        component={HabitDetailScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}

