document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const authScreen = document.getElementById('authScreen');
  const dashboardScreen = document.getElementById('dashboardScreen');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  
  // Login form
  const loginBlueId = document.getElementById('loginBlueId');
  const loginPassword = document.getElementById('loginPassword');
  const loginBtn = document.getElementById('loginBtn');
  const loginError = document.getElementById('loginError');
  
  // Signup form
  const signupUsername = document.getElementById('signupUsername');
  const signupEmail = document.getElementById('signupEmail');
  const signupBio = document.getElementById('signupBio');
  const signupPassword = document.getElementById('signupPassword');
  const signupConfirm = document.getElementById('signupConfirm');
  const signupBtn = document.getElementById('signupBtn');
  const signupError = document.getElementById('signupError');
  const blueIdBox = document.getElementById('blueIdBox');
  const generatedBlueId = document.getElementById('generatedBlueId');
  
  // Dashboard
  const welcomeMsg = document.getElementById('welcomeMsg');
  const profileBlueId = document.getElementById('profileBlueId');
  const profileUsername = document.getElementById('profileUsername');
  const profileEmail = document.getElementById('profileEmail');
  const profileCreated = document.getElementById('profileCreated');
  const profileNameDisplay = document.getElementById('profileNameDisplay');
  const profileBioDisplay = document.getElementById('profileBioDisplay');
  const profileAvatar = document.getElementById('profileAvatar');
  const avatarPlaceholder = document.getElementById('avatarPlaceholder');
  const userDataList = document.getElementById('userDataList');
  const logoutBtn = document.getElementById('logoutBtn');
  const editProfileBtn = document.getElementById('editProfileBtn');
  const copyBlueIdBtn = document.getElementById('copyBlueIdBtn');
  
  // Edit profile modal
  const editProfileModal = document.getElementById('editProfileModal');
  const closeEditModal = document.getElementById('closeEditModal');
  const editAvatarUrl = document.getElementById('editAvatarUrl');
  const editAvatarPreview = document.getElementById('editAvatarPreview');
  const editDisplayName = document.getElementById('editDisplayName');
  const editBio = document.getElementById('editBio');
  const editLocation = document.getElementById('editLocation');
  const editPhone = document.getElementById('editPhone');
  const editWebsite = document.getElementById('editWebsite');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const editError = document.getElementById('editError');
  
  // Data modal
  const addDataBtn = document.getElementById('addDataBtn');
  const addDataModal = document.getElementById('addDataModal');
  const dataKey = document.getElementById('dataKey');
  const dataValue = document.getElementById('dataValue');
  const saveDataBtn = document.getElementById('saveDataBtn');
  const dataError = document.getElementById('dataError');
  const closeDataModal = document.getElementById('closeDataModal');
  
  // Import/Export
  const exportBtn = document.getElementById('exportBtn');
  const importBtn = document.getElementById('importBtn');
  const importFileInput = document.getElementById('importFileInput');

  // Functions
  function showAuthScreen() {
    authScreen.classList.add('active');
    dashboardScreen.classList.remove('active');
  }

  function showDashboard() {
    dashboardScreen.classList.add('active');
    authScreen.classList.remove('active');
    refreshDashboard();
  }

  function refreshDashboard() {
    const user = getLoggedInUser();
    if (!user) return;

    welcomeMsg.textContent = `Welcome, ${user.username}!`;
    profileBlueId.textContent = user.blueId;
    profileUsername.textContent = user.username;
    profileEmail.textContent = user.email || 'Not set';
    profileCreated.textContent = new Date(user.createdAt).toLocaleDateString();

    // Profile info
    const profile = user.profile || {};
    profileNameDisplay.textContent = profile.displayName || user.username;
    profileBioDisplay.textContent = profile.bio || 'No bio set';

    // Avatar
    if (profile.avatarUrl) {
      profileAvatar.src = profile.avatarUrl;
      profileAvatar.style.display = 'block';
      avatarPlaceholder.style.display = 'none';
    } else {
      profileAvatar.style.display = 'none';
      avatarPlaceholder.style.display = 'flex';
    }

    // Data
    const dataEntries = Object.entries(user.data || {});
    if (dataEntries.length === 0) {
      userDataList.innerHTML = '<div class="data-item">No custom data. Click <strong>+ Add Data</strong> to get started.</div>';
    } else {
      userDataList.innerHTML = dataEntries
        .map(([key, value]) => {
          const displayVal = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
          return `<div class="data-item"><strong>${key}:</strong> ${displayVal}</div>`;
        })
        .join('');
    }
  }

  function switchTab(tabName) {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    loginForm.classList.remove('active');
    signupForm.classList.remove('active');
    
    if (tabName === 'login') {
      loginForm.classList.add('active');
    } else {
      signupForm.classList.add('active');
    }
  }

  function openEditModal() {
    const user = getLoggedInUser();
    if (!user) return;
    
    const profile = user.profile || {};
    editAvatarUrl.value = profile.avatarUrl || '';
    editDisplayName.value = profile.displayName || user.username;
    editBio.value = profile.bio || '';
    editLocation.value = profile.location || '';
    editPhone.value = profile.phone || '';
    editWebsite.value = profile.website || '';
    editError.textContent = '';
    
    updateAvatarPreview();
    editProfileModal.classList.remove('hidden');
    editProfileModal.classList.add('active');
  }

  function closeEditModalFn() {
    editProfileModal.classList.add('hidden');
    editProfileModal.classList.remove('active');
  }

  function updateAvatarPreview() {
    const url = editAvatarUrl.value.trim();
    if (url) {
      editAvatarPreview.src = url;
      editAvatarPreview.onload = () => {
        editAvatarPreview.classList.add('show');
      };
      editAvatarPreview.onerror = () => {
        editAvatarPreview.classList.remove('show');
      };
    } else {
      editAvatarPreview.classList.remove('show');
    }
  }

  function openDataModal() {
    dataKey.value = '';
    dataValue.value = '';
    dataError.textContent = '';
    addDataModal.classList.remove('hidden');
    addDataModal.classList.add('active');
  }

  function closeDataModalFn() {
    addDataModal.classList.add('hidden');
    addDataModal.classList.remove('active');
  }

  // Event listeners - Tab switching
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Login
  loginBtn.addEventListener('click', function() {
    loginError.textContent = '';
    const blueId = loginBlueId.value.trim();
    const password = loginPassword.value;

    if (!blueId || !password) {
      loginError.textContent = 'Please fill in all fields';
      return;
    }

    const user = loginUser(blueId, password);
    if (!user) {
      loginError.textContent = 'Invalid Blue ID or password';
      return;
    }

    loginBlueId.value = '';
    loginPassword.value = '';
    showDashboard();
  });

  // Signup
  signupBtn.addEventListener('click', function() {
    signupError.textContent = '';
    const username = signupUsername.value.trim();
    const email = signupEmail.value.trim();
    const bio = signupBio.value.trim();
    const password = signupPassword.value;
    const confirm = signupConfirm.value;

    if (!username || !password) {
      signupError.textContent = 'Username and password are required';
      return;
    }

    if (password.length < 6) {
      signupError.textContent = 'Password must be at least 6 characters';
      return;
    }

    if (password !== confirm) {
      signupError.textContent = 'Passwords do not match';
      return;
    }

    const user = registerUser(username, email, password, bio);
    generatedBlueId.textContent = user.blueId;
    blueIdBox.classList.remove('hidden');
    
    signupUsername.value = '';
    signupEmail.value = '';
    signupBio.value = '';
    signupPassword.value = '';
    signupConfirm.value = '';
  });

  // Edit Profile
  editProfileBtn.addEventListener('click', openEditModal);
  closeEditModal.addEventListener('click', closeEditModalFn);
  editProfileModal.addEventListener('click', function(e) {
    if (e.target === editProfileModal) closeEditModalFn();
  });

  editAvatarUrl.addEventListener('input', updateAvatarPreview);

  saveProfileBtn.addEventListener('click', function() {
    const user = getLoggedInUser();
    if (!user) return;

    editError.textContent = '';
    const displayName = editDisplayName.value.trim();
    
    if (!displayName) {
      editError.textContent = 'Display name is required';
      return;
    }

    updateUserProfile(user, {
      displayName,
      avatarUrl: editAvatarUrl.value.trim(),
      bio: editBio.value.trim(),
      location: editLocation.value.trim(),
      phone: editPhone.value.trim(),
      website: editWebsite.value.trim()
    });

    closeEditModalFn();
    refreshDashboard();
  });

  // Logout
  logoutBtn.addEventListener('click', function() {
    logoutUser();
    showAuthScreen();
    switchTab('login');
  });

  // Copy Blue ID
  copyBlueIdBtn.addEventListener('click', async function() {
    const text = profileBlueId.textContent;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      copyBlueIdBtn.textContent = '✓ Copied';
      setTimeout(() => {
        copyBlueIdBtn.textContent = '📋';
      }, 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  });

  // Data modal
  addDataBtn.addEventListener('click', openDataModal);
  closeDataModal.addEventListener('click', closeDataModalFn);
  addDataModal.addEventListener('click', function(e) {
    if (e.target === addDataModal) closeDataModalFn();
  });

  // Save data
  saveDataBtn.addEventListener('click', function() {
    const user = getLoggedInUser();
    const key = dataKey.value.trim();
    const rawValue = dataValue.value.trim();

    if (!user || !key) {
      dataError.textContent = 'Please enter a key';
      return;
    }

    let value = rawValue;
    try {
      if (rawValue) value = JSON.parse(rawValue);
    } catch {
      value = rawValue;
    }

    user.data = user.data || {};
    user.data[key] = value;
    updateUserData(user);
    closeDataModalFn();
    refreshDashboard();
  });

  // Export
  exportBtn.addEventListener('click', function() {
    const user = getLoggedInUser();
    if (!user) return;

    const json = exportProfile(user);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${user.blueId}-profile.json`;
    link.click();
    URL.revokeObjectURL(url);
  });

  // Import
  importBtn.addEventListener('click', function() {
    importFileInput.click();
  });

  importFileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      try {
        const user = importProfile(event.target.result);
        refreshDashboard();
        showDashboard();
      } catch (err) {
        alert('Import failed: ' + err.message);
      }
    };
    reader.readAsText(file);
    importFileInput.value = '';
  });

  // Init
  const logged = getLoggedInUser();
  if (logged) {
    showDashboard();
  } else {
    showAuthScreen();
    switchTab('login');
  }
});
