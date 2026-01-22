import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, StatusBar, Platform, BackHandler, Modal, ActivityIndicator } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useRouter } from 'expo-router';
import DynamicHeader from '../components/DynamicHeader';
import { getPackages } from '../api/getPackages';
import { getChannels } from '../api/getChannels';
import type { PackageItem } from '../types/packages';
import TvCategoryBar from '../components/TvCategoryBar';
import TvChannelList from '../components/TvChannelList';
import TvPlayer from '../components/TvPlayer';
import TvBottomControls from '../components/TvBottomControls';
import { cacheGet, cacheSet } from '../lib/cache';

const { width, height } = Dimensions.get('window');
const DEFAULT_MAC = 'A4:34:D9:E6:F7:30';
const PACKAGES_CACHE_KEY = `packages:${DEFAULT_MAC}`;
const CHANNELS_CACHE_PREFIX = 'channels:';

// Fallback when API fails or empty; shape matches getPackages: { id, name, price, image }
const FALLBACK_PACKAGE: PackageItem = { id: 0, name: 'All Channels', price: 0, image: null };

const FALLBACK_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

/** UI channel: id, name, videoUrl (from stream_url), optional logo */
type ChannelUi = { id: number; name: string; videoUrl: string; logo?: string };

export default function TVScreen() {
  const router = useRouter();
  const [packages, setPackages] = useState<PackageItem[] | null>(null);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Channels');
  const [currentTime] = useState(new Date());
  const [focusedChannelIndex, setFocusedChannelIndex] = useState(0);
  const [focusedCategoryIndex, setFocusedCategoryIndex] = useState(0);
  const [showMenuPopup, setShowMenuPopup] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Categories from getPackages API; fallback when loading or empty
  const categoriesList = useMemo(
    () => (Array.isArray(packages) && packages.length > 0 ? packages : [FALLBACK_PACKAGE]),
    [packages]
  );

  // Fetch packages (categories) from API
  useEffect(() => {
    let cancelled = false;
    setPackagesLoading(true);
    getPackages()
      .then((res) => {
        console.log('[getPackages] API response:', JSON.stringify(res, null, 2));
        if (cancelled) return;
        const list = Array.isArray(res.packages) ? res.packages : [];
        setPackages(list);
        // Select first category when they arrive
        if (list.length > 0 && list[0]?.name) {
          setSelectedCategory(list[0].name);
          setFocusedCategoryIndex(0);
        }
        setPackagesLoading(false);
        // Prefetch and cache all channels for every category on first load
        // Removed eager prefetch of all channel lists to speed up initial load.
        // Channels are now fetched lazily when their category is selected.
      })
      .catch((err) => {
        console.log('[getPackages] API error:', err);
        if (!cancelled) {
          setPackages([]);
          setPackagesLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // Selected package id = category_id for getChannels (from packages/categories)
  const selectedPackageId = useMemo(
    () => categoriesList.find((p) => p.name === selectedCategory)?.id ?? 0,
    [categoriesList, selectedCategory]
  );

  const [channels, setChannels] = useState<ChannelUi[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<ChannelUi | null>(null);

  // Fetch channels when category (package) changes: getChannels.php?category_id=
  // First category is selected by default; first channel becomes selected when channels load
  useEffect(() => {
    let cancelled = false;
    setChannelsLoading(true);
    getChannels(selectedPackageId)
      .then((res) => {
        if (cancelled) return;
        const list: ChannelUi[] = (res.channels ?? []).map((c) => ({
          id: c.id,
          name: c.name,
          videoUrl: c.stream_url,
          logo: c.logo,
        }));
        setChannels(list);
        // First channel in array is selected by default; his content loads in the player
        const first = list[0];
        setSelectedChannel(first ?? null);
        setFocusedChannelIndex(0);
        setChannelsLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setChannels([]);
          setSelectedChannel(null);
          setChannelsLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [selectedPackageId, packagesLoading]);

  const handleGoHome = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/' as any);
    }
  }, [router]);

  const player = useVideoPlayer(selectedChannel?.videoUrl ?? FALLBACK_VIDEO_URL, (p) => {
    p.loop = true;
    p.volume = 1.0;
    p.muted = false;
    p.play();
  });

  // Separate player for fullscreen
  const fullscreenPlayer = useVideoPlayer(
    selectedChannel?.videoUrl ?? FALLBACK_VIDEO_URL,
    (p) => {
      p.loop = true;
      p.volume = 1.0;
      p.muted = false;
      if (showFullscreen) p.play();
    }
  );

  // Sync main player when selectedChannel changes (from getChannels or user pick)
  useEffect(() => {
    if (selectedChannel?.videoUrl) {
      player.replace(selectedChannel.videoUrl);
      player.play();
    } else {
      player.replace(FALLBACK_VIDEO_URL);
      player.pause();
    }
  }, [selectedChannel, player]);

  // Ensure that whenever the focused index changes (e.g. via remote up/down),
  // the focused channel becomes the selected/playing channel.
  useEffect(() => {
    if (focusedChannelIndex < 0 || focusedChannelIndex >= channels.length) return;
    const next = channels[focusedChannelIndex];
    if (!next || selectedChannel?.id === next.id) return;
    setSelectedChannel(next);
  }, [focusedChannelIndex, channels, selectedChannel]);

  // Sync fullscreen player with main player and pause main video
  useEffect(() => {
    const url = selectedChannel?.videoUrl ?? FALLBACK_VIDEO_URL;
    if (showFullscreen) {
      player.pause();
      fullscreenPlayer.replace(url);
      fullscreenPlayer.volume = 1.0;
      fullscreenPlayer.muted = false;
      setTimeout(() => fullscreenPlayer.play(), 100);
    } else {
      player.volume = 1.0;
      player.muted = false;
      player.play();
    }
  }, [showFullscreen, selectedChannel, player, fullscreenPlayer]);

  // Android Back Button Handler (skip on web where it may not exist)
  useEffect(() => {
    if (Platform.OS === 'web' || !BackHandler?.addEventListener) return;
    const backAction = () => {
      handleGoHome();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => sub.remove();
  }, [handleGoHome]);

  // Simple navigation for testing: move focus AND select/play that channel
  const moveChannelFocus = (delta: number) => {
    setFocusedChannelIndex((prev) => {
      if (!channels.length) return prev;
      const len = channels.length;
      const nextIndex = (prev + delta + len) % len;
      const nextChannel = channels[nextIndex];
      if (nextChannel) {
        setSelectedChannel(nextChannel);
      }
      return nextIndex;
    });
  };

  const handleUpPress = () => {
    moveChannelFocus(-1);
  };

  const handleDownPress = () => {
    moveChannelFocus(1);
  };

  const handleLeftPress = () => {
    setFocusedCategoryIndex(prev => {
      const len = categoriesList.length;
      const newIndex = len <= 1 ? 0 : prev > 0 ? prev - 1 : len - 1;
      setSelectedCategory(categoriesList[newIndex]?.name ?? 'All Channels');
      return newIndex;
    });
  };

  const handleRightPress = () => {
    setFocusedCategoryIndex(prev => {
      const len = categoriesList.length;
      const newIndex = len <= 1 ? 0 : prev < len - 1 ? prev + 1 : 0;
      setSelectedCategory(categoriesList[newIndex]?.name ?? 'All Channels');
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

  const handleChannelSelect = useCallback((channel: ChannelUi) => {
    setSelectedChannel(channel);
  }, []);

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
      <View style={styles.container}>
        {/* Header Bar */}
        <DynamicHeader currentTime={currentTime} />

        {packagesLoading ? (
          /* Loader while categories (packages) API is loading */
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#8B1538" />
            <Text style={styles.loaderText}>Loading categories...</Text>
          </View>
        ) : (
          <>
            {/* Category Tabs - first in array is selected when they arrive */}
            <TvCategoryBar
              categories={categoriesList}
              selectedCategory={selectedCategory}
              onBack={handleGoHome}
              onSelectCategory={(label, index) => {
                setSelectedCategory(label);
                setFocusedCategoryIndex(index);
              }}
            />

            {/* Main Content - first channel selected by default, his content loads in player */}
            <View style={styles.mainContent}>
              <TvChannelList
                channels={channels}
                loading={channelsLoading}
                selectedChannelId={selectedChannel?.id ?? null}
                focusedIndex={focusedChannelIndex}
                onSelectChannel={(channel, index) => {
                  handleChannelSelect(channel as any);
                  setFocusedChannelIndex(index);
                }}
              />

              <TvPlayer player={player} loading={channelsLoading} />
            </View>
          </>
        )}

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

        {!packagesLoading && (
          <TvBottomControls onToggleMenu={handleMenuBarPress} onFullscreen={handleFullscreenPress} />
        )}

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
      </View>
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
  loaderOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loaderText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  channelListLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  videoLoaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  videoLoaderText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
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

