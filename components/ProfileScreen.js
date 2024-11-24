import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const API_URL = 'https://673d55b50118dbfe8606e723.mockapi.io/api/fittrack/users';

const ProfileScreen = ({ route }) => {
  const { id } = route.params || {}; // Obtendo o parâmetro id corretamente

  // Verifique se o id existe
  if (!id) {
    Alert.alert('Erro', 'ID do usuário não encontrado.');
    return null; // Ou redirecionar para a tela de login
  }

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        const { userName, email, height, weight } = response.data;

        setUserName(userName || '');
        setEmail(email || '');
        setHeight(height || '');
        setWeight(weight || '');
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]); // Corrigido de 'idd' para 'id'

  const saveProfile = async () => {
    try {
      await axios.put(`${API_URL}/${id}`, {
        userName,
        email,
        height,
        weight,
      });
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados do usuário.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      <TextInput
        placeholder="Nome"
        value={userName}
        onChangeText={setUserName}
        style={styles.input}
        editable={isEditing}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        editable={isEditing}
      />
      <TextInput
        placeholder="Altura"
        value={height}
        onChangeText={setHeight}
        style={styles.input}
        editable={isEditing}
      />
      <TextInput
        placeholder="Peso"
        value={weight}
        onChangeText={setWeight}
        style={styles.input}
        editable={isEditing}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={isEditing ? saveProfile : () => setIsEditing(true)}
      >
        <Text style={styles.buttonText}>{isEditing ? 'Salvar' : 'Editar'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffefdb',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#ff5722',
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfileScreen;
