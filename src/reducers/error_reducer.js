export default function errorReducer(state = '', action) {
    switch(action.type) {
      case 'ERROR' :
        return action.message;
      default :
        return state
    }
  }