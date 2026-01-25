import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BottomControls = memo(() => {
  return (
    <View style={styles.bottomBar}>
      <View style={styles.controlItem}>
        <View style={styles.sphericalButton}>
          <Text style={styles.menuButtonText}>LANG</Text>
        </View>
        <Text style={styles.controlLabel}>LANGUAGE</Text>
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
        <Text style={styles.controlLabel}>SCROLL LEFT/RIGHT</Text>
      </View>
      <View style={styles.controlItem}>
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
        <Text style={styles.controlLabel}>SCROLL UP/DOWN</Text>
      </View>
      <View style={styles.controlItem}>
        <View style={styles.sphericalButton}>
          <View style={styles.dpadContainer}>
            <View style={styles.dpadRow}>
              <View style={styles.dpadArrowPlaceholder} />
              <Text style={styles.dpadArrow}>▲</Text>
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
              <Text style={styles.dpadArrow}>▼</Text>
              <View style={styles.dpadArrowPlaceholder} />
            </View>
          </View>
        </View>
        <Text style={styles.controlLabel}>OK SELECT</Text>
      </View>
    </View>
  );
});

BottomControls.displayName = 'BottomControls';

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

export default BottomControls;


