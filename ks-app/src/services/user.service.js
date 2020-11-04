import Axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/test/';

class UserService {
  getPublicContent() {
    return Axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return Axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return Axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return Axios.get(API_URL + 'admin', { headers: authHeader() });
  }
}

export default new UserService();