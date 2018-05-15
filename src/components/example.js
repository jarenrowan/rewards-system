import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

import ActivitiesCard from './ActivitiesCard';
import ThemeService from '../../core/services/Theme';
import { ActivityTypes } from '../models/Activity';
import { Badge, Loading, Icon, Text } from '../../soho';

let incrementer = 0;

export default class ActivityList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      styles: StyleSheet.create({
        container: {
          flex: 1,
        },
        emptyText: {
          fontSize: 14,
          textAlign: 'center',
          paddingBottom: 5,
        },
        emptySubText: {
          fontSize: 12,
          textAlign: 'center',
        },
        header: {
          flex: 1,
          flexDirection: 'row',
          paddingTop: 5,
          paddingBottom: 5,
        },
        subTitle: {
          fontSize: 12,
          marginRight: 5,
          marginBottom: 5,
        },
        map: {
          ...StyleSheet.absoluteFillObject,
        },
      }),
      markers: [],
    };
    this.initiateAction = this.initiateAction.bind(this);
  }
  makeCard(activity, index) {
    const {
      selectActivity,
    } = this.props;
    if (activity.type !== ActivityTypes.maps || Platform.OS === 'ios') {
      incrementer++;
      return (
        <ActivitiesCard key={`${incrementer}-card-${index}`} activity={activity} imageUrl={activity.imageUrl} onAction={this.initiateAction} select={selectActivity.bind(null, index)} />
      );
    }
    incrementer++;
    return (
      <ActivitiesCard key={`${incrementer}-card-${index}`} activity={activity} overlay={true} onAction={this.initiateAction} select={selectActivity}>
        <MapView style={this.state.styles.map} liteMode={true} region={activity.coordinates}>
          <MapView.Marker coordinate={{
            latitude: activity.coordinates.latitude,
            longitude: activity.coordinates.longitude,
          }}/>
        </MapView>
      </ActivitiesCard>
    );
  }
  async snapshotMapsForActivity(activity) {
    if (this.map && activity.type === ActivityTypes.maps && activity.coordinates) {
      this.setState(({markers}) => {
        return {
          markers: [...markers, {
            latitude: activity.coordinates.latitude,
            longitude: activity.coordinates.longitude,
          }],
        };
      });
      const uri = await this.map.takeSnapshot({
        width: 300,
        height: 300,
        region: activity.coordinates,
        format: 'png',
      });

      activity.imageUrl = uri;
    }
  }
  componentWillReceiveProps(nextprops) {
    this.updateActivitySnapshots(nextprops.activities);
  }
  componentDidMount() {
    this.updateActivitySnapshots(this.props.activities);
  }
  updateActivitySnapshots(activities) {
    if (!activities || !Platform.OS === 'ios') {
      return;
    }

    activities
      .filter((activity) => activity && activity.type === ActivityTypes.maps)
      .forEach((activity) => {
        this.snapshotMapsForActivity(activity);
      });
  }
  initiateAction(activity) {
    switch(activity.type) {
    case ActivityTypes.phone:
      this.initiateCall(activity);
      break;
    }
  }
  initiateCall(entity = {}) {
    if (this.props.initiateCall && entity.phoneNumber) {
      this.props.initiateCall(entity.phoneNumber);
    }
  }
  render() {
    const {
      activities,
      containerStyle,
      emptyIcon,
      emptyText,
      emptySubText,
      header,
      headerStyle,
      headerTextStyle,
      loading,
      showCountBadge,
    } = this.props;
    const BadgeShow = showCountBadge ? <Badge color={ThemeService.healthyColor}>{activities.length}</Badge> : null;
    const MapIOS = Platform.OS === 'ios' ? (
      <MapView initialRegion={{
        latitude: 33.5653023,
        longitude: -111.9153131,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }} ref={map => {
        this.map = map;
      }}>
        {
          this.state.markers.map((marker, i) => (
            <MapView.Marker coordinate={marker || {
              latitude: 33.5653023,
              longitude: -111.9153131,
            }} key={`marker-${i}`} />
          ))
        }
      </MapView>
    ) : null;
    return (
      <View style={[this.state.styles.container, containerStyle]}>
        {MapIOS}
        {!loading ? (
          <View>
            <View style={[this.state.styles.header, headerStyle]}>
              <Text style={[this.state.styles.subTitle, headerTextStyle]}>{header}</Text>
              {BadgeShow}
            </View>
            <View>
              {activities.length ? activities.map((activity, index) => this.makeCard(activity, index)) : (
                <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 10 }}>
                  <Icon icon={emptyIcon} color="#383838" size={64} />
                  <Text style={this.state.styles.emptyText}>{emptyText}</Text>
                  <Text style={this.state.styles.emptySubText}>{emptySubText}</Text>
                </View>
              )}
            </View>
          </View>) : (
          <Loading />
        )
        }
      </View>
    );
  }
}
