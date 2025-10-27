import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Dimensions, StatusBar, ScrollView } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function ServicesScreen() {
  const router = useRouter();
  const [currentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('Information 1');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  const player = useVideoPlayer('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');

  useEffect(() => {
    const subscription = player.addListener('playingChange', (event) => {
      setIsVideoPlaying(event.isPlaying);
    });

    return () => {
      subscription?.remove();
    };
  }, [player]);

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

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    if (tabName === 'Information 2') {
      // Force video to restart and play
      player.replace('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
      setTimeout(() => {
        player.play();
      }, 200);
    } else {
      player.pause();
    }
  };


  const renderContent = () => {
    switch (activeTab) {
      case 'Information 1':
        return (
          <View style={styles.twoColumnLayout}>
            {/* Left Side - Image */}
            <View style={styles.leftImageSection}>
              <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
                style={styles.imageOnlyBox}
                resizeMode="cover"
              />
            </View>
            
            {/* Right Side - Content */}
            <View style={styles.rightContentSection}>
              <Text style={styles.contentTitle}>Information 1</Text>
              <Text style={styles.contentText}>
                VPS Healthcare Group's premium healthcare brand, Burjeel is the most comprehensive private tertiary healthcare provider in UAE. The Burjeel hospitals have been at the forefront of healthcare services in the region and have emerged as the Center of Medical Excellence across the UAE. Over the years, Burjeel has built a strong sense of trust in the hearts of every patient we came across by serving them in all walks of life along with state-of-the-art facilities, and in-depth expertise.
              </Text>
            </View>
          </View>
        );
      case 'Information 2':
        return (
          <View style={styles.videoContainer}>
            <VideoView
              player={player}
              style={styles.videoPlayer}
              nativeControls={false}
            />
          </View>
        );
      case 'Information 3':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>Information 3</Text>
            <Text style={styles.contentText}>
              Our specialized departments include Cardiology, Neurology, Oncology, Pediatrics, and Emergency Medicine. Each department is equipped with the latest medical technology and staffed by internationally trained specialists.
            </Text>
            <View style={styles.servicesList}>
              <Text style={styles.serviceItem}>• Emergency Services 24/7</Text>
              <Text style={styles.serviceItem}>• Advanced Diagnostic Imaging</Text>
              <Text style={styles.serviceItem}>• Surgical Excellence</Text>
              <Text style={styles.serviceItem}>• Rehabilitation Services</Text>
              <Text style={styles.serviceItem}>• Preventive Care Programs</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
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
            <Text style={styles.logoText}>vps healthcare</Text>
            <Text style={styles.hospitalText}>برجيل burjeel hospital</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerInfo}>
              Room 215 | {formatDate(currentTime)} | {formatTime(currentTime)} | ☁️ 19°C
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              activeOpacity={0.6}
              style={[styles.tab, activeTab === 'Information 1' ? styles.activeTab : styles.inactiveTab]}
              onPress={() => handleTabPress('Information 1')}
            >
              <Text style={activeTab === 'Information 1' ? styles.activeTabText : styles.inactiveTabText}>
                ‹ Information 1
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              activeOpacity={0.6}
              style={[styles.tab, activeTab === 'Information 2' ? styles.activeTab : styles.inactiveTab]}
              onPress={() => handleTabPress('Information 2')}
            >
              <Text style={activeTab === 'Information 2' ? styles.activeTabText : styles.inactiveTabText}>
                Information 2
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              activeOpacity={0.6}
              style={[styles.tab, activeTab === 'Information 3' ? styles.activeTab : styles.inactiveTab]}
              onPress={() => handleTabPress('Information 3')}
            >
              <Text style={activeTab === 'Information 3' ? styles.activeTabText : styles.inactiveTabText}>
                Information 3 ›
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dynamic Content Area */}
          <View style={styles.contentArea}>
            {renderContent()}
          </View>
        </View>

        {/* Bottom Control Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.controlItem}>
            <View style={styles.controlButton} />
            <Text style={styles.controlLabel}>MENU BAR</Text>
          </View>
          <View style={styles.controlItem}>
            <View style={styles.controlButton} />
            <Text style={styles.controlLabel}>SELECT CATEGORY</Text>
          </View>
          <TouchableOpacity activeOpacity={0.6} style={styles.controlItem} onPress={handleGoBack}>
            <View style={styles.controlButton} />
            <Text style={styles.controlLabel}>BACK</Text>
          </TouchableOpacity>
          <View style={styles.controlItem}>
            <View style={styles.controlButton} />
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
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#8B1538',
  },
  inactiveTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeTabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inactiveTabText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentArea: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  contentContainer: {
    flex: 1,
  },
  twoColumnLayout: {
    flexDirection: 'row',
    flex: 1,
    gap: 10,
  },
  leftImageSection: {
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContentSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  imageOnlyBox: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
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
    textAlign: 'center',
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
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
