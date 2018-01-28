import axios from 'axios';
import serverUrl from '../serverUrl'
import { getToken } from '../utils'

export function signIn() {
  return {
    type: 'SIGNIN'
  };
}

export function signOut() {
  return {
    type: 'SIGNOUT'
  };
}

export function loginError(message) {
  return {
    type: 'ERROR',
    message
  }
}

export function login(email, password) {
  return function(dispatch) {
    axios
      .post(`${serverUrl}super-admin/login`, {
        email,
        password
      })
      .then(res => {
        localStorage.setItem(
          'adminpanel',
          JSON.stringify({ auth: true, token: res.data.token })
        );
        dispatch(signIn());
        dispatch(loginError(''))
      })
      .catch(e => {
        dispatch(signOut());
        dispatch(loginError('wrong email or password'))
      });
  };
}

export function fetchUsers() {
  return function fetch(dispatch) {
    let token = getToken(signOut)
    axios
      .get(`${serverUrl}users`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        dispatch({
          type: 'ADD_USERS',
          users: res.data.results
        });
      })
      .catch(e => {
        console.log(e);
        dispatch(signOut());
      });
  };
}

export function fetchEvents(id) {
  return function fetchEv(dispatch) {
    let token = getToken(signOut)
    let link;
    if (!id) {
      link = `${serverUrl}events`;
    } else {
      link = `${serverUrl}venue/${id}/events`;
    }
    axios
      .get(link, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        dispatch({
          type: 'ADD_EVENTS',
          events: res.data.results
        });
      })
      .catch(e => {
        console.log(e);
        dispatch(signOut());
      });
  };
}

export function fetchVenues() {
  return function fetchVe(dispatch) {
    let token = getToken(signOut)
    axios
      .get(`${serverUrl}venues`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        dispatch({
          type: 'ADD_VENUES',
          venues: res.data.results
        });
      })
      .catch(e => {
        console.log(e);
        dispatch(signOut());
      });
  };
}

export function deleteSingleUser() {
  return {
    type: 'DELETE_SINGLE_USER'
  };
}
export function deleteSingleEvent() {
  return {
    type: 'DELETE_SINGLE_EVENT'
  };
}

export function deleteSingleVenue() {
  return {
    type: 'DELETE_SINGLE_VENUE'
  };
}
