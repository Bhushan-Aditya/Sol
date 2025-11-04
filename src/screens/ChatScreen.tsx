import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatInput, TypingIndicator, VoiceInterface } from '../components';
import { colors, fontFamily, fontWeight, spacing } from '../constants';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';

interface Message {
  id: string;
  text: string;
  sender: 'sol' | 'user';
  timestamp: Date;
}

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export const ChatScreen: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there, I'm SOL. You can be yourself with me — no filters needed. Want to talk about how you're feeling today?",
      sender: 'sol',
      timestamp: new Date('2024-10-12'),
    },
    {
      id: '2',
      text: "Hi there, I'm SOL. You can be yourself with me — no filters needed. Want to talk about how you're feeling today?",
      sender: 'sol',
      timestamp: new Date('2024-10-12'),
    },
    {
      id: '3',
      text: "I'm good. Feeling a bit low today",
      sender: 'user',
      timestamp: new Date('2024-10-12'),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Voice mode states
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [audioLevel, setAudioLevel] = useState(0);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  // Setup Voice and TTS listeners
  useEffect(() => {
    // Initialize Voice module
    const initVoice = async () => {
      try {
        // Voice recognition event listeners
        Voice.onSpeechStart = () => {
          console.log('Speech started');
        };

        Voice.onSpeechEnd = () => {
          console.log('Speech ended');
        };

        Voice.onSpeechResults = (e) => {
          if (e.value && e.value[0]) {
            handleTranscription(e.value[0]);
          }
        };

        Voice.onSpeechPartialResults = (e) => {
          // Update audio level based on speech detection
          if (e.value && e.value.length > 0) {
            setAudioLevel(0.7 + Math.random() * 0.3); // Simulate audio levels
            resetSilenceTimer();
          }
        };

        Voice.onSpeechError = (e) => {
          console.error('Speech error:', e);
          Alert.alert('Speech Error', 'Failed to recognize speech. Please try again.');
          setVoiceState('listening');
        };

        // TTS event listeners
        Tts.addEventListener('tts-start', () => {
          console.log('TTS started');
        });

        Tts.addEventListener('tts-finish', () => {
          console.log('TTS finished');
          handleTtsFinish();
        });

        Tts.addEventListener('tts-cancel', () => {
          console.log('TTS cancelled');
        });
      } catch (error) {
        console.error('Error initializing voice:', error);
      }
    };

    initVoice();

    return () => {
      try {
        Voice.destroy().then(Voice.removeAllListeners).catch(console.error);
        Tts.removeAllListeners('tts-start');
        Tts.removeAllListeners('tts-finish');
        Tts.removeAllListeners('tts-cancel');
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
      } catch (error) {
        console.error('Error cleaning up:', error);
      }
    };
  }, []);

  const handleSend = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    
    // Scroll to bottom after sending message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handlePhonePress = async () => {
    console.log('Phone button pressed');

    // Request microphone permission
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Microphone permission is required for voice mode.'
      );
      return;
    }

    // Toggle voice mode
    setVoiceMode(true);
    startListening();
  };

  // Request microphone permission (Android)
  const requestMicrophonePermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'Sol needs access to your microphone for voice conversations.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Permission error:', err);
        return false;
      }
    }
    return true; // iOS permissions handled in Info.plist
  };

  // Start listening for speech
  const startListening = async () => {
    try {
      setVoiceState('listening');
      setAudioLevel(0.2);

      // Check if Voice module is available
      if (!Voice || typeof Voice.start !== 'function') {
        throw new Error('Voice recognition module is not properly initialized');
      }

      await Voice.start('en-US');
      startSilenceTimer();
    } catch (error: any) {
      console.error('Error starting voice recognition:', error);

      let errorMessage = 'Voice recognition is currently unavailable on this device.';

      // Check for specific errors
      if (error.message?.includes('not properly initialized') ||
          error.message?.includes('startSpeech') ||
          error.message?.includes('null')) {
        errorMessage = 'Voice recognition service failed to initialize. This device may not support speech recognition, or the Google app needs to be updated.\n\nPlease ensure:\n- Google app is installed and updated\n- Internet connection is active\n- Microphone permission is granted';
      } else if (error.message?.includes('recognizer not present') ||
          error.message?.includes('Recognition service not available') ||
          error.code === '2' || error.code === 2) {
        errorMessage = 'Speech recognition service is not available. Please ensure:\n\n1. Google app is installed\n2. Microphone permission is granted\n3. Internet connection is active\n\nNote: This may not work on some emulators.';
      }

      Alert.alert('Voice Recognition Error', errorMessage, [
        { text: 'OK', onPress: () => stopVoiceMode() }
      ]);
    }
  };

  // Silence detection timer
  const startSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    silenceTimerRef.current = setTimeout(() => {
      handleSilenceDetected();
    }, 2500); // 2.5 seconds of silence
  };

  const resetSilenceTimer = () => {
    startSilenceTimer();
  };

  const handleSilenceDetected = async () => {
    console.log('Silence detected, stopping recording');
    try {
      await Voice.stop();
      setAudioLevel(0);
    } catch (error) {
      console.error('Error stopping voice:', error);
    }
  };

  // Handle transcription result
  const handleTranscription = (text: string) => {
    console.log('Transcription:', text);

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Transition to processing state
    setVoiceState('processing');
    setAudioLevel(0);
    setIsTyping(true);

    // Simulate AI response (backend will handle this in production)
    simulateAIResponse(text);
  };

  // Simulate AI response (placeholder for backend integration)
  const simulateAIResponse = (userText: string) => {
    setTimeout(() => {
      const aiResponse = generateMockResponse(userText);
      handleAIResponse(aiResponse);
    }, 1500); // Simulate processing time
  };

  const generateMockResponse = (userText: string): string => {
    // Simple mock responses based on keywords
    const lowerText = userText.toLowerCase();

    if (lowerText.includes('low') || lowerText.includes('sad') || lowerText.includes('down')) {
      return "I hear you. It's completely okay to feel low sometimes. Would you like to talk more about what's making you feel this way?";
    } else if (lowerText.includes('good') || lowerText.includes('great') || lowerText.includes('happy')) {
      return "That's wonderful to hear! I'm glad you're feeling good. What's been bringing you joy lately?";
    } else if (lowerText.includes('stress') || lowerText.includes('anxious') || lowerText.includes('worried')) {
      return "Stress and anxiety can be really challenging. Remember, it's okay to take things one step at a time. What's been on your mind?";
    } else {
      return "Thank you for sharing that with me. I'm here to listen and support you. Tell me more about how you're feeling.";
    }
  };

  // Handle AI response - display and speak
  const handleAIResponse = async (responseText: string) => {
    setIsTyping(false);

    // Add AI message to chat
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: responseText,
      sender: 'sol',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Transition to speaking state
    setVoiceState('speaking');

    // Start text-to-speech
    try {
      await Tts.setDefaultLanguage('en-US');
      await Tts.setDefaultRate(0.5);
      await Tts.setDefaultPitch(1.0);
      Tts.speak(responseText);

      // Simulate audio level during TTS
      simulateSpeakingAudioLevel();
    } catch (error) {
      console.error('TTS error:', error);
      // If TTS fails, still return to listening
      setTimeout(() => {
        startListening();
      }, 1000);
    }
  };

  // Simulate waveform animation during TTS
  const simulateSpeakingAudioLevel = () => {
    const interval = setInterval(() => {
      if (voiceState !== 'speaking') {
        clearInterval(interval);
        return;
      }
      setAudioLevel(0.5 + Math.random() * 0.5);
    }, 100);
  };

  // Handle TTS finish - return to listening
  const handleTtsFinish = () => {
    console.log('TTS finished, returning to listening');
    setAudioLevel(0);
    // Return to listening state
    startListening();
  };

  // Stop voice mode
  const stopVoiceMode = async () => {
    console.log('Stopping voice mode');

    try {
      // Stop voice recognition if active
      if (Voice) {
        try {
          await Voice.stop();
        } catch (e) {
          console.log('Voice.stop error:', e);
        }
        try {
          await Voice.cancel();
        } catch (e) {
          console.log('Voice.cancel error:', e);
        }
      }

      // Stop TTS if speaking
      try {
        Tts.stop();
      } catch (e) {
        console.log('TTS.stop error:', e);
      }

      // Clear silence timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      // Reset states
      setVoiceMode(false);
      setVoiceState('idle');
      setAudioLevel(0);
      setIsTyping(false);
    } catch (error) {
      console.error('Error stopping voice mode:', error);
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isSameDay = (d1: Date, d2: Date) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    if (isSameDay(date, today)) {
      return 'Today';
    } else if (isSameDay(date, yesterday)) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const renderDateSeparator = (date: Date) => {
    return (
      <View style={styles.dateSeparatorContainer}>
        <View style={styles.dateSeparatorLine} />
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{formatDate(date)}</Text>
        </View>
        <View style={styles.dateSeparatorLine} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.chat} />
      
      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sol</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/images/setting_logo.png')}
            style={styles.settingsIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Messages and Input with Keyboard Handling */}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Scrollable Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message, index) => {
            // Show date separator only before the 3rd message (index 2) - after Sol messages
            const showDate = index === 2;

            return (
              <View key={message.id}>
                {showDate && renderDateSeparator(message.timestamp)}
                <View
                  style={[
                    styles.messageBubble,
                    message.sender === 'sol'
                      ? styles.solBubble
                      : styles.userBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.sender === 'sol'
                        ? styles.solText
                        : styles.userText,
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* Fixed Input - Conditional based on voice mode */}
        {voiceMode ? (
          <VoiceInterface
            onStop={stopVoiceMode}
            voiceState={voiceState}
            audioLevel={audioLevel}
          />
        ) : (
          <ChatInput onSend={handleSend} onPhonePress={handlePhonePress} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const isSameDay = (d1: Date, d2: Date) =>
  d1.getDate() === d2.getDate() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getFullYear() === d2.getFullYear();

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.chat,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: colors.background.chat,
    position: 'relative',
  },
  keyboardView: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: fontFamily.heading,
    fontSize: 28,
    fontWeight: fontWeight.heading,
    color: colors.text.intense.neutral,
    lineHeight: 36,
  },
  settingsButton: {
    position: 'absolute',
    right: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    width: 24,
    height: 24,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  dateSeparatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  dateSeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D0D0CE',
  },
  dateBadge: {
    backgroundColor: '#E8E8E4',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginHorizontal: 12,
  },
  dateText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    fontWeight: fontWeight.regular,
    color: colors.text.intense.neutral,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  solBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.background.userMessage,
  },
  messageText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    fontWeight: fontWeight.regular,
    lineHeight: 24,
  },
  solText: {
    color: colors.text.intense.neutral,
  },
  userText: {
    color: colors.text.intense.neutral,
  },
});

