import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importações das telas
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import MealScreen from './components/MealScreen'; // Atualizado para MealScreen
import WorkoutScreen from './components/WorkoutScreen';
import WorkoutDetailsScreen from './components/WorkoutDetailsScreen';
import ProfileScreen from './components/ProfileScreen';
import CardioScreen from './components/CardioScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Tela de login */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Login' }} 
        />
        
        {/* Tela principal (Home) */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Página Inicial' }} 
        />
        
        {/* Tela de refeição (substituindo Progresso) */}
        <Stack.Screen 
          name="Meal" // Alterado de Progress para Meal
          component={MealScreen} // Alterado de ProgressScreen para MealScreen
          options={{ title: 'Refeições' }} // Alterado o título para Refeições
        />
        
        {/* Tela de treinos */}
        <Stack.Screen 
          name="Workout" 
          component={WorkoutScreen} 
          options={{ title: 'Treinos' }} 
        />
        
        {/* Tela de detalhes do treino */}
        <Stack.Screen 
          name="WorkoutDetails" 
          component={WorkoutDetailsScreen} 
          options={{ title: 'Detalhes do Treino' }} 
        />
        
        {/* Tela de perfil */}
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Meu Perfil' }} 
        />
        
        {/* Tela de cardio */}
        <Stack.Screen 
          name="Cardio" 
          component={CardioScreen} 
          options={{ title: 'Treino Cardio' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
