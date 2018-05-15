import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { Linking } from 'react-native';

import {
  initiateAsyncAction,
  INITIATE_CALL,
  INITIATE_DIRECTIONS,
  INITIATE_DIRECTIONS_WITH_ADDRESS,
  INITIATE_EMAIL,
  INITIATE_TEXTSMS,
} from '../../core/actions';

import {
  completeActivity,
} from '../actions';

import Detail from '../components/Detail';

const mapStateToProps = ({ core }) => {
  return {
    activity: core.selected_activity,
    resultList: core.picklists.find(picklist => picklist.for === core.selected_activity.type && picklist.property === 'result'),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => { // eslint-disable-line
  return {
    call: (...args) => {
      const activity = args[0];
      dispatch(initiateAsyncAction(INITIATE_CALL, activity.phoneNumber));
    },
    completed: (activity) => {
      dispatch(completeActivity(activity));
      if (activity.followup) {
        dispatch(NavigationActions.navigate({
          routeName: 'ActivityEdit',
        }));
      }
    },
    directions: (...args) => {
      const activity = args[0];
      // Use whichever depending on the data available to the activity
      // may need to refine, currently use most precise based on coordinates first
      if (activity.coordinates) {
        dispatch(initiateAsyncAction(INITIATE_DIRECTIONS, activity.coordinates));
      } else if (activity.address) {
        dispatch(initiateAsyncAction(INITIATE_DIRECTIONS_WITH_ADDRESS, activity.address));
      }
    },
    email: (...args) => {
      const activity = args[0];
      dispatch(initiateAsyncAction(INITIATE_EMAIL, activity.email));
    },
    note: () => {
      dispatch(NavigationActions.navigate({
        routeName: 'NoteInsert',
      }));
    },
    textsms: (...args) => {
      const activity = args[0];
      dispatch(initiateAsyncAction(INITIATE_TEXTSMS, activity.phoneNumber));
    },
    textlate: (number) => {
      // TODO: Configurable message
      Linking.openURL(`sms:${number}&body=I am running a little bit late for the meeting! I will be there as soon as possible.`);
    },
  };
};

const ActivityDetail = connect(
  mapStateToProps,
  mapDispatchToProps
)(Detail);

export default ActivityDetail;
