import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Fonts from 'expo-font'
import AppLoading from 'expo-app-loading'
import Navigator from './navigation'
import store from './store'
import { Provider } from 'react-redux'


const getFonts = () => Fonts.loadAsync({
  'Poppins-Black': require('./assets/fonts/Poppins-Black.ttf'),
  'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
  'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
});

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  if (fontsLoaded) {
    return (
      <Provider store={store}>
        <Navigator />
      </Provider>
    );
  }
  else {
    return (
      <AppLoading
        startAsync={getFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={console.warn}
      />
    );
  }
}

