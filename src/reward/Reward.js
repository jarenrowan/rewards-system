import type { RewardView } from './containers/RewardView';
import React from 'react';
import {
  View,
  Text,
  Image,
  Button,
} from 'react-native';
import styles from '../config/styles';
import * as Animatable from 'react-native-animatable';
import QRCodeScanner from 'react-native-qrcode-scanner';


class Reward extends React.Component<RewardView> {
  constructor(props) {
    super(props);
    this.state = {
      auth: this.props.auth || false,
      loading: false,
      phoneNumber: props.reward && props.reward.phoneNumber || '',
      reward: props.reward || false,
    };
    this.onCancel = this.onCancel.bind(this);
    this.onRead = this.onRead.bind(this);
  }

  createRewards(drinks) {
    const drinkImages = [];
    let drinksLeft = drinks;
    for (let x = 0; x < 10; x++) {
      if (drinksLeft) {
        drinkImages.push(<Image key={x} style={styles.rewardCupImage} source={require('../../resources/images/markedDrink.png')}/>);
        drinksLeft--;
      } else {
        drinkImages.push(<Image key={x} style={styles.rewardCupImage} source={require('../../resources/images/unmarkedDrink.png')}/>);
      }
    }
    return drinkImages;
  }

  onCancel() {
    this.props.navigation.navigate('Home');
  }
  onRead(qr) {
    console.log(qr);
    this.props.navigation.navigate('Home');
  }
  render() {
    const {
      reward,
    } = this.state;
    const drinks = reward && reward.drinks;
    const freeDrink = reward && reward.freeDrink;
    return (
      <Animatable.View
      animation="fadeInRightBig"
      duration={300}
      style={{
        paddingTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
        flex: 1,
        backgroundColor: 'white',
      }}
      >
        {this.createRewards(drinks)}
        <View style={{
          flexWrap: 'nowrap',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        {
          freeDrink ?
          <Text style={styles.rewardDisplayText}>You have a free drink!</Text>
          :
          <Text style={styles.rewardDisplayText}>You are {(drinks - 10)} drinks away from a free drink</Text>
        }
        {
          freeDrink ?
          <View style={{flexDirection: 'row', flexWrap:'nowrap'}}>
            <Text style={styles.rewardDisplayText}>Waiting for approval</Text>
            <Animatable.Text animation="fadeIn" easing="ease-out" delay={100} iterationCount="infinite" direction="alternate" style={styles.rewardDisplayText}>.</Animatable.Text>
            <Animatable.Text animation="fadeIn" easing="ease-out" delay={300} iterationCount="infinite" direction="alternate" style={styles.rewardDisplayText}>.</Animatable.Text>
            <Animatable.Text animation="fadeIn" easing="ease-out" delay={500} iterationCount="infinite" direction="alternate" style={styles.rewardDisplayText}>.</Animatable.Text>
          </View>
          :
          null
        }
      <QRCodeScanner
          onRead={this.onRead}
          topContent={null}
          bottomContent={null}
          cameraStyle={{ height: 0, width: 0}}
          cameraType="front"
      />
      </View>
      </Animatable.View>
    );
  }
}

export default Reward;
