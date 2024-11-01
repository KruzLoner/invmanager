import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingOverlay from '../../src/components/LoadingOverlay';

interface AnalyticsData {
  overview: {
    totalValue: number;
    itemsSold: number;
  };
  topPerforming: Array<{
    _id: string;
    name: string;
    quantity: number;
    status: string;
  }>;
  health: {
    lowStock: number;
    outOfStock: number;
    inStock: number;
  };
}

export default function AnalyticsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      const authData = await AsyncStorage.getItem('auth_data');
      if (!authData) throw new Error('Not authenticated');

      const { token } = JSON.parse(authData);
      const API_URL = Platform.OS === 'ios' 
        ? 'http://localhost:5001/api'
        : 'http://10.0.2.2:5001/api';

      const response = await fetch(`${API_URL}/inventory/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data.data);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (isLoading || !analytics) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="calendar-outline" size={20} color="#9E86FF" />
          </TouchableOpacity>
        </View>

        {/* Overview Cards */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.overviewContainer}
        >
          <View style={styles.overviewCard}>
            <View style={styles.overviewIconContainer}>
              <Ionicons name="cube" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.overviewLabel}>Total Items</Text>
            <Text style={styles.overviewValue}>{analytics.overview.totalValue}</Text>
          </View>

          <View style={styles.overviewCard}>
            <View style={[styles.overviewIconContainer, { backgroundColor: 'rgba(255, 138, 101, 0.1)' }]}>
              <Ionicons name="trending-up" size={20} color="#FF8A65" />
            </View>
            <Text style={styles.overviewLabel}>Items Sold</Text>
            <Text style={styles.overviewValue}>{analytics.overview.itemsSold}</Text>
          </View>
        </ScrollView>

        {/* Performance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Performing Items</Text>
          </View>

          {/* Performance Cards */}
          {analytics.topPerforming.map((item, index) => (
            <View key={item._id} style={styles.performanceCard}>
              <View style={styles.performanceInfo}>
                <Text style={styles.performanceRank}>#{index + 1}</Text>
                <Text style={styles.performanceName}>{item.name}</Text>
              </View>
              <View style={styles.performanceStats}>
                <Text style={styles.performanceValue}>
                  {item.quantity} units
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Inventory Health */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventory Health</Text>
          <View style={styles.healthGrid}>
            <View style={styles.healthCard}>
              <View style={[styles.healthIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.healthValue}>{analytics.health.inStock}</Text>
              <Text style={styles.healthLabel}>In Stock</Text>
            </View>
            <View style={styles.healthCard}>
              <View style={[styles.healthIconContainer, { backgroundColor: 'rgba(255, 138, 101, 0.1)' }]}>
                <Ionicons name="alert-circle" size={24} color="#FF8A65" />
              </View>
              <Text style={styles.healthValue}>{analytics.health.lowStock}</Text>
              <Text style={styles.healthLabel}>Low Stock</Text>
            </View>
            <View style={styles.healthCard}>
              <View style={[styles.healthIconContainer, { backgroundColor: 'rgba(244, 67, 54, 0.1)' }]}>
                <Ionicons name="close-circle" size={24} color="#F44336" />
              </View>
              <Text style={styles.healthValue}>{analytics.health.outOfStock}</Text>
              <Text style={styles.healthLabel}>Out of Stock</Text>
            </View>
          </View>
        </View>
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
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(158, 134, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  overviewCard: {
    backgroundColor: '#2C2B3E',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 160,
  },
  overviewIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  overviewLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
  performanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2C2B3E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  performanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  performanceRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9E86FF',
    marginRight: 12,
  },
  performanceName: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  performanceStats: {
    alignItems: 'flex-end',
  },
  performanceValue: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  healthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  healthCard: {
    width: '48%',
    backgroundColor: '#2C2B3E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  healthIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  healthValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  healthLabel: {
    fontSize: 14,
    color: '#666',
  },
}); 