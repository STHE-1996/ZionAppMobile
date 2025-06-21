import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList, Modal, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDetails } from '../models/UserDetails';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Card, Button, Avatar } from 'react-native-paper';
import { getChurchMembers, getUsers } from '../services/apiService';
import { Modalize } from 'react-native-modalize';
import Icon from 'react-native-vector-icons/FontAwesome';

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

  interface ViewScreenProps {
  route: any;
}

const ViewProfileScreen = ({ route }: ViewScreenProps) => {
  const data = [
    {
      id: 1,
      title: 'Product 1',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/suvtrees-003.webp?alt=media&token=1b02009d-72d8-40ec-a2cd-a4d593d72d4b',
    },
    {
      id: 2,
      title: 'Product 2',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/shelby-american-muscle-cars-5893728-2560-1920.jpg?alt=media&token=18942b2a-687b-4000-8531-8c15b8d98832',
    },
    {
      id: 3,
      title: 'Product 3',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/best_car_wallpapers%201.jpeg?alt=media&token=190d41cd-46f4-4cc9-b6da-2582c6db9c08',
    },
    {
      id: 4,
      title: 'Product 4',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/47457.webp?alt=media&token=9d68e725-4fef-472f-bd1d-0b408ff24de1',
    },
    {
      id: 5,
      title: 'Product 5',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/NetBhB7.jpg?alt=media&token=87198ab1-ad04-4ea1-860e-d55e35da2bee',
    },
    {
      id: 6,
      title: 'Product 6',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/5-lamborghini-gallardo-car-wallpaper-1024x576.jpg?alt=media&token=ef54fa54-7ab8-4af1-bd03-86b68a30cbd6',
    },
    {
      id: 7,
      title: 'Product 7',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/e6f99cc790210cb3ea63bc2755e98550.jpg?alt=media&token=cd3b9dab-ed62-4657-82b1-889cdc2822c0',
    },
    {
      id: 8,
      title: 'Product 8',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/Bmw%20cars%20usa-2.jpg?alt=media&token=8d44a607-240c-4a13-8fe5-adee7827be72',
    },
    {
      id: 9,
      title: 'Product 9',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/suvtrees-003.webp?alt=media&token=1b02009d-72d8-40ec-a2cd-a4d593d72d4b',
    },
    {
      id: 9,
      title: 'Product 10',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/dd9cdf7c2daead48c83ce0d8cbf42f1a.jpg?alt=media&token=0cdef31f-7e60-4791-b341-f2e979c48e35',
    },
  ]
  const [modalVisible, setModalVisible] = useState(false);
  const [userSelected, setUserSelected] = useState([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [churchMembers, setChurchMembers] = useState<UserDetails[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState(data)
  const [activeTab, setActiveTab] = useState('Church');
  const [routes] = useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
    { key: 'third', title: 'Third' },
  ]);
  const { userId } = route.params; 
  const modalizeRef = useRef<Modalize>(null);
  const churchModalRef = useRef<Modalize>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const renderScene = SceneMap({
    first: FirstTab,
    second: SecondTab,
    third: ThirdTab,
  });




  useEffect(() => {
    const fetchChurchMembers = async () => {
      try {
        
        const data = await getChurchMembers(userId);
        setChurchMembers(data); 
        
      } catch (error) {
        Alert.alert('Error', 'Failed to load church members');
      } finally {
        setLoading(false); 
      }
    };
    fetchChurchMembers();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
          // const response = await axios.get(`http://192.168.0.245:8082/api/UserProfile/${senderId}`);
          const response = await axios.get(`https://zion-app-8bcc080006a7.herokuapp.com/api/UserProfile/${userId}`);
          setUserDetails(response.data);
          console.log(response.data)
        
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

  const openSheet = () => {
  console.log('Modalize ref:', modalizeRef.current);
  modalizeRef.current?.open();
};

 const openChurchDrawer = () => {
  churchModalRef.current?.open();
};

const handleImagePress = (imageUri: React.SetStateAction<string | null>) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

 return (
     <View style={styles.container}>
        <View style={styles.card}>
 
       <View style={styles.avatarContainer}>
         <TouchableOpacity onPress={() => handleImagePress(userDetails.profilePictureUrl)}>
              {userDetails.profilePictureUrl ? (
                 <Image
                   source={{ uri: userDetails.profilePictureUrl }}
                   style={styles.avatar}
                 />
               ) : (
                 <View style={styles.iconContainer}>
                   <Icon
                     name="user"
                     size={60}
                     color="#01ebff"
                   />
                 </View>
               )}
         </TouchableOpacity>
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
            mode="contained"
            onPress={() => openSheet()}
            style={styles.navButton}
         >
          Posts
         </Button>
 
         <Button
           mode="contained"
           onPress={openChurchDrawer}
           style={styles.navButton}
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
 
       <View style={[styles.card, { marginTop: 20 }]}>
         <View style={styles.table}>
            <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Province</Text>
                  <Text style={styles.tableValue}>{userDetails.province || 'N/A'}</Text>
            </View>
            <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Language</Text>
                  {/* <Text style={styles.tableValue}>{ || 'N/A'}</Text> */}
            </View>
         </View>
       </View>
  
     
 
       {/* Conditional Rendering Based on Active Tab */}
       
   {/* <View style={styles.card}> */}
     <Modalize
   ref={modalizeRef}
   snapPoint={500}
   flatListProps={{
     data: userDetails?.postModelList || [],
     numColumns: 2,
     keyExtractor: (item) => item.postId,
     contentContainerStyle: styles.listContainer2,
     ItemSeparatorComponent: () => <View style={styles.separator} />,
     renderItem: ({ item }) => (
       <TouchableOpacity
       style={styles.card3}
       onPress={() => handleImagePress(item.content)}
     >
         <View style={styles.imageContainer}>
           <Image style={styles.cardImage} source={{ uri: item.content }} />
           <TouchableOpacity style={styles.menuIcon}>
             <Text style={styles.dots}>⋮</Text>
           </TouchableOpacity>
         </View>
         <View style={styles.cardContent}>
           <Text style={styles.title}>{item.title}</Text>
         </View>
       </TouchableOpacity>
     ),
   }}
 />
 
         
       
     
  
     {/* {activeTab === 'Invite' && (
       <FlatList
       style={styles.list}
       contentContainerStyle={styles.listContainer}
       data={results}
       horizontal={false}
       numColumns={2}
       keyExtractor={item => {
         return item.id
       }}
       ItemSeparatorComponent={() => {
         return <View style={styles.separator} />
       }}
       renderItem={post => {
         const item = post.item
         return (
           <TouchableOpacity style={styles.card}>
             <View style={styles.imageContainer}>
               <Image style={styles.cardImage} source={{ uri: item.image }} />
             </View>
             <View style={styles.cardContent}>
               <Text style={styles.title}>{item.title}</Text>
               <Text style={styles.count}>({item.count} Photos)</Text>
             </View>
           </TouchableOpacity>
         )
       }}
     />
     )} */}
     <Modalize
   ref={churchModalRef}
   snapPoint={500}
   flatListProps={{
     data: churchMembers || [],
     keyExtractor: (item) => item.id.toString(),
     renderItem: ({ item }) => (
       <TouchableOpacity style={styles.card2}>
         {item.profilePictureUrl ? (
              <Image style={styles.image} source={{ uri: item.profilePictureUrl }} />
              ) : (
                  <View style={styles.iconforListofUsers}>
                  <Icon
                     name="user"
                     size={50}
                     color="#01ebff"
                   />
                </View>
               )}
         <View style={styles.cardContent}>
           <Text style={styles.name}>{item.firstName} {item.secondName}</Text>
           <Text style={styles.position}>{item.churchName}</Text>
           
         </View>
       </TouchableOpacity>
     )
   }}
 />
 
       {/* Image Preview Modal */}
       <Modal visible={modalVisible} transparent={true} animationType="fade">
         <View style={styles.modalBackground}>
           <TouchableOpacity style={styles.modalContainer} onPress={() => setModalVisible(false)}>
             {selectedImage && (
               <Image style={styles.fullImage} source={{ uri: selectedImage }} />
             )}
           </TouchableOpacity>
         </View>
       </Modal>
     </View>
     
     
   );
 };
 
 
 
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
     backgroundColor: '#01ebff',
     color: '#fff',
   },
   card2: {
     shadowColor: '#00000021',
     shadowOffset: {
       width: 6,
       height: 6,
     },
     shadowOpacity: 0.37,
     shadowRadius: 7.49,
     elevation: 12,
     marginVertical: 10,   
     backgroundColor: '#D0F8FF',
     borderColor: '#7FE7FD',  
      borderWidth: 2,    
     padding: 10,          
     flexDirection: 'row',  
     borderRadius: 10,     
     marginHorizontal: 15,       
   },
   
   activeNavButton: {
     backgroundColor: '#01ebff',
     color: '#fff',
   },
   card: {
     width: '100%',
     maxWidth: 400,
     padding: 20,
     backgroundColor: '#D0F8FF',
     borderRadius: 15,
     borderColor: '#7FE7FD',  
     borderWidth: 2,          
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.1,
     shadowRadius: 10,
     elevation: 5,
   },
   iconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#DCDCDC',
    borderWidth: 3,
    backgroundColor: '#f0f0f0', 
    alignSelf: 'center',
  },
  iconforListofUsers: {
     width: 70,
    height: 70,
    borderRadius: 35,
   alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#DCDCDC',
    borderWidth: 3,
    backgroundColor: '#f0f0f0',
    alignSelf: 'center',
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
     backgroundColor: '#01ebff',
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
  
   
 
   container2: {
     flex: 1,
     marginTop: 20,
   },
   list: {
     paddingHorizontal: 10,
   },
   listContainer2: {
     alignItems: 'center',
   },
   separator: {
     marginTop: 10,
   },
   /******** card **************/
   card3: {
     marginVertical: 8,
     // backgroundColor: 'white',
     flexBasis: '45%',
     marginHorizontal: 10,
     backgroundColor: '#D0F8FF',
     borderColor: '#7FE7FD',  
      borderWidth: 2,
   },
   cardContent: {
     paddingVertical: 17,
     paddingHorizontal: 10,
     justifyContent: 'space-between',
   },
   cardImage: {
     flex: 1,
     height: 150,
     width: null,
   },
   imageContainer: {
     shadowColor: '#000',
     shadowOffset: {
       width: 0,
       height: 4,
     },
     shadowOpacity: 0.32,
     shadowRadius: 5.46,
 
     elevation: 9,
   },
   /******** card components **************/
   title: {
     fontSize: 18,
     flex: 1,
     color: '#778899',
   },
   count: {
     fontSize: 18,
     flex: 1,
     color: '#B0C4DE',
   },
   modalBackground: {
   flex: 1,
   backgroundColor: 'rgba(0,0,0,0.8)',
   justifyContent: 'center',
   alignItems: 'center',
 },
 modalContainer: {
   width: '100%',
   height: '100%',
   justifyContent: 'center',
   alignItems: 'center',
 },
 fullImage: {
   width: '90%',
   height: '70%',
   resizeMode: 'contain',
 },
 menuIcon: {
   position: 'absolute',
   top: 5,
   right: 5,
   zIndex: 2,
   padding: 5,
 },
 
 dots: {
   fontSize: 20,
   color: '#333',
 },
 
 menu: {
   position: 'absolute',
   top: 30,
   right: 5,
   backgroundColor: '#fff',
   padding: 10,
   borderRadius: 5,
   elevation: 5,
   zIndex: 3,
 },
 
 menuItem: {
   fontSize: 14,
   color: 'red',
 },
 
 table: {
   marginTop: 10,
   borderWidth: 1,
   borderColor: '#ccc',
   borderRadius: 8,
   overflow: 'hidden',
 },
 
 tableRow: {
   flexDirection: 'row',
   paddingVertical: 10,
   paddingHorizontal: 15,
   borderBottomWidth: 1,
   borderBottomColor: '#eee',
   backgroundColor: '#fff',
 },
 
 tableLabel: {
   flex: 1,
   fontWeight: 'bold',
   color: '#333',
 },
 
 tableValue: {
   flex: 2,
   color: '#555',
 },
 
 });

export default ViewProfileScreen;
