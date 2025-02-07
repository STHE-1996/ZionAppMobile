import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // For navigation

const VerificationScreen = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation(); // Use navigation hook

//   const handleInputChange = (text) => {
//     // Ensure only numbers are entered and limit to 5 digits
//     if (text.length <= 5 && /^[0-9]*$/.test(text)) {
//       setVerificationCode(text);
//     }
//   };

//   const handleVerify = () => {
//     // Example of verification check (you'd replace this with your actual verification logic)
//     if (verificationCode === '12345') {
//       // If verification is successful, navigate to the next screen
//       navigation.navigate('NextScreen'); // Replace with your next screen name
//     } else {
//       setError('Invalid code. Please try again.');
//     }
//   };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>Please enter the 5-digit code sent to your email or phone.</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 5-digit code"
        value={verificationCode}
        // onChangeText={handleInputChange}
        keyboardType="numeric"
        maxLength={5}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
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
