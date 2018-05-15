import moment from 'moment';
import DataService from './services/SData';

// Action Types
export const ACTIVITIES_GET = 'ACTIVITIES_GET';
export const ACTIVITIES_GET_FAILED = 'ACTIVITIES_GET_FAILED';
export const ACTIVITIES_GET_SUCCESS = 'ACTIVITIES_GET_SUCCESS';
export const ACTIVITIES_SET = 'ACTIVITIES_SET';
export const ACTIVITY_COMPLETE = 'ACTIVITY_COMPLETE';
export const ACTIVITY_COMPLETE_SUCCESS = 'ACTIVITY_COMPLETE_SUCCESS';
export const ACTIVITY_GET = 'ACTIVITY_GET';
export const ACTIVITY_GET_SUCCESS = 'ACTIVITY_GET_SUCCESS';
export const ACTIVITY_SELECT = 'ACTIVITY_SELECT';
export const ACTIVITY_RELATED_SELECT = 'ACTIVITY_RELATED_SELECT';

/*

See: https://github.com/acdlite/flux-standard-action

An action MUST
+ be a plain JavaScript object.
+ have a type property.

 An action MAY
+ have an error property.
+ have a payload property.
+ have a meta property.

An action MUST NOT
+ include properties other than type, payload, error, and meta.
*/
function fetchActivities() {
  return {
    type: ACTIVITIES_GET,
  };
}

function fetchActivitiesSuccess() {
  return {
    type: ACTIVITIES_GET_SUCCESS,
  };
}

function fetchActivitiesFailed(reason) {
  return {
    type: ACTIVITIES_GET_FAILED,
    payload: {
      reason,
    },
  };
}

export function fetchTodaysActivities() {
  return async (dispatch, getState) => {
    const { auth: { endpoint, token, userInfo: { __id__ } }} = getState();
    dispatch(fetchActivities());
    try {
      const service = new DataService(endpoint, token);
      const activities =
        await Promise.all([
          service.getActivities(__id__),
          service.getCompletedActivities(__id__),
          service.getUnscheduledActivities(__id__),
        ]);
      dispatch(fetchActivitiesSuccess());
      dispatch(setActivities(activities));
      return activities;
    } catch (e) {
      dispatch(fetchActivitiesFailed(e));
    }
  };
}

export function setActivities(activities) {
  return {
    type: ACTIVITIES_SET,
    payload: {
      activities,
    },
  };
}

export function completeActivity(activity) {
  // TODO: Refactor this 100 line fn
  return async (dispatch, getState) => {
    dispatch({
      type: ACTIVITY_COMPLETE,
      payload: {
        activity,
      },
    });

    const {
      dashboard: {
        scheduled_activities,
        completed_activities,
        unscheduled_activities,
      },
    } = getState();

    const isScheduled = !!scheduled_activities.find((toFind, index) => {
      if (toFind.__id__ === activity.__id__) {
        scheduled_activities.splice(index, 1);
        return toFind;
      }
    });
    // Optimization, don't bother finding if it was in the prior array
    if (!isScheduled) {
      unscheduled_activities.find((toFind, index) =>  {
        if (toFind.__id__ === activity.__id__) {
          unscheduled_activities.splice(index, 1);
          return toFind;
        }
      });
    }

    // Is in limbo...
    activity.__insync__ = false;

    completed_activities.push(activity);

    const activities = [
      [...scheduled_activities],
      [...completed_activities.sort((a, b) => {
        const a_wrapped = moment(a.completeDate);
        const b_wrapped = moment(b.completeDate);
        if (a_wrapped.isBefore(b_wrapped)) {
          return 1;
        }
        if (a_wrapped.isAfter(b_wrapped)) {
          return -1;
        }
        return 0;
      })],
      [...unscheduled_activities],
    ];

    dispatch(setActivities(activities));

    const { auth: { endpoint, token }} = getState();
    const service = new DataService(endpoint, token);
    const completedResponse = await service.completeActivity(activity);

    dispatch({
      type: ACTIVITY_COMPLETE_SUCCESS,
      payload: {
        activity,
        response: completedResponse,
      },
    });

    const { HistoryId } = completedResponse;

    dispatch({
      type: ACTIVITY_GET,
    });
    const activityEntity = await service.getCompletedActivity(HistoryId);
    dispatch({
      type: ACTIVITY_GET_SUCCESS,
      payload: {
        activity: activityEntity,
      },
    });

    // Want to re-fetch state as it may have changed
    const {
      dashboard: {
        scheduled_activities: refreshed_scheduled,
        completed_activities: refreshed_completed,
        unscheduled_activities: refreshed_unscheduled,
      },
    } = getState();

    refreshed_completed.find((toFind, index) => {
      if (toFind.__id__ === activity.__id__) {
        refreshed_completed.splice(index, 1, activityEntity);
        return toFind;
      }
    });

    const allActivities = [
      [...refreshed_scheduled],
      [...refreshed_completed],
      [...refreshed_unscheduled],
    ];
    dispatch(setActivities(allActivities));
  };
}

export function activitySelect(selected_activity, selected_activity_index, selected_activity_array) {
  return {
    type: ACTIVITY_SELECT,
    payload: {
      selected_activity,
      selected_activity_array,
      selected_activity_index,
    },
  };
}

export function activityRelatedSelect(related_activities) {
  return {
    type: ACTIVITY_RELATED_SELECT,
    payload: {
      related_activities,
    },
  };
}
