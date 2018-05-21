import { connect } from 'react-redux';
import Home from '../Rewards';
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
    getAuth: async (username, password) => dispatch(getAuth(
      username || 'jarenrowan',
      password || 'jr10110100',
    )),
    getLogout: () => dispatch({type: 'GET_LOGOUT'}),
    getReward: (phoneNumber, auth) => dispatch({
      type: 'GET_REWARD_DATA',
      phoneNumber: phoneNumber || '',
      auth,
    }),
  };
};

const HomeView = connect(mapStateToProps, mapDispatchToProps)(Home);
export default (HomeView);
