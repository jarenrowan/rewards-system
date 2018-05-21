function home(state = { reward: {}, loading: true, auth: '' }, action) {
  switch (action.type) {
    case 'GET_REWARDS_DATA_LOADING':
      return {
        ...state,
        loading: true,
      };
    case 'GET_REWARD_DATA_RECEIVED':
      return {
        loading: false,
        reward: action.data.reward,
      };
    case 'GET_REWARD_DATA_ERROR':
      return state;
    case 'GET_LOGIN_AUTH':
      return {
        ...state,
        loading: true,
      };
    case 'LOGIN_AUTH_RECEIVED':
      return {
        auth: action.auth.access_token,
        loading: false,
      };
    case 'LOGIN_AUTH_ERROR':
      return state;
    case 'GET_LOGOUT':
      return {
        ...state,
        loading: true,
      };
    case 'LOGOUT_RECEIVED':
      return {
        auth: action.data.auth,
        message: action.data.message,
        loading: false,
      };
    case 'LOGIN_ERROR':
      return state;
    default:
      return state;
    }
}

export default home;
