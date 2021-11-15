import { UserService, AuthenticationError } from '../services/user.service';
import { TokenService } from '../services/storage.service';
import router from '../router';

const state = {
  authenticating: false,
  accessToken: TokenService.getToken(),
  authenticationErrorCode: 0,
  authenticationError: '',
  authenticationSuccess: false,
  registerSuccess: false,
  registering: false,
  registerError: '',
  registerErrorCode: '',
};

const getters = {
  loggedIn: (state) => {
    return state.accessToken ? true : false;
  },

  authenticationErrorCode: (state) => {
    return state.authenticationErrorCode;
  },

  authenticationError: (state) => {
    return state.authenticationError;
  },

  authenticating: (state) => {
    return state.authenticating;
  },
  authenticationSuccess: (state) => {
    return state.authenticationSuccess;
  },
  registerSuccess: (state) => {
    return state.registerSuccess;
  },
};

const actions = {
  async login({ commit }, { email, password }) {
    commit('loginRequest');
    try {
      const token = await UserService.login(email, password);
      commit('loginSuccess', token);
      // Redirect the user to the page he first tried to visit or to the home view
      router.push(router.history.current.query.redirect || '/');

      return true;
    } catch (e) {
      if (e instanceof AuthenticationError) {
        commit('loginError', {
          errorCode: e.errorCode,
          errorMessage: e.message,
        });
      }
      return false;
    }
  },
  async register({ commit }, payload) {
    console.log(payload);
    commit('registerRequest');
    try {
      const IsregisterSuccess = await UserService.register(payload);
      if (IsregisterSuccess) {
        router.push(
          router.history.current.query.redirect || '/registerSuccess'
        );
        return true;
      } else {
        commit('registerError', {
          errorCode: e.errorCode,
          errorMessage: e.message,
        });
      }
      return false;
    } catch (e) {
      if (e instanceof AuthenticationError) {
        commit('registerError', {
          errorCode: e.errorCode,
          errorMessage: e.message,
        });
      }
      return false;
    }
  },

  logout({ commit }) {
    UserService.logout();
    commit('logoutSuccess');
    router.push('/login');
  },
};

const mutations = {
  loginRequest(state) {
    state.authenticating = true;
    state.authenticationError = '';
    state.authenticationErrorCode = 0;
  },
  registerRequest(state) {
    state.registering = true;
    state.registerError = '';
    state.registerErrorCode = 0;
  },

  loginSuccess(state, accessToken) {
    state.accessToken = accessToken;
    state.authenticationSuccess = true;
    state.authenticating = false;
  },

  loginError(state, { errorCode, errorMessage }) {
    state.authenticating = false;
    state.authenticationErrorCode = errorCode;
    state.authenticationError = errorMessage;
  },
  registerError(state, { errorCode, errorMessage }) {
    state.authenticating = false;
    state.authenticationErrorCode = errorCode;
    state.authenticationError = errorMessage;
  },
  registerSuccess(state) {
    state.registerSuccess = true;
    state.authenticating = false;
  },
  logoutSuccess(state) {
    state.accessToken = '';
  },
};

export const auth = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
