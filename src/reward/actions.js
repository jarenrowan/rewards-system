import { Platform } from 'react-native';
import type { DispatchAPI } from 'redux';

const API = Platform.OS === 'android'
  ? 'http://10.0.3.2:3000' // works for Genymotion
  : 'https://rewards-system-200816.appspot.com';

// Action Types
export const REDEEM_REWARD = 'REDEEM_REWARD';
export const REDEEM_REWARD_LOADING = 'REDEEM_REWARD_LOADING';
export const REDEEM_REWARD_SUCCESSFUL = 'REDEEM_REWARD_SUCCESSFUL';
export const REDEEM_REWARD_ERROR = 'REDEEM_REWARD_ERROR';
export const ADD_REWARD = 'ADD_REWARD';
export const ADD_REWARD_LOADING = 'ADD_REWARD_LOADING';
export const ADD_REWARD_SUCCESSFUL = 'ADD_REWARD_SUCCESSFUL';
export const ADD_REWARD_ERROR = 'ADD_REWARD_ERROR';
export const CREATE_REWARD = 'CREATE_REWARD';
export const CREATE_REWARD_LOADING = 'CREATE_REWARD_LOADING';
export const CREATE_REWARD_SUCCESS = 'CREATE_REWARD_SUCCESS';
export const CREATE_REWARD_ERROR = 'CREATE_REWARD_ERROR';

export function addReward(auth, phoneNumber, drinks) {
  return async (dispatch: DispatchAPI<*>, getState: any) => {
    dispatch({type: ADD_REWARD_LOADING});
    try {
      const response = await fetch(`${API}/rewards/${phoneNumber}/${drinks}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth}`,
        },
      });
      const reward = await response.json();
      console.log(reward);
      if (!reward) {
        dispatch({
          type: ADD_REWARD_ERROR,
        });
      } else {
        dispatch({
          type: ADD_REWARD_SUCCESSFUL,
          payload: {
            reward,
          },
        });
      }
    } catch (e) {
      dispatch({
        type: ADD_REWARD_ERROR,
        e,
      });
    }
  };
}

export function redeemReward(auth, phoneNumber) {
  return async (dispatch: DispatchAPI<*>, getState: any) => {
    dispatch({type: REDEEM_REWARD_LOADING});
    try {
      const response = await fetch(`${API}/rewards/redeem/${phoneNumber}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth}`,
        },
      });
      const reward = await response.json();
      console.log(reward);
      if (!reward) {
        dispatch({
          type: REDEEM_REWARD_ERROR,
        });
      } else {
        dispatch({
          type: REDEEM_REWARD_SUCCESSFUL,
          payload: {
            reward,
          },
        });
      }
    } catch (e) {
      dispatch({
        type: REDEEM_REWARD_ERROR,
        e,
      });
    }
  };
}
