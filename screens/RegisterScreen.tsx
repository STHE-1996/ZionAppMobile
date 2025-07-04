import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  Button,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ChurchNames, registerUser } from '../services/apiService'; // Import the register function
import { Province as fetchProvinces } from '../services/apiService'; // Import functions
import { Province } from '../models/Province';
import { Church } from '../models/ChurchNames';
import { ResizeMode, Video } from 'expo-av';
import Modal from 'react-native-modal';

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
  const [agreedToTerms, setAgreedToTerms] = useState(false);


  const [provinces, setProvinces] = useState<Province[]>([]);
  const [churches, setChurches] = useState<Church[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
const [modalContent, setModalContent] = useState({ message: '', type: '' });

const showModal = (message: string, type: 'success' | 'error') => {
  setModalContent({ message, type });
  setModalVisible(true);
};

const hideModal = () => {
  setModalVisible(false);
};

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
  // List required fields here explicitly
  const requiredFields = [
    'firstName',
    'secondName',
    'username',
    'whatsappNumber',
    'email',
    'password',
    'confirmPassword',
    'gender',
    'province',
  ];

  // Prepare data
  const registrationData = {
    firstName: formData.firstName.trim(),
    secondName: formData.secondName.trim(),
    username: formData.username.trim(),
    whatsappNumber: formData.whatsappNumber.trim(),
    email: formData.email.trim(),
    churchName:
      formData.church === 'NOT_AVAILABLE' ? formData.enterChurchName.trim() : formData.church.trim(),
    enterChurchName:
      formData.church === 'NOT_AVAILABLE' ? formData.enterChurchName.trim() : '',
    zionType: formData.zionType.trim(),
    gender: formData.gender.trim(),
    province: formData.province.trim(),
    profilePictureUrl: '',
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  };

  // Check for empty required fields before sending
  type RegistrationDataKeys = keyof typeof registrationData;

for (const field of requiredFields) {
  const key = field as RegistrationDataKeys; // cast string to key of registrationData
  if (!registrationData[key] || registrationData[key].length === 0) {
    showModal(`Please fill in the ${field}`, 'error');
    return;
  }
}


  // Special check for churchName or enterChurchName
  if (formData.church === 'NOT_AVAILABLE' && !registrationData.enterChurchName) {
    showModal('Please enter your church name', 'error');
    return;
  }
  if (formData.church !== 'NOT_AVAILABLE' && !registrationData.churchName) {
    showModal('Please select your church', 'error');
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(registrationData.email)) {
    showModal('Please enter a valid email address.', 'error');
    return;
  }

  // Password match validation
  if (registrationData.password !== registrationData.confirmPassword) {
    showModal('Passwords do not match.', 'error');
    return;
  }

  // Password strength validation
  const password = registrationData.password;
  if (!/[a-z]/.test(password)) {
    showModal('Password must contain at least one lowercase letter.', 'error');
    return;
  }
  if (!/[A-Z]/.test(password)) {
    showModal('Password must contain at least one uppercase letter.', 'error');
    return;
  }
  if (!/\d/.test(password)) {
    showModal('Password must contain at least one digit.', 'error');
    return;
  }
  if (password.length < 8) {
    showModal('Password must be at least 8 characters long.', 'error');
    return;
  }

  // All validations passed — submit form
  try {
    const response = await registerUser(registrationData);
    const successMsg = response.responseMessage || 'You have successfully registered!';
    showModal(successMsg, 'success');

    setTimeout(() => {
      hideModal();
      navigation.navigate('VerificationScreen');
    }, 2500);
  } catch (error: any) {
    console.error('Registration error:', error);

    // Use backend response message if available, otherwise fallback
    let errorMessage = 'An error occurred. Please try again.';
    if (error?.response?.data?.responseMessage) {
      errorMessage = error.response.data.responseMessage;
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message || errorMessage;
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (error?.response?.status) {
      errorMessage = `Request failed with status ${error.response.status}`;
    }

    showModal(errorMessage, 'error');
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

<View style={styles.termsRow}>
  <TouchableOpacity
    style={styles.checkboxContainer}
    onPress={() => setAgreedToTerms(!agreedToTerms)}
  >
    <View style={styles.checkbox}>
      {agreedToTerms && <View style={styles.checked} />}
    </View>
    <Text style={styles.termsText}>
      I agree to the{' '}
      <Text
        style={styles.link}
        onPress={() => Linking.openURL('https://zionportal.co.za/policies')}
      >
        Terms & Condition
      </Text>
    </Text>
  </TouchableOpacity>
</View>

<TouchableOpacity
  style={[styles.button, !agreedToTerms && { backgroundColor: '#ccc' }]}
  onPress={handleSubmit}
  disabled={!agreedToTerms}
>
  <Text style={styles.buttonText}>Register</Text>
</TouchableOpacity>
        <TouchableOpacity onPress={() => {
            // Navigate to RegisterScreen when clicked
            navigation.navigate('Login');
          }}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.link}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
  isVisible={isModalVisible}
  onBackdropPress={hideModal}
  backdropColor="transparent"
  style={{ margin: 0 }}
>
  <View style={styles.modalContent}>
    <Text style={styles.modalText}>{modalContent.message}</Text>

    {modalContent.type === 'success' && (
      <Video
        source={require('../assets/love.gif')}
        style={styles.gif}
        shouldPlay
        isLooping
         resizeMode={ResizeMode.COVER} 
        isMuted
      />
    )}

    {modalContent.type === 'error' && (
      <Video
        source={require('../assets/error.gif - Online GIF to MP4 Video converter.mp4')}
        style={styles.gif}
        shouldPlay
        isLooping
         resizeMode={ResizeMode.COVER} 
        isMuted
      />
    )}

    <Button title="Close" onPress={hideModal} />
  </View>
</Modal>


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
  termsRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 10,
},



checkbox: {
  width: 20,
  height: 20,
  borderWidth: 1,
  borderColor: '#888',
  marginRight: 10,
  justifyContent: 'center',
  alignItems: 'center',
},

checked: {
  width: 12,
  height: 12,
  backgroundColor: '#007BFF',
},

termsText: {
  fontSize: 14,
  color: '#333',
  flexShrink: 1,
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
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },

});

export default RegistrationScreen;
