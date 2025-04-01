import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // For navigation
import { verifyAccount } from '../services/apiService';

const VerificationScreen = ({ navigation }: { navigation: any }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');

  const handleInputChange = (text:string) => {
    // Ensure only numbers are entered and limit to 5 digits
    if (text.length <= 5 && /^[0-9]*$/.test(text)) {
      setVerificationCode(text);
    }
  };

  const handleVerify = async () => {
    try {
      const message = await verifyAccount(verificationCode);
      setVerificationMessage(message); 
      navigation.navigate('Login');
      setError('');  
    } catch (err:any) {
      setError(err.message); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>Please enter the 5-digit code sent to your email or phone.</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 5-digit code"
        value={verificationCode}
        onChangeText={handleInputChange}
        keyboardType="numeric"
        maxLength={5}
      />
      <TouchableOpacity style={styles.button}  onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
      {verificationMessage ? <Text>{verificationMessage}</Text> : null}
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0FBFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0055FF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
    width: '80%',
    textAlign: 'center',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#00E5FF',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VerificationScreen;
