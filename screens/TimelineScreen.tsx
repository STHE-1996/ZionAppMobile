import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, ActivityIndicator, Alert, Modal, Button } from "react-native";
import Video from "react-native-video";
import { comment, heartPost, izibusisoPost, likePost, postTimeLine, TimeLine, uploadImageTimeLine } from "../services/timeLimeServices";
import { Post, PostHeart, PostIzibusiso, PostLike, UserDetails } from "../models/UserDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker'; 
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { faUser } from '@fortawesome/free-solid-svg-icons'; // Import the "fa-user" icon




  const TimelineScreen = () => {
  const [activity, setActivity] = useState("");
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [timeline, setTimeLine] = useState<Post[]>([]);
  const [title, setTitle] = useState('');  
  const [paragraph, setParagraph] = useState(''); 
  const [activeTab, setActiveTab] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<{ [key: string]: string }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<PostLike[] | PostHeart[] | PostIzibusiso[]>([]);
 


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
  

  
  const handleSubmit = async () => {
    if (!title || !image) {
      console.log(title, image);
      Alert.alert('Please provide both a title and an image!');
      return;
    }
  
    try {
      console.log('Submitting form with:', title, image);
      const file = {
           uri: image, // local file URI
           type: 'image/jpeg',
           name: 'image.jpg',
      } as any;

      const formData = new FormData();
      formData.append('file', file);
  
      
      const id = await AsyncStorage.getItem('userId');
      if (!id) {
            throw new Error('User ID not found');
      }
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

  
  
  const handleActivityChange = (postId: string, text: string) => {
    setActivities((prevActivities) => ({ ...prevActivities, [postId]: text }));
  };

  const handleCommentChange = (postId: string, text: string) => {
  setCommentInputs((prevInputs) => ({ ...prevInputs, [postId]: text }));
};

const handleReaction = (postId: string, type: string) => {
  console.log(`Post ${postId} received a ${type} reaction`);
  // You can extend this to call an API or update state.
};



  const handleSubmitComment = async (postId: string) => {

    console.log('api triggeredcles')
    const commentText = activities[postId]; 
    const userId = await AsyncStorage.getItem('userId');

    console.log('post id', postId);
    console.log('comment', commentText);
    console.log('user Id', userId);
  
    if (commentText && userId) {
      try {
        // Call the comment API
        const response = await comment(commentText, userId, postId);
        setTimeLine((prevTimeline) =>
          prevTimeline.map((post) => {
            if (post.postId === postId) {
              return { 
                ...post, 
                comments: [...post.comments, response] 
              }; 
            }
            return post;
          })
        );
  
        // Clear the comment input field
        setCommentInputs((prevInputs) => ({ ...prevInputs, [postId]: '' }));
      } catch (error) {
        console.error('Error submitting comment:', error);
        Alert.alert('Error', 'There was an error submitting your comment.');
      }
    } else {
      Alert.alert('Error', 'Please provide a comment.');
    }
  };

  
  const handleReactionLike = async (postId: string, reactionType: string) => {
    if (reactionType === 'like') {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const response = await likePost(userId, postId);
          console.log(response);
  
          if (response.message === 'Post liked successfully!') {
            const { likedPost } = response;
  
            // Update the specific post in the timeline state
            setTimeLine(prevTimeline =>
              prevTimeline.map(post =>
                post.postId === postId
                  ? {
                      ...post,
                      postLikeModelList: [
                        ...(post.postLikeModelList || []),
                        {
                          PostLikeId: likedPost.postLikeId,
                          userId: likedPost.userId,
                          firstName: likedPost.firstName,
                          lastName: likedPost.lastName,
                          profileUrl: likedPost.profileUrl,
                        },
                      ],
                    }
                  : post
              )
            );
          }
        } else {
          console.error('UserId not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error liking the post:', error);
      }
    }
  };
  
  const handleReactionHeart = async (postId: string, reactionType: string) => {
    if (reactionType === 'love') {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const response = await heartPost(userId, postId);
          console.log(response);
  
          if (response.message === 'Post hearted successfully!') {
            const { heartedPost } = response;
  
            // Update the specific post in the timeline state
            setTimeLine(prevTimeline =>
              prevTimeline.map(post =>
                post.postId === postId
                  ? {
                      ...post,
                      postHeartModelList: [
                        ...(post.postHeartModelList || []),
                        {
                          PostHeartId: heartedPost.postHeartId,
                          userId: heartedPost.userId,
                          firstName: heartedPost.firstName,
                          lastName: heartedPost.lastName,
                          profileUrl: heartedPost.profileUrl,
                        },
                      ],
                    }
                  : post
              )
            );
          }
        } else {
          console.error('UserId not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error hearting the post:', error);
      }
    }
  };


  const handleBadgeClick = (reactionType: string, usersList: PostLike[] | PostHeart[] | PostIzibusiso[]) => {
    setSelectedReaction(reactionType); // Set the selected reaction type
    setSelectedUsers(usersList); // Set the list of users who reacted with that reaction
    setModalVisible(true); // Open the modal
  };
  
  

  const handleReactionIsizibusiso = async (postId: string, reactionType: string) => {
    if (reactionType === 'laugh') {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const response = await izibusisoPost(userId, postId);
          console.log(response);
  
          if (response.message === 'Post izibusiso successfully!') {
            const { izibusiso } = response;
  
            // Update the specific post in the timeline state
            setTimeLine(prevTimeline =>
              prevTimeline.map(post =>
                post.postId === postId
                  ? {
                      ...post,
                      postIzibusisoModelList: [
                        ...(post.postIzibusisoModelList || []),
                        {
                          PostIzibusisoId: izibusiso.postIzibusisoId,
                          userId: izibusiso.userId,
                          firstName: izibusiso.firstName,
                          lastName: izibusiso.lastName,
                          profileUrl: izibusiso.profileUrl,
                        },
                      ],
                    }
                  : post
              )
            );
          }
        } else {
          console.error('UserId not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error izibusiso the post:', error);
      }
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
                  {item.user.profilePictureUrl ? (
                     <Image 
                         source={{ uri: item.user.profilePictureUrl }} 
                         style={styles.profilePic} 
                     />
               ) : (
                <View style={styles.iconContainer}>
                <FontAwesome 
                  name="user" // FontAwesome icon name
                  style={styles.icon} // Icon styling
                />
              </View>
             )}

              <View>
                <Text style={styles.userName}>
                    {item.user.firstName} {item.user.secondName}
                </Text>
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
               {/* Emoji Reactions */}
             {/* Emoji Reactions with Badges */}
             <View style={styles.reactionsContainer}>
              <TouchableOpacity onPress={() => handleReactionLike(item.postId, 'like')}>
                 <View style={styles.reactionBadgeWrapper}>
                {/* Badge Above the Icon */}
                     <TouchableOpacity onPress={() => handleBadgeClick('like', item?.postLikeModelList || [])}>
                      {item?.postLikeModelList?.length > 0 ? (
                     <View style={styles.badge}>
                         <Text style={styles.badgeText}>{item.postLikeModelList.length}</Text>
                     </View>
                     ) : (
                    <View style={styles.badge}>
                       <Text style={styles.badgeText}>0</Text>
                    </View>
                    )}
                   </TouchableOpacity>

                   {/* Reaction Icon */}
                   <Text style={styles.reaction}>👍</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleReactionHeart(item.postId, 'love')}>
                   <View style={styles.reactionBadgeWrapper}>
                   {/* Badge Above the Heart Icon */}
              <TouchableOpacity onPress={() => handleBadgeClick('love', item?.postHeartModelList || [])}>
              {item.postHeartModelList?.length > 0 ? (
              <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.postHeartModelList?.length}</Text>
              </View>
              ) : (
                <View style={styles.badge}>
              <Text style={styles.badgeText}>0</Text>
            </View>
              )}
             </TouchableOpacity>
    
            {/* Heart Reaction Icon */}
            <Text style={styles.reaction}>❤️</Text>
             </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleReactionIsizibusiso(item.postId, 'laugh')}>
                 <View style={styles.reactionBadgeWrapper}>
                 {/* Badge Above the Prayer Icon */}
            <TouchableOpacity onPress={() => handleBadgeClick('laugh', item?.postIzibusisoModelList || [])}>
            {item.postIzibusisoModelList?.length > 0 ? (
            <View style={styles.badge}>
                 <Text style={styles.badgeText}>{item.postIzibusisoModelList?.length}</Text>
            </View>
            ) : (
           <View style={styles.badge}>
                <Text style={styles.badgeText}>0</Text>
           </View>
           )}
           </TouchableOpacity>
    
           {/* Prayer Reaction Icon */}
           <Text style={styles.reaction}>🙏</Text>
               </View>
             </TouchableOpacity>
           </View>


              {/* Activity Feed */}
              <View style={styles.activityFeed}>
                <TextInput
                  style={styles.input}
                  placeholder="Share what you've been up to..."
                  value={activities[item.postId] || ''} 
                onChangeText={(text) => handleActivityChange(item.postId, text)}
                />
                <TouchableOpacity style={styles.postButton}>
                  <Text 
                      style={styles.postText} 
                      onPress={() => handleSubmitComment(item.postId)}>Post</Text>
                </TouchableOpacity>
              </View>
    
              {/* Comments */}
              {showComments[item.postId] && 
                  item.comments !== null && Array.isArray(item.comments) && 
                  item.comments.map((comment) => (
                       <View key={comment.id} style={styles.comment}>
                            <View style={styles.userInfo}>
                               {comment.user?.profilePictureUrl ? (
                               <Image 
                                  source={{ uri: comment.profilePictureUrl }} 
                                  style={styles.profilePic} 
                               />
                             ) : (
                           <View style={styles.iconContainer}>
                         <FontAwesome 
                              name="user" // FontAwesome icon name
                              style={styles.icon} // Icon styling
                           />
                        </View>
                      )}
                    <View>
                 <Text style={styles.commentUser}>{comment.firstName} {comment.secondName}</Text>
                 <Text style={styles.commentText}>{comment.text}</Text>
             </View>
            </View>
           </View>
           ))
           }

    
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
          <Modal
             animationType="slide"
             transparent={true}
             visible={modalVisible}
                 onRequestClose={() => setModalVisible(false)}
            >
             <View style={styles.modalBackground}>
                 <View style={styles.modalContainer}>
                       <Text style={styles.modalText}>
                            Users who reacted with {selectedReaction}:
                       </Text>

               {/* Display users who reacted */}
                    {selectedUsers.length > 0 ? (
                         selectedUsers.map((user, index) => (
                         <View key={index} style={styles.userDetail}>
                         <View style={styles.userInfo}>
                               {/* Display profile picture if available */}
                             {user.profileUrl ? (
                                 <Image
                                      source={{ uri: user.profileUrl }}
                                      style={styles.profilePic}
                                 />
                        ) : (
                                <View style={styles.iconContainer}>
                                    <FontAwesome
                                          name="user" // FontAwesome icon name
                                          style={styles.icon} // Icon styling
                                     />
                                </View>
                         )}
                      </View>
                    {/* User's name */}
                      <Text style={styles.userName}>
                             {user.firstName} {user.lastName}
                      </Text>
                   </View>
                   ))
                   ) : (
                     <Text>No users reacted yet.</Text>
                   )}

                   <Button title="Close" onPress={() => setModalVisible(false)} />
                   </View>
               </View>
           </Modal>
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
     borderWidth: 2,   
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10, 
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20, 
    marginRight: 10,
    backgroundColor: '#f0f0f0', 
    justifyContent: 'center',
    alignItems: 'center', 
  },
  icon: {
    color: '#01ebff', 
    fontSize: 25,
    paddingBottom: 50,
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
  userDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  reactionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    marginTop: 4,
  },
  
  reactionBadgeWrapper: {
    alignItems: 'center',  
    justifyContent: 'center', 
  },
  
  reaction: {
    fontSize: 30,
  },
  
  badge: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 15,
    marginBottom: 5, 
  },
  badgeText: {
    fontSize: 14,
    color: 'black',
  },
  
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default TimelineScreen;
function getImageBlob(image: string) {
  throw new Error("Function not implemented.");
}

function launchImageLibrary(arg0: {
  mediaType: string;
  quality: number;
}, arg1: (response: any) => void) {
  throw new Error("Function not implemented.");
}

