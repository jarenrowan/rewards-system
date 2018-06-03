import type { RewardView } from './containers/RewardView';
import React from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TouchableHighlight,
  TextInput,
  Animated,
} from 'react-native';
import { Button } from 'native-base';
import styles from '../config/styles';
import * as Animatable from 'react-native-animatable';
import QRCodeScanner from 'react-native-qrcode-scanner';
import * as Icon from 'react-native-vector-icons/Ionicons'

class Reward extends React.Component<RewardView> {
  constructor(props) {
    super(props);
    this.state = {
      purchasedDrinks: '',
      auth: this.props.auth || false,
      loading: false,
      phoneNumber: props.reward && props.reward.phoneNumber || '',
      reward: props.reward || false,
      modalVisible: false,
      fadeAnim: new Animated.Value(0.01),
    };
    this.onCancel = this.onCancel.bind(this);
    this.onRead = this.onRead.bind(this);
    this.onQuickAdd = this.onQuickAdd.bind(this);
    this.onRedeem = this.onRedeem.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onBackPress: this._handleBackPress,
    });
    Animated.timing(  // Animate over time
      this.state.fadeAnim,  // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 1000, // Make it take a while
      }
    ).start();  // Starts the animation
  }
  componentWillUnmount(){
     clearTimeout(this.timeoutHandle); // This is just necessary in the case that the screen is closed before the timeout fires, otherwise it would cause a memory leak that would trigger the transition regardless, breaking the user experience.
  }
  _handleBackPress() {
    this.setState({ reward: false });
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
    this.setState({ modalVisible: true});
  }
  onQuickAdd() {
    this.setState({ modalVisible: false});
    this.timeoutHandle = setTimeout(()=>{this.props.navigation.navigate('Home');}, 5000);
  }
  onRedeem() {
    this.setState({ modalVisible: false});
    this.timeoutHandle = setTimeout(()=>{this.props.navigation.navigate('Home');}, 5000);
  }
  render() {
    const {
      reward,
      fadeAnim,
    } = this.state;
    const drinks = reward && reward.drinks;
    const freeDrink = reward && reward.freeDrink;
    return (
      <View style={styles.container} >
        <Animated.View
          style={{
            ...this.props.style,
            opacity: fadeAnim, // Bind opacity to animated value
            paddingTop: 25,
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            flexDirection: 'row',
            flex: 1,
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
            <Text style={styles.rewardDisplayText}>You are {(10 - drinks)} drinks away{'\n'} from a free drink!</Text>
          }
          <View style={{flexDirection: 'column', flexWrap:'nowrap', flex: 1, alignItems: 'center'}}>
            <Animatable.Text animation="fadeIn" easing="ease-out" delay={500} iterationCount="infinite" direction="alternate">
              <Icon.Button name="ios-qr-scanner" size={150} backgroundColor="transparent" color="#000000" onPress={null} />
            </Animatable.Text>
            <Button
              style={styles.loginButton}
              primary={true}
              onPress={() => {
                this.setState({modalVisible: true});
              }}
              title="Test Button"
            >
              <Text style={styles.loginText}>Test QR Scan</Text>
            </Button>
          </View>
          <QRCodeScanner
              onRead={this.onRead}
              topContent={null}
              bottomContent={null}
              cameraStyle={{ height: 0, width: 0}}
              cameraType="front"
          />
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
          >
            <View style={{margin: 50, alignItems: 'center', justifyContent: 'center'}}>
                <View
                  style={{
                    paddingTop: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                  }}>
                  {freeDrink ?
                    <View
                      style={{
                        paddingTop: 25,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                      }}
                    >
                      <Button
                        style={styles.quickAddButton}
                        primary={true}
                        onPress={this.onQuickAdd}
                        title="Test Button"
                      >
                        <Text style={styles.quickAddOneText}>Redeem Drink</Text>
                      </Button>
                    </View>
                    :
                    <View
                      style={{
                        paddingTop: 25,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                      }}
                    >
                      <Button
                        style={styles.quickAddButton}
                        primary={true}
                        onPress={this.onQuickAdd}
                        title="Quick Add"
                      >
                        <Text style={styles.quickAddOneText}>Add 1 Reward</Text>
                      </Button>
                      <View style={{
                          width: '75%',
                          height: 55,
                          margin: 10,
                        }}>
                        <TextInput
                          style={styles.drinksInput}
                          onChangeText={(purchasedDrinks) => this.setState({purchasedDrinks})}
                          value={this.state.purchasedDrinks}
                          keyboardType="numeric"
                          autoFocus={true}
                          maxLength={3}
                          placeholder="Drinks"
                        />
                        <Button
                          style={styles.addCustomButton}
                          primary={true}
                          onPress={this.onAdd}
                          title="Custom Add"
                        >
                          <Text style={styles.addCustomText}>Add</Text>
                        </Button>
                      </View>
                    </View>
                  }
                </View>
              </View>
            </Modal>
          </View>
        </Animated.View>
      </View>
    );
  }
}

export default Reward;
