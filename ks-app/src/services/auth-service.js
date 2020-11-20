import Axios from "axios";

const API_URL = "/auth/";

class AuthService {
  login(username, password) {
    return Axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
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
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();