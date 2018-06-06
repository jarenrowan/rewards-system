import {
  REDEEM_REWARD,
  REDEEM_REWARD_LOADING,
  REDEEM_REWARD_SUCCESSFUL,
  REDEEM_REWARD_ERROR,
  ADD_REWARD,
  ADD_REWARD_LOADING,
  ADD_REWARD_SUCCESSFUL,
  ADD_REWARD_ERROR,
  CREATE_REWARD,
  CREATE_REWARD_LOADING,
  CREATE_REWARD_SUCCESS,
  CREATE_REWARD_ERROR,
} from './actions';

const defaultState = {
  purcahsedDrinks: '',
  reward: '',
  loading: true,
  auth: '',
};

function reward(state = defaultState, action) {
  console.log(action);
  if (!action){
    return state;
  }
  switch (action.type) {
    case REDEEM_REWARD:
      return {
        ...state,
        loading: false,
      };
    case REDEEM_REWARD_LOADING:
      return {
        ...state,
        loading: true,
      };
    case REDEEM_REWARD_SUCCESSFUL:
      return {
        ...state,
        loading: false,
        reward: action.payload.reward,
      };
    case REDEEM_REWARD_ERROR:
      return state;
    case ADD_REWARD:
      return state;
    case ADD_REWARD_LOADING:
      return {
        ...state,
        loading: true,
      };
    case ADD_REWARD_SUCCESSFUL:
      return {
        ...state,
        loading: false,
        reward: action.payload.reward,
      };
    case ADD_REWARD_ERROR:
      return {
        ...state,
        loading: false,
      };
    case CREATE_REWARD:
      return {
        ...state,
        loading: false,
        reward: action.payload.reward,
      };
    case CREATE_REWARD_LOADING:
      return state;
    case CREATE_REWARD_SUCCESS:
      return state;
    case CREATE_REWARD_ERROR:
      return state;
    default:
      return state;
    }
}

export default reward;
