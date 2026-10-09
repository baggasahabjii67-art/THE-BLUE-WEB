document.addEventListener('DOMContentLoaded', () => {
  const authScreen = document.getElementById('authScreen');
  const dashboardScreen = document.getElementById('dashboardScreen');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const tabButtons = document.querySelectorAll('.tab-btn');

  const loginBlueId = document.getElementById('loginBlueId');
  const loginPassword = document.getElementById('loginPassword');
  const loginBtn = document.getElementById('loginBtn');
  const loginError = document.getElementById('loginError');

  const signupUsername = document.getElementById('signupUsername');
  const signupEmail = document.getElementById('signupEmail');
  const signupPassword = document.getElementById('signupPassword');
  const signupConfirm = document.getElementById('signupConfirm');
  const signupBtn = document.getElementById('signupBtn');
  const signupError = document.getElementById('signupError');
  const blueIdBox = document.getElementById('blueIdBox');
  const generatedBlueId = document.getElementById('generatedBlueId');

  const welcomeName = document.getElementById('welcomeName');
  const profileBlueId = document.getElementById('profileBlueId');
  const profileUsername = document.getElementById('profileUsername');
  const profileEmail = document.getElementById('profileEmail');
  const profileCreated = document.getElementById('profileCreated');
  const userDataList = document.getElementById('userDataList');

  const dataModal = document.getElementById('dataModal');
  const dataKey = document.getElementById('dataKey');
  const dataValue = document.getElementById('dataValue');
  const dataError = document.getElementById('dataError');
  const addDataBtn = document.getElementById('addDataBtn');
  const saveDataBtn = document.getElementById('saveDataBtn');
  const closeDataModal = document.getElementById('closeDataModal');

  const importFileInput = document.getElementById('importFileInput');
  const exportBtn = document.getElementById('exportBtn');
  const importBtn = document.getElementById('importBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const copyBlueIdBtn = document.getElementById('copyBlueIdBtn');

  function switchTab(tab) {
    tabButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.tab === tab);
    });

    loginForm.classList.toggle('active', tab === 'login');
    signupForm.classList.toggle('active', tab === 'signup');
  }

  function renderDashboard(user) {
    welcomeName.textContent = user.username;
    profileBlueId.textContent = user.blueId;
    profileUsername.textContent = user.username;
    profileEmail.textContent = user.email || 'Not provided';
    profileCreated.textContent = new Date(user.createdAt).toLocaleString();

    const entries = Object.entries(user.data || {});
    userDataList.innerHTML = entries.length
      ? entries
          .map(([key, value]) => {
            const displayValue = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
            return `<div class="data-item"><strong>${key}:</strong> ${displayValue}</div>`;
          })
          .join('')
      : '<div class="data-item">No custom data yet.</div>';

    authScreen.classList.remove('active');
    dashboardScreen.classList.add('active');
  }

  function renderLoginScreen() {
    dashboardScreen.classList.remove('active');
    authScreen.classList.add('active');
  }

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });

  loginBtn.addEventListener('click', () => {
    loginError.textContent = '';
    const blueId = loginBlueId.value.trim();
    const password = loginPassword.value;

    if (!blueId || !password) {
      loginError.textContent = 'Please enter your Blue ID and password.';
      return;
    }

    const user = loginUser(blueId, password);
    if (!user) {
      loginError.textContent = 'Invalid Blue ID or password.';
      return;
    }

    renderDashboard(user);
    loginBlueId.value = '';
    loginPassword.value = '';
  });

  signupBtn.addEventListener('click', () => {
    signupError.textContent = '';
    const username = signupUsername.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value;
    const confirm = signupConfirm.value;

    if (!username) {
      signupError.textContent = 'Username is required.';
      return;
    }

    if (!password || password.length < 6) {
      signupError.textContent = 'Password must be at least 6 characters.';
      return;
    }

    if (password !== confirm) {
      signupError.textContent = 'Passwords do not match.';
      return;
    }

    const user = createUser({ username, email, password });
    generatedBlueId.textContent = user.blueId;
    blueIdBox.classList.remove('hidden');

    signupUsername.value = '';
    signupEmail.value = '';
    signupPassword.value = '';
    signupConfirm.value = '';
  });

  logoutBtn.addEventListener('click', () => {
    logoutUser();
    renderLoginScreen();
  });

  addDataBtn.addEventListener('click', () => {
    dataKey.value = '';
    dataValue.value = '';
    dataError.textContent = '';
    dataModal.classList.remove('hidden');
  });

  closeDataModal.addEventListener('click', () => {
    dataModal.classList.add('hidden');
  });

  saveDataBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    const key = dataKey.value.trim();
    const raw = dataValue.value.trim();

    if (!user || !key) {
      dataError.textContent = 'Please enter a key first.';
      return;
    }

    let value = raw;

    try {
      if (raw) value = JSON.parse(raw);
    } catch {
      value = raw;
    }

    user.data = user.data || {};
    user.data[key] = value;
    updateUser(user);
    renderDashboard(user);
    dataModal.classList.add('hidden');
  });

  exportBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    if (!user) return;

    const json = exportUserProfile(user);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${user.blueId}-profile.json`;
    link.click();
    URL.revokeObjectURL(url);
  });

  importBtn.addEventListener('click', () => {
    importFileInput.click();
  });

  importFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedUser = importUserProfile(e.target.result);
        renderDashboard(importedUser);
      } catch (error) {
        alert('Import failed: ' + error.message);
      }
    };
    reader.readAsText(file);
    importFileInput.value = '';
  });

  copyBlueIdBtn.addEventListener('click', async () => {
    const text = profileBlueId.textContent;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore copy issue in unsupported browsers
    }
  });

  const currentUser = getCurrentUser();
  if (currentUser) {
    renderDashboard(currentUser);
  } else {
    renderLoginScreen();
    switchTab('login');
  }
});
