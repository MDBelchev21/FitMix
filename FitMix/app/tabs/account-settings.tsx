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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useTranslation } from '../context/TranslationContext';
import { useTheme } from '../context/ThemeContext';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const user = auth.currentUser;
    if (user) {
      setUsername(user.displayName || '');
      setProfileImage(user.photoURL);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t.error, t.enterCurrentPassword);
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t.error, t.passwordsNotMatch);
      return;
    }

    try {
      setIsLoading(true);
      const user = auth.currentUser;
      if (user && user.email) {
        // Re-authenticate user before updating password
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        Alert.alert(t.success, t.passwordUpdated);
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      if (error.code === 'auth/wrong-password') {
        Alert.alert(t.error, t.currentPasswordIncorrect);
      } else {
        Alert.alert(t.error, t.updateFailed);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateUsername = async () => {
    if (!username.trim()) {
      Alert.alert(t.error, t.enterUsername);
      return;
    }

    try {
      setIsLoading(true);
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, {
          displayName: username
        });
        Alert.alert(t.success, t.usernameUpdated);
      }
    } catch (error) {
      console.error('Error updating username:', error);
      Alert.alert(t.error, t.updateFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const user = auth.currentUser;
      
      if (!user) return null;

      const imageRef = ref(storage, `profile_images/${user.uid}`);
      await uploadBytes(imageRef, blob);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setIsLoading(true);
        const downloadUrl = await uploadImage(result.assets[0].uri);
        
        if (downloadUrl) {
          const user = auth.currentUser;
          if (user) {
            await updateProfile(user, {
              photoURL: downloadUrl
            });
            setProfileImage(downloadUrl);
          }
        }
      }
    } catch (error) {
      console.error('Error updating profile image:', error);
      Alert.alert(t.error, t.updateFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert(t.error, t.signOutFailed);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={[styles.container, isDarkMode ? styles.darkMode : styles.lightMode]}>
        <LinearGradient
          colors={isDarkMode ? ['#1a1a1a', '#2a2a2a'] : ['#ffffff', '#f5f5f5']}
          style={styles.background}
        >
          <View style={styles.mainContainer}>
            <ScrollView style={styles.scrollView}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/tabs/home')} style={styles.backButton}>
                  <FontAwesome5 name="arrow-left" size={20} color={isDarkMode ? "white" : "black"} />
                </TouchableOpacity>
                <Text style={[styles.title, isDarkMode ? styles.textLight : styles.textDark]}>{t.accountSettings}</Text>
              </View>

              <View style={styles.profileSection}>
                <TouchableOpacity onPress={handleProfileImage} style={styles.profileImageContainer}>
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                  ) : (
                    <View style={[styles.placeholderImage, isDarkMode ? styles.darkItem : styles.lightItem]}>
                      <FontAwesome5 name="user" size={40} color={isDarkMode ? "white" : "black"} />
                    </View>
                  )}
                  <View style={styles.editIconContainer}>
                    <FontAwesome5 name="camera" size={14} color="white" />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>{t.profileInformation}</Text>
                <View style={[styles.inputContainer, isDarkMode ? styles.darkItem : styles.lightItem]}>
                  <Text style={[styles.label, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>{t.username}</Text>
                  <TextInput
                    style={[styles.input, isDarkMode ? styles.textLight : styles.textDark]}
                    value={username}
                    onChangeText={setUsername}
                    placeholder={t.enterUsername}
                    placeholderTextColor={isDarkMode ? "#666" : "#999"}
                  />
                  <TouchableOpacity onPress={updateUsername} style={[styles.button, styles.primaryButton]}>
                    <Text style={styles.buttonText}>{t.updateUsername}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>{t.changePassword}</Text>
                <View style={[styles.inputContainer, isDarkMode ? styles.darkItem : styles.lightItem]}>
                  <Text style={[styles.label, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>{t.currentPassword}</Text>
                  <TextInput
                    style={[styles.input, isDarkMode ? styles.textLight : styles.textDark]}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                    placeholder={t.enterCurrentPassword}
                    placeholderTextColor={isDarkMode ? "#666" : "#999"}
                  />
                  <Text style={[styles.label, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>{t.newPassword}</Text>
                  <TextInput
                    style={[styles.input, isDarkMode ? styles.textLight : styles.textDark]}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    placeholder={t.enterNewPassword}
                    placeholderTextColor={isDarkMode ? "#666" : "#999"}
                  />
                  <Text style={[styles.label, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>{t.confirmNewPassword}</Text>
                  <TextInput
                    style={[styles.input, isDarkMode ? styles.textLight : styles.textDark]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholder={t.confirmNewPassword}
                    placeholderTextColor={isDarkMode ? "#666" : "#999"}
                  />
                  <TouchableOpacity onPress={handlePasswordChange} style={[styles.button, styles.primaryButton]}>
                    <Text style={styles.buttonText}>{t.updatePassword}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                onPress={handleSignOut} 
                style={[styles.button, styles.dangerButton]}
              >
                <Text style={styles.buttonText}>{t.signOut}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF4B4B',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  inputContainer: {
    padding: 20,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#FF4B4B',
  },
  dangerButton: {
    backgroundColor: '#FF4B4B',
    marginHorizontal: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  darkMode: {
    backgroundColor: '#1a1a1a',
  },
  lightMode: {
    backgroundColor: '#ffffff',
  },
  darkItem: {
    backgroundColor: '#2a2a2a',
  },
  lightItem: {
    backgroundColor: '#f5f5f5',
  },
  textLight: {
    color: 'white',
  },
  textDark: {
    color: 'black',
  },
  textLightSecondary: {
    color: '#999',
  },
  textDarkSecondary: {
    color: '#666',
  },
});
