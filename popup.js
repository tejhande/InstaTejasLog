const domain = "https://www.instagram.com";

// Function to set cookies
function setCookies(domain, cookieString, callback) {
  const cookieArray = cookieString.split(';');
  
  cookieArray.forEach(cookiePair => {
    const [name, value] = cookiePair.split('=').map(item => item.trim());
    if (name && value) {
      chrome.cookies.set({
        url: domain,
        name: name,
        value: value,
        path: "/",
        secure: false,
        httpOnly: false
      }, () => {
        console.log(`Cookie set: ${name}=${value}`);
        callback(domain);
      });
    }
  });
}

// Function to reload the active tab
function reloadTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    chrome.tabs.update(currentTab.id, { url: domain });
  });
}

// Function to clear cookies and logout
function logout(callback) {
  chrome.cookies.getAll({ domain: new URL(domain).hostname }, (cookies) => {
    cookies.forEach(cookie => {
      chrome.cookies.remove({ url: domain + cookie.path, name: cookie.name });
    });
    callback();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login_button');
  const logoutButton = document.getElementById('logout_button');
  const cookieInput = document.getElementById('cookie-input');
  const loadingData = document.getElementById('loading_data');

  // Check if cookies are already set on load
  chrome.cookies.getAll({ domain: new URL(domain).hostname }, (cookies) => {
    if (cookies.length > 0) {
      loginButton.style.display = 'none';
      logoutButton.style.display = 'inline-block';
    } else {
      loginButton.style.display = 'inline-block';
      logoutButton.style.display = 'none';
    }
  });

  // Login button click handler
  loginButton.addEventListener('click', () => {
    const cookieValue = cookieInput.value.trim();
    if (cookieValue) {
      loadingData.style.display = 'block';
      setCookies(domain, cookieValue, () => {
        loadingData.style.display = 'none';
        loginButton.style.display = 'none';
        logoutButton.style.display = 'inline-block';
        reloadTab(); // Reload the tab after setting cookies
      });
    } else {
      alert('Please enter a valid cookie string.');
    }
  });

  // Logout button click handler
  logoutButton.addEventListener('click', () => {
    loadingData.style.display = 'block';
    logout(() => {
      loadingData.style.display = 'none';
      loginButton.style.display = 'inline-block';
      logoutButton.style.display = 'none';
      reloadTab(); // Reload the tab after clearing cookies
    });
  });
});
