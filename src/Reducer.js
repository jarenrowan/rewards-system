import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // AsyncStorage
import home from './home/reducers';

const persistConfig = {
  debug: __DEV__,
  key: 'primary',
  blacklist: ['nav'],
  storage,
};

export default persistCombineReducers(persistConfig, {
  home,
});
