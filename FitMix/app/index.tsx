import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { auth } from './config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      await AsyncStorage.setItem('userToken', token);
      router.replace('/tabs/home');
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#1E1E1E', '#252525']}
          style={styles.background}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.logoContainer}>
                <View style={styles.iconWrapper}>
                  <LinearGradient
                    colors={['#2F9E44', '#40C057']}
                    style={styles.iconBackground}
                  >
                    <FontAwesome name="heartbeat" size={50} color="#FFFFFF" />
                  </LinearGradient>
                </View>
                <Text style={styles.title}>FitMix</Text>
                <Text style={styles.subtitle}>Your Personal Fitness Journey</Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[styles.input, styles.passwordInput]}
                      placeholder="Password"
                      placeholderTextColor="#666"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity 
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesome 
                        name={showPassword ? "eye" : "eye-slash"} 
                        size={20} 
                        color="#666" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.buttonWrapper} onPress={handleLogin}>
                  <LinearGradient
                    colors={['#2F9E44', '#40C057']}
                    style={styles.button}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.buttonText}>Login</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.registerLink}
                  onPress={() => router.push('/register')}
                >
                  <Text style={styles.registerText}>
                    Don't have an account? <Text style={styles.registerTextBold}>Register</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  iconWrapper: {
    borderRadius: 60,
    backgroundColor: '#2A2A2A',
    padding: 3,
    shadowColor: '#2F9E44',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2F9E44',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#90CFA4',
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  inputWrapper: {
    marginBottom: 15,
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
    padding: 3,
    shadowColor: '#2F9E44',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 14,
    fontSize: 16,
    color: '#E0E0E0',
    borderWidth: 1,
    borderColor: '#404040',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
  },
  buttonWrapper: {
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
    padding: 3,
    marginTop: 10,
    shadowColor: '#2F9E44',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  button: {
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#90CFA4',
    fontSize: 16,
  },
  registerTextBold: {
    color: '#2F9E44',
    fontWeight: 'bold',
  },
});
