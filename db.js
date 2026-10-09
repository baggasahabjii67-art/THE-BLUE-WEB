const STORAGE_KEY = 'blue_web_users';
const SESSION_KEY = 'blue_web_session';

function generateBlueId() {
  const part1 = Math.random().toString(36).substr(2, 8).toUpperCase();
  const part2 = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `BLU-${part1}-${part2}`;
}

function readAllUsers() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Error reading users:', e);
    return {};
  }
}

function saveAllUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users:', e);
  }
}

function getUserByBlueId(blueId) {
  const users = readAllUsers();
  return users[blueId] || null;
}

function registerUser(username, email, password) {
  const users = readAllUsers();
  let blueId = generateBlueId();
  
  while (users[blueId]) {
    blueId = generateBlueId();
  }

  const user = {
    blueId,
    username,
    email: email || '',
    password,
    createdAt: new Date().toISOString(),
    data: {}
  };

  users[blueId] = user;
  saveAllUsers(users);
  return user;
}

function loginUser(blueId, password) {
  const user = getUserByBlueId(blueId);
  if (!user || user.password !== password) {
    return null;
  }
  localStorage.setItem(SESSION_KEY, blueId);
  return user;
}

function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

function getLoggedInUser() {
  const blueId = localStorage.getItem(SESSION_KEY);
  if (!blueId) return null;
  return getUserByBlueId(blueId);
}

function updateUserData(user) {
  const users = readAllUsers();
  users[user.blueId] = user;
  saveAllUsers(users);
  localStorage.setItem(SESSION_KEY, user.blueId);
}

function exportProfile(user) {
  return JSON.stringify({
    version: 1,
    exportDate: new Date().toISOString(),
    user: {
      blueId: user.blueId,
      username: user.username,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      data: user.data || {}
    }
  }, null, 2);
}

function importProfile(jsonText) {
  const profile = JSON.parse(jsonText);
  if (!profile.user || !profile.user.blueId) {
    throw new Error('Invalid profile file');
  }

  const users = readAllUsers();
  const userData = profile.user;
  
  users[userData.blueId] = {
    blueId: userData.blueId,
    username: userData.username,
    email: userData.email || '',
    password: userData.password,
    createdAt: userData.createdAt || new Date().toISOString(),
    data: userData.data || {}
  };
  
  saveAllUsers(users);
  localStorage.setItem(SESSION_KEY, userData.blueId);
  return users[userData.blueId];
}
