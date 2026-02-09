import React, { memo, useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export type HomeMenuItem = {
  id: number;
  icon: string | React.ReactNode;
  label: string;
  color: string;
  route: string;
};

type Props = {
  items: HomeMenuItem[];
  onPressItem: (item: HomeMenuItem) => void;
};

const ITEMS_PER_PAGE = 6; // 3 items per row × 2 rows
const COLUMN_SIZE = 3; // number of items in one column (both rows)

const HomeMenu = memo(({ items, onPressItem }: Props) => {
  // startIndex defines the first visible item in the 3x2 window
  const [startIndex, setStartIndex] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const firstItemRef = useRef<any>(null);

  const maxStartIndex = Math.max(0, items.length - ITEMS_PER_PAGE);
  const isFirstPage = startIndex === 0;
  const isLastPage = startIndex >= maxStartIndex;
  const currentItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleNextPage = useCallback(() => {
    if (!isLastPage) {
      setStartIndex((prev) => Math.min(prev + COLUMN_SIZE, maxStartIndex));
      setFocusedIndex(0);
    }
  }, [isLastPage, maxStartIndex]);

  const handlePrevPage = useCallback(() => {
    if (!isFirstPage) {
      setStartIndex((prev) => Math.max(prev - COLUMN_SIZE, 0));
      setFocusedIndex(0);
    }
  }, [isFirstPage]);

  // Ensure first item is focused on initial mount
  useEffect(() => {
    setFocusedIndex(0);
    // Use a small delay to ensure the component is fully rendered before focusing
    const timer = setTimeout(() => {
      if (firstItemRef.current) {
        // Try to focus the first item programmatically
        // @ts-ignore - focus() may not be available on all platforms
        if (firstItemRef.current.focus) {
          firstItemRef.current.focus();
        }
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []); // Only run on initial mount

  // Reset focus to first item when startIndex changes
  useEffect(() => {
    setFocusedIndex(0);
    const timer = setTimeout(() => {
      if (firstItemRef.current) {
        // @ts-ignore
        if (firstItemRef.current.focus) {
          firstItemRef.current.focus();
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [startIndex]);

  return (
    <View style={styles.menuContainer}>
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <TouchableOpacity
            // @ts-ignore
            activeOpacity={0.7}
            onPress={handlePrevPage}
            style={[styles.arrowButton, isFirstPage && styles.arrowDisabled]}
            disabled={isFirstPage}
          >
            <Text style={[styles.arrowText, isFirstPage && styles.arrowTextDisabled]}>‹</Text>
          </TouchableOpacity>

          <View style={styles.menuGrid}>
            {currentItems.map((item, index) => (
              <TouchableOpacity
                // @ts-ignore
                activeOpacity={0.8}
                key={item.id}
                ref={index === 0 ? firstItemRef : null}
                // @ts-ignore - hasTVPreferredFocus is for TV platforms
                hasTVPreferredFocus={index === 0 && startIndex === 0}
                style={[
                  styles.menuItem,
                  { backgroundColor: item.color },
                  index === focusedIndex && styles.menuItemFocused,
                ]}
                onPress={() => onPressItem(item)}
                onFocus={() => {
                  setFocusedIndex(index);
                }}
                onBlur={() => {
                  // Only clear focus if it's not the focused index
                  if (index === focusedIndex && index !== 0) {
                    // Keep focus state if it's the first item
                  }
                }}
              >
                {typeof item.icon === 'string' ? (
                  <>
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                    <View style={styles.iconLine} />
                  </>
                ) : (
                  <>
                    <View style={styles.menuIconContainer}>{item.icon}</View>
                    <View style={styles.iconLine} />
                  </>
                )}
                <Text style={styles.menuLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            // @ts-ignore
            activeOpacity={0.7}
            onPress={handleNextPage}
            style={[styles.arrowButton, isLastPage && styles.arrowDisabled]}
            disabled={isLastPage}
          >
            <Text style={[styles.arrowText, isLastPage && styles.arrowTextDisabled]}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

HomeMenu.displayName = 'HomeMenu';

const CARD_WIDTH = width * 0.55;

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 40,
    paddingVertical: 22,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 10,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItem: {
    flexBasis: '32%',    // 3 items per row
    maxWidth: '32%',
    height: 135,         // with 6 items total => 2 rows
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
  },
  menuItemFocused: {
    borderWidth: 4,
    borderColor: '#000',
  },
  menuIcon: { fontSize: 50, marginBottom: 8 },
  menuIconContainer: { marginBottom: 8, justifyContent: 'center', alignItems: 'center' },
  iconLine: {
    width: 40,
    height: 2,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  menuLabel: { color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  arrowButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  arrowText: { fontSize: 40, color: '#000000', fontWeight: 'bold' },
  arrowTextDisabled: {
    color: 'rgba(0,0,0,0.4)',
  },
});

export default HomeMenu;


