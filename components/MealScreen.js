import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

const MealScreen = () => {
  const [dietData, setDietData] = useState([]);

  // Refeições predefinidas
  const predefinedMeals = [
    { name: 'Almoço', calories: 600 },
    { name: 'Café da Manhã', calories: 300 },
    { name: 'Jantar', calories: 500 },
  ];

  // Função para carregar as refeições salvas do AsyncStorage
  const loadMealsData = async () => {
    try {
      const savedMeals = await AsyncStorage.getItem('dietData');
      if (savedMeals) {
        setDietData(JSON.parse(savedMeals));
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar as refeições registradas.');
    }
  };

  // Função para adicionar refeição predefinida ao histórico
  const addPredefinedMeal = async (meal) => {
    const updatedDietData = [...dietData, meal];
    try {
      await AsyncStorage.setItem('dietData', JSON.stringify(updatedDietData));
      setDietData(updatedDietData);
      Alert.alert('Sucesso', `${meal.name} adicionada com sucesso!`);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar a refeição.');
    }
  };

  // Carregar as refeições ao iniciar o componente
  useEffect(() => {
    loadMealsData();
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Registrar Refeições</Text>

        <Text style={styles.historyTitle}>Refeições Predefinidas</Text>
        {predefinedMeals.map((meal, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => addPredefinedMeal(meal)}
          >
            <Text style={styles.buttonText}>
              {meal.name} - {meal.calories} calorias
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.historyTitle}>Refeições Registradas</Text>
        {dietData.length > 0 ? (
          dietData.map((meal, index) => (
            <Text key={index} style={styles.dietItem}>
              {meal.name}: {meal.calories} calorias
            </Text>
          ))
        ) : (
          <Text style={styles.dietItem}>Nenhuma refeição registrada.</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffefdb',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ff5722',
    textAlign: 'center',
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
    color: '#ff5722',
  },
  button: {
    backgroundColor: '#ff5722',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dietItem: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
  },
});

export default MealScreen;
