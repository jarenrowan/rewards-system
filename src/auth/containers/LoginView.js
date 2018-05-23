import { connect } from 'react-redux';
import Login from '../Login';
import { getAuth } from '../../home/actions';

type DispatchProps = {
  getAuth: () => void,
  getLogout: () => void,
}

const mapStateToProps = (state) => {
  return {
    loading: state.home.loading,
    auth: state.home.auth,
  };
};

const mapDispatchToProps = (dispatch: Function): DispatchProps => {
  return {
    getAuth: async (username, password) => dispatch(getAuth(
      username || 'jarenrowan',
      password || 'jr10110100',
    )),
    getLogout: () => dispatch({type: 'GET_LOGOUT'}),
  };
};

const LoginView = connect(mapStateToProps, mapDispatchToProps)(Login);
export default (LoginView);
