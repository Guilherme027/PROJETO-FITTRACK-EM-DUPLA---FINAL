import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [recentWorkouts, setRecentWorkouts] = useState([]); // Armazenar os treinos recentes

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      const storedWorkouts = await AsyncStorage.getItem('workoutTotal');
      const workouts = storedWorkouts ? parseInt(storedWorkouts, 10) : 0;
      const recent = await AsyncStorage.getItem('recentWorkouts');
      const workoutsList = recent ? JSON.parse(recent) : []; // Carregar treinos recentes

      if (name) {
        setUserName(name);
      }
      setTotalWorkouts(workouts);
      setRecentWorkouts(workoutsList);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  useEffect(() => {
    const focusListener = navigation.addListener('focus', loadUserData);
    return focusListener;
  }, [navigation]);

  const handleLogout = async () => {
    Alert.alert('Sair', 'Você tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        onPress: async () => {
          await AsyncStorage.removeItem('userName');
          await AsyncStorage.removeItem('loggedIn');
          navigation.navigate('Login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.userName}>{userName}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Icon name="logout" size={24} color="#ff5722" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Bem-vindo ao FITTRACK!</Text>

      <View style={styles.card}>
        <Text style={styles.metrics}>Seus Passos:</Text>
        <Text style={styles.metricItem}>
          Total de Treinos: <Text style={styles.metricValue}>{totalWorkouts}</Text>
        </Text>
        <Text style={styles.metricItem}>
          Progresso Diário: <Text style={styles.metricValue}>500 Calorias Queimadas</Text>
        </Text>
      </View>

      {/* Exibição de treinos recentes */}
      <View style={styles.recentWorkoutsContainer}>
        <Text style={styles.recentWorkoutsTitle}>Últimos Treinos</Text>
        {recentWorkouts.length > 0 ? (
          <ScrollView style={styles.recentWorkoutsList}>
            {recentWorkouts.map((workout, index) => (
              <View key={index} style={styles.workoutItem}>
                <Text style={styles.workoutText}>
                  {workout.name} - {workout.calories} Calorias
                </Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noWorkouts}>Nenhum treino recente.</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Workout')}>
          <Text style={styles.buttonText}>Ver Treinos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Progress')}>
          <Text style={styles.buttonText}>Ver Progresso</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.buttonText}>Meu Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffefdb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff5722',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff5722',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  metrics: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  metricItem: {
    fontSize: 16,
    marginVertical: 5,
    color: '#666',
  },
  metricValue: {
    fontWeight: 'bold',
    color: '#ff5722',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ff5722',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  recentWorkoutsContainer: {
    marginBottom: 20,
  },
  recentWorkoutsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff5722',
    textAlign: 'center',
  },
  recentWorkoutsList: {
    maxHeight: 150,
  },
  workoutItem: {
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  workoutText: {
    fontSize: 16,
    color: '#333',
  },
  noWorkouts: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
});

export default HomeScreen;
