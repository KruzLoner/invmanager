import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function AnalyticsScreen() {
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
              <Ionicons name="trending-up" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.overviewLabel}>Total Sales</Text>
            <Text style={styles.overviewValue}>$12,450</Text>
            <Text style={styles.overviewTrend}>+12.5%</Text>
          </View>

          <View style={styles.overviewCard}>
            <View style={[styles.overviewIconContainer, { backgroundColor: 'rgba(255, 138, 101, 0.1)' }]}>
              <Ionicons name="cube" size={20} color="#FF8A65" />
            </View>
            <Text style={styles.overviewLabel}>Items Sold</Text>
            <Text style={styles.overviewValue}>1,245</Text>
            <Text style={[styles.overviewTrend, { color: '#FF8A65' }]}>-3.2%</Text>
          </View>

          <View style={styles.overviewCard}>
            <View style={[styles.overviewIconContainer, { backgroundColor: 'rgba(158, 134, 255, 0.1)' }]}>
              <Ionicons name="people" size={20} color="#9E86FF" />
            </View>
            <Text style={styles.overviewLabel}>Customers</Text>
            <Text style={styles.overviewValue}>324</Text>
            <Text style={styles.overviewTrend}>+8.1%</Text>
          </View>
        </ScrollView>

        {/* Performance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Performing Items</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Performance Cards */}
          {['MacBook Charger', 'USB-C Cable', 'Wireless Mouse'].map((item, index) => (
            <View key={index} style={styles.performanceCard}>
              <View style={styles.performanceInfo}>
                <Text style={styles.performanceRank}>#{index + 1}</Text>
                <Text style={styles.performanceName}>{item}</Text>
              </View>
              <View style={styles.performanceStats}>
                <Text style={styles.performanceValue}>
                  {120 - (index * 35)} units
                </Text>
                <View style={[styles.trendBadge, index === 1 && styles.trendBadgeDown]}>
                  <Ionicons 
                    name={index === 1 ? "arrow-down" : "arrow-up"} 
                    size={12} 
                    color={index === 1 ? "#FF8A65" : "#4CAF50"} 
                  />
                  <Text style={[
                    styles.trendText,
                    index === 1 && styles.trendTextDown
                  ]}>
                    {index === 1 ? "2.3%" : "5.2%"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Inventory Health */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventory Health</Text>
          <View style={styles.healthGrid}>
            {[
              { title: 'Low Stock', value: '23', icon: 'alert-circle', color: '#FF8A65' },
              { title: 'To Expire', value: '12', icon: 'time', color: '#FFB74D' },
              { title: 'In Transit', value: '45', icon: 'car', color: '#4CAF50' },
              { title: 'Returns', value: '8', icon: 'return-up-back', color: '#9E86FF' },
            ].map((item, index) => (
              <View key={index} style={styles.healthCard}>
                <View style={[styles.healthIconContainer, { backgroundColor: `${item.color}20` }]}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={styles.healthValue}>{item.value}</Text>
                <Text style={styles.healthLabel}>{item.title}</Text>
              </View>
            ))}
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
  overviewTrend: {
    fontSize: 14,
    color: '#4CAF50',
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
  seeAllText: {
    fontSize: 14,
    color: '#9E86FF',
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
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendBadgeDown: {
    backgroundColor: 'rgba(255, 138, 101, 0.1)',
  },
  trendText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  trendTextDown: {
    color: '#FF8A65',
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