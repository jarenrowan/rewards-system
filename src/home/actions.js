import { Platform } from 'react-native';
import type { DispatchAPI } from 'redux';

const API = Platform.OS === 'android'
  ? 'http://10.0.3.2:3000' // works for Genymotion
  : 'https://rewards-system-200816.appspot.com';

// Action Types
export const GET_LOGIN_AUTH = 'GET_LOGIN_AUTH';
export const GET_LOGIN_AUTH_LOADING = 'GET_LOGIN_AUTH_LOADING';
export const GET_LOGIN_AUTH_RECEIVED = 'GET_LOGIN_AUTH_RECEIVED';
export const GET_LOGIN_AUTH_ERROR = 'GET_LOGIN_AUTH_ERROR';
export const GET_REWARD_DATA = 'GET_REWARD_DATA';
export const GET_REWARD_DATA_LOADING = 'GET_REWARD_DATA_LOADING';
export const GET_REWARD_DATA_RECEIVED = 'GET_REWARD_DATA_RECEIVED';
export const GET_REWARD_DATA_ERROR = 'GET_REWARD_DATA_ERROR';
export const NAVIGATE_TO_REWARDS = 'NAVIGATE_TO_REWARDS';

export function getReward(auth, phoneNumber) {
  return async (dispatch: DispatchAPI<*>, getState: any) => {
    // Dispatch GET_REWARD_DATA_LOADING to update loading state
    dispatch({type: GET_REWARD_DATA_LOADING});
    // Make API call and dispatch appropriate actions when done
    try {
      const response = await fetch(`${API}/rewards/${phoneNumber}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth}`,
        },
      });
      const data = await response.json();
      let reward = data && data.reward;
      if (!reward) {
        reward = {
          freeDrink: 0,
          phoneNumber,
          drinks: 0,
        };
      }
      dispatch({
        type: GET_REWARD_DATA_RECEIVED,
        payload: {
          reward,
        },
      });
    } catch (e) {
      dispatch({
        type: GET_REWARD_DATA_ERROR,
        e,
      });
    }
  };
}

export function getAuth(username, password) {
  return async (dispatch: DispatchAPI<*>, getState: any) => {
    // Dispatch GET_LOGIN_AUTH_LOADING to update loading state
    dispatch({type: GET_LOGIN_AUTH_LOADING});
    // Make API call and dispatch appropriate actions when done
    const body = {
      'grant_type': 'password',
      'client_id': 'application',
      'client_secret': 'secret',
      'username': username,
      'password': password,
    };
    let formBody = [];
    for (var property in body) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(body[property]);
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
      const data = await response.json();
      await dispatch({
        type: GET_LOGIN_AUTH_RECEIVED,
        payload: {
          auth: data && data.access_token,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
}

export function navigateToReward(auth, reward) {
  return (dispatch) => {
    dispatch({ type: NAVIGATE_TO_REWARDS, payload: { auth, reward } });
  };
}
