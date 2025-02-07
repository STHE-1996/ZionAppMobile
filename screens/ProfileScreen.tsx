import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList, Modal, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDetails } from '../models/UserDetails';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Card, Button, Avatar } from 'react-native-paper';

const FirstTab = () => (
  <View style={[styles.tabContent, { backgroundColor: '#ff4081' }]}>
    <Text>First Tab Content</Text>
  </View>
);

const SecondTab = () => (
  <View style={[styles.tabContent, { backgroundColor: '#673ab7' }]}>
    <Text>Second Tab Content</Text>
  </View>
);

const ThirdTab = () => (
  <View style={[styles.tabContent, { backgroundColor: '#4caf50' }]}>
    <Text>Third Tab Content</Text>
  </View>
);


const ProfileScreen = () => {
  const data = [
    {
      id: 1,
      name: 'Mark Doe',
      position: 'CEO',
      image: 'https://bootdey.com/img/Content/avatar/avatar7.png',
      about:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    },
    {
      id: 2,
      name: 'John Doe',
      position: 'CTO',
      image: 'https://bootdey.com/img/Content/avatar/avatar1.png',
      about:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    },
    {
      id: 3,
      name: 'Clark Man',
      position: 'Creative designer',
      image: 'https://bootdey.com/img/Content/avatar/avatar6.png',
      about:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    },
    {
      id: 4,
      name: 'Jaden Boor',
      position: 'Front-end dev',
      image: 'https://bootdey.com/img/Content/avatar/avatar5.png',
      about:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    },
    {
      id: 5,
      name: 'Srick Tree',
      position: 'Backend-end dev',
      image: 'https://bootdey.com/img/Content/avatar/avatar4.png',
      about:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    },
  ];

  const [users, setUsers] = useState(data);
  const [modalVisible, setModalVisible] = useState(false);
  const [userSelected, setUserSelected] = useState([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [index, setIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('Church');
  const [routes] = useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
    { key: 'third', title: 'Third' },
  ]);

  const renderScene = SceneMap({
    first: FirstTab,
    second: SecondTab,
    third: ThirdTab,
  });



  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const senderId = await AsyncStorage.getItem('userId');
        if (senderId) {
          
          // const response = await axios.get(`http://192.168.0.245:8082/api/UserProfile/${senderId}`);
          const response = await axios.get(`https://zion-app-8bcc080006a7.herokuapp.com/api/UserProfile/${senderId}`);
          setUserDetails(response.data);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!userDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unable to load user details.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
       <View style={styles.card}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: userDetails.profilePictureUrl || 'https://www.bootdey.com/img/Content/avatar/avatar6.png' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {userDetails.firstName} {userDetails.secondName}
        </Text>
        <Text style={styles.name}>
          {userDetails.username} 
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{userDetails.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Church:</Text>
        <Text style={styles.infoValue}>{userDetails.churchName}</Text>
      </View>
      {/* Render Social Media Links */}
      <View style={styles.navContainer}>
        <Button 
          mode={activeTab === 'Posts' ? 'contained' : 'text'} 
          onPress={() => setActiveTab('Posts')} 
          style={activeTab === 'Posts' ? styles.activeNavButton : styles.navButton}
        >
          Posts
        </Button>
        <Button 
          mode={activeTab === 'Invite' ? 'contained' : 'text'} 
          onPress={() => setActiveTab('Invite')} 
          style={activeTab === 'Invite' ? styles.activeNavButton : styles.navButton}
        >
          Invite
        </Button>
        <Button 
          mode={activeTab === 'Church' ? 'contained' : 'text'} 
          onPress={() => setActiveTab('Church')} 
          style={activeTab === 'Church' ? styles.activeNavButton : styles.navButton}
        >
          Church
        </Button>
      </View>

      <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: 400, height: 600 }}
    />
    </View> 
    

      {/* Conditional Rendering Based on Active Tab */}
      <View style={styles.contentContainer}>
  {/* <View style={styles.card}> */}
    {activeTab === 'Posts' && <Text>Posts Content</Text>}
    {activeTab === 'Invite' && <Text>Invite Content</Text>}
    {activeTab === 'Church' && (
          <FlatList
            style={styles.userList}
            data={users} // Passing the hardcoded users data
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card2}>
                <Image style={styles.image} source={{ uri: item.image }} />
                <View style={styles.cardContent}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.position}>{item.position}</Text>
                  <TouchableOpacity style={styles.followButton}>
                    <Text style={styles.followButtonText}>Follow</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  
      // </View>
    )}


 
 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navContainer: {
    flexDirection: 'row',
    marginTop: 10,
    
  },
  navButton: {
    marginHorizontal: 5,
  },
  card2: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: 'white',
    flexBasis: '46%',
    padding: 10,
    flexDirection: 'row',
  },

  activeNavButton: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: '#D0F8FF',
    borderRadius: 15,
    borderColor: '#7FE7FD',  // Add border color
    borderWidth: 2,          // Set border width
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  contentContainer: {
    marginTop: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  infoValue: {
    marginTop: 5,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  
  
  
  // FlatList styles
  userList: {
    width: '100%',
  },
  
  listContainer: {
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  cardItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  cardContent: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  
  position: {
    fontSize: 14,
    color: '#696969',
  },
  followButton: {
    marginTop: 10,
    height: 35,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#00BFFF',
  },
  followButtonText: {
    color: 'white',
    fontSize: 16,
  },

  // Modal Styles
  popupOverlay: {
    backgroundColor: '#00000080',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  about: {
    marginTop: 10,
    color: '#555',
    textAlign: 'center',
  },
  popupButtons: {
    marginTop: 20,
    alignItems: 'center',
  },
  btnClose: {
    backgroundColor: '#20b2aa',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  txtClose: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProfileScreen;
