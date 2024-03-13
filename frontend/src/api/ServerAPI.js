import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/**API Class
 *
 * Class with methods to interact with backend server api
 */

export default class ServerAPI {
  //token for user auth will be stored here
  static token;

  static async request(endpoint, method = "get", data = {}) {
    // console.debug("API Call:", endpoint, data, method);

    //We can use the static token and pass it in the header with requests
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${ServerAPI.token}` };
    const params = method === "get" ? data : {};
    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  /**
   * API Endpoints
   *  /users
   * HTTP GET: returns array of all users
   * HTTP POST: creates a new user, returns the created user data
   *
   * /users/:id
   * HTTP GET: returns the user with given id (numeric, auto-incrementing). HTTP 404 if user not found
   * HTTP PUT: updates the user with given id and returns updated record. HTTP 404 if user not fund.
   * HTTP DELETE: removes the users with given id, returns nothing (HTTP 204)
   */

  static async getAllUsers() {
    const endpoint = "users";
    try {
      const response = await this.request(endpoint);
      return response;
    } catch (err) {
      throw err;
    }
  }

  /** POST "/users/register" - { user } => { token }
   * user must include { email, password, firstName, lastName, }
   * Returns JWT token
   */

  static async register(newUser) {
    const endpoint = "users";
    const method = "post";
    const data = newUser;

    try {
      const response = await this.request(endpoint, method, data);
      ServerAPI.token = response.token;
      localStorage.setItem("ServerToken", response.token);
      return response.token;
    } catch (err) {
      throw err;
    }
  }

  /** POST "/users/login" - { username, password } => { token }
   * Authenticates username and password
   * Returns JWT token
   **/
  static async login(user) {
    const endpoint = "users/login";
    const method = "post";
    const data = user;
    try {
      const response = await this.request(endpoint, method, data);
      //Save token to api class
      ServerAPI.token = response.token;
      localStorage.setItem("ServerToken", response.token);
      return response.token;
    } catch (err) {
      throw err;
    }
  }
}
