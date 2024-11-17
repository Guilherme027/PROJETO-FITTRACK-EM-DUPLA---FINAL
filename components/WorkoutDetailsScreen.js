import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WorkoutDetailsScreen = ({ route }) => {
  const { workout } = route.params; // Recebendo o treino passado pela navegação

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{workout.name}</Text>
      <Text style={styles.description}>Descrição: {workout.description || 'Sem descrição'}</Text>
      <Text style={styles.day}>Dia da Semana: {workout.day}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffefdb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ff5722',
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
  },
  day: {
    fontSize: 18,
    color: '#ff5722',
  },
});

export default WorkoutDetailsScreen;
