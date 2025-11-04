import React from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors, spacing } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PaginationDotsProps {
  totalDots: number;
  scrollX: Animated.Value;
  screenWidth?: number;
}

export const PaginationDots: React.FC<PaginationDotsProps> = ({
  totalDots,
  scrollX,
  screenWidth = SCREEN_WIDTH,
}) => {
  const DOT_WIDTH = 8;
  const DOT_HEIGHT = 3;
  const DOT_GAP = 4;
  const DOT_SPACING = DOT_WIDTH + DOT_GAP;
  const BORDER_RADIUS = 1.5; // Half of height for perfect pill shape

  return (
    <View style={styles.container}>
      <View style={styles.dotsWrapper}>
        {/* Base inactive dots */}
        {Array.from({ length: totalDots }).map((_, index) => (
          <View
            key={`base-${index}`}
            style={[
              styles.dot,
              styles.inactiveDot,
              {
                width: DOT_WIDTH,
                height: DOT_HEIGHT,
                marginHorizontal: DOT_GAP / 2,
                borderRadius: BORDER_RADIUS,
              },
            ]}
          />
        ))}

        {/* Animated extending dot overlay */}
        <Animated.View
          style={[
            styles.activeDot,
            {
              height: DOT_HEIGHT,
              borderRadius: BORDER_RADIUS,
              left: DOT_GAP / 2,
              width: scrollX.interpolate({
                inputRange: Array.from({ length: totalDots - 1 }, (_, i) => [
                  i * screenWidth,
                  i * screenWidth + screenWidth / 2,
                  (i + 1) * screenWidth,
                ]).flat().concat([totalDots > 0 ? (totalDots - 1) * screenWidth : 0]),
                outputRange: Array.from({ length: totalDots - 1 }, () => [
                  DOT_WIDTH, // Start: normal width
                  DOT_SPACING, // Midpoint: extend to reach the next dot (not cover it)
                  DOT_WIDTH, // End: normal width
                ]).flat().concat([DOT_WIDTH]),
                extrapolate: 'clamp',
              }),
              transform: [
                {
                  translateX: scrollX.interpolate({
                    inputRange: Array.from({ length: totalDots - 1 }, (_, i) => [
                      i * screenWidth,
                      i * screenWidth + screenWidth / 2,
                      (i + 1) * screenWidth,
                    ]).flat().concat([totalDots > 0 ? (totalDots - 1) * screenWidth : 0]),
                    outputRange: Array.from({ length: totalDots - 1 }, (_, i) => [
                      i * DOT_SPACING, // Start: at current dot position
                      (i + 0.6) * DOT_SPACING, // Midpoint: shift 60% towards next dot for balanced spacing
                      (i + 1) * DOT_SPACING, // End: at next dot position
                    ]).flat().concat([totalDots > 0 ? (totalDots - 1) * DOT_SPACING : 0]),
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 16,
    maxHeight: 16,
  },
  dotsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  dot: {
    // Base dot styles
  },
  activeDot: {
    position: 'absolute',
    backgroundColor: '#272726',
  },
  inactiveDot: {
    backgroundColor: '#D0D0CE',
  },
});

