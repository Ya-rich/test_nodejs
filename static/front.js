function sendRequest(requestMethod, url, payload, callback) {
  const XHR = new XMLHttpRequest();

  // Define what happens on successful data submission
  XHR.addEventListener('load', function (event) {
    const res = JSON.parse(event.currentTarget.response);
    console.log(event);
    if (event.currentTarget.status !== 200) {
      alert(res.message);
    } else if (callback && typeof (callback) === 'function') {
      callback(res);
    } else {
      console.log(res)
    }
  });

  // Define what happens in case of error
  XHR.addEventListener('error', function (event) {
    alert('Oops! Something went wrong.');
  });
  // Set up our request
  XHR.open(requestMethod, 'http://localhost:3000' + url);
  // Add the required HTTP header for form data POST requests
  XHR.setRequestHeader('Content-Type', 'application/json');

  if (payload) XHR.send(JSON.stringify(payload));
  else XHR.send()

}

function processRegistration() {

  const newUser = {};
  newUser.firstName = document.getElementById('firstName').value;
  newUser.lastName = document.getElementById('lastName').value;
  newUser.email = document.getElementById('email').value;
  newUser.password = document.getElementById('password').value;

  const passwordAccept = document.getElementById('passwordAccept').value;

  if (passwordAccept === newUser.password) {
    sendRequest('POST', '/register ', newUser);
  } else {
    alert("Пароли не совпадают")
  }
}

function processLogin() {

  const loginUser = {};
  loginUser.email = document.getElementById('email').value;
  loginUser.password = document.getElementById('password').value;

  sendRequest('POST', '/login ', loginUser, (user) => {
    localStorage.setItem("userId", user.id);
    localStorage.setItem("token", user.token);
    window.location.href = '/profile.html'
  });
}

window.addEventListener("load", () => {

  const showPass = document.getElementById("password-visibility");
  const passType = document.getElementById("password");
  const passTypeAcc = document.getElementById("passwordAccept");

  showPass.addEventListener("click", function () {
      console.log(this.textContent);
      if (this.textContent === "visibility_off") {

        this.textContent = "visibility";
        passType.setAttribute("type", "text");
        passTypeAcc.setAttribute("type", "text");

      } else {

        this.textContent = "visibility_off";
        passType.setAttribute("type", "password");
        passTypeAcc.setAttribute("type", "password");
      }
    }
  )

});
