
import React, { Component } from 'react';
// import Home from './home/Rewards';
import AppNavigator from './AppNavigator';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
// import { apiMiddleware, reducer } from './redux';
import RootReducer from './Reducer';
// import { persistStore } from 'redux-persist';
// import { PersistGate } from 'redux-persist/lib/integration/react';
// import { Navigator } from 'react-native-deprecated-custom-components';
import { YellowBox } from 'react-native';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'remote-redux-devtools';
// YellowBox.ignoreWarnings(['Warning: componentWillMount']);
// YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps']);
// YellowBox.ignoreWarnings(['Warning: componentWillUpdate']);
YellowBox.ignoreWarnings(['Warning: Failed prop type']);
YellowBox.ignoreWarnings(['Module RCTImageLoader requires main queue']);
YellowBox.ignoreWarnings(['Class RCTCxxModule']);

const composeEnhancers = typeof global.jest === 'undefined' ? composeWithDevTools({
  realtime: true,
}) : compose;

// Create Redux store
const store = createStore(RootReducer,
  composeEnhancers(
    applyMiddleware(thunk),
  ));

// const persistor = persistStore(store);

export default class App extends Component {
  render() {
    return (
        <Provider store={store}>
          <AppNavigator />
        </Provider>
    );
  }
}
