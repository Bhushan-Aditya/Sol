import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculate responsive dimensions based on screen width
const HORIZONTAL_PADDING = 16;
const CONTENT_WIDTH = SCREEN_WIDTH - (HORIZONTAL_PADDING * 2);
const IMAGE_ASPECT_RATIO = 475 / 360; // height / width from Figma
const IMAGE_WIDTH = CONTENT_WIDTH;
const IMAGE_HEIGHT = IMAGE_WIDTH * IMAGE_ASPECT_RATIO;

export const dimensions = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  
  // Onboarding specific - responsive width, calculated height
  onboarding: {
    imageWidth: IMAGE_WIDTH,
    imageHeight: IMAGE_HEIGHT,
    contentWidth: CONTENT_WIDTH,
    subtitleWidth: CONTENT_WIDTH,
    subtitleHeight: 56,
    buttonHeight: 48,
    footerWidth: CONTENT_WIDTH,
    footerHeight: 32,
    paginationHeight: 16,
    horizontalPadding: HORIZONTAL_PADDING,
  },
} as const;

