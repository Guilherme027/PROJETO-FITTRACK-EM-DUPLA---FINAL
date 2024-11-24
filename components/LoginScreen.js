import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import axios from 'axios';

const API_URL = 'https://673d55b50118dbfe8606e723.mockapi.io/api/fittrack/users';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleAuth = async () => {
    if (isSignup) {
      // Cadastro de usuário
      if (password !== confirmPassword) {
        Alert.alert('Erro', 'As senhas não coincidem!');
        return;
      }

      try {
        await axios.post(API_URL, {
          userName: username,
          password,
        });
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        setIsSignup(false); // Volta para a tela de login
      } catch (error) {
        Alert.alert('Erro', 'Erro ao cadastrar usuário.');
      }
    } else {
      // Login de usuário
      try {
        const response = await axios.get(API_URL);
        const users = response.data;

        const user = users.find(
          (u) => u.userName === username && u.password === password
        );

        if (user) {
          Alert.alert('Sucesso', 'Login realizado com sucesso!');
          navigation.navigate('Home', { userId: user.id }); // Agora redireciona para a tela Home
        } else {
          Alert.alert('Erro', 'Usuário ou senha inválidos.');
        }
      } catch (error) {
        Alert.alert('Erro', 'Erro ao realizar login.');
      }
    }

    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

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
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Text style={styles.toggleText}>
              {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Button
        title={isSignup ? 'Cadastrar' : 'Logar'}
        onPress={handleAuth}
        color="#ff5722"
      />
      <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
        <Text style={styles.signupText}>
          {isSignup
            ? 'Já tem uma conta? Faça Login'
            : 'Não tem uma conta? Cadastre-se'}
        </Text>
      </TouchableOpacity>
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
  signupText: {
    color: '#ff5722',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default LoginScreen;
