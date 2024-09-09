const domain = "https://www.instagram.com";

// Function to set cookies with secure flag and expiration date
function setCookies(domain, cookieString, callback) {
  const cookieArray = cookieString.split(';');
  const expirationDate = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // Set expiration for 7 days

  cookieArray.forEach(cookiePair => {
    const [name, value] = cookiePair.split('=').map(item => item.trim());
    if (name && value) {
      chrome.cookies.set({
        url: domain,
        name: name,
        value: value,
        path: "/",
        secure: true, // Set secure to true for HTTPS
        httpOnly: false, // Adjust if necessary
        expirationDate: expirationDate // Set expiration date
      }, () => {
        console.log(`Cookie set: ${name}=${value}`);
      });
    }
  });

  if (callback) callback(domain);
}

// Reload Tab function
function reloadTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab) {
      chrome.tabs.update(currentTab.id, { url: domain });
    }
  });
}

// Clear Cookies function
function logout(callback) {
  chrome.cookies.getAll({ domain: new URL(domain).hostname }, (cookies) => {
    cookies.forEach(cookie => {
      chrome.cookies.remove({ url: domain + cookie.path, name: cookie.name }, () => {
        console.log(`Cookie removed: ${cookie.name}`);
      });
    });

    if (callback) callback();
  });
}

// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login_button');
  const logoutButton = document.getElementById('logout_button');
  const cookieInput = document.getElementById('cookie-input');
  const loadingData = document.getElementById('loading_data');

  // Check if cookies are already set
  chrome.cookies.getAll({ domain: new URL(domain).hostname }, (cookies) => {
    if (cookies.length > 0) {
      loginButton.style.display = 'none';
      logoutButton.style.display = 'inline-block';
    } else {
      loginButton.style.display = 'inline-block';
      logoutButton.style.display = 'none';
    }
  });

  // Login Button Click Event
  loginButton.addEventListener('click', () => {
    const cookieValue = cookieInput.value.trim();
    if (cookieValue) {
      loadingData.style.display = 'block';
      setCookies(domain, cookieValue, () => {
        loadingData.style.display = 'none';
        loginButton.style.display = 'none';
        logoutButton.style.display = 'inline-block';
        reloadTab();
      });
    } else {
      alert('Please enter a valid cookie string.');
    }
  });

  // Logout Button Click Event
  logoutButton.addEventListener('click', () => {
    loadingData.style.display = 'block';
    logout(() => {
      loadingData.style.display = 'none';
      loginButton.style.display = 'inline-block';
      logoutButton.style.display = 'none';
      reloadTab();
    });
  });
});
