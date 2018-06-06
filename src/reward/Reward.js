import type { RewardView } from './containers/RewardView';
import React from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TextInput,
  Animated,
} from 'react-native';
import { Button } from 'native-base';
import styles from '../config/styles';
import * as Animatable from 'react-native-animatable';
import QRCodeScanner from 'react-native-qrcode-scanner';
import * as Icon from 'react-native-vector-icons/Ionicons';

class Reward extends React.Component<RewardView> {
  constructor(props) {
    super(props);
    this.state = {
      purchasedDrinks: '',
      redeemedDrinks: '',
      auth: this.props.auth || false,
      loading: false,
      showQR: true,
      phoneNumber: props.reward && props.reward.phoneNumber || '',
      reward: props.reward || false,
      modalVisible: false,
      modalRedeemMultipleVisible: false,
      modalRedeemAndPurchasedVisible: false,
      modalRedeemMultipleAndPurchasedVisible: false,
      fadeAnim: new Animated.Value(0.01),
    };
    this.addReward = this.props.addReward;
    this.redeemReward = this.props.redeemReward;

    this.onRead = this.onRead.bind(this);
    this.onQuickAdd = this.onQuickAdd.bind(this);
    this.onRedeem = this.onRedeem.bind(this);
    this.onRedeemMultiple = this.onRedeemMultiple.bind(this);
    this.onRedeemWithPurchases = this.onRedeemWithPurchases.bind(this);
    this.onRedeemMultipleWithPurchases = this.onRedeemMultipleWithPurchases.bind(this);
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
  componentWillReceiveProps(props) {
    console.log(props);
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
  onRead(qr) {
    console.log(qr);
    this.setState({ modalVisible: true});
  }
  async onQuickAdd() {
    try {
      await this.addReward(this.state.auth, this.state.phoneNumber, 1);
      this.setState({ reward: this.props.reward, showQR: false, modalVisible: false });
      // this.timeoutHandle = setTimeout(()=>{this.props.navigation.navigate('Home');}, 5000);
    } catch (e) {
      console.log(e);
    }
  }
  async onRedeem() {
    try {
      this.redeemReward(this.state.auth, this.state.phoneNumber);
      this.setState({ reward: this.props.reward, showQR: false, modalVisible: false });
      // this.timeoutHandle = setTimeout(()=>{this.props.navigation.navigate('Home');}, 5000);
    } catch (e) {
      console.log(e);
    }
  }
  onRedeemMultiple() {
    this.setState({ modalVisible: false, modalRedeemMultipleVisible: true});
  }
  onRedeemWithPurchases() {
    this.setState({ modalVisible: false, modalRedeemAndPurchasedVisible: true});
  }
  onRedeemMultipleWithPurchases() {
    this.setState({ modalVisible: false, modalRedeemMultipleAndPurchasedVisible: true});
  }
  render() {
    const {
      fadeAnim,
      showQR,
    } = this.state;
    const {
      reward,
    } = this.props;
    const drinks = reward && reward.drinks;
    const freeDrinks = Math.floor(drinks / 10);
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
          {this.state.showQR ? this.createRewards(drinks) : this.createRewards(drinks)}
          <View style={{
            flexWrap: 'nowrap',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}>
          {
            freeDrink ?
            <Text style={styles.rewardDisplayText}>You have {freeDrinks} free drink{freeDrinks >= 2 ? 's' : ''}!</Text>
            :
            <Text style={styles.rewardDisplayText}>You are {(10 - drinks)} drinks away{'\n'} from a free drink!</Text>
          }
          <View style={{flexDirection: 'column', flexWrap:'nowrap', flex: 1, alignItems: 'center'}}>
            { this.state.showQR ?
              <Animatable.Text animation="fadeIn" easing="ease-out" delay={500} iterationCount="infinite" direction="alternate">
                <Icon.Button name="ios-qr-scanner" size={150} backgroundColor="transparent" color="#000000" onPress={null} />
              </Animatable.Text>
              :
              null
            }
            <Button
              style={styles.testQRButton}
              primary={true}
              onPress={() => {
                this.setState({modalVisible: true});
              }}
              title="Test QR Scan"
            >
              <Text style={styles.testQRButtonText}>Test QR Scan</Text>
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
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, paddingBottom: 20}}>
                <View>
                  {freeDrink ?
                    <View>
                      <View style={{alignSelf: 'center'}}>
                        <Button
                          style={styles.redeemButton}
                          primary={true}
                          onPress={this.onRedeem}
                          title="Redeem Drink"
                        >
                          <Text style={styles.redeemText}>Redeem Drink</Text>
                        </Button>
                      </View>
                      <View style={{alignSelf: 'center'}}>
                        <Button
                          style={styles.redeemButton}
                          primary={true}
                          onPress={this.onRedeemWithPurchases}
                          title="Redeem With Purchased Drinks"
                        >
                          <Text style={styles.redeemText}>Redeem with{'\n'}{this.state.purchasedDrinks} Purchased Drinks</Text>
                        </Button>
                      </View>
                      <View style={{alignSelf: 'center'}}>
                        <Button
                          style={styles.redeemButton}
                          primary={true}
                          onPress={this.onRedeemMultiple}
                          title="Redeem Multiple Drinks"
                        >
                          <Text style={styles.redeemText}>Redeem Multiple Drinks</Text>
                        </Button>
                      </View>
                      <View style={{alignSelf: 'center'}}>
                        <Button
                          style={styles.redeemButton}
                          primary={true}
                          onPress={this.onRedeemMultipleWithPurchases}
                          title="Redeem/Purchased Multiple Drinks"
                        >
                          <Text style={styles.redeemText}>Redeem & Purchase</Text>
                        </Button>
                      </View>
                    </View>
                    :
                    <View>
                      <View style={{alignSelf: 'center'}}>
                        <Button
                          style={styles.quickAddButton}
                          primary={true}
                          onPress={this.onQuickAdd}
                          title="Quick Add"
                        >
                          <Text style={styles.quickAddOneText}>Add 1 Reward</Text>
                        </Button>
                      </View>
                      <View style={{alignSelf: 'center'}}>
                        <Button
                          style={styles.addCustomButton}
                          primary={true}
                          onPress={this.onAdd}
                          title="Add Drinks"
                        >
                          <Text style={styles.addCustomText}>Add {this.state.purchasedDrinks} Multiple Rewards</Text>
                        </Button>
                      </View>
                    </View>
                  }
                </View>
              </View>
            </Modal>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalRedeemMultipleVisible}>
              <View style={{alignItems: 'center', justifyContent: 'flex-start', flex: 1, paddingBottom: 20}}>
                <View style={{
                    width: '100%',
                    height: 55,
                    margin: 10,
                    padding: 25,
                    alignItems: 'center',
                  }}>
                  <TextInput
                    style={styles.drinksInput}
                    onChangeText={(redeemedDrinks) => this.setState({redeemedDrinks})}
                    value={this.state.redeemedDrinks}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="Redeem Drinks"
                    textAlign="center"
                    returnKeyType="done"
                  />
                </View>
                <View style={{alignSelf: 'center', paddingTop: 40}}>
                  <Button
                    style={styles.redeemButton}
                    primary={true}
                    onPress={this.onRedeem}
                    title="Redeem Drink"
                  >
                    <Text style={styles.redeemText}>Redeem</Text>
                  </Button>
                </View>
              </View>
            </Modal>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalRedeemAndPurchasedVisible}>
              <View style={{alignItems: 'center', justifyContent: 'flex-start', flex: 1, paddingBottom: 20}}>
                <View style={{
                    width: '100%',
                    height: 55,
                    margin: 10,
                    padding: 25,
                    alignItems: 'center',
                  }}>
                  <TextInput
                    style={styles.drinksInput}
                    onChangeText={(purchasedDrinks) => this.setState({purchasedDrinks})}
                    value={this.state.purchasedDrinks}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="Purchased Drinks"
                    textAlign="center"
                    returnKeyType="done"
                  />
                </View>
                <View style={{alignSelf: 'center', paddingTop: 40}}>
                  <Button
                    style={styles.redeemButton}
                    primary={true}
                    onPress={this.onRedeem}
                    title="Redeem Drink"
                  >
                    <Text style={styles.redeemText}>Redeem</Text>
                  </Button>
                </View>
              </View>
            </Modal>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalRedeemMultipleAndPurchasedVisible}>
              <View style={{alignItems: 'center', justifyContent: 'flex-start', flex: 1, paddingBottom: 20}}>
                <View style={{
                    width: '100%',
                    height: 55,
                    margin: 10,
                    padding: 25,
                    alignItems: 'center',
                  }}>
                  <TextInput
                    style={styles.drinksInput}
                    onChangeText={(redeemedDrinks) => this.setState({redeemedDrinks})}
                    value={this.state.redeemedDrinks}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="Redeem Drinks"
                    textAlign="center"
                    returnKeyType="done"
                  />
                </View>
                <View style={{
                    width: '100%',
                    height: 55,
                    margin: 10,
                    padding: 25,
                    alignItems: 'center',
                  }}>
                  <TextInput
                    style={styles.drinksInput}
                    onChangeText={(purchasedDrinks) => this.setState({purchasedDrinks})}
                    value={this.state.purchasedDrinks}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="Purchased Drinks"
                    textAlign="center"
                    returnKeyType="done"
                  />
                </View>
                <View style={{alignSelf: 'center', paddingTop: 40}}>
                  <Button
                    style={styles.redeemButton}
                    primary={true}
                    onPress={this.onRedeem}
                    title="Redeem Drink"
                  >
                    <Text style={styles.redeemText}>Redeem</Text>
                  </Button>
                </View>
              </View>
            </Modal>
          </View>
        </Animated.View>
      </View>
    );
  }
}

// modalRedeemMultipleVisible: false,
// modalRedeemAndPurchasedVisible: false,
// modalRedeemMultipleAndPurchasedVisible: false,

// <View style={{
//     width: '100%',
//     height: 55,
//     margin: 10,
//     alignItems: 'center',
//   }}>
//   <TextInput
//     style={styles.drinksInput}
//     onChangeText={(purchasedDrinks) => this.setState({purchasedDrinks})}
//     value={this.state.purchasedDrinks}
//     keyboardType="numeric"
//     maxLength={3}
//     placeholder="Redeem Drinks"
//     textAlign="center"
//     returnKeyType="done"
//   />
// </View>




// <View style={{alignSelf: 'center'}}>
//   <TextInput
//     style={styles.drinksInput}
//     onChangeText={(purchasedDrinks) => this.setState({purchasedDrinks})}
//     value={this.state.purchasedDrinks}
//     keyboardType="numeric"
//     maxLength={2}
//     placeholder="Purchased Drinks"
//     textAlign="center"
//   />
// </View>


export default Reward;
