import { Platform } from 'react-native';
import type { DispatchAPI } from 'redux';
import { home } from './reducers';

const API = Platform.OS === 'android'
  ? 'http://10.0.3.2:3000' // works for Genymotion
  : 'http://127.0.0.1:3000';

export const actions = store => next => async action => {
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

export function getAuth(username, password) {
  return async (dispatch: DispatchAPI<*>, getState: any) => {
    // Dispatch LOGIN_AUTH_LOADING to update loading state
    dispatch({type: 'LOGIN_AUTH_LOADING'});
    // Make API call and dispatch appropriate actions when done
    const data = {
      'grant_type': 'password',
      'client_id': 'application',
      'client_secret': 'secret',
      'username': username,
      'password': password,
    };
    let formBody = [];
    for (var property in data) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    try {
      const response = await fetch(`${API}/authorization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody,
      });
      const auth = await response.json();
      console.log(auth);
      dispatch(authSuccess(auth && auth.access_token));
    } catch (e) {
      console.log(e);
    }
  };
}

function authSuccess(auth) {
  return {
    type: 'LOGIN_AUTH_RECEIVED',
    payload: {
      auth,
    },
  };
}
