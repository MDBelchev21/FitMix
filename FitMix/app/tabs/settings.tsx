import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from '../context/TranslationContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleLanguage = async () => {
    try {
      const newLanguage = language === 'en' ? 'bg' : 'en';
      await setLanguage(newLanguage);
      Alert.alert(t.success, t.languageUpdated);
    } catch (error) {
      console.error('Error updating language:', error);
      Alert.alert(t.error, t.updateFailed);
    }
  };

  const handleThemeToggle = async () => {
    try {
      await toggleTheme();
      Alert.alert(t.success, t.themeUpdated);
    } catch (error) {
      console.error('Error updating theme:', error);
      Alert.alert(t.error, t.updateFailed);
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
                <Text style={[styles.title, isDarkMode ? styles.textLight : styles.textDark]}>{t.settings}</Text>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>{t.language}</Text>
                <TouchableOpacity 
                  style={[styles.settingItem, isDarkMode ? styles.darkItem : styles.lightItem]} 
                  onPress={toggleLanguage}
                >
                  <View style={styles.settingContent}>
                    <FontAwesome5 name="language" size={20} color={isDarkMode ? "white" : "black"} />
                    <Text style={[styles.settingText, isDarkMode ? styles.textLight : styles.textDark]}>
                      {language === 'en' ? t.english : t.bulgarian}
                    </Text>
                  </View>
                  <FontAwesome5 name="chevron-right" size={16} color={isDarkMode ? "white" : "black"} />
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>{t.theme}</Text>
                <View style={[styles.settingItem, isDarkMode ? styles.darkItem : styles.lightItem]}>
                  <View style={styles.settingContent}>
                    <FontAwesome5 name={isDarkMode ? "moon" : "sun"} size={20} color={isDarkMode ? "white" : "black"} />
                    <Text style={[styles.settingText, isDarkMode ? styles.textLight : styles.textDark]}>
                      {isDarkMode ? t.dark : t.light}
                    </Text>
                  </View>
                  <Switch
                    value={isDarkMode}
                    onValueChange={handleThemeToggle}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
                  />
                </View>
              </View>
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
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 15,
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
});
