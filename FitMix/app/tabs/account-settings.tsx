import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth, storage } from '../config/firebase';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, uploadString } from 'firebase/storage';

export default function AccountSettings() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUsername(user.displayName || '');
      setProfileImage(user.photoURL);
    }
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      try {
        const uri = result.assets[0].uri;
        setProfileImage(uri);
        await uploadProfileImage(uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to update profile image');
      }
    }
  };

  const uploadProfileImage = async (uri: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Get the file extension and create a unique filename
      const extension = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const filename = `${user.uid}_${Date.now()}.${extension}`;

      // Create a reference to the storage location
      const imageRef = ref(storage, `profile_images/${filename}`);

      // Convert image to base64
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Create a FileReader to read the blob as base64
      const reader = new FileReader();
      
      // Create a promise to handle the FileReader
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
      
      // Read the blob as base64
      reader.readAsDataURL(blob);
      
      // Wait for the base64 data
      const base64Data = await base64Promise;
      
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64String = String(base64Data).split(',')[1];

      // Upload the base64 string
      console.log('Starting upload...');
      await uploadString(imageRef, base64String, 'base64', {
        contentType: `image/${extension}`
      });
      console.log('Upload completed');

      // Get the download URL
      const downloadURL = await getDownloadURL(imageRef);
      console.log('Download URL obtained:', downloadURL);

      // Update user profile
      await updateProfile(user, {
        photoURL: downloadURL,
      });

      Alert.alert('Success', 'Profile image updated successfully!');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        serverResponse: error.serverResponse
      });
      Alert.alert(
        'Error',
        'Failed to update profile image. Please try again later.'
      );
      throw error;
    }
  };

  const updateUsername = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, {
          displayName: username,
        });
        Alert.alert('Success', 'Username updated successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update username');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        Alert.alert('Success', 'Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update password. Please check your current password.');
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#1a1a1a', '#2a2a2a']}
          style={styles.background}
        >
          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <FontAwesome5 name="arrow-left" size={20} color="white" />
              </TouchableOpacity>
              <Text style={styles.title}>Account Settings</Text>
            </View>

            <View style={styles.profileSection}>
              <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <FontAwesome5 name="user" size={40} color="#666" />
                  </View>
                )}
                <View style={styles.editIconContainer}>
                  <FontAwesome5 name="camera" size={16} color="white" />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile Information</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter username"
                  placeholderTextColor="#666"
                />
                <TouchableOpacity onPress={updateUsername} style={styles.button}>
                  <Text style={styles.buttonText}>Update Username</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Change Password</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Current Password</Text>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  placeholder="Enter current password"
                  placeholderTextColor="#666"
                />
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="Enter new password"
                  placeholderTextColor="#666"
                />
                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="Confirm new password"
                  placeholderTextColor="#666"
                />
                <TouchableOpacity onPress={handlePasswordChange} style={styles.button}>
                  <Text style={styles.buttonText}>Update Password</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2a2a2a',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1a1a1a',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#2a2a2a',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  inputContainer: {
    gap: 10,
  },
  label: {
    color: '#999',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    color: 'white',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
