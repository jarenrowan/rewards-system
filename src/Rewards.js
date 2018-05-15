import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  Keyboard,
} from 'react-native';
import {
  Button,
  Container,
  Header,
  Content,
  Form,
  Item,
  Input
 } from 'native-base';
import RewardItem from './components/RewardItem/RewardItem';
import PhoneInput from './components/PhoneInput/PhoneInput';
import styles from './config/styles';
import { parseNumber, formatNumber, AsYouType } from 'libphonenumber-js';
import { createStackNavigator } from 'react-navigation';

@connect(
  state => ({
    reward: state.reward,
    loading: state.loading,
    auth: state.auth,
    message: state.message,
  }),
  dispatch => ({
    refresh: () => dispatch({type: 'GET_REWARDS_DATA'}),
    getAuth: async (username, password) => dispatch({
      type: 'GET_LOGIN_AUTH',
      username: username || 'jarenrowan',
      password: password || 'jr10110100',
    }),
    getLogout: () => dispatch({type: 'GET_LOGOUT'}),
    getReward: (phoneNumber, auth) => dispatch({
      type: 'GET_REWARD_DATA',
      phoneNumber: phoneNumber || '',
      auth,
    }),
  }),
)

class Rewards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
      loading: false,
      loginUsername: 'jarenrowan',
      loginPassword: 'jr10110100',
      phoneNumber: '',
      reward: false,
      fadeAnim: new Animated.Value(0.01),
      drinksFadeAnim: new Animated.Value(0.01),
      loginButtonsFadeAnim: new Animated.Value(0.01),
      submitButtonsFadeAnim: new Animated.Value(0.01),
      failedLogin: false,
      showRewards: false,
      adminMode: false,
    }
    this.getAuth = this.props.getAuth;
    this.getLogout = this.props.getLogout;
    this.getReward = this.props.getReward;

    this.onChangePhone = this.onChangePhone.bind(this);
    this.onSubmitPhone = this.onSubmitPhone.bind(this);
    this.clearNumber = this.clearNumber.bind(this);
    this._onClear = this._onClear.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this.login = this.login.bind(this);
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
  }
  async login() {
    try {
      await this.getAuth(this.state.loginUsername, this.state.loginPassword);
      this.setState({
        auth: this.props.auth || false,
        failedLogin: this.state.auth ? false : true,
      });
    } catch (e) {
      console.log(e);
    }
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
  }
  async onSubmitPhone() {
    if (this.state.phoneNumber === '') { return }
    try {
      const parsedNumber = parseNumber(this.state.phoneNumber, 'US');
      console.log(parsedNumber.phone);
      await this.getReward(parsedNumber.phone || '', this.state.auth);
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
    for(const x=0; x<10;x++) {
      if (drinksLeft) {
        drinkImages.push(<Image key={x} style={styles.rewardCupImage} source={require('./../resources/images/markedDrink.png')}/>);
        drinksLeft--;
      } else {
        drinkImages.push(<Image key={x} style={styles.rewardCupImage} source={require('./../resources/images/unmarkedDrink.png')}/>);
      }
    }
    return drinkImages;
  }
  render() {
    const {
      fadeAnim,
      drinksFadeAnim,
      loginButtonsFadeAnim,
      submitButtonsFadeAnim,
      phoneNumber,
      failedLogin,
      auth,
      showRewards,
      adminMode,
    } = this.state;
    const {
      reward,
      loading,
      refresh,
      message,
    } = this.props;
    const arrow = '<-';
    const drinks = reward && reward.drinks;
    const awayFromFreeDrink = 10 - drinks || 0;
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
            source={require('./../resources/images/logo.png')}
          />
        {auth
          ? null :
            <Animated.View
              style={{
                ...this.props.style,
                opacity: fadeAnim,  // Bind opacity to animated value
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
              }}
            >
            <Form style={styles.formContainer}>
              {failedLogin
                ?
                  <Text style={styles.errorText}>User credentials are invalid</Text>
                : null
              }
              {this.showLoggedOutButtons()}
              <Item>
                <Input style={styles.textInput} placeholder="Username" value={this.state.loginUsername} onChangeText={(value) => this.setState({loginUsername: value})}/>
              </Item>
              <Item last>
                <Input style={styles.textInput} secureTextEntry={true} placeholder="Password" value={this.state.loginPassword} onChangeText={(value) => this.setState({loginPassword: value})}/>
              </Item>
            </Form>
          </Animated.View>
        }
        {auth
          ?
          <Animated.View
            style={{
              ...this.props.style,
              opacity: submitButtonsFadeAnim, // Bind opacity to animated value
              paddingTop: 0,
              paddingBottom: 0,
              width: 280,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <PhoneInput onChangePhone={this.onChangePhone.bind(this)} onSubmitPhone={this.onSubmitPhone.bind(this)} textValue={phoneNumber}/>
          </Animated.View>
          :
          null
        }
        {auth
          ?
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
                    <Button style={styles.submitButton} primary={true} title='Continue' onPress={this.onContinue}>
                      <Text style={styles.loginText}>Continue</Text>
                    </Button>
                    :
                    <Button style={styles.submitButton} primary={true} title='Submit' onPress={this.onSubmitPhone}>
                      <Text style={styles.loginText}>Submit</Text>
                    </Button>
                  }
                  <Button style={styles.clearButton} primary={true} title='Clear Number' onPress={this.clearNumber}>
                    <Text style={styles.buttonText}>X</Text>
                  </Button>
                  <Button style={styles.logoutButton} primary={true} title='Logout' onPress={this.logout}>
                    <Text style={styles.loginText}>{arrow}</Text>
                  </Button>
              </View>
            </Animated.View>
            :
            <Animated.View
              style={{
                ...this.props.style,
                opacity: loginButtonsFadeAnim, // Bind opacity to animated value
                paddingTop: 10,
                paddingBottom: 25,
                flex: 1,
                alignItems: 'center',
              }}
            >
              {this.showLoggedOutButtons()}
              <View style={styles.buttonContainer}>
                <Button style={styles.loginButton} primary={true} title='Login' onPress={this.login}>
                  <Text style={styles.loginText}>Login</Text>
                </Button>
              </View>
          </Animated.View>
        }
        </Animated.View>
      </View>
    );
  }
}

export default createStackNavigator({
  Home: {
    screen: Rewards,
  }
})
