import Axios from "axios";

const API_URL = "/api/auth/";

class AuthService {
  login(username, password) {
    return Axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          sessionStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    sessionStorage.removeItem("user");
  }

  register(firstName, lastName, email, address, phone, username, password) {
    return Axios.post(API_URL + "signup", {
      firstName,
      lastName,
      email,
      address,
      phone,
      username,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('user'));;
  }
}

export default new AuthService();