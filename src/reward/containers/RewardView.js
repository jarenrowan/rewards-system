import { connect } from 'react-redux';
import Reward from '../Reward';
// import { getAuth, getReward } from '../actions';

type DispatchProps = {
  // refresh: () => void,
  // getAuth: () => void,
  // getLogout: () => void,
  // getReward: () => void,
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    reward: state.home.reward,
    phoneNumber: state.home.reward.phoneNumber,
  };
};

const mapDispatchToProps = (dispatch: Function): DispatchProps => {
  return {};
  // return {
  //   refresh: () => dispatch({type: 'GET_REWARDS_DATA'}),
  //   getAuth: async (username, password) => dispatch(getAuth(
  //     username || '',
  //     password || '',
  //   )),
  //   getLogout: () => dispatch({type: 'GET_LOGOUT'}),
  //   getReward: async (auth, phoneNumber) => dispatch(getReward(auth, phoneNumber || '' )),
  // };
};

const RewardView = connect(mapStateToProps, mapDispatchToProps)(Reward);
export default (RewardView);
