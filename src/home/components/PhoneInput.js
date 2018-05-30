import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

export default class PhoneInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
    };
  }
  render() {
    const { style } = this.props;
    const textValue = this.props.textValue || '';
    const onChangePhone = this.props.onChangePhone;
    const onSubmitPhone = this.props.onSubmitPhone;
    return (
      <View style={styles.inputContainer}>
          <TextInputMask
            onChangeText={(text) => {
              onChangePhone(text);
              this.setState({ phoneNumber: text});
            }}
            value={textValue}
            style={style || styles.textInput}
            autoFocus={true}
            onSubmitEditing={(event) => onSubmitPhone(event.nativeEvent.text)}
            placeholder="Enter Phone"
            blurOnSubmit={true}
            returnKeyLabel="Look up Rewards"
            keyboardType="number-pad"
            maxLength={14}
            borderColor="black"
            borderRadius={5}
            keyboardAppearance="dark"
            type={'custom'}
            options={{
              mask: '(999)-999-9999',
            }}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingTop: 10,
    paddingBottom: 50,
    width: 280,
    height: 65,
    borderColor: '#827c7a',
    flex: 1,
  },
  textInput: {
    borderBottomWidth: 0.25,
    textAlign: 'center',
    borderColor: 'black',
    borderRadius: 2,
    fontSize: 35,
    height: 55,
  },
  loginButton: {
    width: '50%',
    alignItems: 'center',
  },
  loginText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    flex: 1,
  },
});
// <TextInput
//   onChangeText={(text) => {
//     onChangePhone(text);
//     this.setState({ phoneNumber: text })
//   }}
//   value={this.state.phoneNumber}
//   style={styles.textInput}
//   autoFocus={true}
//   onSubmitEditing={(event) => onSubmitPhone(event.nativeEvent.text)}
//   placeholder="Enter Phone"
//   blurOnSubmit={true}
//   returnKeyType="done"
//   keyboardType="numeric"
//   maxLength={10}
//   borderColor="black"
//   borderRadius={5}
//   type={'custom'}
//   options={{
//     mask: '(999)-999-9999'
//   }}
// />
