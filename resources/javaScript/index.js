import '@babel/polyfill'
import { login, logout } from './login'
import { updateUserSetting } from './updateUser'


//DOM elements
const loginForm = document.querySelector('.form--login');
const logoutButton = document.querySelector('.logout');
const userPasswordForm = document.querySelector('.form-user-password');


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
  //console.log('ii')
  logoutButton.addEventListener('click', logout);
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateUserSetting({ passwordCurrent, password, passwordConfirm });

    passwordCurrent = document.getElementById('password-current').value = '';
    password = document.getElementById('password').value = '';
    passwordConfirm = document.getElementById('password-confirm').value = '';
  })
} 