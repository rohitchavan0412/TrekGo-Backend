import '@babel/polyfill';
import { login, logout } from './login';
import { updateUserSetting } from './updateUser';
import { signUp } from './signup';
import { bookTour } from './stripe';


//DOM elements
const loginForm = document.querySelector('.form--login');
const logoutButton = document.querySelector('.logout');
const userPasswordForm = document.querySelector('.form-user-password');
const bookButton = document.getElementById('book-tour');
const signUpForm = document.querySelector('.form--signup');


if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;
    console.log('email', email)
    login(email, password)
  })
}

if (signUpForm) {
  signUpForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;
    const confirmPassword = document.getElementById('ConfirmPassword').value;
    console.log('name', name);
    signUp(name, email, password, confirmPassword);
  })
}


if (logoutButton) {
  console.log('ii')
  logoutButton.addEventListener('click', logout);
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    console.log('bb')
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


if (bookButton) {
  bookButton.addEventListener('click', e => {
    e.target.textContent = 'Processing..';
    const tourID = e.target.dataset.tourId;
    bookTour(tourID)
  })
}