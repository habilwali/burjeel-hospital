import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import type { PackageItem } from '../types/packages';

type Props = {
  categories: PackageItem[];
  selectedCategory: string;
  onBack: () => void;
  onSelectCategory: (name: string, index: number) => void;
};

type CategoryTabProps = {
  category: string;
  index: number;
  isActive: boolean;
  onPress: () => void;
};

const CategoryTab = memo(({ category, isActive, onPress }: CategoryTabProps) => (
  <TouchableOpacity
    activeOpacity={0.6}
    style={[styles.categoryTab, isActive && styles.categoryTabActive]}
    onPress={onPress}
  >
    <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>{category}</Text>
  </TouchableOpacity>
));

CategoryTab.displayName = 'CategoryTab';

const TvCategoryBar = memo(({ categories, selectedCategory, onBack, onSelectCategory }: Props) => {
  return (
    <View style={styles.categoryContainer}>
      <TouchableOpacity activeOpacity={0.6} onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((pkg, index) => {
          const label = pkg?.name ?? 'All Channels';
          const isActive = selectedCategory === label;
          return (
            <CategoryTab
              key={pkg?.id ?? `cat-${index}`}
              category={label}
              index={index}
              isActive={isActive}
              onPress={() => onSelectCategory(label, index)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
});

TvCategoryBar.displayName = 'TvCategoryBar';

const styles = StyleSheet.create({
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
  categoryText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: 'white',
  },
});

export default TvCategoryBar;


