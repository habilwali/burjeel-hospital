import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

interface Location {
  id: string;
  name: string;
  nameArabic: string;
  type: 'hospital' | 'education' | 'shopping' | 'food' | 'services' | 'fuel' | 'accommodation';
  icon: string;
  x: number; // Percentage position on map
  y: number; // Percentage position on map
}

const locations: Location[] = [
  {
    id: 'burjeel',
    name: 'Burjeel Hospital',
    nameArabic: 'برجيل hospital',
    type: 'hospital',
    icon: '🏥',
    x: 50,
    y: 45,
  },
  {
    id: 'hct',
    name: 'HCT - Abu Dhabi Women\'s College',
    nameArabic: 'كلية التقنية العليا للطالبات',
    type: 'education',
    icon: '🎓',
    x: 25,
    y: 35,
  },
  {
    id: 'parco',
    name: 'Parco Supermarket',
    nameArabic: 'Parco Supermarket',
    type: 'shopping',
    icon: '🛒',
    x: 15,
    y: 20,
  },
  {
    id: 'telal',
    name: 'AL TELAL GENTS FASHION LLC',
    nameArabic: 'التلال للازياء',
    type: 'shopping',
    icon: '🛍️',
    x: 50,
    y: 25,
  },
  {
    id: 'sliced',
    name: 'Sliced Pizza',
    nameArabic: 'سليسد بيتزا',
    type: 'food',
    icon: '🍕',
    x: 50,
    y: 20,
  },
  {
    id: 'bosnian',
    name: 'Bosnian Hut',
    nameArabic: 'مطعم الكوخ ال',
    type: 'food',
    icon: '🍽️',
    x: 65,
    y: 45,
  },
  {
    id: 'tasha',
    name: 'Tasha Restaurant',
    nameArabic: 'مطعم طشه',
    type: 'food',
    icon: '🍽️',
    x: 25,
    y: 50,
  },
  {
    id: 'post',
    name: 'Emirates Post - AlFalah Post Office',
    nameArabic: 'Emirates Post - Al Falah Post Office',
    type: 'services',
    icon: '📮',
    x: 40,
    y: 20,
  },
  {
    id: 'adnoc',
    name: 'ADNOC Station',
    nameArabic: 'ADNOC Station',
    type: 'fuel',
    icon: '⛽',
    x: 15,
    y: 15,
  },
  {
    id: 'villaggio',
    name: 'Villaggio Hotel & Resort',
    nameArabic: 'Villaggio Hotel & Resort',
    type: 'accommodation',
    icon: '🏨',
    x: 75,
    y: 70,
  },
  {
    id: 'arabisk',
    name: 'Arabisk Vape',
    nameArabic: 'ارابيسك فيب',
    type: 'shopping',
    icon: '🛍️',
    x: 25,
    y: 60,
  },
  {
    id: 'prince',
    name: 'Prince Mobile Phones',
    nameArabic: 'Prince Mobile Shop',
    type: 'shopping',
    icon: '📱',
    x: 15,
    y: 70,
  },
  {
    id: 'adib',
    name: 'ADIB ATM',
    nameArabic: 'ADIB ATM',
    type: 'services',
    icon: '🏧',
    x: 40,
    y: 70,
  },
];

export default function MapScreen() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [zoomLevel, setZoomLevel] = useState(15);
  const webViewRef = React.useRef<any>(null);

  const handleGoBack = () => {
    router.back();
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 1, 20);
    setZoomLevel(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 1, 10);
    setZoomLevel(newZoom);
  };

  const handleLocationPress = (location: Location) => {
    setSelectedLocation(location);
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case 'hospital': return '#FF6B6B';
      case 'education': return '#4ECDC4';
      case 'shopping': return '#45B7D1';
      case 'food': return '#96CEB4';
      case 'services': return '#FFEAA7';
      case 'fuel': return '#DDA0DD';
      case 'accommodation': return '#98D8C8';
      default: return '#95A5A6';
    }
  };

  const renderMap = () => {
    // Simple Google Maps search embed - will show pin for Burjeel Hospital Al Quoz
    const mapHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
              width: 100%;
            }
            #map {
              height: 100%;
              width: 100%;
            }
          </style>
        </head>
        <body>
          <iframe
            id="map"
            src="https://maps.google.com/maps?q=Burjeel+Hospital+Al+Quoz+Dubai&t=&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed"
            frameborder="0"
            style="border:0; width: 100%; height: 100%;"
            allowfullscreen=""
            loading="lazy">
          </iframe>
        </body>
      </html>
    `;
    
    return (
      <WebView
        ref={webViewRef}
        source={{ html: mapHtml }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        originWhitelist={['*']}
      />
    );
  };

  const renderLocationDetails = () => {
    if (!selectedLocation) return null;

    return (
      <View style={styles.locationDetails}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsIcon}>{selectedLocation.icon}</Text>
          <View style={styles.detailsText}>
            <Text style={styles.detailsTitle}>{selectedLocation.name}</Text>
            <Text style={styles.detailsArabic}>{selectedLocation.nameArabic}</Text>
          </View>
        </View>
        <Text style={styles.detailsType}>
          {selectedLocation.type.charAt(0).toUpperCase() + selectedLocation.type.slice(1)}
        </Text>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.closeButton}
          onPress={() => setSelectedLocation(null)}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLocationList = () => (
    <View style={styles.locationList}>
      <Text style={styles.listTitle}>Nearby Locations</Text>
      {locations.map((location) => (
        <TouchableOpacity
          activeOpacity={0.6}
          key={location.id}
          style={[styles.locationItem, { borderLeftColor: getLocationColor(location.type) }]}
          onPress={() => handleLocationPress(location)}
        >
          <Text style={styles.locationIcon}>{location.icon}</Text>
          <View style={styles.locationInfo}>
            <Text style={styles.locationName}>{location.name}</Text>
            <Text style={styles.locationType}>{location.type}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

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
            <Text style={styles.logoText}>vps healthcare</Text>
            <Text style={styles.hospitalText}>برجيل burjeel hospital</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerInfo}>Interactive Map</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.mapPanel}>
            {renderMap()}
          </View>
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity activeOpacity={0.6} style={styles.controlItem} onPress={handleGoBack}>
            <View style={styles.controlButton} />
            <Text style={styles.controlLabel}>BACK</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.controlItem} onPress={handleZoomIn}>
            <View style={styles.controlButton} />
            <Text style={styles.controlLabel}>ZOOM IN</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.controlItem} onPress={handleZoomOut}>
            <View style={styles.controlButton} />
            <Text style={styles.controlLabel}>ZOOM OUT</Text>
          </TouchableOpacity>
          <View style={styles.controlItem}>
            <View style={styles.controlButton} />
            <Text style={styles.controlLabel}>ZOOM: {zoomLevel}</Text>
          </View>
          <View style={styles.controlItem}>
            <View style={styles.controlButton} />
            <Text style={styles.controlLabel}>MENU BAR</Text>
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
  logoText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 15,
  },
  hospitalText: {
    color: '#8B1538',
    fontSize: 16,
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
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  mapPanel: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  map: {
    flex: 1,
    borderRadius: 12,
  },
  mapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
  },
  fallbackText: {
    fontSize: 24,
    color: '#8B1538',
    fontWeight: 'bold',
  },
  locationList: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 400,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B1538',
    marginBottom: 10,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderLeftWidth: 4,
    marginBottom: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 6,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  locationType: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  markerIcon: {
    fontSize: 20,
  },
  locationDetails: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailsIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  detailsText: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsArabic: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  detailsType: {
    fontSize: 12,
    color: '#8B1538',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
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
