import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingOverlay from '../../src/components/LoadingOverlay';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

// ... rest of the code remains the same 