import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ChurchNames, registerUser } from '../services/apiService'; // Import the register function
import { Province as fetchProvinces } from '../services/apiService'; // Import functions
import { Province } from '../models/Province';
import { Church } from '../models/ChurchNames';

const RegistrationScreen = ({ navigation }: { navigation: any }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    username: '',
    whatsappNumber: '',
    church: '', // Will store the selected church
    gender: '',
    province: '',
    zionType: '',
    email: '',
    password: '',
    confirmPassword: '',
    churchName: '', // Initially empty for a selected church or custom input
    enterChurchName: '', // Will hold custom church name if "NOT_AVAILABLE" is selected
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [churches, setChurches] = useState<Church[]>([]);

  useEffect(() => {
    const fetchProvincesData = async () => {
      try {
        const provinceData = await fetchProvinces();
        setProvinces(provinceData);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    const fetchChurchesData = async () => {
      try {
        const churchData = await ChurchNames();
        setChurches(churchData);
      } catch (error) {
        console.error('Error fetching churches:', error);
      }
    };

    fetchProvincesData();
    fetchChurchesData();
  }, []);

  const handleInputChange = (key: string, value: string) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [key]: value };

      // If church is selected (not "NOT_AVAILABLE"), ensure enterChurchName is cleared
      if (key === 'church' && value !== 'NOT_AVAILABLE') {
        updatedData.churchName = ''; // Clear the custom church name
        updatedData.enterChurchName = ''; // Clear the custom entered name
      }

      return updatedData;
    });
  };

  const handleSubmit = async () => {
    const registrationData = {
      firstName: formData.firstName,
      secondName: formData.secondName,
      username: formData.username,
      whatsappNumber: formData.whatsappNumber,
      email: formData.email,
      churchName: formData.church === 'NOT_AVAILABLE' ? formData.enterChurchName : formData.church, 
      enterChurchName: formData.church === 'NOT_AVAILABLE' ? formData.enterChurchName : '',
      zionType: formData.zionType,
      gender: formData.gender,
      province: formData.province,
      profilePictureUrl: '', // Optional
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    try {
      const response = await registerUser(registrationData); // Call the registration API
      Alert.alert('Success', 'You have successfully registered!');
      navigation.navigate('HomeScreen');
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Signup now and get full access to our app.</Text>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={(text) => handleInputChange('firstName', text)}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Second Name"
            value={formData.secondName}
            onChangeText={(text) => handleInputChange('secondName', text)}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={formData.username}
          onChangeText={(text) => handleInputChange('username', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Whatsapp Number"
          keyboardType="phone-pad"
          value={formData.whatsappNumber}
          onChangeText={(text) => handleInputChange('whatsappNumber', text)}
        />
        <View style={styles.row}>
          <Picker
            selectedValue={formData.church}
            style={[styles.input, styles.halfInput]}
            onValueChange={(itemValue) => handleInputChange('church', itemValue)}
          >
            <Picker.Item label="Select Church" value="" />
            {churches.map((church) => (
              <Picker.Item key={church.id ?? church.churchName} label={church.churchName} value={church.churchName} />
            ))}
            <Picker.Item label="Not Available" value="NOT_AVAILABLE" />
          </Picker>
          <Picker
            selectedValue={formData.gender}
            style={[styles.input, styles.halfInput]}
            onValueChange={(itemValue) => handleInputChange('gender', itemValue)}
          >
            <Picker.Item label="Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        </View>
        <View style={styles.row}>
          <Picker
            selectedValue={formData.province}
            style={[styles.input, styles.halfInput]}
            onValueChange={(itemValue) => handleInputChange('province', itemValue)}
          >
            <Picker.Item label="Select Province" value="" />
            {provinces.map((province) => (
              <Picker.Item key={province.id} label={province.province} value={province.province} />
            ))}
          </Picker>
          <Picker
            selectedValue={formData.zionType}
            style={[styles.input, styles.halfInput]}
            onValueChange={(itemValue) => handleInputChange('zionType', itemValue)}
          >
            <Picker.Item label="Zion Type" value="" />
            <Picker.Item label="Sgege" value="Sgege" />
            <Picker.Item label="Chorus" value="Chorus" />
            <Picker.Item label="Khalanga" value="Khalanga" />
          </Picker>
        </View>

        {/* Conditionally render the Church Name input field */}
        {formData.church === 'NOT_AVAILABLE' ? (
          <TextInput
            style={styles.input}
            placeholder="Enter Church Name"
            value={formData.enterChurchName}
            onChangeText={(text) => handleInputChange('enterChurchName', text)} // This updates custom church name
          />
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={formData.password}
          onChangeText={(text) => handleInputChange('password', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={!showPassword}
          value={formData.confirmPassword}
          onChangeText={(text) => handleInputChange('confirmPassword', text)}
        />
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.checkboxContainer}
          >
            <Text>{showPassword ? 'Hide' : 'Show'} password</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.link}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#E0FBFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: '#D0F8FF',
    borderRadius: 20, 
    borderWidth: 1,
    borderColor: '#7FE7FD', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
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
    flex: 1,
  },
  halfInput: {
    flex: 0.48,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#00E5FF',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#777',
  },
  link: {
    color: '#0055FF',
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default RegistrationScreen;
