import '@babel/polyfill'
import { login, logout } from './login'


//DOM elements
const loginForm = document.querySelector('.form');
const logoutButton = document.querySelector('.logout');


if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;
    console.log('email', email)
    login(email, password)
  })
}


if (logoutButton) {
  console.log('ii')
  logoutButton.addEventListener('click', logout);
}