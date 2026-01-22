import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Dimensions, StatusBar } from 'react-native';
import { useVideoPlayer } from 'expo-video';
import { useRouter } from 'expo-router';
import DynamicHeader from '../components/DynamicHeader';
import { getBackgroundVideos, toAbsoluteVideoUrl } from '../api/getBackgroundVideos';
import { getWelcomeData } from '../api/getWelcomeData';
import HomeMenu, { HomeMenuItem } from '../components/HomeMenu';
import BottomControls from '../components/BottomControls';
import IntroVideoModal from '../components/IntroVideoModal';
import WelcomeOverlay from '../components/WelcomeOverlay';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [showVideoModal, setShowVideoModal] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [welcomeData, setWelcomeData] = useState<Awaited<ReturnType<typeof getWelcomeData>> | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const player = useVideoPlayer(null as any, (p) => {
    p.loop = true;
  });

  // Fetch background videos from API and use first in modal
  useEffect(() => {
    let cancelled = false;
    setIsVideoLoading(true);
    getBackgroundVideos()
      .then((res) => {
        if (cancelled || !res.videos?.length) return;
        const first = res.videos[0];
        const url = toAbsoluteVideoUrl(first.file_url);
        player.replace(url);
        setIsVideoLoading(false);
        player.play();
      })
      .catch(() => {
        // On error, close video modal and go directly to welcome
        setIsVideoLoading(false);
        setShowVideoModal(false);
        setShowWelcome(true);
      });
    return () => { cancelled = true; };
  }, [player]);

  // Fetch welcome data (room_number, welcome_message, etc.) for header and welcome modal
  useEffect(() => {
    let cancelled = false;
    getWelcomeData()
      .then((data) => {
        if (!cancelled) setWelcomeData(data);
      })
      .catch(() => {
        // Keep null on error; header shows "—", modal uses fallback
      });
    return () => { cancelled = true; };
  }, []);

  // Memoize menuItems to prevent re-creation
  const menuItems: HomeMenuItem[] = useMemo(
    () => [
      { id: 1, icon: '📺', label: 'TV', color: '#8B1538', route: '/tv' },
      { id: 2, icon: 'ℹ️', label: 'INFORMATION', color: '#8B1538', route: '/information' },
      { id: 3, icon: '📱', label: 'CHROMECAST', color: '#8B1538', route: '/chromecast' },
      { id: 4, icon: '✉️', label: 'MESSAGES', color: '#8B1538', route: '/messages' },
      { id: 5, icon: '📍', label: 'MAP', color: '#8B1538', route: '/map' },
      { id: 6, icon: '🌡️', label: 'WEATHER', color: '#8B1538', route: '/weather' },
      { id: 7, icon: '✈️', label: 'FLIGHT', color: '#8B1538', route: '/flight' },
    ],
    []
  );

  const handleMenuClick = useCallback((item: typeof menuItems[0]) => {
    if (item.route) {
      setShowVideoModal(false);
      setShowWelcome(false);
      router.push(item.route as any);
    }
  }, [router]);

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
    if (showVideoModal && !isVideoLoading) {
      // Play video when modal is visible and video is ready
      player.play();
    } else {
      // Pause video when modal is not visible
      player.pause();
    }
  }, [showVideoModal, isVideoLoading, player]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <StatusBar hidden={true} />

      <View style={styles.container}>
        <View style={styles.backgroundImage} />

        <DynamicHeader currentTime={currentTime} roomNumber={welcomeData?.room_number} />

        {!showVideoModal && !showWelcome && (
          <>
            <View style={styles.mainContent}>
              <HomeMenu items={menuItems} onPressItem={handleMenuClick} />
            </View>

            <BottomControls />
          </>
        )}

        <IntroVideoModal
          visible={showVideoModal}
          player={player}
          loading={isVideoLoading}
          onSkip={handleSkipVideo}
        />

        <WelcomeOverlay
          visible={showWelcome}
          welcomeMessage={welcomeData?.welcome_message}
          signatureTitle={welcomeData?.signature_title}
          onClose={handleSkipWelcome}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: width, height: height, backgroundColor: 'transparent' },
  backgroundImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#e8f4f8', opacity: 0 },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 20, paddingTop: 20, paddingBottom: 20 },
  menuItemFocused: { 
    borderWidth: 5,
    borderColor: '#FFD700'
  },
});

