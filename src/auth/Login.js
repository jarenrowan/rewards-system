import React from 'react';
import {
  View,
  Text,
  Image,
  Animated,
} from 'react-native';
import {
  Button,
  Form,
  Item,
  Input,
 } from 'native-base';
import styles from '../config/styles';
import type { LoginView } from './container/LoginView';

class Login extends React.Component<LoginView> {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
      loading: false,
      loginUsername: 'jarenrowan',
      loginPassword: 'jr10110100',
      fadeAnim: new Animated.Value(0.01),
      drinksFadeAnim: new Animated.Value(0.01),
      loginButtonsFadeAnim: new Animated.Value(0.01),
      failedLogin: false,
    };
    this.getAuth = this.props.getAuth;
    this.getLogout = this.props.getLogout;

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
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
      if (this.props.auth) {
        this.props.navigation.navigate('Home', { auth: this.props.auth});
      } else {
        this.setState({
          auth: false,
          failedLogin: true,
        });
      }
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
  showLoggedOutButtons() {
    Animated.timing(
      this.state.loginButtonsFadeAnim,  // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 1000, // Make it take a while
      }
    ).start();
  }
  render() {
    const {
      fadeAnim,
      loginButtonsFadeAnim,
      failedLogin,
    } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.loginEmptyHeader} />
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
              <Item>
                <Input
                  style={styles.textInput}
                  placeholder="Username"
                  value={this.state.loginUsername}
                  onChangeText={(value) => this.setState({loginUsername: value})}
                  returnKeyType="next"
                  onSubmitEditing= {() => {this.passwordTextInput._root.focus(); }}
                  blurOnSubmit={false}
                />
              </Item>
              <Item last>
                <Input
                  ref={(input) => { this.passwordTextInput = input; }}
                  style={styles.textInput}
                  secureTextEntry={true}
                  placeholder="Password"
                  value={this.state.loginPassword}
                  onChangeText={(loginPassword) => this.setState({loginPassword})}
                  onSubmitEditing={this.login}
                  returnKeyLabel="Login"
                />
              </Item>
            </Form>
          </Animated.View>
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
                <Button style={styles.loginButton} primary={true} title="Login" onPress={this.login}>
                  <Text style={styles.loginText}>Login</Text>
                </Button>
              </View>
          </Animated.View>
        </Animated.View>
      </View>
    );
  }
}

export default Login;
