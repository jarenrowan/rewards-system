import { Platform } from 'react-native';

const API = Platform.OS === 'android'
  ? 'http://10.0.3.2:3000' // works for Genymotion
  : 'http://127.0.0.1:3000';

export const apiMiddleware = store => next => async action => {
  // Pass all actions through by default
  next(action);
  switch (action.type) {
    // In case we receive an action to send an API request
    case 'GET_REWARD_DATA':
      // Dispatch GET_REWARD_DATA_LOADING to update loading state
      store.dispatch({type: 'GET_REWARD_DATA_LOADING'});
      // Make API call and dispatch appropriate actions when done
      await fetch(`${API}/rewards/${action.phoneNumber}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + action.auth,
        },
      })
        .then(response => response.json())
        .then(data => next({
          type: 'GET_REWARD_DATA_RECEIVED',
          data,
        }))
        .catch(error => next({
          type: 'GET_REWARD_DATA_ERROR',
          error,
        }));
      break;
    // Do nothing if the action does not interest us
    case 'GET_LOGIN_AUTH':
      // Dispatch LOGIN_AUTH_LOADING to update loading state
      store.dispatch({type: 'LOGIN_AUTH_LOADING'});
      // Make API call and dispatch appropriate actions when done
      const data = {
        'grant_type': 'password',
        'client_id': 'application',
        'client_secret': 'secret',
        'username': action.username,
        'password': action.password,
      };
      let formBody = [];
      for (var property in data) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      await fetch(`${API}/authorization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody,
      })
        .then(response => response.json())
        .then(() => next({
          type: 'LOGIN_AUTH_RECEIVED',
          data,
        }))
        .catch(error => next({
          type: 'LOGIN_AUTH_ERROR',
          error,
        }));
      break;
    default:
      break;
  }
};

export const reducer = (state = { reward: {}, loading: true, auth: '' }, action) => {
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
        auth: action.data.access_token,
        message: action.data.message,
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
};
