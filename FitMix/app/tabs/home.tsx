import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { auth } from '../config/firebase';
import { useTranslation } from '../context/TranslationContext';
import { useTheme } from '../context/ThemeContext';

type AppRoute = './workouts' | './progress' | './nutrition' | './community' | './settings';

interface MenuCardProps {
  icon: string;
  title: string;
  description: string;
  route: AppRoute;
  gradient: readonly [string, string];
  delay?: number;
}

const MenuCard: React.FC<MenuCardProps> = ({ icon, title, description, route, gradient, delay = 0 }) => {
  const router = useRouter();
  
  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay, type: 'timing', duration: 500 }}
    >
      <TouchableOpacity 
        onPress={() => router.push(route)}
        style={styles.cardContainer}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={gradient}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardInner}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name={icon} size={24} color="#FFF" style={styles.cardIcon} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardDescription}>{description}</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={20} color="#FFF" style={styles.chevron} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </MotiView>
  );
};

const Header: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useTheme();

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.displayName) {
      setUsername(user.displayName);
    } else if (user?.email) {
      setUsername(user.email.split('@')[0]);
    }
  }, []);

  return (
    <View style={styles.header}>
      <View>
        <Text style={[styles.greeting, { color: theme.colors.textPrimary }]}>{t.welcome}, {username}</Text>
        <Text style={[styles.date, { color: theme.colors.textSecondary }]}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
      </View>
      <TouchableOpacity 
        style={styles.profileButton}
        onPress={() => router.push('/tabs/account-settings')}
      >
        <FontAwesome5 name="user-circle" size={32} color={theme.colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const menuItems: Array<MenuCardProps> = [
    {
      icon: 'dumbbell',
      title: t.workouts,
      description: t.workoutsDesc,
      route: './workouts',
      gradient: ['#7CB9E8', '#72A0C1'],
    },
    {
      icon: 'chart-line',
      title: t.progress,
      description: t.progressDesc,
      route: './progress',
      gradient: ['#98FB98', '#90EE90'],
    },
    {
      icon: 'apple-alt',
      title: t.nutrition,
      description: t.nutritionDesc,
      route: './nutrition',
      gradient: ['#FFB6C1', '#FFA07A'],
    },
    {
      icon: 'users',
      title: t.community,
      description: t.communityDesc,
      route: './community',
      gradient: ['#DDA0DD', '#D8BFD8'],
    },
    {
      icon: 'cog',
      title: t.settings,
      description: t.settingsDesc,
      route: './settings',
      gradient: ['#B0C4DE', '#A9B2C3'],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.background]}
        style={styles.background}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Header />
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <MenuCard key={index} {...item} delay={index * 100} />
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
  },
  profileButton: {
    padding: 8,
  },
  menuContainer: {
    gap: 16,
  },
  cardContainer: {
    height: 100,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  card: {
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    width: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
  },
  chevron: {
    opacity: 0.6,
  },
});
