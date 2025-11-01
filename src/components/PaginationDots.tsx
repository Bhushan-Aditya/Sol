import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants';

interface PaginationDotsProps {
  totalDots: number;
  activeIndex: number;
}

export const PaginationDots: React.FC<PaginationDotsProps> = ({
  totalDots,
  activeIndex,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalDots }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === activeIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 16,
    maxHeight: 16,
    padding: spacing.sm / 3,
    gap: 4,
  },
  dot: {
    width: 8,
    height: 3,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#272726',
  },
  inactiveDot: {
    backgroundColor: '#D0D0CE',
  },
});

