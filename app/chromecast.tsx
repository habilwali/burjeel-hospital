import React, { useState } from 'react';
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
import QRCode from 'react-qr-code';
import DynamicHeader from '../components/DynamicHeader';

const { width, height } = Dimensions.get('window');

export default function ChromecastScreen() {
  const chromecastUrl = 'http://xxxxxxxxx.xxx/xxx'; // Replace with actual URL

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
        {/* Header */}
        <DynamicHeader currentTime={new Date()} />

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.contentCard}>
            {/* Instructions Section */}
            <View style={styles.instructionsSection}>
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>STEP 1</Text>
                <Text style={styles.stepText}>
                  Connect your device to the Wi-Fi "Burjeel Hospital".
                </Text>
              </View>

              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>STEP 2</Text>
                <Text style={styles.stepText}>
                  Scan the QR code with your device.
                </Text>
              </View>

              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>STEP 3</Text>
                <Text style={styles.stepText}>
                  Open your apps (i.e. Youtube).
                </Text>
              </View>

              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>STEP 4</Text>
                <View style={styles.step4Content}>
                  <Text style={styles.stepText}>
                    Press the "Chromecast icon" 
                  </Text>
                  <Text style={styles.castIcon}>📡</Text>
                  <Text style={styles.stepText}>
                    {' '}connect to "Burjeel Hospital".
                  </Text>
                </View>
              </View>

              <View style={styles.disclaimerContainer}>
                <Text style={styles.disclaimerText}>
                  *Some cast-enabled apps and paid content may be restricted by Google to your home country and thus may not be accessible through our casting service. We apologise for any inconvenience caused.
                </Text>
              </View>
            </View>

            {/* QR Code Section */}
            <View style={styles.qrSection}>
              <Text style={styles.scanTitle}>Scan Here</Text>
              <View style={styles.qrContainer}>
                <QRCode
                  value={chromecastUrl}
                  size={200}
                  level="H"
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </View>
              <Text style={styles.urlText}>{chromecastUrl}</Text>
            </View>
          </View>
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity activeOpacity={0.6} style={styles.controlItem} onPress={handleGoBack}>
            <View style={styles.controlButton} />
            <Text style={styles.controlLabel}>MENU BAR</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#666',
  },
  header: {
    backgroundColor: '#8B1538',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  contentCard: {
    backgroundColor: '#fff',
    borderRadius: 0,
    width: '90%',
    maxWidth: 1000,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  instructionsSection: {
    flex: 2,
    padding: 40,
    justifyContent: 'center',
  },
  stepContainer: {
    marginBottom: 25,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  stepText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  step4Content: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  castIcon: {
    fontSize: 18,
    marginHorizontal: 5,
  },
  disclaimerContainer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  disclaimerText: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  qrSection: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
  },
  scanTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  urlText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
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

