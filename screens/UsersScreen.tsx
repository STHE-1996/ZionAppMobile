import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, FlatList } from 'react-native';
import { getUsers } from '../services/apiService';
import { UserDetails } from '../models/UserDetails';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Import the "fa-user" icon
// import { styles } from './styles';

const Users = ({ navigation }: { navigation: any }) => {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(true); // To track the loading state

  useEffect(() => {
    // Fetch users when the component mounts
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data); // Set the fetched users to the state
      } catch (error) {
        Alert.alert('Error', 'Failed to load users');
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchUsers();
  }, []); // Empty dependency array to call it only once when the component mounts

  const clickEventListener = (user: UserDetails) => {
    navigation.navigate('ChatScreen', { user });
  };

  const renderProfileImage = (profilePictureUrl: string) => {
    if (profilePictureUrl) {
      return <Image style={styles.userImage} source={{ uri: profilePictureUrl }} />;
    } else {
      return (
        <FontAwesomeIcon
          icon={faUser} // Use the "fa-user" icon
          style={{ color: "#74C0FC", fontSize: 90 }} // Style the icon (color and size)
        />
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContainer}
        data={users}
        horizontal={false}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity style={styles.card} onPress={() => clickEventListener(item)}>
              <View style={styles.cardHeader}>
                <Image
                  style={styles.icon}
                  source={{ uri: 'https://img.icons8.com/flat_round/64/000000/hearts.png' }}
                />
              </View>
              <View style={styles.container}>
      {item.profilePictureUrl ? (
        <Image
          style={styles.userImage}
          source={{ uri: item.profilePictureUrl }}
        />
      ) : (
        <View style={styles.iconContainer}>
          <Icon
            name="user" // Choose the icon name you prefer (e.g., 'user', 'user-circle')
            size={60} // Icon size adjusted to fit the container
            color="#01ebff" // Icon color
          />
        </View>
      )}
    </View>
              <View style={styles.cardFooter}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={styles.name}>{`${item.firstName} ${item.secondName}`}</Text>
                  <Text style={styles.position}>{item.churchType}</Text>
                  <TouchableOpacity
                    style={styles.followButton}
                    onPress={() => clickEventListener(item)}>
                    <Text style={styles.followButtonText}>Chats</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  list: {
    paddingHorizontal: 5,
    backgroundColor: '#E6E6E6',
  },
  listContainer: {
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /******** card **************/
  card: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    marginVertical: 5,
    backgroundColor: 'white',
    flexBasis: '46%',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  cardFooter: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 10, 
    borderBottomRightRadius: 10, 
  },
  userImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
    alignSelf: 'center',
    borderColor: '#DCDCDC',
    borderWidth: 3,
    
  },
  iconContainer: {
    height: 120,
    width: 120,
    borderRadius: 60, // To make the icon circular
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#DCDCDC',
    borderWidth: 3,
    backgroundColor: '#f0f0f0', // Optional: Add a background color for the icon
    alignSelf: 'center',
  },
  name: {
    fontSize: 18,
    flex: 1,
    alignSelf: 'center',
    color: '#008080',
    fontWeight: 'bold',
  },
  position: {
    fontSize: 14,
    flex: 1,
    alignSelf: 'center',
    color: '#696969',
  },
  followButton: {
    marginTop: 10,
    height: 35,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: 'rgb(1, 235, 252)',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  icon: {
    height: 20,
    width: 20,
  },
});

export default Users;
