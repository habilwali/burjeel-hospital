import React, { memo } from 'react';
import {
  Modal,
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import { VideoView, VideoPlayer } from 'expo-video';

const { width } = Dimensions.get('window');

type Props = {
  visible: boolean;
  player: VideoPlayer;
  loading: boolean;
  onSkip: () => void;
};

const IntroVideoModal = memo(({ visible, player, loading, onSkip }: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onSkip}>
        <View style={styles.touchArea}>
          <View style={styles.modalOverlay}>
            <View style={styles.videoModal}>
              <TouchableOpacity style={styles.closeButton} onPress={onSkip}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>

              {loading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#8B1538" />
                  <Text style={styles.loadingText}>Loading video...</Text>
                </View>
              ) : (
                <View style={styles.videoPlayer}>
                  <VideoView player={player} style={styles.video} nativeControls={false} />
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

IntroVideoModal.displayName = 'IntroVideoModal';

const styles = StyleSheet.create({
  touchArea: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', // dim over the existing bg.png
  },
  videoModal: {
    width: width * 0.65,
    backgroundColor: 'transparent',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  loaderContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 22,
    elevation: 18,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  videoPlayer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 22,
    elevation: 18,
  },
  video: { width: '100%', height: '100%' },
  skipButton: { backgroundColor: '#8B5CF6', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 },
  skipButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default IntroVideoModal;


