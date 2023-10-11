// src/app.js

import { Auth, getUser } from './auth';
import { getUserFragments, postFragment, getFragmentById, getHealthCheck } from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const postForm = document.querySelector('#post-form');
  const fragmentDataInputField = document.querySelector('#fragmentData')
  const getFragmentsBtn = document.querySelector('#getFragmentsBtn');
  const getByIdForm = document.querySelector('#get-by-id-form');
  const fragmentIdInputField = document.querySelector('#fragmentId')
  const healthCheckBtn = document.querySelector('#healthCheckBtn');

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  // Event handler to deal with "Create text fragment and store it in the fragments server" form submission
  postForm.onsubmit = (e) => {
    e.preventDefault(); // prevent the browser from automatically submitting the form
    if (user) {
      let fragmentData = fragmentDataInputField.value; // get the value from the text input field
      postFragment(user, fragmentData);   // create the fragment and save it to db
      fragmentDataInputField.value = '';  // clear the input field
    }
  }

  // Event handler to deal with "Get an existing fragment by ID" form submission
  getByIdForm.onsubmit = (e) => {
    e.preventDefault(); // prevent the browser from automatically submitting the form
    if (user) {
      let fragmentId = fragmentIdInputField.value; // get the value from the text input field
      getFragmentById(user, fragmentId);  // get fragment from db
      fragmentIdInputField.value = '';  // clear the input field
    }
  }

  // Event handler to deal with "Get user fragments" button
  getFragmentsBtn.onclick = () => {
    if (user) {
      getUserFragments(user); // get fragments from db
    }
  };

  // Event handler to deal with "Access health check route" button
  healthCheckBtn.onclick = () => {
    // Do an authenticated request to the fragments API server and log the result
    console.log('clicked button');
    getHealthCheck();
  };

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;

  // Do an authenticated request to the fragments API server and log the result
  getUserFragments(user);
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);