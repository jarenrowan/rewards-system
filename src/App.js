
import React, { Component } from 'react';
import AppNavigator from './AppNavigator';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './Reducer';
import { YellowBox } from 'react-native';
import thunk from 'redux-thunk';

YellowBox.ignoreWarnings(['Warning: componentWillMount']);
YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps']);
YellowBox.ignoreWarnings(['Warning: componentWillUpdate']);
YellowBox.ignoreWarnings(['Warning: Failed prop type']);
YellowBox.ignoreWarnings(['Module RCTImageLoader requires main queue']);
YellowBox.ignoreWarnings(['Class RCTCxxModule']);

// Create Redux store
const store = createStore(rootReducer, applyMiddleware(thunk));

export default class App extends Component {
  render() {
    return (
        <Provider store={store}>
          <AppNavigator />
        </Provider>
    );
  }
}
