import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PrivacyScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate from bottom to top with fade in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset position when hidden
      slideAnim.setValue(SCREEN_HEIGHT);
      opacityAnim.setValue(0);
    }
  }, [visible, slideAnim, opacityAnim]);

  const handleClose = () => {
    // Animate back down with fade out before closing
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <View style={styles.content}>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                activeOpacity={0.7}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <View style={styles.closeIcon}>
                  <View style={styles.closeIconLine1} />
                  <View style={styles.closeIconLine2} />
                </View>
              </TouchableOpacity>

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Privacy Policy</Text>
                <Text style={styles.subtitle}>
                  Friendly AI, serious privacy – tiny print, big care
                </Text>
              </View>

              {/* Scrollable Content */}
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                bounces={true}
              >
                <View style={styles.contentBlock}>
                  <Text style={styles.sectionTitle}>Introduction</Text>
                  <Text style={styles.paragraph}>
                    These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, Webiste Name accessible at Website.com.
                    {'\n\n'}
                    These Terms will be applied fully and affect to your use of this Website. By using this Website, you agreed to accept all terms and conditions written in here. You must not use this Website if you disagree with any of these Website Standard Terms and Conditions.
                    {'\n\n'}
                    Minors or people below 18 years old are not allowed to use this Website.
                    {'\n\n'}
                  </Text>

                  <Text style={styles.sectionTitle}>Intellectual Property Rights</Text>
                  <Text style={styles.paragraph}>
                    Other than the content you own, under these Terms, Company Name and/or its licensors own all the intellectual property rights and materials contained in this Website.
                    {'\n\n'}
                    You are granted limited license only for purposes of viewing the material contained on this Website.
                    {'\n\n'}
                  </Text>

                  <Text style={styles.sectionTitle}>Restrictions</Text>
                  <Text style={styles.paragraph}>
                    You are specifically restricted from all of the following:
                    {'\n\n'}
                    • publishing any Website material in any other media;
                    {'\n'}
                    • selling, sublicensing and/or otherwise commercializing any Website material;
                    {'\n'}
                    • publicly performing and/or showing any Website material;
                    {'\n'}
                    • using this Website in any way that is or may be damaging to this Website;
                    {'\n'}
                    • using this Website in any way that impacts user access to this Website;
                    {'\n'}
                    • using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity;
                    {'\n'}
                    • engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website;
                    {'\n'}
                    • using this Website to engage in any advertising or marketing.
                    {'\n\n'}
                    Certain areas of this Website are restricted from being access by you and Company Name may further restrict access by you to any areas of this Website, at any time, in absolute discretion. Any user ID and password you may have for this Website are confidential and you must maintain confidentiality as well.
                    {'\n\n'}
                  </Text>

                  <Text style={styles.sectionTitle}>Your Content</Text>
                  <Text style={styles.paragraph}>
                    In these Website Standard Terms and Conditions, "Your Content" shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Company Name a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.
                    {'\n\n'}
                    Your Content must be your own and must not be invading any third-party's rights. Company Name reserves the right to remove any of Your Content from this Website at any time without notice.
                    {'\n\n'}
                  </Text>

                  <Text style={styles.sectionTitle}>No warranties</Text>
                  <Text style={styles.paragraph}>
                    This Website is provided "as is," with all faults, and Company Name express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.
                    {'\n\n'}
                  </Text>

                  <Text style={styles.sectionTitle}>Limitation of liability</Text>
                  <Text style={styles.paragraph}>
                    In no event shall Company Name, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Company Name, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
                    {'\n\n'}
                  </Text>

                  <Text style={styles.sectionTitle}>Indemnification</Text>
                  <Text style={styles.paragraph}>
                    You hereby indemnify to the fullest extent Company Name from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.
                    {'\n\n'}
                  </Text>

                  <Text style={styles.sectionTitle}>Severability</Text>
                  <Text style={styles.paragraph}>
                    If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.
                    {'\n\n'}
                  </Text>

                  <Text style={styles.sectionTitle}>Variation of Terms</Text>
                  <Text style={styles.paragraph}>
                    Company Name is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.
                    {'\n\n'}
                  </Text>

                  <Text style={styles.sectionTitle}>Assignment</Text>
                  <Text style={styles.paragraph}>
                    The Company Name is allowed to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.
                    {'\n\n'}
                  </Text>

                  <Text style={styles.sectionTitle}>Entire Agreement</Text>
                  <Text style={styles.paragraph}>
                    These Terms constitute the entire agreement between Company Name and you in relation to your use of this Website, and supersede all prior agreements and understandings.
                  </Text>
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  closeButton: {
    alignSelf: 'flex-start',
    padding: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  closeIcon: {
    width: 24,
    height: 24,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIconLine1: {
    position: 'absolute',
    width: 20,
    height: 2,
    backgroundColor: colors.text.intense.neutral,
    transform: [{ rotate: '45deg' }],
  },
  closeIconLine2: {
    position: 'absolute',
    width: 20,
    height: 2,
    backgroundColor: colors.text.intense.neutral,
    transform: [{ rotate: '-45deg' }],
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: 'AlbertSans-SemiBold',
    fontSize: 32,
    fontWeight: '600',
    color: colors.text.intense.neutral,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: 'AlbertSans-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.intense.neutral,
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  contentBlock: {
    backgroundColor: '#FAFAF8',
    padding: spacing.lg,
    borderRadius: 12,
  },
  sectionTitle: {
    fontFamily: 'AlbertSans-SemiBold',
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.intense.neutral,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  paragraph: {
    fontFamily: 'AlbertSans-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.intense.neutral,
    lineHeight: 22,
  },
});

