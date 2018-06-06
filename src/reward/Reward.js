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
      redeemedDrink: false, // User Redeemed Drink
      purchasedDrink: false, // User Purchased Drink
      purchasedDrinks: '', // User Inputed Purchased Drinks
      redeemedDrinks: '', // User Inputed Redeemed Drinks
      auth: this.props.auth || false,
      loading: false,
      showQR: true, // Show Animated QR
      phoneNumber: props.reward && props.reward.phoneNumber || '',
      reward: props.reward || false,
      modalVisible: false,
      modalAddMultipleVisible: false,
      modalRedeemMultipleVisible: false,
      modalRedeemAndPurchasedVisible: false,
      modalRedeemMultipleAndPurchasedVisible: false,
      fadeAnim: new Animated.Value(0.01), // Page Fade Animation
    };
    this.addReward = this.props.addReward;
    this.redeemReward = this.props.redeemReward;

    this.clearDrinks = this.clearDrinks.bind(this);
    this.redeemMultiple = this.redeemMultiple.bind(this);
    this.addMultiple = this.addMultiple.bind(this);
    this.onRead = this.onRead.bind(this);
    this.onQuickAdd = this.onQuickAdd.bind(this);
    this.onAddMultiple = this.onAddMultiple.bind(this);
    this.onAddMultipleOpen = this.onAddMultipleOpen.bind(this);
    this.onRedeem = this.onRedeem.bind(this);
    this.onRedeemMultiple = this.onRedeemMultiple.bind(this);
    this.onRedeemMultipleOpen = this.onRedeemMultipleOpen.bind(this);
    this.onRedeemWithPurchasesOpen = this.onRedeemWithPurchasesOpen.bind(this);
    this.onRedeemWithPurchases = this.onRedeemWithPurchases.bind(this);
    this.onRedeemMultipleWithPurchasesOpen = this.onRedeemMultipleWithPurchasesOpen.bind(this);
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
  componentWillUnmount(){
     clearTimeout(this.timeoutHandle); // This is just necessary in the case that the screen is closed before the timeout fires, otherwise it would cause a memory leak that would trigger the transition regardless, breaking the user experience.
  }
  _handleBackPress() {
    this.setState({ reward: false });
  }
  clearDrinks() {
    this.setState({ purchasedDrinks: '', redeemedDrinks: ''});
  }
  navigateBackDelayed() {
    this.timeoutHandle = setTimeout(()=>{this.props.navigation.navigate('Home');}, 5000);
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
      this.setState({ reward: this.props.reward,
        modalVisible: false,
        purchasedDrink: true,
        redeemedDrink: false,
        showQR: false,
      });
      this.clearDrinks();
      // this.timeoutHandle = setTimeout(()=>{this.props.navigation.navigate('Home');}, 5000);
    } catch (e) {
      console.log(e);
    }
  }
  onAddMultipleOpen() {
    this.setState({ modalVisible: false, modalAddMultipleVisible: true});
  }
  async addMultiple() {
    try {
      await this.addReward(this.state.auth, this.state.phoneNumber, this.state.purchasedDrinks);
    } catch (e) {
      console.log(e);
    }
  }
  async onAddMultiple() {
    try {
      await this.addMultiple();
      this.setState({
        reward: this.props.reward,
        modalAddMultipleVisible: false,
        purchasedDrink: true,
        redeemedDrink: false,
        showQR: false,
      });
      this.clearDrinks();
      this.navigateBackDelayed();
    } catch (e) {
      console.log(e);
    }
  }
  async onRedeem() {
    try {
      await this.redeemReward(this.state.auth, this.state.phoneNumber);
      this.setState({ reward: this.props.reward,
        modalVisible: false,
        purchasedDrink: false,
        redeemedDrink: true,
        showQR: false,
      });
      this.clearDrinks();
      this.navigateBackDelayed();
    } catch (e) {
      console.log(e);
    }
  }
  onRedeemMultipleOpen() {
    this.setState({ modalVisible: false, modalRedeemMultipleVisible: true});
  }
  async redeemMultiple() {
    try {
      const {
        redeemedDrinks,
        auth,
        phoneNumber,
      } = this.state;
      for (let x = 0; x < redeemedDrinks; x++) {
        await this.redeemReward(auth, phoneNumber);
      }
    } catch (e) {
      console.log(e);
    }
  }
  async onRedeemMultiple() {
    try {
      await this.redeemMultiple();
      this.setState({
        modalRedeemMultipleVisible: false,
        purchasedDrink: false,
        redeemedDrink: true,
        showQR: false,
      });
      this.clearDrinks();
      this.navigateBackDelayed();
    } catch (e) {
      console.log(e);
    }
    // get numbers and do redeem for {numbers} times
  }
  onRedeemWithPurchasesOpen() {
    this.setState({ modalVisible: false, modalRedeemAndPurchasedVisible: true});
  }
  async onRedeemWithPurchases() {
    // get number of purchases, do redeem and add {number} drinks
    try {
      await this.addMultiple();
      await this.onRedeem();
      this.setState({
        modalRedeemAndPurchasedVisible: false,
        purchasedDrink: true,
        redeemedDrink: true,
        showQR: false,
      });
      this.clearDrinks();
      this.navigateBackDelayed();
    } catch (e) {
      console.log(e);
    }
  }
  onRedeemMultipleWithPurchasesOpen() {
    this.setState({
      modalVisible: false,
      modalRedeemMultipleAndPurchasedVisible: true,
      showQR: false,
    });
  }
  async onRedeemMultipleWithPurchases() {
    // get number of redeems, get number of purchases, do redeem {numbers} times and add {numbers} drinks
    try {
      await this.addMultiple();
      await this.redeemMultiple();
      this.setState({
        modalRedeemMultipleAndPurchasedVisible: false,
        purchasedDrink: true,
        redeemedDrink: true,
        showQR: false,
      });
      this.clearDrinks();
      this.navigateBackDelayed();
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    const {
      fadeAnim,
      showQR,
      purchasedDrink,
      redeemedDrink,
    } = this.state;
    const {
      reward,
    } = this.props;
    const drinks = reward && reward.drinks;
    const freeDrinks = Math.floor(drinks / 10);
    const freeDrink = reward && reward.freeDrink;
    const rewardText = (freeDrink ?
      (<Text style={styles.rewardDisplayText}>You have {freeDrinks} free drink{freeDrinks >= 2 ? 's' : ''}!</Text>)
      :
      (<Text style={styles.rewardDisplayText}>You are {(10 - drinks)} drinks away{'\n'} from a free drink!</Text>));
    const finishedText = (redeemedDrink ?
      (<Text style={styles.rewardDisplayText}>Rewards Redeemed{purchasedDrink ? ' and Added' : ''}</Text>)
      :
      (<Text style={styles.rewardDisplayText}>Rewards Added</Text>));

    const menuModal = (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
      >
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, paddingBottom: 5}}>
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
                      onPress={this.onRedeemWithPurchasesOpen}
                      title="Redeem With Purchased Drinks"
                    >
                      <Text style={styles.redeemText}>Redeem with{'\n'}{this.state.purchasedDrinks} Purchased Drinks</Text>
                    </Button>
                  </View>
                  <View style={{alignSelf: 'center'}}>
                    <Button
                      style={styles.redeemButton}
                      primary={true}
                      onPress={this.onRedeemMultipleOpen}
                      title="Redeem Multiple Drinks"
                    >
                      <Text style={styles.redeemText}>Redeem Multiple Drinks</Text>
                    </Button>
                  </View>
                  <View style={{alignSelf: 'center'}}>
                    <Button
                      style={styles.redeemButton}
                      primary={true}
                      onPress={this.onRedeemMultipleWithPurchasesOpen}
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
                      style={styles.redeemButton}
                      primary={true}
                      onPress={this.onQuickAdd}
                      title="Quick Add"
                    >
                      <Text style={styles.quickAddOneText}>Add 1 Reward</Text>
                    </Button>
                  </View>
                  <View style={{alignSelf: 'center'}}>
                    <Button
                      style={styles.redeemButton}
                      primary={true}
                      onPress={this.onAddMultipleOpen}
                      title="Add Drinks"
                    >
                      <Text style={styles.addCustomText}>Add Multiple Rewards</Text>
                    </Button>
                  </View>
                </View>
              }
            </View>
          </View>
        </Modal>
    );
    const addMultipleModal = (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalAddMultipleVisible}>
        <View style={{alignItems: 'center', justifyContent: 'flex-start', flex: 1}}>
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
              autoFocus={true}
              placeholder="Purchased Drinks"
              textAlign="center"
              returnKeyType="done"
            />
          </View>
          <View style={{alignSelf: 'center', paddingTop: 40}}>
            <Button
              style={styles.redeemButton}
              primary={true}
              onPress={this.onAddMultiple}
              title="Add Drinks"
            >
              <Text style={styles.redeemText}>Add {this.state.purchasedDrinks} Drinks</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
    const redeemMultipleModal = (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalRedeemMultipleVisible}>
        <View style={{alignItems: 'center', justifyContent: 'flex-start', flex: 1, paddingBottom: 5}}>
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
              autoFocus={true}
              placeholder="Redeem Drinks"
              textAlign="center"
              returnKeyType="done"
            />
          </View>
          <View style={{alignSelf: 'center', paddingTop: 40}}>
            <Button
              style={styles.redeemButton}
              primary={true}
              onPress={this.onRedeemMultiple}
              title="Redeem Drink"
            >
              <Text style={styles.redeemText}>Redeem</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
    const redeemWithPurchasesModal = (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalRedeemAndPurchasedVisible}>
        <View style={{alignItems: 'center', justifyContent: 'flex-start', flex: 1, paddingBottom: 5}}>
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
              autoFocus={true}
              placeholder="Purchased Drinks"
              textAlign="center"
              returnKeyType="done"
            />
          </View>
          <View style={{alignSelf: 'center', paddingTop: 40}}>
            <Button
              style={styles.redeemButton}
              primary={true}
              onPress={this.onRedeemWithPurchases}
              title="Redeem Drink"
            >
              <Text style={styles.redeemText}>Redeem</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
    const redeemMultipleWithPurchasesModal = (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalRedeemMultipleAndPurchasedVisible}
        >
        <View style={{alignItems: 'center', justifyContent: 'flex-start', flex: 1, paddingBottom: 5}}>
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
              autoFocus={true}
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
              onPress={this.onRedeemMultipleWithPurchases}
              title="Redeem Drink"
            >
              <Text style={styles.redeemText}>Redeem & Add</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
    return (
      <View style={styles.container} >
        <Animated.View
          style={{
            ...this.props.style,
            opacity: fadeAnim, // Bind opacity to animated value
            paddingTop: 10,
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            flexDirection: 'row',
            flex: 1,
          }}
        >
          {this.state.showQR ? this.createRewards(drinks) : this.createRewards(drinks)}
          <View>
            {rewardText}
            <View style={{flexDirection: 'column', flexWrap:'nowrap', flex: 1, alignItems: 'center'}}>
              { showQR ?
                <Animatable.Text style={{paddingBottom: 5}} animation="fadeIn" easing="ease-out" delay={500} iterationCount="infinite" direction="alternate">
                  <Icon.Button name="ios-qr-scanner" size={150} backgroundColor="transparent" color="#000000" onPress={null} />
                </Animatable.Text>
                :
                finishedText
              }
              <View>
                <QRCodeScanner
                    onRead={this.onRead}
                    topContent={null}
                    bottomContent={null}
                    containerStyle={{height: 0, width: 0, flex: 0}}
                    topViewStyle={{height: 0, width: 0, flex: 0}}
                    bottomViewStyle={{height: 0, width: 0, flex: 0}}
                    cameraStyle={{ height: 0, width: 0, flex: 0}}
                    cameraType="front"
                />
                <Button
                  style={styles.redeemButton}
                  primary={true}
                  onPress={() => {
                    this.setState({modalVisible: true});
                  }}
                  title="Test QR Scan"
                >
                  <Text style={styles.redeemText}>Test QR Scan</Text>
                </Button>
              </View>
            </View>
            {menuModal}
            {addMultipleModal}
            {redeemMultipleModal}
            {redeemWithPurchasesModal}
            {redeemMultipleWithPurchasesModal}
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
