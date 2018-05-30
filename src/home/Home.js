import React from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  Keyboard,
} from 'react-native';
import {
  Button,
 } from 'native-base';
import PhoneInput from './components/PhoneInput';
import styles from '../config/styles';
import { parseNumber } from 'libphonenumber-js';
import type { HomeView } from './container/HomeView';
import { YellowBox } from 'react-native';
import { defaultUsername, defaultPassword } from '../config/settings';
YellowBox.ignoreWarnings(['Warning: componentWillMount']);
YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps']);
YellowBox.ignoreWarnings(['Warning: componentWillUpdate']);
YellowBox.ignoreWarnings(['Warning: Failed prop type']);
YellowBox.ignoreWarnings(['Module RCTImageLoader requires main queue']);
YellowBox.ignoreWarnings(['Class RCTCxxModule']);


class Home extends React.Component<HomeView> {
  constructor(props) {
    super(props);
    this.state = {
      auth: this.props.auth || false,
      loading: false,
      loginUsername: defaultUsername,
      loginPassword: defaultPassword,
      phoneNumber: '',
      reward: false,
      fadeAnim: new Animated.Value(0.01),
      drinksFadeAnim: new Animated.Value(0.01),
      loginButtonsFadeAnim: new Animated.Value(0.01),
      submitButtonsFadeAnim: new Animated.Value(0.01),
      failedLogin: false,
      showRewards: false,
      adminMode: false,
    };
    this.getLogout = this.props.getLogout;
    this.getReward = this.props.getReward;

    this.onChangePhone = this.onChangePhone.bind(this);
    this.onSubmitPhone = this.onSubmitPhone.bind(this);
    this.clearNumber = this.clearNumber.bind(this);
    this._onClear = this._onClear.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this.logout = this.logout.bind(this);
    this.onContinue = this.onContinue.bind(this);
    this.showLoggedInButtons = this.showLoggedInButtons.bind(this);
    this.showLoggedOutButtons = this.showLoggedOutButtons.bind(this);
  }
  componentDidMount() {
    Animated.timing(  // Animate over time
      this.state.fadeAnim,  // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 1000, // Make it take a while
      }
    ).start();  // Starts the animation
    this.props.navigation.setParams({
      onBackPress: this._handleBackPress,
    });
  }
  _handleBackPress() {
    console.log('test');
  }
  logout() {
    this.getLogout();
    this.setState({
      auth: false,
      failedLogin: false,
      reward: false,
      phoneNumber: '',
      showRewards: false,
    });
    this.props.navigation.navigate('Login');
  }
  async onSubmitPhone() {
    if (this.state.phoneNumber === '') { return; }
    try {
      const parsedNumber = parseNumber(this.state.phoneNumber, 'US');
      await this.getReward(this.state.auth, parsedNumber.phone || '');
      this.setState({
        reward: this.props.reward,
        showRewards: true,

      });
      Keyboard.dismiss();
    } catch (e) {
      console.log(e);
    }
  }
  onChangePhone(phoneNumber) {
    this.setState({ phoneNumber });
  }
  _onSubmit = () => {
    Animated.timing(
      this.state.drinksFadeAnim,  // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 1000, // Make it take a while
      }
    ).start();
  }
  _onClear() {
    Animated.timing(
      this.state.drinksFadeAnim,  // The animated value to drive
      {
        toValue: 0, // Animate to opacity: 1 (opaque)
        duration: 100, // Make it take a while
      }
    ).start();
  }
  showLoggedInButtons() {
    Animated.timing(
      this.state.submitButtonsFadeAnim,  // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 1000, // Make it take a while
      }
    ).start();
    Animated.timing(
      this.state.loginButtonsFadeAnim,  // The animated value to drive
      {
        toValue: 0, // Animate to opacity: 1 (opaque)
        duration: 1000, // Make it take a while
      }
    ).start();
  }
  showLoggedOutButtons() {
    Animated.timing(
      this.state.submitButtonsFadeAnim,  // The animated value to drive
      {
        toValue: 0, // Animate to opacity: 1 (opaque)
        duration: 1000, // Make it take a while
      }
    ).start();
    Animated.timing(
      this.state.loginButtonsFadeAnim,  // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 1000, // Make it take a while
      }
    ).start();
  }
  clearNumber() {
    this.setState({
      phoneNumber: '',
      reward: false,
      showRewards: false,
      adminMode: false,
    }, () => {
      this._onClear();
    });
  }
  onContinue() {
    this.setState({ adminMode: true });
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
  render() {
    const {
      fadeAnim,
      drinksFadeAnim,
      submitButtonsFadeAnim,
      phoneNumber,
      showRewards,
    } = this.state;
    const {
      reward,
    } = this.props;
    const drinks = reward && reward.drinks;
    // const awayFromFreeDrink = 10 - drinks || 0;
    return (
      <View style={styles.container}>
        <View style={styles.rewardsRow}>
            {showRewards ?
              <Animated.View
                style={{
                  ...this.props.style,
                  opacity: drinksFadeAnim, // Bind opacity to animated value
                  paddingTop: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  flex: 1,
                }}
              >
                {this._onSubmit()}
                {this.createRewards(drinks)}
              </Animated.View>
              :
              <Animated.View
                style={{
                  ...this.props.style,
                  opacity: drinksFadeAnim, // Bind opacity to animated value
                  paddingTop: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  flex: 1,
                }}
              >
                {this._onClear()}
                {this.createRewards(0)}
              </Animated.View>
            }
        </View>
        <Animated.View
          style={{
            ...this.props.style,
            opacity: fadeAnim,  // Bind opacity to animated value
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Image
            style={styles.image}
            source={require('../../resources/images/logo-copy.png')}
          />
        <Animated.View
          style={{
            ...this.props.style,
            opacity: submitButtonsFadeAnim, // Bind opacity to animated value
            paddingTop: 0,
            paddingBottom: 0,
            width: 280,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <PhoneInput onChangePhone={this.onChangePhone.bind(this)} onSubmitPhone={this.onSubmitPhone.bind(this)} textValue={phoneNumber}/>
        </Animated.View>
          <Animated.View
            style={{
              ...this.props.style,
              opacity: submitButtonsFadeAnim, // Bind opacity to animated value
              paddingTop: 5,
              paddingBottom: 25,
              flex: 6,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              flexDirection: 'column',
            }}
          >
            {this.showLoggedInButtons()}
            <View style={styles.buttonContainer}>
                {this.state.reward ?
                  <Button style={styles.submitButton} primary={true} title="Continue" onPress={this.onContinue}>
                    <Text style={styles.loginText}>Continue</Text>
                  </Button>
                  :
                  <Button style={styles.submitButton} primary={true} title="Submit" onPress={this.onSubmitPhone}>
                    <Text style={styles.loginText}>Submit</Text>
                  </Button>
                }
                <Button style={styles.clearButton} primary={true} title="Clear Number" onPress={this.clearNumber}>
                  <Text style={styles.buttonText}>X</Text>
                </Button>
                <Button style={styles.logoutButton} primary={true} title="Logout" onPress={this.logout}>
                  <Text style={styles.loginText}>Logout</Text>
                </Button>
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    );
  }
}

export default Home;
