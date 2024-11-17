import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import ProgressScreen from './components/ProgressScreen';
import WorkoutScreen from './components/WorkoutScreen';
import WorkoutDetailsScreen from './components/WorkoutDetailsScreen'; 
import ProfileScreen from './components/ProfileScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="Workout" component={WorkoutScreen} />
        <Stack.Screen 
          name="WorkoutDetails" 
          component={WorkoutDetailsScreen} 
          options={{ title: 'Detalhes do Treino' }} 
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
