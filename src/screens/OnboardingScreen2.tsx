import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';
import { GoogleButton, PaginationDots } from '../components';
import { colors, typography, spacing, dimensions } from '../constants';

interface OnboardingScreen2Props {
  isActive?: boolean;
}

export const OnboardingScreen2: React.FC<OnboardingScreen2Props> = ({ isActive = false }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const imageScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (isActive) {
      // Entrance animation sequence
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(imageScale, {
          toValue: 1,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive]);

  const handleGoogleSignIn = () => {
    console.log('Google Sign In Pressed');
    // TODO: Implement Google Sign In
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Title */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Hi, I'm Sol</Text>
        </Animated.View>

        {/* Hero Image with overlapping subtitle */}
        <View style={styles.heroSection}>
          <Animated.View
            style={[
              styles.imageContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: imageScale }],
              },
            ]}
          >
            <Image
              source={require('../assets/images/onboarding_2.png')}
              style={styles.image}
            />
          </Animated.View>

          {/* Subtitle - overlapping the image with blur effect */}
          <Animated.View
            style={[
              styles.subtitleContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <BlurView
              style={styles.blurContainer}
              blurType="light"
              blurAmount={15}
              reducedTransparencyFallbackColor="rgba(255, 255, 255, 0.6)"
            >
              <View style={styles.textWrapper}>
            <Text style={styles.subtitle}>
              Your safe space to chat{'\n'}about anything, anytime
            </Text>
              </View>
            </BlurView>
          </Animated.View>
        </View>

        {/* Content Section - Below the image */}
        <View style={styles.contentSection}>
          {/* Pagination Dots */}
          <Animated.View
            style={[
              styles.paginationContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <PaginationDots totalDots={3} activeIndex={1} />
          </Animated.View>

          {/* Google Button */}
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <GoogleButton onPress={handleGoogleSignIn} />
          </Animated.View>

          {/* Footer Text */}
          <Animated.View
            style={[
              styles.footerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.footerText}>
              By continuing, you agree to our{'\n'}
              <Text style={styles.footerLink}>Terms & Conditions</Text> and{' '}
              <Text style={styles.footerLink}>Privacy Policy</Text>.
            </Text>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: dimensions.onboarding.horizontalPadding,
  },
  titleContainer: {
    paddingTop: spacing.xl,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text.intense.neutral,
    textAlign: 'center',
  },
  heroSection: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  imageContainer: {
    width: '100%',
    height: dimensions.onboarding.imageHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  subtitleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  blurContainer: {
    width: '100%',
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  textWrapper: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    ...typography.h6,
    color: colors.text.intense.neutral,
    textAlign: 'center',
    fontWeight: '600',
    width: 296,
    height: 56,
  },
  contentSection: {
    width: '100%',
    alignItems: 'center',
  },
  paginationContainer: {
    marginBottom: spacing.xl,
    height: dimensions.onboarding.paginationHeight,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: spacing.md,
  },
  footerContainer: {
    width: '100%',
    height: dimensions.onboarding.footerHeight,
    justifyContent: 'center',
  },
  footerText: {
    ...typography.caption,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 16,
  },
  footerLink: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    color: colors.text.intense.neutral,
  },
});

