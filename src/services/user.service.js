import ApiService from './api.service';
import { TokenService } from './storage.service';

class AuthenticationError extends Error {
  constructor(errorCode, message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errorCode = errorCode;
  }
}

const UserService = {
  /**
   * Login the user and store the access token to TokenService.
   *
   * @returns access_token
   * @throws AuthenticationError
   **/
  login: async function (email, password) {
    const requestData = {
      method: 'post',
      url: '/Users/authenticate',
      data: {
        email: email,
        password: password,
      },
    };
    try {
      const response = await ApiService.customRequest(requestData);
      if (response.status != 200) {
        throw Error('Unauthorized Account');
      }
      const accessToken = response.data.jwtToken;
      TokenService.saveToken(accessToken);
      ApiService.setHeader();
      return accessToken;
    } catch (error) {
      console.log('Login Failed');
      throw new AuthenticationError(
        error.response.status,
        error.response.data.title
      );
    }
  },
  register: async function (registerData) {
    const requestData = {
      method: 'post',
      url: '/Users/register',
      data: registerData,
    };
    try {
      const response = await ApiService.customRequest(requestData);
      console.log(response);
      if (response.status == 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.log('Login Failed');
      throw new AuthenticationError(
        error.response.status,
        error.response.data.title
      );
    }
  },
  /**
   * Refresh the access token.
   **/
  refreshToken: async function () {
    const refreshToken = TokenService.getRefreshToken();

    const requestData = {
      method: 'post',
      url: '/users/refresh-token',
    };

    try {
      const response = await ApiService.customRequest(requestData);

      TokenService.saveToken(response.data.jwtToken);
      // Update the header in ApiService
      ApiService.setHeader();

      return response.data.access_token;
    } catch (error) {
      throw new AuthenticationError(
        error.response.status,
        error.response.data.detail
      );
    }
  },

  /**
   * Logout the current user by removing the token from storage.
   *
   * Will also remove `Authorization Bearer <token>` header from future requests.
   **/
  logout() {
    // Remove the token and remove Authorization header from Api Service as well
    TokenService.removeToken();
    ApiService.removeHeader();

    // NOTE: Again, we'll cover the 401 Interceptor a bit later.
  },
};

export default UserService;

export { UserService, AuthenticationError };
