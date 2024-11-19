import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CardioScreen = () => {
  const [workoutTime, setWorkoutTime] = useState(0); // Tempo do treino em segundos
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [cardios, setCardios] = useState([]); // Lista de cardios salvos

  useEffect(() => {
    // Carregar os cardios salvos ao iniciar o componente
    const loadCardios = async () => {
      try {
        const savedCardios = await AsyncStorage.getItem('cardios');
        if (savedCardios) {
          setCardios(JSON.parse(savedCardios));
        }
      } catch (error) {
        console.error('Erro ao carregar os cardios:', error);
      }
    };

    loadCardios();
  }, []);

  useEffect(() => {
    let timer;
    if (isTimerActive) {
      timer = setInterval(() => {
        setWorkoutTime((prev) => prev + 1);
      }, 1000);
    } else if (!isTimerActive && workoutTime !== 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isTimerActive]);

  // Função para alternar entre iniciar e pausar o timer
  const toggleTimer = () => {
    setIsTimerActive((prev) => !prev);
  };

  // Função para finalizar o cardio e salvar o tempo
  const resetTimer = async () => {
    setIsTimerActive(false);
    const timeFormatted = formatTime(workoutTime); // Formatar tempo
    Alert.alert('Cardio Finalizado', `Tempo Total: ${timeFormatted}`, [
      {
        text: 'OK',
        onPress: async () => {
          await saveCardioTime(workoutTime); // Salvar o tempo no AsyncStorage
          setWorkoutTime(0); // Resetar o tempo
        },
      },
    ]);
  };

  // Função para formatar o tempo em minutos e segundos
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Função para salvar o tempo do cardio no AsyncStorage
  const saveCardioTime = async (timeInSeconds) => {
    try {
      // Recupera os cardios já salvos
      const existingCardios = await AsyncStorage.getItem('cardios');
      const updatedCardios = existingCardios ? JSON.parse(existingCardios) : [];

      // Cria um novo registro com o tempo formatado
      const newCardio = {
        id: Date.now().toString(),
        time: formatTime(timeInSeconds),
        date: new Date().toLocaleDateString(),
      };

      // Adiciona o novo cardio na lista
      updatedCardios.push(newCardio);

      // Salva a lista atualizada no AsyncStorage
      await AsyncStorage.setItem('cardios', JSON.stringify(updatedCardios));
      
      // Atualiza a lista de cardios no estado
      setCardios(updatedCardios);
    } catch (error) {
      console.error('Erro ao salvar o cardio:', error);
    }
  };

  // Função para renderizar os itens da lista de cardios
  const renderCardioItem = ({ item }) => (
    <View style={styles.cardioItem}>
      <Text style={styles.cardioText}>
        {item.date} - {item.time}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitorando Cardio</Text>
      <Text style={styles.timer}>{formatTime(workoutTime)}</Text>

      <TouchableOpacity style={styles.button} onPress={toggleTimer}>
        <Text style={styles.buttonText}>{isTimerActive ? 'Pausar' : 'Iniciar'}</Text>
      </TouchableOpacity>

      {isTimerActive && (
        <TouchableOpacity style={styles.button} onPress={resetTimer}>
          <Text style={styles.buttonText}>Finalizar Cardio</Text>
        </TouchableOpacity>
      )}

      {/* Lista de Cardios Feitos */}
      <Text style={styles.historyTitle}>Histórico de Cardios</Text>
      <FlatList
        data={cardios}
        renderItem={renderCardioItem}
        keyExtractor={(item) => item.id}
        style={styles.cardioList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffefdb',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff5722',
    marginBottom: 20,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#ff5722',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 30,
    marginBottom: 10,
  },
  cardioList: {
    width: '100%',
    marginTop: 10,
  },
  cardioItem: {
    backgroundColor: '#ff5722',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardioText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CardioScreen;
