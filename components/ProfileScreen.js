import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Estado para alternar entre visualização e edição

  useEffect(() => {
    const loadUserData = async () => {
      const storedUserName = await AsyncStorage.getItem('userName');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedHeight = await AsyncStorage.getItem('height');
      const storedWeight = await AsyncStorage.getItem('weight');

      if (storedUserName) setUserName(storedUserName);
      if (storedEmail) setEmail(storedEmail);
      if (storedHeight) setHeight(storedHeight);
      if (storedWeight) setWeight(storedWeight);
    };

    loadUserData();
  }, []);

  const saveProfile = async () => {
    await AsyncStorage.setItem('userName', userName);
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('height', height);
    await AsyncStorage.setItem('weight', weight);
    Alert.alert('Perfil atualizado com sucesso!');
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      {/* Campo de Nome */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nome:</Text>
        {isEditing ? (
          <TextInput
            value={userName}
            onChangeText={setUserName}
            style={styles.input}
          />
        ) : (
          <Text style={styles.infoText}>{userName}</Text>
        )}
      </View>

      {/* Campo de Email */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        {isEditing ? (
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
        ) : (
          <Text style={styles.infoText}>{email}</Text>
        )}
      </View>

      {/* Campo de Altura */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Altura:</Text>
        {isEditing ? (
          <TextInput
            value={height}
            onChangeText={setHeight}
            style={styles.input}
            keyboardType="numeric"
          />
        ) : (
          <Text style={styles.infoText}>{height} cm</Text>
        )}
      </View>

      {/* Campo de Peso */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Peso:</Text>
        {isEditing ? (
          <TextInput
            value={weight}
            onChangeText={setWeight}
            style={styles.input}
            keyboardType="numeric"
          />
        ) : (
          <Text style={styles.infoText}>{weight} kg</Text>
        )}
      </View>

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
    padding: 20,
    backgroundColor: '#ffefdb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ff5722',
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#ff5722',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
