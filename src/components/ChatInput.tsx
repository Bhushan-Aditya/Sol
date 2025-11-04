import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { colors, fontFamily, fontWeight } from '../constants';

interface ChatInputProps {
  onSend?: (message: string) => void;
  onPhonePress?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, onPhonePress }) => {
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(48);
  const LINE_HEIGHT = 24;
  const MAX_LINES = 5;
  const MIN_HEIGHT = 48;
  const MAX_HEIGHT = MIN_HEIGHT + (LINE_HEIGHT * (MAX_LINES - 1));

  const handleSend = () => {
    if (message.trim()) {
      onSend?.(message.trim());
      setMessage('');
      setInputHeight(MIN_HEIGHT);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { height: inputHeight }]}
          placeholder="Talk to me"
          placeholderTextColor="#8E8E8E"
          value={message}
          onChangeText={setMessage}
          multiline
          scrollEnabled={inputHeight >= MAX_HEIGHT}
          onContentSizeChange={(event) => {
            const contentHeight = event.nativeEvent.contentSize.height;
            const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, contentHeight));
            setInputHeight(newHeight);
          }}
          textAlignVertical="top"
          returnKeyType="default"
          blurOnSubmit={false}
        />
      </View>
      <TouchableOpacity
        style={styles.phoneButton}
        onPress={onPhonePress}
        activeOpacity={0.7}
      >
        <Image
          source={require('../assets/images/phone.png')}
          style={styles.phoneIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
    backgroundColor: colors.background.chat,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    fontWeight: fontWeight.regular,
    color: colors.text.intense.neutral,
    lineHeight: 24,
  },
  phoneButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background.userMessage,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneIcon: {
    width: 24,
    height: 24,
  },
});

