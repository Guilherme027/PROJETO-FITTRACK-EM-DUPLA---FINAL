import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL da API para gerenciar treinos
const API_URL = 'https://673d55b50118dbfe8606e723.mockapi.io/api/fittrack/workouts';

const WorkoutScreen = ({ navigation }) => {
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [newWorkoutDescription, setNewWorkoutDescription] = useState('');
  const [newWorkoutDay, setNewWorkoutDay] = useState('Segunda-feira');
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedWorkout, setExpandedWorkout] = useState(null); // Estado para controlar qual treino está expandido

  // Carregar treinos da API
  const loadWorkouts = async () => {
    try {
      const response = await axios.get(API_URL);
      setWorkouts(response.data);
      await AsyncStorage.setItem('workoutTotal', response.data.length.toString()); // Atualiza o total de treinos
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar treinos da API');
    }
  };

  // Adicionar ou editar treino
  const saveWorkout = async () => {
    if (newWorkoutName.trim()) {
      const workoutData = {
        name: newWorkoutName,
        description: newWorkoutDescription,
        day: newWorkoutDay,
        completed: false,
      };

      try {
        if (isEditing) {
          await axios.put(`${API_URL}/${selectedWorkout.id}`, workoutData);
          setWorkouts((prev) =>
            prev.map((workout) =>
              workout.id === selectedWorkout.id ? { ...workout, ...workoutData } : workout
            )
          );
        } else {
          const response = await axios.post(API_URL, workoutData);
          setWorkouts((prev) => [...prev, response.data]);
        }

        // Atualiza o total de treinos
        await AsyncStorage.setItem('workoutTotal', (workouts.length + 1).toString());

        setNewWorkoutName('');
        setNewWorkoutDescription('');
        setNewWorkoutDay('Segunda-feira');
        setModalVisible(false);
        setIsEditing(false);
      } catch (error) {
        Alert.alert('Erro', 'Erro ao salvar treino na API');
      }
    } else {
      Alert.alert('Validação', 'O nome do treino não pode estar vazio.');
    }
  };

  // Marcar treino como concluído/incompleto
  const toggleCompleted = async (workout) => {
    try {
      const updatedWorkout = { ...workout, completed: !workout.completed };
      await axios.put(`${API_URL}/${workout.id}`, updatedWorkout);
      setWorkouts((prev) =>
        prev.map((w) => (w.id === workout.id ? updatedWorkout : w))
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar treino');
    }
  };

  // Função para expandir ou retrair a descrição do treino
  const toggleExpand = (workoutId) => {
    if (expandedWorkout === workoutId) {
      setExpandedWorkout(null); // Se o treino já estiver expandido, recolhe
    } else {
      setExpandedWorkout(workoutId); // Expande o treino
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Treinos</Text>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.workoutItem}>
            <View style={styles.workoutHeader}>
              <Text style={item.completed ? styles.completedWorkout : styles.workoutName}>{item.name}</Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedWorkout(item);
                  setNewWorkoutName(item.name);
                  setNewWorkoutDescription(item.description);
                  setNewWorkoutDay(item.day);
                  setIsEditing(true);
                  setModalVisible(true);
                }}
              >
                <Icon name="edit" size={24} color="#ff5722" />
              </TouchableOpacity>
            </View>
            <Text style={styles.workoutDay}>Dia: {item.day}</Text>

            {/* Setinha para expandir a descrição */}
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Icon
                name={expandedWorkout === item.id ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={24}
                color="#ff5722"
              />
            </TouchableOpacity>

            {/* Mostrar descrição quando o treino for expandido */}
            {expandedWorkout === item.id && (
              <Text style={styles.workoutDescription}>{item.description}</Text>
            )}

            <TouchableOpacity onPress={() => toggleCompleted(item)}>
              <Text style={styles.toggleCompletion}>
                {item.completed ? 'Marcar como Incompleto' : 'Marcar como Completo'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? 'Editar Treino' : 'Adicionar Novo Treino'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do treino"
              value={newWorkoutName}
              onChangeText={setNewWorkoutName}
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição do treino"
              value={newWorkoutDescription}
              onChangeText={setNewWorkoutDescription}
            />
            <Picker
              selectedValue={newWorkoutDay}
              style={styles.picker}
              onValueChange={(itemValue) => setNewWorkoutDay(itemValue)}
            >
              <Picker.Item label="Segunda-feira" value="Segunda-feira" />
              <Picker.Item label="Terça-feira" value="Terça-feira" />
              <Picker.Item label="Quarta-feira" value="Quarta-feira" />
              <Picker.Item label="Quinta-feira" value="Quinta-feira" />
              <Picker.Item label="Sexta-feira" value="Sexta-feira" />
            </Picker>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={saveWorkout}>
                <Text style={styles.saveButton}>{isEditing ? 'Salvar' : 'Adicionar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButton}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Estilização
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  workoutItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completedWorkout: {
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  workoutDay: {
    color: 'gray',
  },
  toggleCompletion: {
    color: '#ff5722',
    marginTop: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ff5722',
    borderRadius: 50,
    padding: 15,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 15,
    fontSize: 16,
    paddingVertical: 5,
  },
  picker: {
    marginVertical: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  saveButton: {
    color: '#ff5722',
    fontWeight: 'bold',
  },
  cancelButton: {
    color: 'gray',
  },
  workoutDescription: {
    marginTop: 8,
    color: 'gray',
    fontStyle: 'italic',
  },
});

export default WorkoutScreen;
