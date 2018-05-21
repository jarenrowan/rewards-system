
import React, { Component } from 'react';
import Home from './home/Rewards';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { apiMiddleware, reducer } from './redux';
import { Navigator } from 'react-native-deprecated-custom-components';
import { YellowBox } from 'react-native';
// YellowBox.ignoreWarnings(['Warning: componentWillMount']);
// YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps']);
// YellowBox.ignoreWarnings(['Warning: componentWillUpdate']);
YellowBox.ignoreWarnings(['Warning: Failed prop type']);
YellowBox.ignoreWarnings(['Module RCTImageLoader requires main queue']);
YellowBox.ignoreWarnings(['Class RCTCxxModule']);

// Create Redux store
const store = createStore(reducer, {}, applyMiddleware(apiMiddleware));

// Fetch reward data
// store.dispatch({type: 'GET_REWARD_DATA'});

const RouteMapper = (route, navigator) => {
  return (
    <Home navigator={navigator} store={store}/>
  );
};

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigator
         // Default to rewards route
         initialRoute={{ name: 'rewards' }}
         // Use FloatFromBottom transition between screens
         configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromBottom}
         // Pass a route mapper functions
         renderScene={RouteMapper}
         />
      </Provider>
    );
  }
}
