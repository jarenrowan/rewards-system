import {
  GET_LOGIN_AUTH,
  GET_LOGIN_AUTH_LOADING,
  GET_LOGIN_AUTH_RECEIVED,
  GET_LOGIN_AUTH_ERROR,
  GET_REWARD_DATA,
  GET_REWARD_DATA_LOADING,
  GET_REWARD_DATA_RECEIVED,
  GET_REWARD_DATA_ERROR,
  NAVIGATE_TO_REWARDS,
} from './actions';

const defaultState = {
  purcahsedDrinks: '',
  reward: '',
  loading: true,
  auth: '',
};

function home(state = defaultState, action) {
  console.log(action);
  switch (action.type) {
    case GET_REWARD_DATA_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_REWARD_DATA:
      return {
        ...state,
        loading: true,
      };
    case GET_REWARD_DATA_RECEIVED:
      return {
        ...state,
        loading: false,
        reward: action.payload.reward,
      };
    case GET_REWARD_DATA_ERROR:
      return state;
    case GET_LOGIN_AUTH:
      return {
        ...state,
        loading: true,
      };
    case GET_LOGIN_AUTH_RECEIVED:
      return {
        ...state,
        auth: action.payload.auth,
        loading: false,
      };
    case GET_LOGIN_AUTH_LOADING:
      return state;
    case GET_LOGIN_AUTH_ERROR:
      return state;
    case NAVIGATE_TO_REWARDS:
      return {
        ...state,
        auth: action.payload.auth,
        reward: action.payload.reward,
      };
    default:
      return state;
    }
}

export default home;
