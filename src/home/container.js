import { connect } from 'react-redux';
import Rewards from './Rewards';
import { refresh, getAuth, getLogout, getReward } from '../actions';

type DispatchProps = {
  refresh: () => void,
  getAuth: () => void,
  getLogout: () => void,
  getReward: () => void,
}

const mapStateToProps = (state) => {
  return {
    reward: state.reward,
    loading: state.loading,
    auth: state.auth,
    message: state.message,
  };
};

const mapDispatchToProps = (dispatch: Function): DispatchProps => {
  return {
    refresh: () => dispatch({type: 'GET_REWARDS_DATA'}),
    getAuth: async (username, password) => dispatch({
      type: 'GET_LOGIN_AUTH',
      username: username || 'jarenrowan',
      password: password || 'jr10110100',
    }),
    getLogout: () => dispatch({type: 'GET_LOGOUT'}),
    getReward: (phoneNumber, auth) => dispatch({
      type: 'GET_REWARD_DATA',
      phoneNumber: phoneNumber || '',
      auth,
    }),
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(Rewards);
export default (connected);
