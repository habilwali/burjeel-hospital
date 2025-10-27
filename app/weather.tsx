import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface City {
  name: string;
  time: string;
  weather: string;
  temperature: string;
  icon: string;
}

interface Region {
  name: string;
  cities: City[];
}

const weatherData: Region[] = [
  {
    name: 'North Asia',
    cities: [
      { name: 'BEIJING', time: '16 Feb I 17:52', weather: 'Cloudy', temperature: '-4°C to 8°C', icon: '☁️' },
      { name: 'SHANGHAI', time: '16 Feb I 17:52', weather: 'Sunny', temperature: '10°C to 18°C', icon: '☀️' },
      { name: 'TOKYO', time: '16 Feb I 18:52', weather: 'Sunny', temperature: '5°C to 13°C', icon: '☀️' },
      { name: 'SEOUL', time: '16 Feb I 18:52', weather: 'Rainy', temperature: '-1°C to 2°C', icon: '🌧️' },
      { name: 'HONG KONG', time: '16 Feb I 17:52', weather: 'Sunny', temperature: '13°C to 21°C', icon: '☀️' },
    ],
  },
  {
    name: 'South Asia',
    cities: [
      { name: 'DUBAI', time: '16 Feb I 15:52', weather: 'Sunny', temperature: '18°C to 28°C', icon: '☀️' },
      { name: 'ABU DHABI', time: '16 Feb I 15:52', weather: 'Sunny', temperature: '17°C to 27°C', icon: '☀️' },
      { name: 'DELHI', time: '16 Feb I 17:22', weather: 'Cloudy', temperature: '12°C to 24°C', icon: '☁️' },
      { name: 'MUMBAI', time: '16 Feb I 17:22', weather: 'Sunny', temperature: '22°C to 31°C', icon: '☀️' },
      { name: 'BANGKOK', time: '16 Feb I 18:52', weather: 'Rainy', temperature: '24°C to 32°C', icon: '🌧️' },
    ],
  },
  {
    name: 'Middle East',
    cities: [
      { name: 'RIYADH', time: '16 Feb I 14:52', weather: 'Sunny', temperature: '15°C to 26°C', icon: '☀️' },
      { name: 'DOHA', time: '16 Feb I 14:52', weather: 'Sunny', temperature: '16°C to 25°C', icon: '☀️' },
      { name: 'MUSCAT', time: '16 Feb I 15:52', weather: 'Sunny', temperature: '19°C to 27°C', icon: '☀️' },
      { name: 'KUWAIT', time: '16 Feb I 14:52', weather: 'Cloudy', temperature: '11°C to 21°C', icon: '☁️' },
      { name: 'BAHRAIN', time: '16 Feb I 14:52', weather: 'Sunny', temperature: '17°C to 24°C', icon: '☀️' },
    ],
  },
];

export default function WeatherScreen() {
  const [currentTime] = useState(new Date());
  const [selectedRegionIndex, setSelectedRegionIndex] = useState(1); // Default to South Asia

  const handleGoBack = () => {
    router.back();
  };

  const handlePreviousRegion = () => {
    if (selectedRegionIndex > 0) {
      setSelectedRegionIndex(selectedRegionIndex - 1);
    }
  };

  const handleNextRegion = () => {
    if (selectedRegionIndex < weatherData.length - 1) {
      setSelectedRegionIndex(selectedRegionIndex + 1);
    }
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
        source={{ uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' }}
        style={styles.container}
        resizeMode="cover"
      >
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <Text style={styles.roomText}>Room 215</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerInfo}>
              {formatDate(currentTime)} | {formatTime(currentTime)} | ☁️ 19°C
            </Text>
          </View>
        </View>

        {/* Region Timeline */}
        <View style={styles.regionContainer}>
          <TouchableOpacity 
            style={styles.arrowButton}
            onPress={handlePreviousRegion}
            disabled={selectedRegionIndex === 0}
          >
            <Text style={[styles.arrowText, selectedRegionIndex === 0 && styles.arrowDisabled]}>‹</Text>
          </TouchableOpacity>

          {weatherData.map((region, index) => (
            <TouchableOpacity
              key={region.name}
              style={[
                styles.regionItem,
                selectedRegionIndex === index && styles.regionItemActive
              ]}
              onPress={() => setSelectedRegionIndex(index)}
            >
              <Text style={[
                styles.regionText,
                selectedRegionIndex === index && styles.regionTextActive
              ]}>
                {region.name}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity 
            style={styles.arrowButton}
            onPress={handleNextRegion}
            disabled={selectedRegionIndex === weatherData.length - 1}
          >
            <Text style={[styles.arrowText, selectedRegionIndex === weatherData.length - 1 && styles.arrowDisabled]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Weather Table */}
        <View style={styles.mainContent}>
          <View style={styles.weatherTable}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.cityColumn]}>CITIES</Text>
              <Text style={[styles.headerCell, styles.timeColumn]}>TIME</Text>
              <Text style={[styles.headerCell, styles.weatherColumn]}>WEATHER</Text>
            </View>

            {/* Table Rows */}
            <ScrollView style={styles.tableBody} showsVerticalScrollIndicator={false}>
              {weatherData[selectedRegionIndex].cities.map((city, index) => (
                <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
                  <Text style={[styles.tableCell, styles.cityColumn]}>{city.name}</Text>
                  <Text style={[styles.tableCell, styles.timeColumn]}>{city.time}</Text>
                  <View style={[styles.weatherCell, styles.weatherColumn]}>
                    <Text style={styles.weatherIcon}>{city.icon}</Text>
                    <Text style={styles.weatherTemp}>{city.temperature}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.controlItem} onPress={handleGoBack}>
            <View style={styles.controlButton} />
            <Text style={styles.controlLabel}>MENU BAR</Text>
          </TouchableOpacity>
          <View style={styles.controlItem}>
            <View style={styles.controlButton} />
            <Text style={styles.controlLabel}>SELECT CATEGORY</Text>
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
  regionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    gap: 10,
  },
  arrowButton: {
    padding: 10,
  },
  arrowText: {
    fontSize: 32,
    color: '#333',
    fontWeight: 'bold',
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  regionItem: {
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    minWidth: 180,
    alignItems: 'center',
  },
  regionItemActive: {
    backgroundColor: '#8B1538',
  },
  regionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  regionTextActive: {
    color: '#fff',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  weatherTable: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    gap: 15,
  },
  weatherIcon: {
    fontSize: 24,
  },
  weatherTemp: {
    fontSize: 15,
    color: '#333',
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
    gap: 10,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#90A4AE',
    borderWidth: 2,
    borderColor: '#666',
  },
  controlLabel: {
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
  },
});

