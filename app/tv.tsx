import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Dimensions, ScrollView, StatusBar, Platform, BackHandler, Modal } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function TVScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All Channel');
  const [currentTime] = useState(new Date());
  const [focusedChannelIndex, setFocusedChannelIndex] = useState(0);
  const [focusedCategoryIndex, setFocusedCategoryIndex] = useState(0);
  const [showMenuPopup, setShowMenuPopup] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const channels = [
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
  ];

  const [selectedChannel, setSelectedChannel] = useState(channels[0]);

  const handleGoHome = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/' as any);
    }
  };

  const player = useVideoPlayer(selectedChannel.videoUrl, player => {
    player.loop = true;
    player.play();
  });

  // Separate player for fullscreen
  const fullscreenPlayer = useVideoPlayer(selectedChannel.videoUrl, player => {
    player.loop = true;
    if (showFullscreen) {
      player.play();
    }
  });

  const categories = ['All Channel', 'Comedy', 'Action', 'Drama', 'Sci-Fi'];

  // Sync fullscreen player with main player
  useEffect(() => {
    if (showFullscreen) {
      fullscreenPlayer.replace(selectedChannel.videoUrl);
      setTimeout(() => {
        fullscreenPlayer.play();
      }, 100);
    }
  }, [showFullscreen, selectedChannel]);

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

  const handleMenuBarPress = () => {
    setShowMenuPopup(!showMenuPopup);
  };

  const handleFullscreenPress = () => {
    setShowFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setShowFullscreen(false);
  };

  const handleChannelSelect = (channel: typeof channels[0]) => {
    setSelectedChannel(channel);
    player.replace(channel.videoUrl);
    player.play();
  };

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
        source={{ uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' }}
        style={styles.container}
        resizeMode="cover"
      >
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.logoSection}>
            <View style={styles.vpsLogo}>
              <Text style={styles.vpsText}>vps healthcare</Text>
            </View>
            <View style={styles.burjeelLogo}>
              <Text style={styles.burjeelOneLine}>برجيل burjeel hospital</Text>
            </View>
          </View>
          
          <View style={styles.infoSection}>
            <Text style={styles.infoText}>Room 215</Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.infoText}>{formatDate(currentTime)}</Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.infoText}>{formatTime(currentTime)}</Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.weatherIcon}>☁️</Text>
            <Text style={styles.infoText}>19°C</Text>
          </View>
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity activeOpacity={0.6} onPress={handleGoHome} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category}
                // @ts-ignore
                activeOpacity={0.6} 
                // @ts-ignore
                style={[
                  styles.categoryTab,
                  selectedCategory === category && styles.categoryTabActive,
                  // focusedCategoryIndex === index && styles.categoryTabFocused
                ]}
                onPress={() => {
                  setSelectedCategory(category);
                  setFocusedCategoryIndex(index);
                }}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                  // focusedCategoryIndex === index && styles.categoryTextFocused
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
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
            <ScrollView showsVerticalScrollIndicator={false}>
              {channels.map((channel, index) => (
                <TouchableOpacity
                  key={channel.id}
                  // @ts-ignore
                  activeOpacity={0.6} 
                  // @ts-ignore
                  style={[
                    styles.channelItem,
                    selectedChannel.id === channel.id && styles.channelItemActive,
                    // focusedChannelIndex === index && styles.channelItemFocused
                  ]}
                  onPress={() => {
                    handleChannelSelect(channel);
                    setFocusedChannelIndex(index);
                  }}
                >
                  <Text style={[
                    styles.channelText,
                    selectedChannel.id === channel.id && styles.channelTextActive,
                    focusedChannelIndex === index && styles.channelTextFocused
                  ]}>
                    {channel.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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

