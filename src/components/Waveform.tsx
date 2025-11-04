import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface WaveformProps {
  audioLevel?: number; // 0-1 scale for amplitude
  isActive?: boolean; // true when user/AI is speaking
}

const NUM_BARS = 25;

export const Waveform: React.FC<WaveformProps> = ({
  audioLevel = 0,
  isActive = false
}) => {
  // Create animated values for each bar
  const barAnimations = useRef(
    Array.from({ length: NUM_BARS }, () => new Animated.Value(0.2))
  ).current;

  useEffect(() => {
    if (isActive && audioLevel > 0) {
      // Active state: bars animate based on audio level
      barAnimations.forEach((anim, index) => {
        // Create variation between bars for natural look
        const variation = Math.sin(index * 0.5) * 0.3;
        const targetHeight = Math.min(1, audioLevel + variation);

        Animated.spring(anim, {
          toValue: targetHeight,
          friction: 8,
          tension: 100,
          useNativeDriver: false,
        }).start();
      });
    } else {
      // Calm state: gentle pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence(
          barAnimations.map((anim, index) => {
            return Animated.parallel([
              Animated.delay(index * 30),
              Animated.sequence([
                Animated.timing(anim, {
                  toValue: 0.3 + Math.sin(index * 0.3) * 0.1,
                  duration: 1000,
                  useNativeDriver: false,
                }),
                Animated.timing(anim, {
                  toValue: 0.2,
                  duration: 1000,
                  useNativeDriver: false,
                }),
              ]),
            ]);
          })
        )
      );

      pulseAnimation.start();

      return () => {
        pulseAnimation.stop();
      };
    }
  }, [isActive, audioLevel, barAnimations]);

  return (
    <View style={styles.container}>
      <View style={styles.waveformContainer}>
        {barAnimations.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                height: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['20%', '100%'],
                }),
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
    gap: 3,
  },
  bar: {
    flex: 1,
    backgroundColor: '#C4A585',
    borderRadius: 2,
    minHeight: 4,
  },
});
