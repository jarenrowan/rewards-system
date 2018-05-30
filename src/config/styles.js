import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Rewards Home Page
  container: {
    flex: 1,
    paddingTop: 5,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 55,
    backgroundColor: '#FFFFFF',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flex: 2,
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  loginButton: {
    width: '50%',
    alignItems: 'center',
    backgroundColor: '#99C33A',
  },
  submitButton: {
    width: '50%',
    alignItems: 'center',
    backgroundColor: '#99C33A',
    paddingBottom: 5,
    marginBottom: 5,
    marginLeft: 50,
  },
  redeemButton: {
    width: '25%',
    alignItems: 'center',
    backgroundColor: '#99C33A',
    paddingBottom: 5,
    marginBottom: 5,
  },
  clearButton: {
    alignItems: 'center',
    backgroundColor: '#99C33A',
    paddingBottom: 5,
    marginBottom: 5,
    marginLeft: 25,
    width: 60,
  },
  logoutButton: {
    width: 120,
    alignItems: 'center',
    backgroundColor: '#DA542E',
    paddingBottom: 5,
    marginTop: 60,
    marginBottom: 5,
    marginLeft: 50,
  },
  homeButtonContainer: {
    paddingTop: 10,
    paddingBottom: 40,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  formContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
  },
  loginText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    flex: 1,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 30,
    flex: 1,
    alignSelf: 'center',
  },
  rewardText: {
    fontSize: 20,
  },
  inputContainer: {
    width: '50%',
    height: '25%',
  },
  textInput: {
    borderRadius: 1,
    textAlign: 'center',
    borderColor: '#000000',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    borderColor: 'white',
  },
  coffeeCupColor: {
    backgroundColor: '#99C33A',
  },
  cartColor: {
    backgroundColor: '#D08C2B',
  },
  coffeeColor: {
    backgroundColor: '#DA542E',
  },
  image: {
    paddingBottom: 10,
  },
  rewardCupImage: {
    width: '20%',
    height: 65,
    paddingTop: 2,
    paddingBottom: 2,
    resizeMode: 'contain',
  },
  rewardsRow: {
    paddingTop: 150,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  loginEmptyHeader: {
    height: 320,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerStyle: {
    height: 40,
    backgroundColor: '#99C33A',
  },
  drawerIcon: {

    paddingLeft: 20,
    paddingTop: 5,
    flex: 1,
  },
  rewardDisplayText: {
    paddingTop: 45,
    textAlign: 'center',
    fontSize: 25,
  },
});

export default styles;
