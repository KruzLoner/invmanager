import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingOverlay from '../../src/components/LoadingOverlay';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';

interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
}

interface ActivityItem {
  _id: string;
  type: 'in' | 'out';
  itemName: string;
  quantity: number;
  createdAt: string;
}

// Add this function before the HomeScreen component
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

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<InventoryStats>({ totalItems: 0, lowStockItems: 0 });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      const authData = await AsyncStorage.getItem('auth_data');
      if (!authData) throw new Error('Not authenticated');

      const { token } = JSON.parse(authData);
      const API_URL = Platform.OS === 'ios' 
        ? 'http://localhost:5001/api'
        : 'http://10.0.2.2:5001/api';

      // Fetch inventory stats
      const statsResponse = await fetch(`${API_URL}/inventory/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!statsResponse.ok) {
        throw new Error('Failed to fetch inventory stats');
      }

      const statsData = await statsResponse.json();
      setStats(statsData.data);

      // Fetch recent activity
      const activityResponse = await fetch(`${API_URL}/inventory/activity`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!activityResponse.ok) {
        throw new Error('Failed to fetch recent activity');
      }

      const activityData = await activityResponse.json();
      setRecentActivity(activityData.data);

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Use useFocusEffect instead of useEffect + isFocused
  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [fetchDashboardData])
  );

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle manual refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle quick action buttons
  const handleQuickAction = async (action: string) => {
    switch (action) {
      case 'Add Item':
        router.push({
          pathname: '/inventory',
          params: { openAddModal: 'true' }
        });
        break;
      // ... handle other actions
    }
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#9E86FF"
          />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{user?.firstName || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#9E86FF" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="cube" size={20} color="#9E86FF" />
            </View>
            <Text style={styles.statNumber}>{stats.totalItems}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255, 138, 101, 0.1)' }]}>
              <Ionicons name="alert-circle" size={20} color="#FF8A65" />
            </View>
            <Text style={styles.statNumber}>{stats.lowStockItems}</Text>
            <Text style={styles.statLabel}>Low Stock</Text>
          </View>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/activity')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentActivity.map((activity, index) => (
            <View key={activity._id} style={styles.activityCard}>
              <View style={[
                styles.activityIconContainer,
                { backgroundColor: activity.type === 'in' ? 
                  'rgba(76, 175, 80, 0.1)' : 'rgba(255, 138, 101, 0.1)' }
              ]}>
                <Ionicons 
                  name={activity.type === 'in' ? "arrow-down" : "arrow-up"} 
                  size={16} 
                  color={activity.type === 'in' ? "#4CAF50" : "#FF8A65"} 
                />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>
                  {activity.type === 'in' ? 'Stock Received' : 'Stock Shipped'}
                </Text>
                <Text style={styles.activitySubtitle}>
                  {activity.itemName} {activity.type === 'in' ? '+' : '-'}{activity.quantity}
                </Text>
              </View>
              <Text style={styles.activityTime}>{formatTimeAgo(activity.createdAt)}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {['Add Item', 'Scan', 'Export', 'Reports'].map((action, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.actionButton}
                onPress={() => handleQuickAction(action)}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons 
                    name={
                      index === 0 ? "add-circle" : 
                      index === 1 ? "scan" :
                      index === 2 ? "download" : "document-text"
                    } 
                    size={24} 
                    color="#9E86FF" 
                  />
                </View>
                <Text style={styles.actionText}>{action}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(158, 134, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2C2B3E',
    borderRadius: 16,
    padding: 16,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(158, 134, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 14,
    color: '#9E86FF',
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
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
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
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#2C2B3E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(158, 134, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#FF8A65',
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
}); 