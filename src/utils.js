export function getToken(logout) {
    const storage = JSON.parse(localStorage.getItem('adminpanel'));
    if (storage) {
      return 'Bearer ' + storage.token;
    } else {
      logout()
    }
}

export let genres = [
    'house',
    'trance',
    'trap',
    'top40',
    'rock',
    'soca',
    'techno',
    'rap',
    'jazz',
    'pop',
    'dubstep',
    'dance',
    'blues',
    'country',
    'deepHouse',
    'drum&bass',
    'funk',
    'latin',
    'metal',
    'live',
    'punk',
    'reggae',
    'r&b',
    'soul',
    'hiphop'
  ];