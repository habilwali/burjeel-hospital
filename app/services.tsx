import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Dimensions, StatusBar, ScrollView, ActivityIndicator, Image } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DynamicHeader from '../components/DynamicHeader';
import { getWelcomeData } from '../api/getWelcomeData';
import { getFacilities } from '../api/getFacilities';
import type { Facility } from '../types/facility';
import { getMac, type GetMacResponse } from '@/api/getMac';

const { width, height } = Dimensions.get('window');

export default function ServicesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ group_id?: string }>();
  const [currentTime] = useState(new Date());
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [welcomeData, setWelcomeData] = useState<Awaited<ReturnType<typeof getWelcomeData>> | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [deviceInfo, setDeviceInfo] = useState<GetMacResponse | null>(null);
  
  const player = useVideoPlayer('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');

  useEffect(() => {
    const subscription = player.addListener('playingChange', (event) => {
      setIsVideoPlaying(event.isPlaying);
    });

    return () => {
      subscription?.remove();
    };
  }, [player]);

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
    
    if (!params.group_id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    getFacilities(params.group_id)
      .then((response) => {
        if (!cancelled && response.status === 'success' && response.data) {
          setFacilities(response.data);
          // Reset to first tab when new data loads
          setActiveTabIndex(0);
        }
      })
      .catch(() => {
        // Keep empty array on error
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    
    return () => { cancelled = true; };
  }, [params.group_id]);

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

  const handleGoBack = () => {
    router.back();
  };

  const handleTabPress = (index: number) => {
    setActiveTabIndex(index);
    const facility = facilities[index];
    
    // If facility has video, play it
    if (facility?.video) {
      player.replace(facility.video);
      setTimeout(() => {
        player.play();
      }, 200);
    } else {
      player.pause();
    }
  };

  const getTabName = (index: number): string => {
    return `Information ${index + 1}`;
  };

  const handleScrollUp = () => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const handleScrollDown = () => {
    scrollViewRef.current?.scrollToEnd({
      animated: true,
    });
  };

  const handleScrollContent = (direction: 'up' | 'down') => {
    if (!scrollViewRef.current) return;
    
    const scrollAmount = 150; // Pixels to scroll per press
    
    if (direction === 'up') {
      const newY = Math.max(0, scrollY - scrollAmount);
      scrollViewRef.current.scrollTo({
        y: newY,
        animated: true,
      });
      setScrollY(newY);
    } else {
      const newY = scrollY + scrollAmount;
      scrollViewRef.current.scrollTo({
        y: newY,
        animated: true,
      });
      setScrollY(newY);
    }
  };


  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B1538" />
          <Text style={styles.loadingText}>Loading facilities...</Text>
        </View>
      );
    }

    if (facilities.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No facilities available</Text>
        </View>
      );
    }

    const facility = facilities[activeTabIndex];
    if (!facility) {
      return null;
    }

    // If facility has video, show video player
    if (facility.video) {
      return (
        <View style={styles.videoContainer}>
          <VideoView
            player={player}
            style={styles.videoPlayer}
            nativeControls={false}
          />
        </View>
      );
    }

    // Default: two column layout with image and content
    return (
      <View style={styles.twoColumnLayout}>
        {/* Left Side - Image */}
        <View style={styles.leftImageSection}>
          {facility.image ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: facility.image }}
                style={styles.facilityImage}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={styles.imageOnlyBox}>
              <Text style={styles.imageOnlyText}>Image only</Text>
            </View>
          )}
        </View>
        
        {/* Right Side - Content */}
        <View style={styles.rightContentSection}>
          {facility.name && (
            <Text style={styles.contentTitle}>{facility.name}</Text>
          )}
          <Text style={styles.contentText}>
            {facility.description || facility.content || 'No description available.'}
          </Text>
        </View>
      </View>
    );
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
          {!isLoading && facilities.length > 0 && (
            <View style={styles.tabRowContainer}>
              {/* Left Navigation Arrow */}
              <TouchableOpacity 
                style={styles.leftArrow}
                onPress={() => {
                  const prevIndex = activeTabIndex > 0 ? activeTabIndex - 1 : facilities.length - 1;
                  handleTabPress(prevIndex);
                }}
              >
                <Text style={styles.arrowText}>‹</Text>
              </TouchableOpacity>

              {/* Tab Navigation */}
              <View style={styles.tabContainer}>
                {facilities.map((facility, index) => (
                  <TouchableOpacity 
                    key={facility.id || index}
                    activeOpacity={0.6}
                    style={[styles.tab, activeTabIndex === index ? styles.activeTab : styles.inactiveTab]}
                    onPress={() => handleTabPress(index)}
                  >
                    <Text style={activeTabIndex === index ? styles.activeTabText : styles.inactiveTabText}>
                      {getTabName(index)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Right Navigation Arrow */}
              <TouchableOpacity 
                style={styles.rightArrow}
                onPress={() => {
                  const nextIndex = activeTabIndex < facilities.length - 1 ? activeTabIndex + 1 : 0;
                  handleTabPress(nextIndex);
                }}
              >
                <Text style={styles.arrowText}>›</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Dynamic Content Area */}
          <View style={styles.contentArea}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
              onScroll={(event) => {
                setScrollY(event.nativeEvent.contentOffset.y);
              }}
              scrollEventThrottle={16}
            >
              {renderContent()}
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
                <TouchableOpacity 
                  style={styles.dpadRow}
                  onPress={() => handleScrollContent('up')}
                  activeOpacity={0.8}
                >
                  <View style={styles.dpadArrowPlaceholder} />
                  <Text style={styles.dpadArrow}>▲</Text>
                  <View style={styles.dpadArrowPlaceholder} />
                </TouchableOpacity>
                <View style={styles.dpadRow}>
                  <Text style={styles.scrollDpadArrow}>◄</Text>
                  <View style={styles.dpadCenter}>
                    <Text style={styles.dpadOK}>OK</Text>
                  </View>
                  <Text style={styles.scrollDpadArrow}>►</Text>
                </View>
                <TouchableOpacity 
                  style={styles.dpadRow}
                  onPress={() => handleScrollContent('down')}
                  activeOpacity={0.8}
                >
                  <View style={styles.dpadArrowPlaceholder} />
                  <Text style={styles.dpadArrow}>▼</Text>
                  <View style={styles.dpadArrowPlaceholder} />
                </TouchableOpacity>
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
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 15,
  },
  tabRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 0,
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
    paddingTop: 10,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  twoColumnLayout: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  leftImageSection: {
    width: '45%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: 10,
    height: '100%',
    paddingTop: 5,
  },
  rightContentSection: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingTop: 5,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 3, // Fixed aspect ratio for consistent sizing
    backgroundColor: '#2A2A2A',
    overflow: 'hidden',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  facilityImage: {
    width: '100%',
    height: '100%',
  },
  imageOnlyBox: {
    width: '100%',
    aspectRatio: 4 / 3, // Match the image container aspect ratio
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  imageOnlyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B1538',
    marginBottom: 20,
    textAlign: 'left',
  },
  contentText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    textAlign: 'left',
  },
  servicesList: {
    marginTop: 10,
  },
  serviceItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    paddingLeft: 10,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButtonIcon: {
    fontSize: 60,
    color: 'white',
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
  scrollArrowsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollArrow: {
    fontSize: 10,
    color: '#000000',
    fontWeight: 'bold',
    height: 12,
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
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});
