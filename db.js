const STORAGE_KEY = 'blue-web-users';
const SESSION_KEY = 'blue-web-current-user';

function generateBlueId() {
  const partA = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  const partB = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  return `BLU-${partA}-${partB}`;
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function getUserByBlueId(blueId) {
  return readUsers()[blueId] || null;
}

function createUser({ username, email, password }) {
  const users = readUsers();
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
  saveUsers(users);
  return user;
}

function loginUser(blueId, password) {
  const user = getUserByBlueId(blueId);
  if (!user || user.password !== password) return null;
  localStorage.setItem(SESSION_KEY, blueId);
  return user;
}

function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

function getCurrentUser() {
  const activeId = localStorage.getItem(SESSION_KEY);
  if (!activeId) return null;
  return getUserByBlueId(activeId);
}

function updateUser(user) {
  const users = readUsers();
  users[user.blueId] = user;
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, user.blueId);
}

function exportUserProfile(user) {
  return JSON.stringify({
    version: 1,
    exportedAt: new Date().toISOString(),
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

function importUserProfile(jsonText) {
  const parsed = JSON.parse(jsonText);
  if (!parsed || !parsed.user || !parsed.user.blueId || !parsed.user.username || !parsed.user.password) {
    throw new Error('Invalid profile file.');
  }

  const user = parsed.user;
  const users = readUsers();
  users[user.blueId] = {
    blueId: user.blueId,
    username: user.username,
    email: user.email || '',
    password: user.password,
    createdAt: user.createdAt || new Date().toISOString(),
    data: user.data || {}
  };

  saveUsers(users);
  localStorage.setItem(SESSION_KEY, user.blueId);
  return users[user.blueId];
}
