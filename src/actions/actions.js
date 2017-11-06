import axios from 'axios';

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
      .post('http://46.101.135.245:8010/api/v1/super-admin/login', {
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
    const storage = JSON.parse(localStorage.getItem('adminpanel'));
    let token;
    if (storage) {
      token = 'Bearer ' + storage.token;
    } else {
      return signOut();
    }
    axios
      .get('http://46.101.135.245:8010/api/v1/users', {
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
    const storage = JSON.parse(localStorage.getItem('adminpanel'));
    let token;
    if (storage) {
      token = 'Bearer ' + storage.token;
    } else {
      return signOut();
    }
    let link;
    if (!id) {
      link = `http://46.101.135.245:8010/api/v1/events`;
    } else {
      link = `http://46.101.135.245:8010/api/v1/venue/${id}/events`;
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
    const storage = JSON.parse(localStorage.getItem('adminpanel'));
    let token;
    if (storage) {
      token = 'Bearer ' + storage.token;
    } else {
      return signOut();
    }
    axios
      .get('http://46.101.135.245:8010/api/v1/venues', {
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
