import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Dimensions, ScrollView, StatusBar, Platform, BackHandler, Modal, FlatList } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useRouter } from 'expo-router';
import DynamicHeader from '../components/DynamicHeader';

const { width, height } = Dimensions.get('window');

// Memoized Channel List Item Component
const ChannelItem = React.memo(({ 
  channel, 
  index, 
  isActive, 
  isFocused, 
  onPress 
}: { 
  channel: { id: number; name: string; videoUrl: string }; 
  index: number;
  isActive: boolean;
  isFocused: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.6}
    style={[
      styles.channelItem,
      isActive && styles.channelItemActive,
      isFocused && styles.channelItemFocused
    ]}
    onPress={onPress}
  >
    <Text style={[
      styles.channelText,
      isActive && styles.channelTextActive,
      isFocused && styles.channelTextFocused
    ]}>
      {channel.name}
    </Text>
  </TouchableOpacity>
));

// Memoized Category Tab Component
const CategoryTab = React.memo(({ 
  category, 
  index, 
  isActive, 
  onPress 
}: { 
  category: string; 
  index: number;
  isActive: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.6}
    style={[
      styles.categoryTab,
      isActive && styles.categoryTabActive,
    ]}
    onPress={onPress}
  >
    <Text style={[
      styles.categoryText,
      isActive && styles.categoryTextActive,
    ]}>
      {category}
    </Text>
  </TouchableOpacity>
));

export default function TVScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All Channel');
  const [currentTime] = useState(new Date());
  const [focusedChannelIndex, setFocusedChannelIndex] = useState(0);
  const [focusedCategoryIndex, setFocusedCategoryIndex] = useState(0);
  const [showMenuPopup, setShowMenuPopup] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Memoize channels array to prevent re-creation
  const channels = useMemo(() => [
    { id: 1, name: 'BBC News', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { id: 2, name: 'Channel News Asia', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
    { id: 3, name: 'CCTV', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
    { id: 4, name: 'CNN', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
    { id: 5, name: 'Fox News', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' },
    { id: 6, name: 'Al Jazeera', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
    { id: 7, name: 'Sky News', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
    { id: 8, name: 'NBC', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { id: 9, name: 'ABC News', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    { id: 10, name: 'CBS News', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4' },
    { id: 11, name: 'Euro News', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' },
    { id: 12, name: 'Discovery', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4' },
    { id: 13, name: 'National Geographic', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4' },
    { id: 14, name: 'History Channel', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { id: 15, name: 'Sports Channel', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    { id: 16, name: 'MSNBC', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { id: 17, name: 'Bloomberg', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
    { id: 18, name: 'CNBC', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
  ], []);

  const [selectedChannel, setSelectedChannel] = useState(channels[0]);
  
  // Memoize categories array
  const categories = useMemo(() => ['All Channel', 'Comedy', 'Action', 'Drama', 'Sci-Fi'], []);

  const handleGoHome = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/' as any);
    }
  }, [router]);

  const player = useVideoPlayer(selectedChannel.videoUrl, player => {
    player.loop = true;
    player.volume = 1.0; // Set volume to maximum
    player.muted = false; // Ensure audio is not muted
    player.play();
  });

  // Separate player for fullscreen
  const fullscreenPlayer = useVideoPlayer(selectedChannel.videoUrl, player => {
    player.loop = true;
    player.volume = 1.0; // Set volume to maximum
    player.muted = false; // Ensure audio is not muted
    if (showFullscreen) {
      player.play();
    }
  });

  // Sync fullscreen player with main player and pause main video
  useEffect(() => {
    if (showFullscreen) {
      // Pause the main video when entering fullscreen
      player.pause();
      
      // Load and play the fullscreen video
      fullscreenPlayer.replace(selectedChannel.videoUrl);
      fullscreenPlayer.volume = 1.0; // Ensure volume is set to maximum
      fullscreenPlayer.muted = false; // Ensure audio is not muted
      setTimeout(() => {
        fullscreenPlayer.play();
      }, 100);
    } else {
      // Resume the main video when exiting fullscreen
      player.volume = 1.0; // Ensure volume is set to maximum
      player.muted = false; // Ensure audio is not muted
      player.play();
    }
  }, [showFullscreen, selectedChannel, player, fullscreenPlayer]);

  // Android Back Button Handler
  useEffect(() => {
    const backAction = () => {
      handleGoHome();
      return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  // Simple navigation for testing
  const handleUpPress = () => {
    setFocusedChannelIndex(prev => 
      prev > 0 ? prev - 1 : channels.length - 1
    );
  };

  const handleDownPress = () => {
    setFocusedChannelIndex(prev => 
      prev < channels.length - 1 ? prev + 1 : 0
    );
  };

  const handleLeftPress = () => {
    setFocusedCategoryIndex(prev => {
      const newIndex = prev > 0 ? prev - 1 : categories.length - 1;
      setSelectedCategory(categories[newIndex]);
      return newIndex;
    });
  };

  const handleRightPress = () => {
    setFocusedCategoryIndex(prev => {
      const newIndex = prev < categories.length - 1 ? prev + 1 : 0;
      setSelectedCategory(categories[newIndex]);
      return newIndex;
    });
  };

  const handleSelectPress = () => {
    if (focusedChannelIndex >= 0 && focusedChannelIndex < channels.length) {
      handleChannelSelect(channels[focusedChannelIndex]);
    }
  };

  const handleMenuBarPress = useCallback(() => {
    setShowMenuPopup(prev => !prev);
  }, []);

  const handleFullscreenPress = useCallback(() => {
    setShowFullscreen(true);
  }, []);

  const handleCloseFullscreen = useCallback(() => {
    setShowFullscreen(false);
  }, []);

  const handleChannelSelect = useCallback((channel: typeof channels[0]) => {
    setSelectedChannel(channel);
    player.replace(channel.videoUrl);
    player.volume = 1.0; // Ensure volume is set to maximum
    player.muted = false; // Ensure audio is not muted
    player.play();
  }, [player]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
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
    <>
      <StatusBar hidden={true} />
      <ImageBackground 
        source={{ uri: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzY1Sf3GyQaP0mvmtxEKt4WM1JcmQid35iHy0TrWAhm7aTQy6ylNqQou2_W1GBHTPRWWh-EVwQAkK4ZvgJ9elmqjaZWqch6h_Llf9rXFCo2KI-tkiSHdgLNTkjQhnJBDJWL2DtauA=s1360-w1360-h1020-rw' }}
        style={styles.container}
        resizeMode="cover"
      >
        {/* Header Bar */}
        <DynamicHeader currentTime={currentTime} />

        {/* Category Tabs */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity activeOpacity={0.6} onPress={handleGoHome} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((category, index) => (
              <CategoryTab
                key={category}
                category={category}
                index={index}
                isActive={selectedCategory === category}
                onPress={() => {
                  setSelectedCategory(category);
                  setFocusedCategoryIndex(index);
                }}
              />
            ))}
          </ScrollView>

          <TouchableOpacity activeOpacity={0.6} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Channel List - Left */}
          <View style={styles.channelList}>
            <FlatList
              data={channels}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <ChannelItem
                  channel={item}
                  index={index}
                  isActive={selectedChannel.id === item.id}
                  isFocused={focusedChannelIndex === index}
                  onPress={() => {
                    handleChannelSelect(item);
                    setFocusedChannelIndex(index);
                  }}
                />
              )}
              removeClippedSubviews={true}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              windowSize={10}
            />
          </View>

              {/* Video Player - Right */}
              <View style={styles.videoContainer}>
                <VideoView
                  player={player}
                  style={styles.video}
                  nativeControls={false}
                />
              </View>
        </View>

        {/* Menu Popup */}
        {showMenuPopup && (
          <>
            {/* Backdrop */}
            <View style={styles.menuBackdrop} />
            
            {/* Menu Popup */}
            <View style={styles.menuPopup}>
              {/* Close Button */}
              <TouchableOpacity 
                activeOpacity={0.6}
                style={styles.closeButton}
                onPress={() => setShowMenuPopup(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              
              <View style={styles.menuGrid}>
                <TouchableOpacity 
                  activeOpacity={0.6}
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenuPopup(false);
                    // TV is already the current screen, so just close popup
                  }}
                >
                  <Text style={styles.menuIcon}>📺</Text>
                  <Text style={styles.menuLabel}>TV</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  activeOpacity={0.6}
                  style={styles.menuItem}
                  onPress={() => {
                    console.log('Information button pressed');
                    setShowMenuPopup(false);
                    console.log('Navigating to information page');
                    router.replace('/information' as any);
                  }}
                >
                  <Text style={styles.menuIcon}>ℹ️</Text>
                  <Text style={styles.menuLabel}>INFORMATION</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  activeOpacity={0.6}
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenuPopup(false);
                    // Navigate to chromecast page (you can add this route later)
                    console.log('Navigate to Chromecast');
                  }}
                >
                  <Text style={styles.menuIcon}>📱</Text>
                  <Text style={styles.menuLabel}>CHROMECAST</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  activeOpacity={0.6}
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenuPopup(false);
                    // Navigate to messages page (you can add this route later)
                    console.log('Navigate to Messages');
                  }}
                >
                  <Text style={styles.menuIcon}>✉️</Text>
                  <Text style={styles.menuLabel}>MESSAGES</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  activeOpacity={0.6}
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenuPopup(false);
                    // Navigate to map page (you can add this route later)
                    console.log('Navigate to Map');
                  }}
                >
                  <Text style={styles.menuIcon}>📍</Text>
                  <Text style={styles.menuLabel}>MAP</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  activeOpacity={0.6}
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenuPopup(false);
                    // Navigate to weather page (you can add this route later)
                    console.log('Navigate to Weather');
                  }}
                >
                  <Text style={styles.menuIcon}>🌡️</Text>
                  <Text style={styles.menuLabel}>WEATHER</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.menuArrow}>
                <Text style={styles.arrowText}>›</Text>
              </View>
            </View>
          </>
        )}

        {/* Bottom Control Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity activeOpacity={0.6} style={styles.controlItem} onPress={handleMenuBarPress}>
            <View style={styles.controlIcon} />
            <Text style={styles.controlLabel}>MENU BAR</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.controlItem} onPress={handleFullscreenPress}>
            <View style={styles.controlIcon} />
            <Text style={styles.controlLabel}>FULL SCREEN</Text>
          </TouchableOpacity>
          <View style={styles.controlItem}>
            <View style={styles.controlIcon} />
            <Text style={styles.controlLabel}>SELECT CATEGORIES</Text>
          </View>
          <View style={styles.controlItem}>
            <View style={styles.controlIcon} />
            <Text style={styles.controlLabel}>SELECT CHANNEL</Text>
          </View>
        </View>

        {/* Fullscreen Video Modal */}
        {showFullscreen && (
          <Modal
            visible={showFullscreen}
            transparent={false}
            animationType="fade"
            onRequestClose={handleCloseFullscreen}
          >
            <View style={styles.fullscreenContainer}>
              <StatusBar hidden={true} />
              <VideoView
                player={fullscreenPlayer}
                style={styles.fullscreenVideo}
                nativeControls={false}
              />
              
              {/* Close Button */}
              <TouchableOpacity 
                activeOpacity={0.6}
                style={styles.fullscreenCloseButton}
                onPress={handleCloseFullscreen}
              >
                <Text style={styles.fullscreenCloseText}>✕ Exit Fullscreen</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}
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
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  vpsLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vpsText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  burjeelLogo: {
    marginLeft: 0,
  },
  burjeelOneLine: {
    color: '#8B1538',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  separator: {
    fontSize: 13,
    color: '#999',
  },
  weatherIcon: {
    fontSize: 14,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 36,
    color: '#333',
    fontWeight: 'bold',
  },
  categoryScroll: {
    flex: 1,
  },
  categoryTab: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    marginHorizontal: 5,
    backgroundColor: 'transparent',
  },
  categoryTabActive: {
    backgroundColor: '#8B1538',
    borderRadius: 5,
  },
  categoryTabFocused: {
    borderWidth: 3,
    borderColor: '#FFD700',
    borderRadius: 5,
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: 'white',
  },
  categoryTextFocused: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  nextButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 36,
    color: '#333',
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    gap: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  channelList: {
    width: width * 0.25,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: 10,
  },
  channelItem: {
    paddingVertical: 18,
    paddingHorizontal: 15,
    marginBottom: 5,
    borderRadius: 5,
  },
  channelItemActive: {
    backgroundColor: '#8B1538',
  },
  channelItemFocused: {
    borderWidth: 3,
    borderColor: '#FFD700',
    borderRadius: 5,
  },
  channelText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  channelTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  channelTextFocused: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
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
    gap: 8,
  },
  controlIcon: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#90A4AE',
    borderWidth: 2,
    borderColor: '#666',
  },
  controlLabel: {
    fontSize: 11,
    color: '#000',
    fontWeight: '600',
  },
  arrowIcon: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  menuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  menuPopup: {
    position: 'absolute',
    left: 20,
    top: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    maxWidth: 300,
  },
  menuItem: {
    width: 80,
    height: 80,
    backgroundColor: '#8B1538',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 10,
  },
  menuIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  menuLabel: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuArrow: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  arrowText: {
    fontSize: 30,
    color: '#8B1538',
    fontWeight: 'bold',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenVideo: {
    width: width,
    height: height,
  },
  fullscreenCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
  },
  fullscreenCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

