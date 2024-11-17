import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const ProgressScreen = () => {
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [workoutsCompleted, setWorkoutsCompleted] = useState(0);
  const [workoutData, setWorkoutData] = useState([]);
  const [dietData, setDietData] = useState([]);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [meal, setMeal] = useState("");
  const [mealCalories, setMealCalories] = useState("");
  const [cardios, setCardios] = useState([]);

  const loadProgressData = async () => {
    try {
      const progressData = await AsyncStorage.getItem('progress');
      if (progressData) {
        const parsedData = JSON.parse(progressData);
        setCaloriesBurned(parsedData.caloriesBurned || 0);
        setWorkoutsCompleted(parsedData.workoutsCompleted || 0);
        setWorkoutData(parsedData.workoutData || []);
        setDietData(parsedData.dietData || []);
        setCardios(parsedData.cardios || []);
      } else {
        Alert.alert('Informação', 'Nenhum dado de progresso encontrado.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar dados de progresso');
    }
  };

  const saveProgressData = async () => {
    const progressData = {
      caloriesBurned,
      workoutsCompleted,
      workoutData,
      dietData,
      cardios,
    };

    try {
      await AsyncStorage.setItem('progress', JSON.stringify(progressData));
      Alert.alert('Sucesso', 'Dados de progresso salvos com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar dados de progresso');
    }
  };

  const toggleTimer = () => {
    if (isTimerActive) {
      setCardios([...cardios, { time: workoutTime }]);
    }
    setIsTimerActive(!isTimerActive);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    let timer;
    if (isTimerActive) {
      timer = setInterval(() => {
        setWorkoutTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (workoutTime > 0) {
      setWorkoutTime(0);
    }
    return () => clearInterval(timer);
  }, [isTimerActive]);

  const addMeal = () => {
    if (meal && mealCalories) {
      const newMeal = { name: meal, calories: parseInt(mealCalories) };
      setDietData([...dietData, newMeal]);
      setMeal("");
      setMealCalories("");
    } else {
      Alert.alert("Erro", "Por favor, preencha todos os campos da refeição.");
    }
  };

  useEffect(() => {
    loadProgressData();
  }, []);

  const chartData = {
    labels: workoutData.length > 0 ? workoutData.map((data) => data.date) : ['Sem dados'],
    datasets: [
      {
        data: workoutData.length > 0 ? workoutData.map((data) => data.calories) : [0],
      },
    ],
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Progresso</Text>
        <Text style={styles.metrics}>Total de Calorias Queimadas: {caloriesBurned}</Text>
        <Text style={styles.metrics}>Total de Treinos Realizados: {workoutsCompleted}</Text>

        <Text style={styles.timerText}>Tempo de Cardio: {formatTime(workoutTime)}</Text>
        <TouchableOpacity style={styles.button} onPress={toggleTimer}>
          <Text style={styles.buttonText}>{isTimerActive ? "Parar Cardio" : "Iniciar Cardio"}</Text>
        </TouchableOpacity>

        <Text style={styles.chartTitle}>Histórico de Cardios</Text>
        <View style={styles.cardioHistory}>
          {cardios.length > 0 ? (
            cardios.map((cardio, index) => (
              <View key={index} style={styles.cardioItem}>
                <Text style={styles.cardioText}>Cardio {index + 1}</Text>
                <Text style={styles.cardioText}>{formatTime(cardio.time)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noCardioText}>Nenhum cardio registrado.</Text>
          )}
        </View>

        <Text style={styles.chartTitle}>Calorias Queimadas por Treino</Text>
        <BarChart
          data={chartData}
          width={340}
          height={220}
          fromZero
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#f0f0f0',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 87, 34, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />

        <TextInput style={styles.input} placeholder="Nome da Refeição" value={meal} onChangeText={setMeal} />
        <TextInput style={styles.input} placeholder="Calorias da Refeição" keyboardType="numeric" value={mealCalories} onChangeText={setMealCalories} />
        <TouchableOpacity style={styles.button} onPress={addMeal}>
          <Text style={styles.buttonText}>Adicionar Refeição</Text>
        </TouchableOpacity>

        <Text style={styles.chartTitle}>Dieta</Text>
        {dietData.length > 0 ? (
          dietData.map((meal, index) => (
            <Text key={index} style={styles.dietItem}>
              {meal.name}: {meal.calories} calorias
            </Text>
          ))
        ) : (
          <Text style={styles.dietItem}>Nenhuma refeição registrada.</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={saveProgressData}>
          <Text style={styles.buttonText}>Salvar Progresso</Text>
        </TouchableOpacity>
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
  metrics: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
  timerText: {
    fontSize: 20,
    marginVertical: 20,
    textAlign: 'center',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
    color: '#ff5722',
  },
  cardioHistory: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  cardioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginVertical: 4,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  cardioText: {
    fontSize: 16,
    color: '#333',
  },
  noCardioText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  dietItem: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
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
});

export default ProgressScreen;
