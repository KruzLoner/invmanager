import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingOverlay from '../src/components/LoadingOverlay';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

interface ActivityItem {
  _id: string;
  type: 'in' | 'out';
  itemName: string;
  quantity: number;
  createdAt: string;
}

const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return 'just now';
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(seconds / 86400);
    return `${days}d ago`;
  }
};

export default function ActivityScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      const authData = await AsyncStorage.getItem('auth_data');
      if (!authData) throw new Error('Not authenticated');

      const { token } = JSON.parse(authData);
      const API_URL = Platform.OS === 'ios' 
        ? 'http://localhost:5001/api'
        : 'http://10.0.2.2:5001/api';

      const response = await fetch(`${API_URL}/inventory/activity/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data.data);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity History</Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={styles.activityCard}>
              <View style={[
                styles.activityIconContainer,
                { backgroundColor: item.type === 'in' ? 
                  'rgba(76, 175, 80, 0.1)' : 'rgba(255, 138, 101, 0.1)' }
              ]}>
                <Ionicons 
                  name={item.type === 'in' ? "arrow-down" : "arrow-up"} 
                  size={16} 
                  color={item.type === 'in' ? "#4CAF50" : "#FF8A65"} 
                />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>
                  {item.type === 'in' ? 'Stock Received' : 'Stock Shipped'}
                </Text>
                <Text style={styles.activitySubtitle}>
                  {item.itemName} {item.type === 'in' ? '+' : '-'}{item.quantity}
                </Text>
              </View>
              <Text style={styles.activityTime}>{formatTimeAgo(item.createdAt)}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(20,20,24)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(158, 134, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2B3E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
  },
  errorText: {
    color: '#F44336',
    textAlign: 'center',
  },
}); 