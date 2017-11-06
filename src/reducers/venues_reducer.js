export default function venuesReducer(state = [], action) {
  switch(action.type) {
    case 'ADD_VENUES' :
      return action.venues;
    default :
      return state;
  }
}
