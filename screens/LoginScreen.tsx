import React, { useState } from 'react';
import { Image,View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Button } from 'react-native';
import { loginUser } from '../services/apiService';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
// import { loginUser } from './services/apiService';  // import the login service
import { WebView } from 'react-native-webview';
import { Video } from 'expo-av';


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
      <Modal
  isVisible={isModalVisible}
  onBackdropPress={hideModal}
  backdropColor="transparent"
  style={{ margin: 0 }} // full-screen, no default margin
>
  <View style={styles.modalContent}>
    <Text>{modalContent.message}</Text>

     {modalContent.type === 'success' && (
      <Video
        source={require('../assets/love.gif')}
        style={styles.gif}
        shouldPlay
        isLooping
        resizeMode="contain"
        isMuted
      />
    )}

    {modalContent.type === 'error' && (
      <Video
        source={require('../assets/error.gif - Online GIF to MP4 Video converter.mp4')}
        style={styles.gif}
        shouldPlay
        isLooping
        resizeMode="contain"
        isMuted
      />
    )}
    
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
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center', // 👈 Add this
  width: 320,          // Optional fixed width
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
