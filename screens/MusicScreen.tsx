import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Song {
  songId: string;
  title: string;
  songUrl: string;
  localDateTime: string | null;
  ulbumProfileUrl: string;
}

export interface Album {
  albumId: string;
  albumImgUrl: string;
  albumTitle: string;
  releaseDate: [number, number, number, number, number, number, number]; // e.g., [2025, 4, 3, 17, 14, 37, 737000000]
  musicModelList: Song[];
}


const MusicScreen = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumImageUri, setAlbumImageUri] = useState('');
  const [songs, setSongs] = useState<{ title: string; file: any }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [album, setAlbums] = useState<Album[]>([]);
    const [myAlbums, setMyAlbums] = useState<Album[]>([]);

  const pickAlbumImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      setAlbumImageUri(result.assets[0].uri);
    }
  };

  const pickSongFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      multiple: false,
    });

    if (result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      const title = file.name.replace(/\.[^/.]+$/, ''); // remove extension
      setSongs((prev) => [...prev, { title, file }]);
    }
  };

  const uploadAlbum = async () => {
  if (!albumTitle || !albumImageUri || songs.length === 0) {
    return Alert.alert('Missing fields', 'Please fill all fields');
  }

  try {
    setUploading(true);

    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      Alert.alert('Authentication Error', 'User token not found');
      setUploading(false);
      return;
    }

    const formData = new FormData();

    // Add album image
    const albumImageFile = {
      uri: albumImageUri,
      name: albumImageUri.split('/').pop() || 'album.jpg',
      type: 'image/jpeg',
    };

    formData.append('id', '66f09754377b7a5898cb3e31');
    formData.append('albumTitle', albumTitle);
    formData.append('albumImage', albumImageFile as any);

    // Add songs
    songs.forEach((song, index) => {
      formData.append('songFiles', {
        uri: song.file.uri,
        name: song.file.name,
        type: 'audio/mpeg',
      } as any);
      formData.append('songTitles', song.title);
    });

    const response = await fetch('https://zion-app-8bcc080006a7.herokuapp.com/api/createAlbum', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`, // ✅ Token added here
      },
      body: formData,
    });

    if (response.ok) {
      Alert.alert('Success', 'Album uploaded!');
      setModalVisible(false);
      setAlbumTitle('');
      setAlbumImageUri('');
      setSongs([]);
    } else {
      const errText = await response.text();
      console.warn('Upload error:', errText);
      Alert.alert('Upload failed', 'Server rejected the upload.');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Upload error', 'Something went wrong.');
  } finally {
    setUploading(false);
  }
};



  const fetchMyAlbums = async () => {
  setLoading(true);
  try {
    const senderId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('userToken');

    if (!senderId) {
      throw new Error('User ID not found in AsyncStorage');
    }

    if (!token) {
      Alert.alert('Authentication Error', 'User token not found');
      setLoading(false);
      return;
    }

    const response = await fetch(
      `https://zion-app-8bcc080006a7.herokuapp.com/api/album/${senderId}`, 
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

    const text = await response.text();
    const data: Album[] = text ? JSON.parse(text) : [];
    setMyAlbums(data);
  } catch (error) {
    Alert.alert('Error', 'Failed to load albums');
    console.error('Fetch error:', error);
  } finally {
    setLoading(false);
  }
};


 useEffect(() => {
  const fetchAlbum = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        Alert.alert('Authentication Error', 'User token not found');
        setLoading(false);
        return;
      }

      const response = await fetch(
        'https://zion-app-8bcc080006a7.herokuapp.com/api/AlbumsList',
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

      const data: Album[] = await response.json();
      setAlbums(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load albums');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (activeTab === 1) {
    fetchMyAlbums(); 
  }

  if (activeTab === 2) {
    fetchAlbum(); 
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
      <Text style={styles.tabText}>My Album</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.tabButton, activeTab === 2 && styles.activeTab]}
      onPress={() => setActiveTab(2)}
    >
      <Text style={styles.tabText}>All Album</Text>
    </TouchableOpacity>
  </View>

  {/* Tab Content */}
  {loading ? (
    <ActivityIndicator size="large" color="#0000ff" />
  ) : (activeTab === 1 ? (
    myAlbums.length === 0 ? (
      <View style={styles.noProductContainer}>
        <Image source={require('../assets/Logo.png')} style={styles.noProductImage} />
        <Text style={styles.noProductText}>No album available</Text>
      </View>
    ) : (
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {myAlbums.map((album) => (
          <View key={album.albumId} style={styles.productCard}>
            <Image source={{ uri: album.albumImgUrl }} style={styles.productImage} />
            <Text style={styles.productName}>{album.albumTitle}</Text>
          </View>
        ))}
      </ScrollView>
    )
  ) : (
    album.length === 0 ? (
      <View style={styles.noProductContainer}>
        <Image source={require('../assets/Logo.png')} style={styles.noProductImage} />
        <Text style={styles.noProductText}>No album available</Text>
      </View>
    ) : (
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {album.map((album) => (
          <View key={album.albumId} style={styles.productCard}>
            <Image source={{ uri: album.albumImgUrl }} style={styles.productImage} />
            <Text style={styles.productName}>{album.albumTitle}</Text>
          </View>
        ))}
      </ScrollView>
    )
  ))}

  {/* Floating Action Button */}
  <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
    <Icon name="plus" size={24} color="#fff" />
  </TouchableOpacity>

 <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Upload Album</Text>

              <TextInput
                placeholder="Album Title"
                style={styles.input}
                value={albumTitle}
                onChangeText={setAlbumTitle}
              />

              <TouchableOpacity onPress={pickAlbumImage} style={styles.mediaPicker}>
                <Text style={{ color: '#007AFF' }}>
                  {albumImageUri ? 'Change Album Image' : 'Pick Album Image'}
                </Text>
              </TouchableOpacity>

              {albumImageUri ? (
                <Text style={styles.smallText}>Selected: {albumImageUri.split('/').pop()}</Text>
              ) : null}

              <TouchableOpacity onPress={pickSongFile} style={styles.mediaPicker}>
                <Text style={{ color: '#007AFF' }}>Add Song</Text>
              </TouchableOpacity>

              {songs.map((s, i) => (
                <Text key={i} style={styles.smallText}>🎵 {s.title}</Text>
              ))}

              {uploading ? (
                <ActivityIndicator style={{ marginTop: 20 }} />
              ) : (
                <TouchableOpacity onPress={uploadAlbum} style={styles.uploadButton}>
                  <Text style={{ color: '#fff' }}>Upload Album</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
</View>
);
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  
 
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    color: '#000',
  },
  mediaPicker: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#D0F8FF',
    alignItems: 'center',
    borderRadius: 6,
  },
  uploadButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  closeButton: {
    marginTop: 15,
    textAlign: 'center',
    color: '#007AFF',
    fontWeight: 'bold',
  },
  smallText: {
    marginTop: 5,
    fontSize: 12,
    color: '#555',
  },
  noProductContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  noProductImage: { width: 150, height: 150, resizeMode: 'contain' },
  noProductText: { marginTop: 10, fontSize: 16, color: '#666' },
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
});

export default MusicScreen;