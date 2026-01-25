import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Dimensions, StatusBar, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import DynamicHeader from '../components/DynamicHeader';
import { getWelcomeData } from '../api/getWelcomeData';
import { getFlights } from '../api/getFlights';
import type { Flight } from '../types/flight';

const { width, height } = Dimensions.get('window');

export default function FlightScreen() {
  const router = useRouter();
  const [currentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'Arrival' | 'Departure'>('Arrival');
  const [welcomeData, setWelcomeData] = useState<Awaited<ReturnType<typeof getWelcomeData>> | null>(null);
  const [arrivalFlights, setArrivalFlights] = useState<Flight[]>([]);
  const [departureFlights, setDepartureFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getWelcomeData()
      .then((data) => {
        if (!cancelled) setWelcomeData(data);
      })
      .catch(() => {
        // Keep null on error; header shows "—"
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    
    console.log('[FlightScreen] Fetching flight data...');
    
    // Fetch both arrival and departure flights
    Promise.all([
      getFlights('OMDB', 'arrival'),
      getFlights('OMDB', 'departure'),
    ])
      .then(([arrivalData, departureData]) => {
        if (!cancelled) {
          console.log('[FlightScreen] Arrival flights received:', arrivalData.flights.length);
          console.log('[FlightScreen] Departure flights received:', departureData.flights.length);
          setArrivalFlights(arrivalData.flights);
          setDepartureFlights(departureData.flights);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('[FlightScreen] Error fetching flights:', error);
        if (!cancelled) {
          setLoading(false);
        }
      });
    
    return () => { cancelled = true; };
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const handleTabPress = (tabName: 'Arrival' | 'Departure') => {
    setActiveTab(tabName);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On-Time':
        return '#4CAF50';
      case 'Delayed':
        return '#FF9800';
      case 'Cancelled':
        return '#F44336';
      default:
        return '#333';
    }
  };

  const currentFlights = activeTab === 'Arrival' ? arrivalFlights : departureFlights;

  return (
    <>
      <StatusBar hidden={true} />
      <ImageBackground
        source={{ uri: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzY1Sf3GyQaP0mvmtxEKt4WM1JcmQid35iHy0TrWAhm7aTQy6ylNqQou2_W1GBHTPRWWh-EVwQAkK4ZvgJ9elmqjaZWqch6h_Llf9rXFCo2KI-tkiSHdgLNTkjQhnJBDJWL2DtauA=s1360-w1360-h1020-rw' }}
        style={styles.container}
        resizeMode="cover"
      >
        {/* Header Bar */}
        <DynamicHeader currentTime={currentTime} roomNumber={welcomeData?.room_number} />

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Tab Navigation with Arrows */}
          <View style={styles.tabRowContainer}>
            {/* Left Navigation Arrow */}
            <TouchableOpacity 
              style={styles.leftArrow}
              onPress={() => {
                const tabs = ['Arrival', 'Departure'];
                const currentIndex = tabs.indexOf(activeTab);
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                handleTabPress(tabs[prevIndex]);
              }}
            >
              <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                activeOpacity={0.6}
                style={[styles.tab, activeTab === 'Arrival' ? styles.activeTab : styles.inactiveTab]}
                onPress={() => handleTabPress('Arrival')}
              >
                <Text style={activeTab === 'Arrival' ? styles.activeTabText : styles.inactiveTabText}>
                  Arrival
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                activeOpacity={0.6}
                style={[styles.tab, activeTab === 'Departure' ? styles.activeTab : styles.inactiveTab]}
                onPress={() => handleTabPress('Departure')}
              >
                <Text style={activeTab === 'Departure' ? styles.activeTabText : styles.inactiveTabText}>
                  Departure
                </Text>
              </TouchableOpacity>
            </View>

            {/* Right Navigation Arrow */}
            <TouchableOpacity 
              style={styles.rightArrow}
              onPress={() => {
                const tabs = ['Arrival', 'Departure'];
                const currentIndex = tabs.indexOf(activeTab);
                const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                handleTabPress(tabs[nextIndex]);
              }}
            >
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Flight Table */}
          <View style={styles.contentArea}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, { flex: 1.2 }]}>Date</Text>
              <Text style={[styles.headerCell, { flex: 1 }]}>Flight #</Text>
              <Text style={[styles.headerCell, { flex: 2.5 }]}>From</Text>
              <Text style={[styles.headerCell, { flex: 1.5 }]}>Airline</Text>
              <Text style={[styles.headerCell, { flex: 0.8 }]}>Terminal</Text>
              <Text style={[styles.headerCell, { flex: 1 }]}>Status</Text>
            </View>

            {/* Table Rows */}
            <ScrollView style={styles.tableBody} showsVerticalScrollIndicator={false}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading flights...</Text>
                </View>
              ) : currentFlights.length === 0 ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>No flights available</Text>
                </View>
              ) : (
                currentFlights.map((flight) => (
                  <View key={flight.id} style={styles.tableRow}>
                    <Text style={[styles.cell, { flex: 1.2 }]}>{flight.date}</Text>
                    <Text style={[styles.cell, { flex: 1 }]}>{flight.flightNumber}</Text>
                    <Text style={[styles.cell, { flex: 2.5 }]} numberOfLines={2}>{flight.from}</Text>
                    <Text style={[styles.cell, { flex: 1.5 }]}>{flight.airline}</Text>
                    <Text style={[styles.cell, { flex: 0.8 }]}>{flight.terminal}</Text>
                    <Text style={[styles.cell, { flex: 1, color: getStatusColor(flight.status) }]}>{flight.status}</Text>
                  </View>
                ))
              )}
            </ScrollView>

            {/* Bottom Right Down Arrow */}
            <TouchableOpacity style={styles.bottomRightArrow}>
              <View style={{ transform: [{ rotate: '90deg' }] }}>
                <Text style={styles.arrowText}>›</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Control Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity activeOpacity={0.6} style={styles.controlItem} onPress={handleGoBack}>
            <View style={styles.sphericalButton}>
              <Text style={styles.menuButtonText}>MENU</Text>
            </View>
            <Text style={styles.controlLabel}>MENU BAR</Text>
          </TouchableOpacity>
          <View style={styles.controlItem}>
            <View style={styles.sphericalButton}>
              <View style={styles.dpadContainer}>
                <View style={styles.dpadRow}>
                  <View style={styles.dpadArrowPlaceholder} />
                  <Text style={styles.scrollDpadArrow}>▲</Text>
                  <View style={styles.dpadArrowPlaceholder} />
                </View>
                <View style={styles.dpadRow}>
                  <Text style={styles.dpadArrow}>◄</Text>
                  <View style={styles.dpadCenter}>
                    <Text style={styles.dpadOK}>OK</Text>
                  </View>
                  <Text style={styles.dpadArrow}>►</Text>
                </View>
                <View style={styles.dpadRow}>
                  <View style={styles.dpadArrowPlaceholder} />
                  <Text style={styles.scrollDpadArrow}>▼</Text>
                  <View style={styles.dpadArrowPlaceholder} />
                </View>
              </View>
            </View>
            <Text style={styles.controlLabel}>SELECT CATEGORY</Text>
          </View>
          <View style={styles.controlItem}>
            <View style={styles.sphericalButton}>
              <View style={styles.dpadContainer}>
                <View style={styles.dpadRow}>
                  <View style={styles.dpadArrowPlaceholder} />
                  <Text style={styles.dpadArrow}>▲</Text>
                  <View style={styles.dpadArrowPlaceholder} />
                </View>
                <View style={styles.dpadRow}>
                  <Text style={styles.scrollDpadArrow}>◄</Text>
                  <View style={styles.dpadCenter}>
                    <Text style={styles.dpadOK}>OK</Text>
                  </View>
                  <Text style={styles.scrollDpadArrow}>►</Text>
                </View>
                <View style={styles.dpadRow}>
                  <View style={styles.dpadArrowPlaceholder} />
                  <Text style={styles.dpadArrow}>▼</Text>
                  <View style={styles.dpadArrowPlaceholder} />
                </View>
              </View>
            </View>
            <Text style={styles.controlLabel}>SCROLL CONTENT</Text>
          </View>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  tabRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  leftArrow: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  rightArrow: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  bottomRightArrow: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    zIndex: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 40,
    color: '#000000',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  activeTab: {
    backgroundColor: '#8B1538',
  },
  inactiveTab: {
    backgroundColor: '#FFFFFF',
  },
  activeTabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inactiveTabText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    position: 'relative',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#8B1538',
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerCell: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  tableBody: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
    alignItems: 'center',
  },
  cell: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 5,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  controlItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  sphericalButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#B0B0B0',
  },
  menuButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  dpadContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dpadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 12,
  },
  dpadArrow: {
    fontSize: 9,
    color: '#000000',
    fontWeight: 'bold',
    width: 12,
    textAlign: 'center',
    lineHeight: 12,
  },
  scrollDpadArrow: {
    fontSize: 9,
    color: '#808080',
    fontWeight: 'bold',
    width: 12,
    textAlign: 'center',
    lineHeight: 12,
    opacity: 0.5,
  },
  dpadArrowPlaceholder: {
    width: 12,
  },
  dpadCenter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#808080',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  dpadOK: {
    fontSize: 5,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 12,
  },
  controlLabel: {
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});
