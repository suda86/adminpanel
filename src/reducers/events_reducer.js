export default function eventsReducer(state = [], action) {
  switch(action.type) {
    case 'ADD_EVENTS' :
      return action.events;
    default :
      return state;
  }
}
