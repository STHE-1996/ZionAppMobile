import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { loginUser } from '../services/apiService';
// import { loginUser } from './services/apiService';  // import the login service

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (whatsappNumber === '' || password === '') {
      Alert.alert('Validation Error', 'Please enter both WhatsApp number and password');
      return;
    }
    setLoading(true);

    try {
      const data = await loginUser(whatsappNumber, password);
      if (data) {
        // If the login is successful, you can navigate to the home screen
        Alert.alert('Login Successful', `Welcome ${whatsappNumber}`);
        // Example navigation to home screen after successful login
        navigation.navigate('HomeScreen');
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials or server error');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
       <View style={styles.card}>
      <Text style={styles.header}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your WhatsApp number"
        value={whatsappNumber}
        onChangeText={setWhatsappNumber}
        keyboardType="phone-pad"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => {
            // Navigate to RegisterScreen when clicked
            navigation.navigate('RegisterScreen');
          }}>
          <Text style={styles.footerLink}>Sign up here</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F0F0',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: '#D0F8FF', // Light cyan to match your image
    borderRadius: 20, // Softer rounded corners
    borderWidth: 1,
    borderColor: '#7FE7FD', // Border matching the theme
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: 'rgb(1, 235, 252)',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#333',
  },
  footerLink: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default LoginScreen;
