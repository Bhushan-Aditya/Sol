/**
 * Boron - React Native App
 *
 * @format
 */

import React, { useState } from 'react';
import { OnboardingContainer, ChatScreen } from './src/screens';

type Screen = 'onboarding' | 'chat';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');

  const navigateToChat = () => {
    setCurrentScreen('chat');
  };

  if (currentScreen === 'chat') {
    return <ChatScreen />;
  }

  return <OnboardingContainer onContinue={navigateToChat} />;
}

export default App;
