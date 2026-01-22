import React, { memo } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

type Props = {
  visible: boolean;
  welcomeMessage?: string | null; // full body text from API, can contain line breaks
  signatureTitle?: string | null;
  onClose: () => void;
};

const WelcomeOverlay = memo(({ visible, welcomeMessage, signatureTitle, onClose }: Props) => {
  const title = 'Welcome to Burjeel Hospital.';

  const fallbackBody =
    'Your health and safety are our top priority, and our caregivers are here to ensure that you have access to the top-quality care you deserve.\n\n' +
    'If you require any assistance at any time, please don’t hesitate to contact one of our caregivers.\n\n' +
    'We wish you a speedy recovery.';

  // Use API-provided message if present; otherwise fall back to default copy
  const bodySource = (welcomeMessage ?? fallbackBody).trim();
  const paragraphs = bodySource.split(/\n\s*\n/);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.welcomeOverlay}>
          <Text style={styles.welcomeTitle}>{title}</Text>

          {paragraphs.map((p, idx) => (
            <Text key={idx} style={styles.bodyText}>
              {p}
            </Text>
          ))}

          {signatureTitle ? <Text style={styles.signatureTitle}>— {signatureTitle}</Text> : null}

          <View style={styles.bottomRow}>
            <Text style={styles.pressText}>Press</Text>
            <View style={styles.okPill}>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.okPillText}>OK</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.pressText}>to proceed</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
});

WelcomeOverlay.displayName = 'WelcomeOverlay';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 40,
    paddingTop: 80, // push modal a bit down from exact center
  },
  welcomeOverlay: {
    width: width * 0.9,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 15,
    paddingVertical: 28,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#111',
    marginBottom: 18,
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 18,
    lineHeight: 26,
    color: '#222',
    textAlign: 'center',
    marginBottom: 12,
  },
  signatureTitle: {
    fontSize: 16,
    color: '#555',
    fontStyle: 'italic',
    marginTop: 6,
    marginBottom: 16,
    textAlign: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  pressText: {
    fontSize: 18,
    color: '#222',
    marginHorizontal: 6,
  },
  okPill: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  okPillText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  okButton: {
    backgroundColor: '#E0E0E0',
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  okButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});

export default WelcomeOverlay;


