import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import DynamicHeader from '../components/DynamicHeader';
import { getWelcomeData } from '../api/getWelcomeData';
import { getWeather } from '../api/getWeather';
import type { Region } from '../types/weather';
import { getMac, type GetMacResponse } from '@/api/getMac';

const { width, height } = Dimensions.get('window');

export default function WeatherScreen() {
  const [currentTime] = useState(new Date());
  const [selectedRegionIndex, setSelectedRegionIndex] = useState(1); // Default to South Asia
  const [welcomeData, setWelcomeData] = useState<Awaited<ReturnType<typeof getWelcomeData>> | null>(null);
  const [weatherData, setWeatherData] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState<GetMacResponse | null>(null);

  // Fetch device MAC once for this screen
  useEffect(() => {
    let cancelled = false;
    getMac()
      .then((info) => {
        if (!cancelled) {
          setDeviceInfo(info);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch welcome data using dynamic MAC
  useEffect(() => {
    if (!deviceInfo?.mac) return;

    let cancelled = false;
    getWelcomeData(deviceInfo.mac)
      .then((data) => {
        if (!cancelled) setWelcomeData(data);
      })
      .catch(() => {
        // Keep null on error; header shows "—"
      });
    return () => { cancelled = true; };
  }, [deviceInfo?.mac]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    
    getWeather()
      .then((response) => {
        if (!cancelled && response.success) {
          setWeatherData(response.regions);
        }
      })
      .catch(() => {
        // Keep empty array on error; will show loading state
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    
    return () => { cancelled = true; };
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

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
                const maxIndex = weatherData.length > 0 ? weatherData.length - 1 : 2;
                const prevIndex = selectedRegionIndex > 0 ? selectedRegionIndex - 1 : maxIndex;
                setSelectedRegionIndex(prevIndex);
              }}
            >
              <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
              {weatherData.length > 0 ? (
                weatherData.map((region, index) => (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    key={region.name}
                    style={[
                      styles.tab,
                      selectedRegionIndex === index ? styles.activeTab : styles.inactiveTab
                    ]}
                    onPress={() => setSelectedRegionIndex(index)}
                  >
                    <Text style={selectedRegionIndex === index ? styles.activeTabText : styles.inactiveTabText}>
                      {region.name}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                // Show default tabs while loading
                ['North Asia', 'South Asia', 'Middle East'].map((name, index) => (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    key={name}
                    style={[
                      styles.tab,
                      selectedRegionIndex === index ? styles.activeTab : styles.inactiveTab
                    ]}
                    onPress={() => setSelectedRegionIndex(index)}
                  >
                    <Text style={selectedRegionIndex === index ? styles.activeTabText : styles.inactiveTabText}>
                      {name}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>

            {/* Right Navigation Arrow */}
            <TouchableOpacity 
              style={styles.rightArrow}
              onPress={() => {
                const maxIndex = weatherData.length > 0 ? weatherData.length - 1 : 2;
                const nextIndex = selectedRegionIndex < maxIndex ? selectedRegionIndex + 1 : 0;
                setSelectedRegionIndex(nextIndex);
              }}
            >
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Dynamic Content Area */}
          <View style={styles.contentArea}>
            <View style={styles.weatherTable}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.cityColumn]}>CITIES</Text>
                <Text style={[styles.headerCell, styles.timeColumn]}>TIME</Text>
                <Text style={[styles.headerCell, styles.weatherColumn]}>WEATHER</Text>
              </View>

              {/* Table Rows */}
              <ScrollView style={styles.tableBody} showsVerticalScrollIndicator={false}>
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#8B1538" />
                    <Text style={styles.loadingText}>Loading weather data...</Text>
                  </View>
                ) : weatherData.length > 0 && weatherData[selectedRegionIndex]?.cities ? (
                  weatherData[selectedRegionIndex].cities.map((city, index) => (
                    <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
                      <Text style={[styles.tableCell, styles.cityColumn]}>{city.name}</Text>
                      <Text style={[styles.tableCell, styles.timeColumn]}>{city.time}</Text>
                      <View style={[styles.weatherCell, styles.weatherColumn]}>
                        <Text style={styles.weatherIcon}>{city.icon}</Text>
                        <Text style={styles.weatherTemp}>{city.temperature}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>No weather data available</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </View>

        {/* Bottom Control Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.controlItem}>
            <View style={styles.sphericalButton}>
              <Text style={styles.menuButtonText}>MENU</Text>
            </View>
            <Text style={styles.controlLabel}>MENU BAR</Text>
          </View>
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
          <TouchableOpacity activeOpacity={0.6} style={styles.controlItem} onPress={handleGoBack}>
            <View style={styles.sphericalButton}>
              <View style={styles.backIconContainer}>
                <Text style={styles.backButtonText}>←</Text>
              </View>
            </View>
            <Text style={styles.controlLabel}>BACK</Text>
          </TouchableOpacity>
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
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerInfo: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
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
  weatherTable: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  tableBody: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableRowEven: {
    backgroundColor: 'rgba(240, 240, 240, 0.3)',
  },
  tableCell: {
    fontSize: 15,
    color: '#333',
  },
  cityColumn: {
    flex: 2,
  },
  timeColumn: {
    flex: 2,
  },
  weatherColumn: {
    flex: 3,
  },
  weatherCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  weatherTemp: {
    fontSize: 15,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
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
  backIconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    includeFontPadding: false,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 10,
  },
  controlLabel: {
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
    marginLeft: 8,
  },
});

