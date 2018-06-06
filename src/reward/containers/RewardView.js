import { connect } from 'react-redux';
import Reward from '../Reward';
import { addReward, redeemReward } from '../actions';

type DispatchProps = {
  addReward: () => void,
  redeemReward: () => void,
}

const mapStateToProps = (state) => {
  let reward = state.reward && state.reward.reward;
  if (isEmpty(reward)) {
    reward = state.home && state.home.reward;
  }
  return {
    reward,
    phoneNumber: state.home.reward.phoneNumber,
    auth: state.home.auth,
  };
};

function isEmpty(myObject) {
    for (var key in myObject) {
        if (myObject.hasOwnProperty(key)) {
            return false;
        }
    }

    return true;
}

const mapDispatchToProps = (dispatch: Function): DispatchProps => {
  return {
    addReward: async (auth, phoneNumber, drinks) => dispatch(addReward(auth, phoneNumber, drinks)),
    redeemReward: async (auth, phoneNumber) => dispatch(redeemReward(auth, phoneNumber)),
  };
};

const RewardView = connect(mapStateToProps, mapDispatchToProps)(Reward);
export default (RewardView);
