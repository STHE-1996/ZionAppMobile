import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert } from 'react-native';

type NotificationItem = {
  id: number;
  description: string;
  date: string;
  color: string;
  completed: number;
};

const ListPosts = () => {
    const data = [
        {
          id: 3,
          image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/492e51e6-1051-4b73-82a8-df94ed6213fb.jpg?alt=media',
          name: 'Sakhile',
          text: 'Sakhile posted on your time line',
          attachment: 'https://via.placeholder.com/100x100/FFB6C1/000000',
        },
        {
          id: 2,
          image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/c5fb1cce-c3ff-43cd-af88-616370ce82ee.jpg?alt=media',
          name: 'Nomvelo',
          text: 'Nomvelo sent an invitation t you.',
          attachment: 'https://via.placeholder.com/100x100/20B2AA/000000',
        },
        {
          id: 4,
          image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/ddc32773-7db7-4bc4-bc08-cfe3bc6f96eb.jpg?alt=media',
          name: 'Naidoo',
          text: 'Naidoo is following you, check her out.',
          attachment: '',
        },
        
      ]
    
      const [comments, setComments] = useState(data)
    
      return (
        <FlatList
          style={styles.root}
          data={comments}
          ItemSeparatorComponent={() => {
            return <View style={styles.separator} />
          }}
          keyExtractor={item => {
            return item.id.toString()
          }}
          renderItem={item => {
            const Notification = item.item
            let attachment = <View />
    
            let mainContentStyle
            if (Notification.attachment) {
              mainContentStyle = styles.mainContent
              attachment = <Image style={styles.attachment} source={{ uri: Notification.attachment }} />
            }
            return (
              <TouchableOpacity style={styles.container}>
                <Image source={{ uri: Notification.image }} style={styles.avatar} />
                <View style={styles.content}>
                  <View style={mainContentStyle}>
                    <View style={styles.text}>
                      <Text style={styles.name}>{Notification.name}</Text>
                      <Text>{Notification.text}</Text>
                    </View>
                    <Text style={styles.timeAgo}>2 hours ago</Text>
                  </View>
                  {attachment}
                </View>
              </TouchableOpacity>
            )
          }}
        />
      )
    }
    
    const styles = StyleSheet.create({
      root: {
        backgroundColor: '#FFFFFF',
      },
      container: {
        padding: 16,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#FFFFFF',
        alignItems: 'flex-start',
      },
      avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
      },
      text: {
        marginBottom: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      content: {
        flex: 1,
        marginLeft: 16,
        marginRight: 0,
      },
      mainContent: {
        marginRight: 60,
      },
      img: {
        height: 50,
        width: 50,
        margin: 0,
      },
      attachment: {
        position: 'absolute',
        right: 0,
        height: 50,
        width: 50,
      },
      separator: {
        height: 1,
        backgroundColor: '#CCCCCC',
      },
      timeAgo: {
        fontSize: 12,
        color: '#696969',
      },
      name: {
        fontSize: 16,
        color: '#1E90FF',
      },
    });

export default ListPosts;
