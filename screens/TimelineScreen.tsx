import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, ActivityIndicator, Alert } from "react-native";
import Video from "react-native-video";
import { postTimeLine, TimeLine, uploadImageTimeLine } from "../services/timeLimeServices";
import { Post, UserDetails } from "../models/UserDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker'; 




  const TimelineScreen = () => {
  const [activity, setActivity] = useState("");
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [timeline, setTimeLine] = useState<Post[]>([]);
  const [title, setTitle] = useState('');  
  const [paragraph, setParagraph] = useState(''); 
  const [activeTab, setActiveTab] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleComments = (postId: string) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const isVideo = (url: string) => {
    return url && /\.(mp4|mov|avi|mkv|webm|MOV)$/i.test(url);
  };




  useEffect(() => {
    const fetchTimeData = async () => {
      try {
        const timeLineData = await TimeLine();
        setTimeLine(timeLineData);
      } catch (error) {
        console.error('Error fetching timeLine :', error);
      } finally {
        setIsLoading(false); // Data fetched, set loading to false
      }
    };
    fetchTimeData();
  }, []);
  

  
  


  const handlePostSubmit = async () => {
    if (title.trim() && paragraph.trim()) {
      try {
        const senderId = await AsyncStorage.getItem('userId');
        if (senderId) {
          const postingRequest = {
            id: senderId, 
            title: title,
            paragraph: paragraph,
          };
          setIsLoading(true); 
          const newPost = await postTimeLine(postingRequest);
          setTimeLine((prevTimeline) => [newPost, ...prevTimeline]);
          setTitle('');
          setParagraph('');
        } else {
          console.error('User ID not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error posting new timeline:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Title and Paragraph are required');
    }
  };


  const pickImage = async () => {
    // Ask for permission to access the camera roll (if not already granted)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access the camera roll is required!');
      return;
    }
  
    // Launch the image picker and set the selected image
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri); // Accessing URI from the first asset
    }
  };
  

  // Method to handle form submission
  const handleSubmit = async () => {
    if (!title || !image) {
      console.log(title, image);
      Alert.alert('Please provide both a title and an image!');
      return;
    }
  
    try {
      console.log('Submitting form with:', title, image);
  
      // Create formData and append the image
      const formData = new FormData();
      formData.append('file', {
        uri: image, // URI of the image
        type: 'image/jpeg', // You can change this based on your image type
        name: 'image.jpg', // Provide a filename
      });
  
      // ID and title for the request
      const id = '6617aa5a4b2c0461281c4ebe'; // Replace with your actual ID
      const response = await uploadImageTimeLine(formData, id, title);

      console.log('your response is ', response);
        // Append the new post to the timeline state
        setTimeLine((prevTimeline) => [response, ...prevTimeline]);
  
      // Handle the response from the service (e.g., show success message)
      Alert.alert('Form Submitted', `Title: ${title}\nImage upload successful!`);
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', 'There was an error submitting your form.');
    }
  };
    
    return (
      <View style={styles.container}>
        <FlatList
          data={timeline}
          keyExtractor={(item) => String(item.postId)}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            ) : (
              <Text>No content available</Text>
            )
          }
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              {/* User Info */}
              <View style={styles.userInfo}>
                <Image source={{ uri: item.user.profilePictureUrl }} style={styles.profilePic} />
                <View>
                  <Text style={styles.userName}>{item.user.firstName} {item.user.secondName}</Text>
                </View>
              </View>
    
              {/* Post Content */}
              <Text style={styles.content}>{item.title}</Text>
    
              {/* Media (Video or Image) */}
              {item.content ? (
                isVideo(item.content) ? (
                  <Video
                    source={{ uri: item.content }}
                    style={styles.media}
                    controls
                    resizeMode="contain"
                    paused={false}
                    repeat={true}
                    onError={(error) => console.log("Video Error:", error)}
                    onLoadStart={() => console.log("Loading video...")}
                    onLoad={() => console.log("Video loaded")}
                    onBuffer={() => console.log("Buffering...")}
                  />
                ) : item.content.startsWith("http") ? (
                  <Image source={{ uri: item.content }} style={styles.media} />
                ) : (
                  <Text style={styles.mediaText}>{item.content}</Text>
                )
              ) : null}
    
              {/* Activity Feed */}
              <View style={styles.activityFeed}>
                <TextInput
                  style={styles.input}
                  placeholder="Share what you've been up to..."
                  value={activity}
                  onChangeText={setActivity}
                />
                <TouchableOpacity style={styles.postButton}>
                  <Text style={styles.postText}>Post</Text>
                </TouchableOpacity>
              </View>
    
              {/* Comments */}
              {showComments[item.postId] &&
                item.comments !== null && Array.isArray(item.comments) && item.comments.map((comment) => (
                  <View key={comment.id} style={styles.comment}>
                    <Text style={styles.commentUser}>{comment.user}</Text>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                ))}
    
              {/* Show Comments Button */}
              <TouchableOpacity onPress={() => toggleComments(item.postId)} style={styles.showCommentsButton}>
                <Text style={styles.showCommentsText}>
                  {showComments[item.postId] ? "Hide comments" : "Show comments"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          ListHeaderComponent={
            <View style={styles.stickyContainer}>
              {/* Tab Buttons */}
              <View style={styles.tabsContainer}>
                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 1 && styles.activeTab]}
                  onPress={() => setActiveTab(1)}
                >
                  <Text style={styles.tabText}>Make a publication</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 2 && styles.activeTab]}
                  onPress={() => setActiveTab(2)}
                >
                  <Text style={styles.tabText}>Post Image</Text>
                </TouchableOpacity>
              </View>
  
              {/* Tab 1: Title + Paragraph */}
              {activeTab === 1 && (
                <View style={styles.tabContent}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Title"
                    value={title}
                    onChangeText={setTitle}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Paragraph"
                    value={paragraph}
                    onChangeText={setParagraph}
                  />
                   <TouchableOpacity onPress={handlePostSubmit} style={styles.postButton}>
                  <Text style={styles.postText}>Post</Text>
                </TouchableOpacity>
                </View>
              )}
  
              {/* Tab 2: Title + Upload */}
              {activeTab === 2 && (
                <View style={styles.tabContent}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Title"
                    value={title}
                    onChangeText={setTitle}
                  />
  
                 {/* Image Upload Button */}
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadText}>Pick an Image</Text>
          </TouchableOpacity>

          {/* Display selected image */}
          {image && <Image source={{ uri: image }} style={styles.uploadedImage} />}

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
                </View>
              )}
            </View>
          }
        />
      </View>
    );
  };

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  postContainer: {
    backgroundColor: "#D0F8FF",
    borderColor: "#7FE7FD",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10, // Add space between tabs and content
  },
  tabContent: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  content: {
    fontSize: 14,
    marginBottom: 8,
  },
  mediaText: {
    fontSize: 16,
    color: "#333",
    padding: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: '#01ebff',
    padding: 10,
  },
  submitText: {
    color: 'white',
    textAlign: 'center',
  },
  media: {
    width: "100%",
    height: 500,
    borderRadius: 8,
    backgroundColor: "#000",
  },
  activityFeed: {
    backgroundColor: "#D0F8FF",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 5,
  },
  postButton: {
    backgroundColor: "#01ebff",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  postText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  comment: {
    backgroundColor: "#D0F8FF",
    padding: 5,
    marginTop: 5,
    borderRadius: 5,
  },
  commentUser: {
    fontWeight: "bold",
  },
  commentText: {
    fontSize: 12,
  },
  showCommentsButton: {
    marginTop: 5,
    alignSelf: "flex-start",
  },
  showCommentsText: {
    color: "#00838F",
    fontWeight: "bold",
  },
  stickyContainer: {
    padding: 10,
    backgroundColor: '#fff',
    // Optionally, add a shadow or border to distinguish the sticky container
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  titleInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  paragraphInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: "#01ebff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "bold",
  },
  uploadedImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    resizeMode: "cover",
  },
  tabButton: {
    backgroundColor: "#D0F8FF",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: "#01ebff",
  },
  tabText: {
    color: "#333",
    fontWeight: "bold",
  },
  loader: {
    flex: 1,             
    justifyContent: 'center',
    alignItems: 'center', 
  },
});

export default TimelineScreen;
function getImageBlob(image: string) {
  throw new Error("Function not implemented.");
}

function launchImageLibrary(arg0: {
  mediaType: string; // Only allow picking photos
  quality: number;
}, arg1: (response: any) => void) {
  throw new Error("Function not implemented.");
}

