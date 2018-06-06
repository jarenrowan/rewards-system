import { combineReducers } from 'redux';
import home from './home/reducers';
import reward from './reward/reducers';

const rootReducer = combineReducers({
  home: home,
  reward: reward,
});

export default rootReducer;
