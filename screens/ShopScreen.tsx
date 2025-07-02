import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  productId: string;
  price: string;
  quantity: string;
  description: string;
  productUrl: string;
  productName: string;
  postedTime: string;
  productEnums: string;
}

const ShopScreen = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('food'); // default enum
  const [productImageUri, setProductImageUri] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const pickProductImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProductImageUri(result.assets[0].uri);
    }
  };

  const uploadProduct = async () => {
  if (!productImageUri || !productName || !description || !price || !quantity) {
    return Alert.alert('Missing Fields', 'Please fill all the fields');
  }

  try {
    setUploading(true);

    const token = await AsyncStorage.getItem('userToken');

    if (!token) {
      Alert.alert('Authentication Error', 'User token not found');
      return;
    }

    const formData = new FormData();

    formData.append('file', {
      uri: productImageUri,
      name: productImageUri.split('/').pop() || 'product.jpg',
      type: 'image/jpeg',
    } as any);

    formData.append('id', '66f09754377b7a5898cb3e31');
    formData.append('description', description);
    formData.append('productName', productName);
    formData.append('quantity', quantity);
    formData.append('price', price);
    formData.append('productEnums', category);

    const response = await fetch(
      'https://zion-app-8bcc080006a7.herokuapp.com/api/uploadImageProduct',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // ✅ Token added here
        },
        body: formData,
      }
    );

    if (response.ok) {
      Alert.alert('Success', 'Product uploaded!');
      setModalVisible(false);
      setProductName('');
      setDescription('');
      setPrice('');
      setQuantity('');
      setProductImageUri('');
      setCategory('food');
    } else {
      const errText = await response.text();
      console.warn('Server error:', errText);
      Alert.alert('Error', 'Upload failed');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Something went wrong');
  } finally {
    setUploading(false);
  }
};

  const fetchMyProducts = async () => {
  setLoading(true);

  try {
    const token = await AsyncStorage.getItem('userToken');
    const senderId = await AsyncStorage.getItem('userId');

    if (!token || !senderId) {
      Alert.alert('Authentication Error', 'Missing user token or ID');
      setLoading(false);
      return;
    }

    const response = await fetch(`https://zion-app-8bcc080006a7.herokuapp.com/api/myProduct/${senderId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${errorText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const raw = await response.text();
      throw new Error(`Unexpected response format:\n${raw}`);
    }

    // ✅ ONLY call .json() once and don't wrap it in JSON.parse
    const data: Product[] = await response.json();

    // Optionally verify structure
    if (!Array.isArray(data)) {
      throw new Error('Expected an array of products');
    }

    setMyProducts(data);
  } catch (error) {
    console.error('Fetch error:', error);
    Alert.alert('Error', 'Failed to load products');
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        Alert.alert('Authentication Error', 'User token not found');
        setLoading(false);
        return;
      }

      const response = await fetch(
        'https://zion-app-8bcc080006a7.herokuapp.com/api/ProductPosts',
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`, // ✅ Token added here
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Product[] = await response.json();
      setProducts(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load products');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (activeTab === 1) {
    fetchMyProducts(); // Assuming this one already has the token added, as we updated earlier
  } else {
    fetchProducts(); // 🆕 This now includes token-based auth
  }
}, [activeTab]);

  return (
    <View style={styles.container}>
      {/* Tab Buttons */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 1 && styles.activeTab]}
          onPress={() => setActiveTab(1)}
        >
          <Text style={styles.tabText}>My Product</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 2 && styles.activeTab]}
          onPress={() => setActiveTab(2)}
        >
          <Text style={styles.tabText}>All Product</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.contentContainer}>
        {activeTab === 1 ? (
          loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : myProducts.length === 0 ? (
            <View style={styles.noProductContainer}>
              <Image
                  source={require('../assets/Logo.png')}
                  style={styles.noProductImage}
              />
              <Text style={styles.noProductText}>No products available</Text>
            </View>
          ) : (
           <ScrollView contentContainerStyle={styles.gridContainer}>
                {myProducts.map((product) => (
                <View key={product.productId} style={styles.productCard}>
                    <Image source={{ uri: product.productUrl }} style={styles.productImage} />
                    <Text style={styles.productName}>{product.productName}</Text>
                    <Text>{product.description}</Text>
                    <Text>Price: ${product.price}</Text>
                    <Text>Quantity: {product.quantity}</Text>
                    <Text>Options: {product.productEnums}</Text>
                    </View>
                 ))}
             </ScrollView>

          )
        ) : loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : products.length === 0 ? (
          <View style={styles.noProductContainer}>
            <Image
              source={require('../assets/Logo.png')}
              style={styles.noProductImage}
            />
            <Text style={styles.noProductText}>No products available</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.gridContainer}>
               {products.map((product) => (
                  <View key={product.productId} style={styles.productCard}>
                    <Image source={{ uri: product.productUrl }} style={styles.productImage} />
                    <Text style={styles.productName}>{product.productName}</Text>
                    <Text>{product.description}</Text>
                    <Text>Price: ${product.price}</Text>
                    <Text>Quantity: {product.quantity}</Text>
                    <Text>Options: {product.productEnums}</Text>
                  </View>
                ))}
           </ScrollView>
        )}
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Upload Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Add Product</Text>

              <TextInput
                placeholder="Product Name"
                style={styles.input}
                value={productName}
                onChangeText={setProductName}
              />
              <TextInput
                placeholder="Description"
                style={styles.input}
                value={description}
                onChangeText={setDescription}
              />
              <TextInput
                placeholder="Price"
                style={styles.input}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
              <TextInput
                placeholder="Quantity"
                style={styles.input}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />

              {/* Enum Dropdown */}
              <View style={styles.input}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Category</Text>
                <TouchableOpacity
                  onPress={() => {
                    const nextCategory = category === 'food' ? 'cosmetic' : 'food';
                    setCategory(nextCategory);
                  }}
                  style={styles.dropdown}
                >
                  <Text>{category}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.imagePicker}
                onPress={pickProductImage}
              >
                <Text style={{ color: 'white' }}>
                  {productImageUri ? 'Change Image' : 'Pick Product Image'}
                </Text>
              </TouchableOpacity>

              {uploading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={uploadProduct}
                >
                  <Text style={{ color: 'white' }}>Upload</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: 'white' }}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    padding: 10,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#ccc',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#01ebff',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#000',
  },
  // tabText: { color: 'black', fontWeight: 'bold' },
  contentContainer: { flex: 1, paddingHorizontal: 10, paddingBottom: 80 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    elevation: 2,
  },
  productImage: { width: '100%', height: 100, borderRadius: 10 },
  productName: { fontWeight: 'bold', marginVertical: 5 },
  noProductContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  noProductImage: { width: 150, height: 150, resizeMode: 'contain' },
  noProductText: { marginTop: 10, fontSize: 16, color: '#666' },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#01ebff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
  },
  dropdown: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  imagePicker: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
});

export default ShopScreen;
