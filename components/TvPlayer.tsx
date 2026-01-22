import React, { memo } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { VideoView, VideoPlayer } from 'expo-video';

type Props = {
  player: VideoPlayer;
  loading: boolean;
};

const TvPlayer = memo(({ player, loading }: Props) => {
  return (
    <View style={styles.videoContainer}>
      <VideoView player={player} style={styles.video} nativeControls={false} />
      {loading && (
        <View style={styles.videoLoaderOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.videoLoaderText}>Loading content...</Text>
        </View>
      )}
    </View>
  );
});

TvPlayer.displayName = 'TvPlayer';

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1, // take all remaining width next to sidebar
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
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
});

export default TvPlayer;


