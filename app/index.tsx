import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Dimensions, ImageBackground, StatusBar, Image } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useRouter } from 'expo-router';
import DynamicHeader from '../components/DynamicHeader';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [showVideoModal, setShowVideoModal] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [focusedItemIndex, setFocusedItemIndex] = useState(0); // For remote navigation
  
  const player = useVideoPlayer('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', player => {
    player.loop = true;
    player.play();
  });

  // Memoize menuItems to prevent re-creation
  const menuItems = useMemo(() => [
    { id: 1, icon: '📺', label: 'TV', color: '#8B1538', route: '/tv' },
    { id: 2, icon: 'ℹ️', label: 'INFORMATION', color: '#8B1538', route: '/information' },
    { id: 3, icon: '📱', label: 'CHROMECAST', color: '#8B1538', route: '/chromecast' },
    { id: 4, icon: '✉️', label: 'MESSAGES', color: '#8B1538', route: '/messages' },
    { id: 5, icon: '📍', label: 'MAP', color: '#8B1538', route: '/map' },
    { id: 6, icon: '🌡️', label: 'WEATHER', color: '#8B1538', route: '/weather' },
  ], []);

  const handleMenuClick = useCallback((item: typeof menuItems[0]) => {
    if (item.route) {
      setShowVideoModal(false);
      setShowWelcome(false);
      router.push(item.route as any);
    }
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }, []);

  const handleSkipVideo = useCallback(() => {
    player.pause(); // Pause video when skipping
    setShowVideoModal(false);
    setShowWelcome(true);
  }, [player]);

  const handleSkipWelcome = useCallback(() => {
    setShowWelcome(false);
  }, []);

  // Control video playback based on modal state
  useEffect(() => {
    if (showVideoModal) {
      // Play video when modal is visible
      player.play();
    } else {
      // Pause video when modal is not visible
      player.pause();
    }
  }, [showVideoModal, player]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <StatusBar hidden={true} />
      <ImageBackground 
        source={{ uri: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzY1Sf3GyQaP0mvmtxEKt4WM1JcmQid35iHy0TrWAhm7aTQy6ylNqQou2_W1GBHTPRWWh-EVwQAkK4ZvgJ9elmqjaZWqch6h_Llf9rXFCo2KI-tkiSHdgLNTkjQhnJBDJWL2DtauA=s1360-w1360-h1020-rw' }}
        style={styles.container}
        resizeMode="cover"
      >
      <View style={styles.backgroundImage} />
      
      <DynamicHeader currentTime={currentTime} />

      <View style={styles.mainContent}>
        <View style={styles.menuContainer}>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              // don't need opacity here
              <TouchableOpacity
              // @ts-ignore
              activeOpacity={0.6} 
              // @ts-ignore
                key={item.id} 
                style={[
                  styles.menuItem, 
                  { backgroundColor: item.color }
                ]}
                onPress={() => handleMenuClick(item)}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.navigationArrow}>
            <Text style={styles.arrowText}>›</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.controlItem}>
          <View style={styles.controlButton} />
          <Text style={styles.controlLabel}>LANGUAGE</Text>
        </View>
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

      <Modal visible={showVideoModal} transparent={true} animationType="fade">
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' }}
          style={styles.modalOverlay}
          resizeMode="cover"
        >
          <View style={styles.videoModal}>
            <View style={styles.videoPlayer}>
              <VideoView player={player} style={styles.video} nativeControls={false} />
            </View>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkipVideo}>
              <Text style={styles.skipButtonText}>Press Any Button to Skip</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Modal>

      <Modal visible={showWelcome} transparent={true} animationType="fade">
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' }}
          style={styles.modalOverlay}
          resizeMode="cover"
        >
          <View style={styles.welcomeOverlay}>
            <Text style={styles.welcomeTitle}>Welcome to Burjeel Hospital</Text>
            <TouchableOpacity style={styles.okButton} onPress={handleSkipWelcome}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Modal>
    </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: width, height: height, backgroundColor: '#f0f0f0' },
  backgroundImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#e8f4f8', opacity: 0 },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 8, backgroundColor: 'transparent', borderBottomWidth: 0 },
  burjeelHeaderLogo: { width: 150, height: 50 },
  infoSection: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  infoText: { fontSize: 14, color: '#000000', fontWeight: '500' },
  separator: { fontSize: 14, color: '#000000' },
  weatherIcon: { fontSize: 16 },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 20, paddingTop: 20, paddingBottom: 20 },
  menuContainer: { flexDirection: 'row', alignItems: 'center' },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, maxWidth: width * 0.55 },
  menuItem: { width: 150, height: 150, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 10,  },
  menuItemFocused: { 
    borderWidth: 5,
    borderColor: '#FFD700'
  },
  menuIcon: { fontSize: 28, marginBottom: 8 },
  menuLabel: { color: 'white', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  navigationArrow: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center', marginLeft: 20 },
  arrowText: { fontSize: 60, color: '#333', fontWeight: 'bold' },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.9)', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  controlItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  controlButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#90A4AE', borderWidth: 2, borderColor: '#666' },
  controlLabel: { fontSize: 12, color: '#000', fontWeight: '600' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  videoModal: { width: width * 0.65, backgroundColor: 'white', borderRadius: 15, padding: 20, alignItems: 'center' },
  videoPlayer: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000', borderRadius: 10, overflow: 'hidden', marginBottom: 20 },
  video: { width: '100%', height: '100%' },
  skipButton: { backgroundColor: '#8B5CF6', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 },
  skipButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  welcomeOverlay: { width: width * 0.8, backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 15, padding: 40, alignItems: 'center', justifyContent: 'center' },
  welcomeTitle: { fontSize: 32, fontWeight: 'bold', color: '#000', marginBottom: 30, textAlign: 'center' },
  okButton: { backgroundColor: '#E0E0E0', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  okButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});

