import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

type ChannelItemProps = {
  channel: { id: number; name: string };
  index: number;
  isActive: boolean;
  isFocused: boolean;
  onPress: () => void;
};

const ChannelItem = memo(({ channel, isActive, isFocused, onPress }: ChannelItemProps) => (
  <TouchableOpacity
    activeOpacity={0.6}
    style={[
      styles.channelItem,
      isActive && styles.channelItemActive,
      isFocused && styles.channelItemFocused,
    ]}
    onPress={onPress}
    // On TV devices, moving focus with the remote should also select/play the channel.
    // This makes the focused item become the active channel automatically.
    onFocus={onPress}
  >
    <Text
      style={[
        styles.channelText,
        isActive && styles.channelTextActive,
        isFocused && styles.channelTextFocused,
      ]}
    >
      {channel.name}
    </Text>
  </TouchableOpacity>
));

ChannelItem.displayName = 'ChannelItem';

type Props = {
  channels: { id: number; name: string }[];
  loading: boolean;
  selectedChannelId: number | null;
  focusedIndex: number;
  onSelectChannel: (channel: { id: number; name: string }, index: number) => void;
};

const TvChannelList = memo(
  ({ channels, loading, selectedChannelId, focusedIndex, onSelectChannel }: Props) => {
    if (loading) {
      return (
        <View style={[styles.channelList, styles.channelListLoader]}>
          <ActivityIndicator size="large" color="#8B1538" />
          <Text style={styles.loaderText}>Loading channels...</Text>
        </View>
      );
    }

    return (
      <View style={styles.channelList}>
        <FlatList
          data={channels}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <ChannelItem
              channel={item}
              index={index}
              isActive={selectedChannelId === item.id}
              isFocused={focusedIndex === index}
              onPress={() => onSelectChannel(item, index)}
            />
          )}
          removeClippedSubviews
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={10}
        />
      </View>
    );
  }
);

TvChannelList.displayName = 'TvChannelList';

const styles = StyleSheet.create({
  channelList: {
    width: width * 0.26, // narrow sidebar, rest of space for video
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: 10,
    marginRight: 12,
  },
  channelListLoader: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loaderText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
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
});

export default TvChannelList;


