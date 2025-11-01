import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StatusBar,
  Image,
  Animated,
  Easing,
  Linking,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { GoogleButton, PaginationDots } from '../components';
import { colors, typography, spacing, dimensions, fontWeight } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  image: any;
  subtitle: string;
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    image: require('../assets/images/onboarding_1.png'),
    subtitle: 'Completely personal,\nprivate & trustworthy',
  },
  {
    id: '2',
    image: require('../assets/images/onboarding_2.png'),
    subtitle: 'Your safe space to chat\nabout anything, anytime',
  },
  {
    id: '3',
    image: require('../assets/images/onboarding_3.png'),
    subtitle: 'Evolves with each\nconversation',
  },
];

export const OnboardingContainer: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    if (index !== activeIndex && index >= 0 && index < ONBOARDING_SLIDES.length) {
      setActiveIndex(index);
      // Smooth fade animation for text transition
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  const handleGoogleSignIn = async () => {
    const googleLoginUrl = 'https://accounts.google.com/signin';
    try {
      console.log('Opening Google login URL:', googleLoginUrl);
      if (await Linking.canOpenURL(googleLoginUrl)) {
        await Linking.openURL(googleLoginUrl);
        console.log('Successfully opened Google login');
      } else {
        console.warn('Cannot open Google login URL, trying direct open');
        await Linking.openURL(googleLoginUrl);
      }
    } catch (error: any) {
      console.error('Error opening Google login:', error);
      // Direct fallback attempt
      Linking.openURL(googleLoginUrl).catch((fallbackError) => {
        console.error('Direct open also failed:', fallbackError);
      });
    }
  };

  const renderImageItem = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={styles.imageSlide}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
          {/* Static Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Hi, I'm Sol</Text>
          </View>

          {/* Image Carousel with Overlay */}
          <View style={styles.heroSection}>
        <FlatList
          ref={flatListRef}
              data={ONBOARDING_SLIDES}
              renderItem={renderImageItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          bounces={false}
          decelerationRate="fast"
              snapToInterval={SCREEN_WIDTH - dimensions.onboarding.horizontalPadding * 2}
          snapToAlignment="center"
        />

            {/* Subtitle Overlay with Gradient Fade - only in lower section */}
            <View style={styles.subtitleContainer}>
              {/* Gradient fade - fades from background color at bottom to transparent at top */}
              <LinearGradient
                colors={['#F5F5F0', '#F5F5F0', 'rgba(245, 245, 240, 0.6)', 'transparent']}
                locations={[0, 0.4, 0.7, 1]}
                start={{ x: 0.5, y: 1 }}
                end={{ x: 0.5, y: 0 }}
                style={styles.gradientFadeWrapper}
              >
                <View style={styles.textWrapper}>
                  <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
                    {ONBOARDING_SLIDES[activeIndex].subtitle}
                  </Animated.Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Static Content Section */}
          <View style={styles.contentSection}>
            {/* Pagination Dots */}
            <View style={styles.paginationContainer}>
              <PaginationDots totalDots={3} activeIndex={activeIndex} />
            </View>

            {/* Google Button */}
            <View style={styles.buttonContainer}>
              <GoogleButton onPress={handleGoogleSignIn} />
            </View>

            {/* Footer Text */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                By continuing, you agree to our{'\n'}
                <Text style={styles.footerLink}>Terms & Conditions</Text> and{' '}
                <Text style={styles.footerLink}>Privacy Policy</Text>.
              </Text>
            </View>
          </View>
      </View>
      </SafeAreaView>
    </SafeAreaProvider>
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
  imageSlide: {
    width: SCREEN_WIDTH - dimensions.onboarding.horizontalPadding * 2,
    height: dimensions.onboarding.imageHeight,
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
    marginBottom: spacing.lg,
  },
  footerContainer: {
    width: '100%',
    minHeight: dimensions.onboarding.footerHeight,
    justifyContent: 'center',
    paddingBottom: spacing.lg,
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

