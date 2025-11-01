import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { GoogleButton, PaginationDots } from '../components';
import { colors, typography, spacing, dimensions, fontWeight } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingScreen1Props {
  isActive?: boolean;
}

export const OnboardingScreen1: React.FC<OnboardingScreen1Props> = ({ isActive = true }) => {
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
              source={require('../assets/images/onboarding_1.png')}
              style={styles.image}
            />
          </Animated.View>

          {/* Subtitle - overlapping the image with gradient fade */}
          <View style={styles.subtitleContainer}>
            <LinearGradient
              colors={['#F5F5F0', '#F5F5F0', 'rgba(245, 245, 240, 0.6)', 'transparent']}
              locations={[0, 0.4, 0.7, 1]}
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
              style={styles.gradientFadeWrapper}
            >
              <View style={styles.textWrapper}>
                <Animated.Text
                  style={[
                    styles.subtitle,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateY: slideAnim }],
                    },
                  ]}
                >
                  Completely personal,{'\n'}private & trustworthy
                </Animated.Text>
              </View>
            </LinearGradient>
          </View>
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
            <PaginationDots totalDots={3} activeIndex={0} />
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
    height: 160,
    justifyContent: 'flex-end',
  },
  gradientFadeWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    paddingBottom: spacing.lg,
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
    fontWeight: fontWeight.heading,
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

