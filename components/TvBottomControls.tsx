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
        <View style={styles.sphericalButton}>
          <Text style={styles.menuButtonText}>MENU</Text>
        </View>
        <Text style={styles.controlLabel}>MENU BAR</Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.6} style={styles.controlItem} onPress={onFullscreen}>
        <View style={styles.sphericalButton}>
          <View style={styles.okCircle}>
            <Text style={styles.okText}>OK</Text>
          </View>
        </View>
        <Text style={styles.controlLabel}>FULL SCREEN</Text>
      </TouchableOpacity>
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
        <Text style={styles.controlLabel}>SELECT CATEGORIES</Text>
      </View>
      <TouchableOpacity activeOpacity={0.6} style={styles.controlItem} onPress={onFullscreen}>
        <View style={styles.sphericalButton}>
          <View style={styles.dpadContainer}>
            <View style={styles.dpadRow}>
              <View style={styles.dpadArrowPlaceholder} />
              <Text style={styles.dpadArrow}>▲</Text>
              <View style={styles.dpadArrowPlaceholder} />
            </View>
            <View style={styles.dpadRow}>
              <Text style={styles.scrollDpadArrow}>◄</Text>
              <View style={styles.dpadCenter}>
                <Text style={styles.dpadOK}>OK</Text>
              </View>
              <Text style={styles.scrollDpadArrow}>►</Text>
            </View>
            <View style={styles.dpadRow}>
              <View style={styles.dpadArrowPlaceholder} />
              <Text style={styles.dpadArrow}>▼</Text>
              <View style={styles.dpadArrowPlaceholder} />
            </View>
          </View>
        </View>
        <Text style={styles.controlLabel}>SELECT CHANNEL</Text>
      </TouchableOpacity>
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
  okCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#808080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  okText: {
    fontSize: 12,
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
  controlLabel: {
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default TvBottomControls;


