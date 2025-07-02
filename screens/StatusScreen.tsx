import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { TextInput, Alert, ActivityIndicator } from 'react-native';
import { UserDetails } from "../models/UserDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Status {
  id: string;
  type: 'video' | 'image';
  url: string;
  title: string;
}

interface UserProfile {
  id: string;
  firstName: string;
  secondName: string;
  username: string;
  profilePictureUrl: string;
}


const screenHeight = Dimensions.get("window").height;



const StatusScreen = () => {
  const [activeTab, setActiveTab] = useState(1);
 const [sampleStatuses, setSampleStatuses] = useState<Status[]>([]);
 const [modalVisible, setModalVisible] = useState(false);
const [caption, setCaption] = useState('');
const [mediaUri, setMediaUri] = useState('');
const [uploading, setUploading] = useState(false);
const [profiles, setProfiles] = useState<UserProfile[]>([]);
const [viewingUserId, setViewingUserId] = useState<string | null>(null);
const [userStatuses, setUserStatuses] = useState<Status[]>([]);
const [userStatusModalVisible, setUserStatusModalVisible] = useState(false);
const [loading, setLoading] = useState(false);


  useEffect(() => {
    const loadStatuses = async () => {
      try {
         setLoading(true);
        const res = await fetch(
          "https://zion-app-8bcc080006a7.herokuapp.com/api/66f09754377b7a5898cb3e31",
          { headers: { Accept: "application/json" } }
        );
        const jsonText = await res.text();
        const data = JSON.parse(jsonText);

        if (Array.isArray(data.statusModelList)) {
          const parsed = data.statusModelList.map((status:any, index:any) => {
          const url = status.statusContent?.trim() ?? "";
          const extension = url.split("?")[0];
        return {
              id: status.statusId ?? `${index}`,
              type: /\.(mp4|mov|avi|mkv|webm)$/i.test(extension) ? "video" : "image",
              url,
              title: status.caption || "Untitled",
         };
        });

          setSampleStatuses(parsed);
          
        } else {
          console.warn("No statusModelList found in response.");
          setSampleStatuses([]);
        }
      } catch (err) {
        console.error("Error loading statuses:", err);
        setSampleStatuses([]);
      } finally {
        setLoading(false);
      }
    };

    loadStatuses();
  }, []);

   console.log('SampleStatuses', sampleStatuses);


   const pickMedia = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission denied', 'We need media access permission!');
    return;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: false,
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    setMediaUri(result.assets[0].uri);
  }
};


const uploadStatus = async () => {
  if (!mediaUri) return Alert.alert('Error', 'Please select an image or video');

  try {
    setUploading(true);
    const formData = new FormData();
    const fileName = mediaUri.split('/').pop() || 'upload.jpg';
    const fileType = fileName.match(/\.(\w+)$/)?.[1];
    const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(fileName);

    formData.append('file', {
      uri: mediaUri,
      name: fileName,
      type: isVideo ? `video/${fileType}` : `image/${fileType}`,
    } as any);

    const userId = '66f09754377b7a5898cb3e31';
    const encodedCaption = encodeURIComponent(caption || 'Untitled');

    const response = await fetch(
      `https://zion-app-8bcc080006a7.herokuapp.com/api/uploadImageStatus/${userId}/${encodedCaption}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      }
    );

    if (response.ok) {
      // 👇 Inject new post at top
      const newStatus: Status = {
        id: Date.now().toString(), // simple unique ID
        type: isVideo ? 'video' : 'image',
        url: mediaUri,
        title: caption || 'Untitled',
      };

      setSampleStatuses((prev) => [newStatus, ...prev]);

      // ✅ Reset modal state
      setModalVisible(false);
      setCaption('');
      setMediaUri('');
      Alert.alert('Success', 'Status uploaded!');
    } else {
      const text = await response.text();
      console.warn('Upload failed, raw response:', text);
      Alert.alert('Upload failed', 'Server did not accept the file.');
    }
  } catch (error) {
  console.error(error);

  if (error instanceof Error) {
    Alert.alert('Upload error', error.message);
  } else {
    Alert.alert('Upload error', 'An unknown error occurred.');
  }
} finally {
  setUploading(false);
}
};


useEffect(() => {
  const loadProfiles = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        console.warn('Authentication token not found.');
        return;
      }

      const res = await fetch("https://zion-app-8bcc080006a7.herokuapp.com/api/StatusPost", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // ✅ Token added here
        },
      });

      const text = await res.text();

      // Check if it's JSON (starts with [ or {)
      if (!text.startsWith("[") && !text.startsWith("{")) {
        console.warn("Non-JSON response received:", text.slice(0, 100));
        return;
      }

      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        console.error("Expected an array but got:", data);
        return;
      }

      const shuffled = data.sort(() => 0.5 - Math.random());
      setProfiles(shuffled);
    } catch (err) {
      console.error("Error loading profiles:", err);
    }
  };

  loadProfiles();
}, []);


const fetchStatusesByUser = async (userId: string) => {
  try {
    const token = await AsyncStorage.getItem('userToken');

    if (!token) {
      Alert.alert('Authentication Error', 'User token not found');
      return;
    }

    const res = await fetch(`https://zion-app-8bcc080006a7.herokuapp.com/api/${userId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`, // ✅ Token added here
      },
    });

    const jsonText = await res.text();
    const data = JSON.parse(jsonText);

    if (Array.isArray(data.statusModelList)) {
      const parsed = data.statusModelList.map((status: any, index: any) => {
        const url = status.statusContent?.trim() ?? '';
        const extension = url.split('?')[0];
        return {
          id: status.statusId ?? `${index}`,
          type: /\.(mp4|mov|avi|mkv|webm)$/i.test(extension) ? 'video' : 'image',
          url,
          title: status.caption || 'Untitled',
        };
      });

      setUserStatuses(parsed);
      setUserStatusModalVisible(true);
    } else {
      Alert.alert('No statuses', 'This user has no statuses.');
    }
  } catch (error) {
    console.error('Error loading user statuses:', error);
    Alert.alert('Error', 'Failed to load user statuses.');
  }
};





  const renderShortItem = ({ item }: any) => {
    return (
      <View style={styles.shortContainer}>
        {item.type === "video" ? (
          <Video
            source={{ uri: item.url }}
            style={styles.media}
            resizeMode={ResizeMode.COVER} 
            shouldPlay
            isLooping
            useNativeControls={false}
          />
        ) : (
          <Image source={{ uri: item.url }} style={styles.media} resizeMode="cover" />
        )}

        <View style={styles.overlay}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.actions}>
            <Text style={styles.actionIcon}>❤️</Text>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionIcon}>📤</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tab Buttons */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 1 && styles.activeTab]}
          onPress={() => setActiveTab(1)}
        >
          <Text style={styles.tabText}>My Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 2 && styles.activeTab]}
          onPress={() => setActiveTab(2)}
        >
          <Text style={styles.tabText}>All Statuses</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
     {activeTab === 1 ? (
      sampleStatuses.length === 0 ? (
        <View style={styles.noProductContainer}>
          <Image
            source={require('../assets/Logo.png')}
            style={styles.noProductImage}
          />
          <Text style={styles.noProductText}>No products available</Text>
        </View>
      ) : (
        <FlatList
          data={sampleStatuses}
          renderItem={renderShortItem}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={screenHeight}
          decelerationRate="fast"
        />
      )
    ) : (
      profiles.length === 0 ? (
        <View style={styles.noProductContainer}>
          <Image
            source={require('../assets/Logo.png')}
            style={styles.noProductImage}
          />
          <Text style={styles.noProductText}>No products available</Text>
        </View>
      ) : (
        <View style={styles.allStatusesContainer}>
          <FlatList
            data={profiles}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.profileList}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setViewingUserId(item.id);
                  fetchStatusesByUser(item.id);
                }}
                style={styles.profileWrapper}
              >
                <Image
                  source={{ uri: item.profilePictureUrl }}
                  style={styles.profileImage}
                />
                <Text style={styles.usernameText}>{item.username}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )
    )}

    <TouchableOpacity
      style={styles.stickyButton}
      onPress={() => setModalVisible(true)}
    >
      <Icon name="plus" size={24} color="#fff" />
    </TouchableOpacity>

      <Modal
             animationType="slide"
             transparent={true}
             visible={modalVisible}
             onRequestClose={() => setModalVisible(false)}
            >
               <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                     <Text style={styles.modalTitle}>New Status</Text>

                             <TextInput
                                style={styles.input}
                                placeholder="Enter caption"
                                placeholderTextColor="#999"
                                value={caption}
                                onChangeText={setCaption}
                              />

              <TouchableOpacity onPress={pickMedia} style={styles.mediaPicker}>
                   <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>
                        {mediaUri ? 'Change Media' : 'Pick Image/Video'}
                   </Text>
               </TouchableOpacity>

                 {mediaUri ? (
                     <Text style={{ fontSize: 12, marginTop: 5 }}>
                         Selected: {mediaUri.split('/').pop()}
                     </Text>
                 ) : null}

                {uploading ? (
                     <ActivityIndicator style={{ marginTop: 15 }} color="#007AFF" />
                ) : (
                <TouchableOpacity onPress={uploadStatus} style={styles.uploadButton}>
                     <Text style={{ color: '#fff', fontWeight: 'bold' }}>Upload</Text>
                </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => setModalVisible(false)}>
                     <Text style={styles.closeButton}>Cancel</Text>
                </TouchableOpacity>
             </View>
           </View>
        </Modal>


          <Modal
             animationType="slide"
             transparent={false}
             visible={userStatusModalVisible}
             onRequestClose={() => setUserStatusModalVisible(false)}
          >
          <FlatList
             data={userStatuses}
             renderItem={renderShortItem}
             keyExtractor={(item) => item.id}
             pagingEnabled
             showsVerticalScrollIndicator={false}
             snapToInterval={screenHeight}
             decelerationRate="fast"
          />

          <TouchableOpacity
             onPress={() => setUserStatusModalVisible(false)}
             style={[styles.stickyButton, { backgroundColor: '#f00' }]}
           >
              <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
         </Modal>
        </View>  
     );
   };

export default StatusScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#D0F8FF",
    alignItems: "center",
    marginHorizontal: 5,
  },
   noProductContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  noProductImage: { width: 150, height: 150, resizeMode: 'contain' },
  noProductText: { marginTop: 10, fontSize: 16, color: '#666' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  activeTab: {
    backgroundColor: "#01ebff",
  },
  tabText: {
    fontWeight: "bold",
    color: "#333",
  },
  shortContainer: {
    height: screenHeight,
    width: "100%",
    position: "relative",
    justifyContent: "flex-end",
  },
  media: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  actions: {
    position: "absolute",
    right: 10,
    bottom: 0,
    alignItems: "center",
  },
  actionIcon: {
    fontSize: 28,
    marginVertical: 10,
    color: "#fff",
  },
  allStatusesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

    stickyButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#01ebff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007AFF',
    fontWeight: 'bold',
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

  profileList: {
  justifyContent: 'center',
  paddingVertical: 20,
},
profileWrapper: {
  alignItems: 'center',
  margin: 10,
},
profileImage: {
  width: 80,
  height: 80,
  borderRadius: 40,
  borderWidth: 3,
  borderColor: 'white',
  shadowColor: '#fff',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.5,
  shadowRadius: 5,
  elevation: 6,
},
usernameText: {
  marginTop: 8,
  color: '#fff',
  fontWeight: '600',
  fontSize: 12,
},

});
