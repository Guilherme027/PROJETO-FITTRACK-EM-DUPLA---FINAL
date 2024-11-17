import React, { useState, useEffect } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAuth = async () => {
    if (isSignup) {
      if (username === '') {
        setMessage('O nome de usuário não pode estar vazio.');
        return;
      }
      if (password === '') {
        setMessage('A senha não pode estar vazia.');
        return;
      }
      if (password === confirmPassword) {
        try {
          await AsyncStorage.setItem('user', JSON.stringify({ username, password }));
          setMessage('Cadastro realizado com sucesso!');
          setIsSignup(false);
        } catch (error) {
          setMessage('Erro ao tentar cadastrar.');
        }
      } else {
        setMessage('As senhas não coincidem.');
      }
    } else {
      if (username === '' || password === '') {
        setMessage('O nome de usuário e a senha não podem estar vazios.');
        return;
      }
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser?.username === username && parsedUser?.password === password) {
          setMessage('Login realizado com sucesso');
          await AsyncStorage.setItem('loggedIn', 'true');
          navigation.navigate('Home');
        } else {
          setMessage('Login inválido, tente novamente');
        }
      } catch (error) {
        setMessage('Erro ao tentar logar');
      }
    }
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = await AsyncStorage.getItem('loggedIn');
      if (isLoggedIn === 'true') {
        navigation.navigate('Home');
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/FITTRACK.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <TextInput
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#a9a9a9"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={[styles.input, styles.passwordInput]}
          placeholderTextColor="#a9a9a9"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.toggleText}>
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </Text>
        </TouchableOpacity>
      </View>
      {isSignup && (
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={[styles.input, styles.passwordInput]}
            placeholderTextColor="#a9a9a9"
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Text style={styles.toggleText}>
              {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Button title={isSignup ? 'Cadastrar' : 'Logar'} onPress={handleAuth} color="#ff5722" />
      <TouchableOpacity onPress={() => setIsSignup(!isSignup)} style={styles.signupButton}>
        <Text style={styles.signupText}>
          {isSignup ? 'Já tem uma conta? Faça Login' : 'Não tem uma conta? Cadastre-se'}
        </Text>
      </TouchableOpacity>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffefdb',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logo: {
    width: 250,
    height: 100,
    alignSelf: 'center',
    marginBottom: 32,
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
  },
  toggleText: {
    color: '#ff5722',
    paddingHorizontal: 8,
    fontSize: 16,
  },
  signupButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  signupText: {
    color: '#ff5722',
  },
  message: {
    marginTop: 16,
    color: '#ff5722',
    textAlign: 'center',
  },
});

export default LoginScreen;
