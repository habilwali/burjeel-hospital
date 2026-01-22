import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BottomControls = memo(() => {
  return (
    <View style={styles.bottomBar}>
      <View style={styles.controlItem}>
        <View style={styles.controlButton} />
        <Text style={styles.controlLabel}>LANGUAGE</Text>
      </View>
      <View style={styles.controlItem}>
        <View style={styles.controlButton} />
        <Text style={styles.controlLabel}>SCROLL LEFT/RIGHT</Text>
      </View>
      <View style={styles.controlItem}>
        <View style={styles.controlButton} />
        <Text style={styles.controlLabel}>SCROLL UP/DOWN</Text>
      </View>
      <View style={styles.controlItem}>
        <View style={styles.controlButton} />
        <Text style={styles.controlLabel}>OK   SELECT</Text>
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
  controlItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#90A4AE',
    borderWidth: 2,
    borderColor: '#666',
  },
  controlLabel: { fontSize: 12, color: '#000', fontWeight: '600' },
});

export default BottomControls;


