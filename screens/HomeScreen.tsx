import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const data = [
    { id: 1, title: 'Home', icon: 'home', color: '#01ebff', size: 40 },
    { id: 2, title: 'User', icon: 'user', color: '#01ebff', size: 50 },
    { id: 3, title: 'Calendar', icon: 'calendar', color: '#01ebff', size: 50 },
    { id: 4, title: 'Cart', icon: 'shopping-cart', color: '#01ebff', size: 40 },
    { id: 5, title: 'Bell', icon: 'bell', color: '#01ebff', size: 50 },
    { id: 6, title: 'Pen', icon: 'pencil', color: '#01ebff', size: 40 },
    { id: 7, title: 'Music', icon: 'music', color: '#01ebff', size: 40 },
    { id: 8, title: 'Chat', icon: 'comment', color: '#01ebff', size: 40 },
  ];

  const showAlert = (title: string) => {
    Alert.alert(`${title} selected`);
  };

  const handleLogout = () => {
    Alert.alert('Logged out');
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContainer}
        data={data}
        horizontal={false}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              // Navigate based on the title of the item
              if (item.title === 'Chat') {
                navigation.navigate('RecentChatsScreen'); // Navigate to ChatScreen
              } else if (item.title === 'User') {
                navigation.navigate('UsersScreen'); // Navigate to UsersScreen
              } else {
                // showAlert();
              }
            }}
          >
            <Icon name={item.icon} style={[styles.icon, { color: item.color, fontSize: item.size }]} />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 5,
    backgroundColor: '#E6E6E6',
    width: '100%',
  },
  listContainer: {
    alignItems: 'center',
  },
  card: {
    shadowColor: '#00000021',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    marginVertical: 10,
    backgroundColor: 'white',
    flexBasis: '42%',
    marginHorizontal: 10,
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: '#696969',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF5733',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
