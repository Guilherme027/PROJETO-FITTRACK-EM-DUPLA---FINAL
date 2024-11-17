import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WorkoutScreen = ({ navigation }) => {
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [newWorkoutDescription, setNewWorkoutDescription] = useState('');
  const [newWorkoutDay, setNewWorkoutDay] = useState('Segunda-feira');
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadWorkouts = async () => {
    try {
      const storedWorkouts = await AsyncStorage.getItem('workouts');
      if (storedWorkouts) {
        setWorkouts(JSON.parse(storedWorkouts));
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar treinos');
    }
  };

  const saveWorkout = async () => {
    if (newWorkoutName.trim()) {
      let updatedWorkouts;
      if (isEditing) {
        updatedWorkouts = workouts.map((workout) =>
          workout.id === selectedWorkout.id
            ? { ...selectedWorkout, name: newWorkoutName, description: newWorkoutDescription, day: newWorkoutDay }
            : workout
        );
      } else {
        const newWorkout = {
          id: Date.now(),
          name: newWorkoutName,
          description: newWorkoutDescription,
          day: newWorkoutDay,
          completed: false,
        };
        updatedWorkouts = [...workouts, newWorkout];
        
        // Atualizar o total de treinos no AsyncStorage
        const totalWorkouts = await AsyncStorage.getItem('workoutTotal');
        const newTotalWorkouts = totalWorkouts ? parseInt(totalWorkouts, 10) + 1 : 1;
        await AsyncStorage.setItem('workoutTotal', newTotalWorkouts.toString());
      }

      try {
        await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
        setWorkouts(updatedWorkouts);
        setNewWorkoutName('');
        setNewWorkoutDescription('');
        setNewWorkoutDay('Segunda-feira');
        setModalVisible(false);
        setIsEditing(false);
      } catch (error) {
        Alert.alert('Erro', 'Erro ao salvar treino');
      }
    } else {
      Alert.alert('Validação', 'O nome do treino não pode estar vazio.');
    }
  };

  const editWorkout = (workout) => {
    setSelectedWorkout(workout);
    setNewWorkoutName(workout.name);
    setNewWorkoutDescription(workout.description);
    setNewWorkoutDay(workout.day);
    setIsEditing(true);
    setModalVisible(true);
  };

  const toggleCompleted = async (workout) => {
    const updatedWorkouts = workouts.map((w) =>
      w.id === workout.id ? { ...w, completed: !w.completed } : w
    );

    try {
      await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
      setWorkouts(updatedWorkouts);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar treino');
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
              <TouchableOpacity onPress={() => editWorkout(item)}>
                <Icon name="edit" size={24} color="#ff5722" />
              </TouchableOpacity>
            </View>
            <Text style={styles.workoutDay}>Dia: {item.day}</Text>
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
});

export default WorkoutScreen;
