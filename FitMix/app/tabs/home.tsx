import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type AppRoute = './workouts' | './progress' | './nutrition' | './community' | './settings';

interface MenuCardProps {
  icon: string;
  title: string;
  description: string;
  route: AppRoute;
  gradient: readonly [string, string];
}

const MenuCard: React.FC<MenuCardProps> = ({ icon, title, description, route, gradient }) => {
  const router = useRouter();
  
  return (
    <TouchableOpacity 
      onPress={() => router.push(route)}
      style={styles.cardContainer}
    >
      <LinearGradient
        colors={gradient}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardInner}>
          <FontAwesome5 name={icon} size={24} color="#000" style={styles.cardIcon} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={20} color="#000" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const router = useRouter();

  const menuItems: Array<MenuCardProps> = [
    {
      icon: 'dumbbell',
      title: 'Workouts',
      description: 'Customized workouts based on your goals',
      route: './workouts',
      gradient: ['#4ADE80', '#22C55E'],
    },
    {
      icon: 'chart-line',
      title: 'Progress',
      description: 'Track your fitness journey',
      route: './progress',
      gradient: ['#34D399', '#059669'],
    },
    {
      icon: 'apple-alt',
      title: 'Nutrition',
      description: 'Meal plans and nutrition tracking',
      route: './nutrition',
      gradient: ['#6EE7B7', '#047857'],
    },
    {
      icon: 'users',
      title: 'Community',
      description: 'Connect with fitness enthusiasts',
      route: './community',
      gradient: ['#A7F3D0', '#065F46'],
    },
    {
      icon: 'cog',
      title: 'Settings',
      description: 'Customize your experience',
      route: './settings',
      gradient: ['#D1FAE5', '#064E3B'],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1E1E1E', '#252525']}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <MenuCard key={index} {...item} />
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
    paddingTop: 10,
  },
  menuContainer: {
    gap: 20,
  },
  cardContainer: {
    borderRadius: 20,
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
  card: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    gap: 15,
  },
  cardIcon: {
    width: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#4A4A4A',
  },
});
