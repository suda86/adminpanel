let storage = JSON.parse(localStorage.getItem('adminpanel'));
let authStatus
if (storage) {
  authStatus = storage.auth;
} else {
  authStatus = false;
}

export default function authReducer(state = authStatus, action) {
  switch(action.type) {
    case 'SIGNIN' :
      return true;
    case 'SIGNOUT' :
      localStorage.setItem('adminpanel', JSON.stringify({auth: false}));
      return false;
    default :
      return state
  }
}
