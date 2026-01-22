import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  onToggleMenu: () => void;
  onFullscreen: () => void;
};

const TvBottomControls = memo(({ onToggleMenu, onFullscreen }: Props) => {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity activeOpacity={0.6} style={styles.controlItem} onPress={onToggleMenu}>
        <View style={styles.controlIcon} />
        <Text style={styles.controlLabel}>MENU BAR</Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.6} style={styles.controlItem} onPress={onFullscreen}>
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
  );
});

TvBottomControls.displayName = 'TvBottomControls';

const styles = StyleSheet.create({
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
});

export default TvBottomControls;


