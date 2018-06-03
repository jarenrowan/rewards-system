import { connect } from 'react-redux';
import Home from '../Home';
import { getAuth, getReward, navigateToReward } from '../actions';

type DispatchProps = {
  getAuth: () => void,
  getLogout: () => void,
  getReward: () => void,
  navigateToReward: () => void,
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
    getAuth: async (username, password) => dispatch(getAuth(
      username || '',
      password || '',
    )),
    getLogout: () => dispatch({type: 'GET_LOGOUT'}),
    getReward: async (auth, phoneNumber) => dispatch(getReward(auth, phoneNumber || '' )),
    navigateToReward: async () => dispatch(navigateToReward()),
  };
};

const HomeView = connect(mapStateToProps, mapDispatchToProps)(Home);
export default (HomeView);
