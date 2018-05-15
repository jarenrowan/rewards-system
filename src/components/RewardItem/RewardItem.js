import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import moment from 'moment';

// Get screen dimensions
const { width, height } = Dimensions.get('window');
// How many posters we want to have in each row and column
const cols = 3, rows = 3;
const insertNumber = function () {
  return;
}
export default class RewardItem extends Component {
  // Component prop types
  render() {
    const { reward, reward: { phoneNumber, freeDrink, lastUpdated, drinks } } = this.props;
    const lastUpdatedMoment = moment(reward.lastUpdated).format('dddd, MMMM Do YYYY, H:mm:ss a');
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={null}>
          <Text style={styles.title} >Phone Number: {reward.phoneNumber}</Text>
          <Text style={styles.title} >Drinks Associated: {reward.drinks}</Text>
          <Text style={styles.title} >Free Drink: {reward.freeDrink}</Text>
          <Text style={styles.title} >Last Updated: {lastUpdatedMoment}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginBottom: 10,
    height: (height - 20 - 20) / rows - 10,
    width: (width - 10) / cols - 10,
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    justifyContent: 'space-between',                     // take up all available space
  },
  image: {
    borderRadius: 10,                 // rounded corners
    ...StyleSheet.absoluteFillObject, // fill up all space in a container
  },
  title: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 4,
  },
  genre: {
    color: '#BBBBBB',
    fontSize: 12,
    lineHeight: 14,
  },
});
