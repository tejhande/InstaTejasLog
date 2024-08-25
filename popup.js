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

// Event listeners for login and logout
document.getElementById('login_button').addEventListener('click', () => {
  const cookieInput = document.getElementById('cookie-input').value;
  document.getElementById('loading_data').style.display = 'block';

  setCookies(domain, cookieInput, () => {
    document.getElementById('loading_data').style.display = 'none';
    document.getElementById('login_button').style.display = 'none';
    document.getElementById('logout_button').style.display = 'block';
    reloadTab();
  });
});

document.getElementById('logout_button').addEventListener('click', () => {
  document.getElementById('loading_data').style.display = 'block';

  logout(() => {
    document.getElementById('loading_data').style.display = 'none';
    document.getElementById('login_button').style.display = 'block';
    document.getElementById('logout_button').style.display = 'none';
    reloadTab();
  });
});

// Check if cookies are already set on load
chrome.cookies.getAll({ domain: new URL(domain).hostname }, (cookies) => {
  if (cookies.length > 0) {
    document.getElementById('login_button').style.display = 'none';
    document.getElementById('logout_button').style.display = 'block';
  }
});
