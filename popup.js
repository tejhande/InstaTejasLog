document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login_button');
  const logoutButton = document.getElementById('logout_button');
  const cookieInput = document.getElementById('cookie-input');
  const loadingData = document.getElementById('loading_data');

  loginButton.addEventListener('click', () => {
    const cookieValue = cookieInput.value.trim();
    if (cookieValue) {
      // Implement your login logic here
      loadingData.style.display = 'block';
      setTimeout(() => {
        alert('Logged in successfully!');
        loadingData.style.display = 'none';
        logoutButton.style.display = 'inline-block';
        loginButton.style.display = 'none';
      }, 1000); // Simulate loading time
    }
  });

  logoutButton.addEventListener('click', () => {
    // Implement your logout logic here
    loadingData.style.display = 'block';
    setTimeout(() => {
      alert('Logged out successfully!');
      loadingData.style.display = 'none';
      loginButton.style.display = 'inline-block';
      logoutButton.style.display = 'none';
    }, 1000); // Simulate loading time
  });
});