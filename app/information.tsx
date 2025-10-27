import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import DynamicHeader from '../components/DynamicHeader';

const { width, height } = Dimensions.get('window');

export default function InformationScreen() {
  const router = useRouter();
  const [currentTime] = useState(new Date());

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

  const handleSubCategorySelect = (category: string) => {
    if (category === 'Service') {
      router.push('/services' as any);
    } else {
      console.log(`Selected sub-category: ${category}`);
      // You can add navigation to other sub-category pages here
    }
  };

  const handleGoBack = () => {
    router.back();
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
        <DynamicHeader currentTime={currentTime} />

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Information Panel */}
          <View style={styles.informationPanel}>
            <Text style={styles.panelTitle}>INFORMATION</Text>
            
            {/* Sub-category Buttons */}
            <View style={styles.subCategoryGrid}>
              <TouchableOpacity 
                activeOpacity={0.6}
                style={styles.subCategoryButton}
                onPress={() => handleSubCategorySelect('Service')}
              >
                <Text style={styles.subCategoryText}>Service</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                activeOpacity={0.6}
                style={styles.subCategoryButton}
                onPress={() => handleSubCategorySelect('Doctor')}
              >
                <Text style={styles.subCategoryText}>Doctor</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                activeOpacity={0.6}
                style={styles.subCategoryButton}
                onPress={() => handleSubCategorySelect('Department')}
              >
                <Text style={styles.subCategoryText}>Department</Text>
              </TouchableOpacity>
            </View>

            {/* Additional Information Area */}
            <View style={styles.infoArea}>
              <Text style={styles.infoText}>
                Select a category above to view detailed information about our services, 
                doctors, and departments.
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Control Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.controlItem}>
            <View style={styles.controlButton} />
            <Text style={styles.controlLabel}>LANGUAGE</Text>
          </View>
          <TouchableOpacity activeOpacity={0.6} style={styles.controlItem} onPress={handleGoBack}>
            <View style={styles.controlButton} />
            <Text style={styles.controlLabel}>BACK</Text>
          </TouchableOpacity>
          <View style={styles.controlItem}>
            <View style={styles.controlButton} />
            <Text style={styles.controlLabel}>SCROLL LEFT/RIGHT</Text>
          </View>
          <View style={styles.controlItem}>
            <View style={styles.controlButton} />
            <Text style={styles.controlLabel}>SCROLL UP/DOWN</Text>
          </View>
          <View style={styles.controlItem}>
            <View style={styles.controlButton} />
            <Text style={styles.controlLabel}>OK   SELECT</Text>
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
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 40,
  },
  informationPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    width: '60%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  panelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B1538',
    textAlign: 'center',
    marginBottom: 30,
  },
  subCategoryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  subCategoryButton: {
    width: 120,
    height: 120,
    backgroundColor: '#8B1538',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  subCategoryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoArea: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#8B1538',
  },
  infoText: {
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
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
