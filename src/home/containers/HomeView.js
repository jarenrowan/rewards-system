import { connect } from 'react-redux';
import Home from '../Home';
import { getAuth, getReward } from '../actions';

type DispatchProps = {
  refresh: () => void,
  getAuth: () => void,
  getLogout: () => void,
  getReward: () => void,
}

const mapStateToProps = (state) => {
  return {
    reward: state.home.reward,
    loading: state.home.loading,
    auth: state.home.auth,
    message: state.home.message,
  };
};

const mapDispatchToProps = (dispatch: Function): DispatchProps => {
  return {
    refresh: () => dispatch({type: 'GET_REWARDS_DATA'}),
    getAuth: async (username, password) => dispatch(getAuth(
      username || '',
      password || '',
    )),
    getLogout: () => dispatch({type: 'GET_LOGOUT'}),
    getReward: async (auth, phoneNumber) => dispatch(getReward(auth, phoneNumber || '' )),
  };
};

const HomeView = connect(mapStateToProps, mapDispatchToProps)(Home);
export default (HomeView);
