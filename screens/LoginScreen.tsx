import React, { useState } from 'react';
import { Image,View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Button } from 'react-native';
import { loginUser } from '../services/apiService';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
// import { loginUser } from './services/apiService';  // import the login service
import { WebView } from 'react-native-webview';

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ message: '', type: '' });
  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleLogin = async () => {
    if (whatsappNumber === '' || password === '') {
      setModalContent({ message: 'Please enter both WhatsApp number and password', type: 'error' });
      showModal();
      return;
    }
    setLoading(true);

    try {
      const data = await loginUser(whatsappNumber, password);
      if (data) {
        // If the login is successful, you can navigate to the home screen
        setModalContent({ message: `Login Successful! Welcome ${whatsappNumber}`, type: 'success' });
        showModal();
        navigation.navigate('Main');
      }
    } catch (error) {
      setModalContent({ message: 'Login Failed! Invalid credentials or server error', type: 'error' });
      showModal();
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
        secureTextEntry={!showPassword}
        // secureTextEntry
      />
      <View style={styles.row}>
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.checkboxContainer}
                >
                  <Text>{showPassword ? 'Hide' : 'Show'} password</Text>
                </TouchableOpacity>
              </View>

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
      <Modal isVisible={isModalVisible} onBackdropPress={hideModal}>
  <View style={styles.modalContent}>
    <Text>{modalContent.message}</Text>

    {modalContent.type === 'error' ? (
      <WebView
        originWhitelist={['*']}
        source={{
          uri: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHU4MXBhaGt2aDFibzQyaHFjMmtnM2UwM283cGcwdHpkNTYxZ2t1ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9ZQ/hp3dmEypS0FaoyzWLR/giphy.gif',
        }}
        style={[styles.gif, { backgroundColor: 'transparent' }]} // Adding transparent background here
        javaScriptEnabled={true} // This is optional, but helps to ensure everything is working in the WebView
        domStorageEnabled={true} // Ensures better compatibility with media content
      />
    ) : null}

    {modalContent.type === 'success' ? (
      <WebView
        originWhitelist={['*']}
        source={{
          uri: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExejhkaHAxa2Z6bmh1MGszazZwbXNuNHJuZ2FqcDd4dml2Y2V4YWx5aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9ZQ/lRXY41yFFi9RfNXyPN/giphy.gif',
        }}
        style={[styles.gif, { backgroundColor: 'transparent' }]} // Adding transparent background here as well
        javaScriptEnabled={true} // Optional
        domStorageEnabled={true} // Optional
      />
    ) : null}
    
    <Button title="Close" onPress={hideModal} />
  </View>
</Modal>

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
  modalContent: {
    width: 360, // Set your desired width
    height: 320, // Set your desired height (same as width for square shape)
    backgroundColor: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10, // Optional: for rounded corners
  },
  gif: {
    width: 200,
    height: 200,
    marginTop: 20,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default LoginScreen;
