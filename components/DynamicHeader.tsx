import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface DynamicHeaderProps {
  currentTime: Date;
  /** Room number from welcome_api (e.g. "1001"). Shown as "Room {roomNumber}" or "Room —" when not loaded. */
  roomNumber?: string | null;
}

export default function DynamicHeader({ currentTime, roomNumber }: DynamicHeaderProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
    <View style={styles.headerBar}>
      <Image 
        source={{ uri: 'https://burjeel.com/wp-content/uploads/2024/12/Burjeel.png' }}
        style={styles.burjeelHeaderLogo}
        resizeMode="contain"
      />

      <View style={styles.infoSection}>
        <Text style={styles.infoText}>Room {roomNumber ?? '—'}</Text>
        <Text style={styles.separator}>|</Text>
        <Text style={styles.infoText}>{formatDate(currentTime)}</Text>
        <Text style={styles.separator}>|</Text>
        <Text style={styles.infoText}>{formatTime(currentTime)}</Text>
        <Text style={styles.separator}>|</Text>
        <Text style={styles.weatherIcon}>☁️</Text>
        <Text style={styles.infoText}>19°C</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 8, 
    backgroundColor: 'transparent', 
    borderBottomWidth: 0 
  },
  burjeelHeaderLogo: { 
    width: 150, 
    height: 50 
  },
  infoSection: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 15 
  },
  infoText: { 
    fontSize: 14, 
    color: '#000000', 
    fontWeight: '500' 
  },
  separator: { 
    fontSize: 14, 
    color: '#000000' 
  },
  weatherIcon: { 
    fontSize: 16 
  },
});

