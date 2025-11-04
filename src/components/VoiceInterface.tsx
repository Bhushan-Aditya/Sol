import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Waveform } from './Waveform';
import { colors } from '../constants';

interface VoiceInterfaceProps {
  onStop: () => void;
  voiceState: 'listening' | 'processing' | 'speaking' | 'idle';
  audioLevel: number;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  onStop,
  voiceState,
  audioLevel,
}) => {
  // Determine if waveform should be active based on state
  const isWaveformActive = voiceState === 'listening' || voiceState === 'speaking';

  return (
    <View style={styles.container}>
      {/* Waveform */}
      <Waveform
        audioLevel={audioLevel}
        isActive={isWaveformActive}
      />

      {/* Stop Button */}
      <TouchableOpacity
        style={styles.stopButton}
        onPress={onStop}
        activeOpacity={0.7}
      >
        <View style={styles.stopIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
    backgroundColor: colors.background.chat,
    alignItems: 'center',
    gap: 24,
  },
  stopButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8B4545',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  stopIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
});
