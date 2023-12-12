// src/app.js

import { Auth, getUser } from './auth';
import { getUserFragments, getUserFragmentsExpanded, postFragment, deleteFragment, updateFragment, getFragmentById, getFragmentMetaById, getHealthCheck } from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const getForm = document.querySelector('#get-form');
  const postForm = document.querySelector('#post-form');
  const postImageForm = document.querySelector('#post-image-form');
  const deleteForm = document.querySelector('#delete-form');
  const updateForm = document.querySelector('#update-form');
  const updateImageForm = document.querySelector('#update-image-form');
  const fragmentDataTypeDropdown = document.querySelector('#fragmentDataType');
  const fragmentDataInputField = document.querySelector('#fragmentData');
  const fragmentImageDataInputField = document.querySelector('#fragmentImageData');
  const updateFragmentIdInputField = document.querySelector('#updateFragmentId');
  const updateFragmentImageIdInputField = document.querySelector('#updateFragmentImageId');
  const updateFragmentDataTypeDropdown = document.querySelector('#updateFragmentDataType');
  const updateFragmentDataInputField = document.querySelector('#updateFragmentData');
  const updateFragmentImageDataInputField = document.querySelector('#updateFragmentImageData');
  const getByIdForm = document.querySelector('#get-by-id-form');
  const fragmentIdInputField = document.querySelector('#fragmentId');
  const deleteFragmentIdInputField = document.querySelector('#deleteFragmentId')
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

  // Event handler to deal with "Create fragment and store it in the fragments server" form submission
  postForm.onsubmit = async (e) => {
    e.preventDefault(); // prevent the browser from automatically submitting the form
    if (user) {
      let fragmentDataType = fragmentDataTypeDropdown.value; // get the value from the dropdown field
      let fragmentData = fragmentDataInputField.value.trim(); // get the value from the text input field

      if (fragmentData.length > 0) {
        await postFragment(user, fragmentData, fragmentDataType); // create the fragment and save it to db
        fragmentDataInputField.value = '';  // clear the input field
      } else {
        alert("No data entered");
      }
    }
  }

  // Event handler to deal with "Create image fragment and store it in the fragments server" form submission
  postImageForm.onsubmit = async (e) => {
    e.preventDefault(); // prevent the browser from automatically submitting the form
    if (user) {
      // get the image from the file input field
      if (document.forms['post-image-form']['fragmentImageData'].files.length > 0) {
        let imageFile = document.forms['post-image-form']['fragmentImageData'].files[0];

        imageFile.arrayBuffer().then(async buff => {
          let imageArr = new Uint8Array(buff); // convert image to Uint8Array
          await postFragment(user, imageArr, imageFile.type); // create the fragment and save it to db
        });

        fragmentImageDataInputField.value = '';  // clear the input field
      } else {
        alert("No file chosen");
      }
    }
  }

  // Event handler to deal with "Get list of user's existing fragments" form submission
  getForm.onsubmit = async (e) => {
    e.preventDefault(); // prevent the browser from automatically submitting the form
    if (user) {
      if (document.activeElement.value == 'Get user fragments') {
        await getUserFragments(user);  // get fragments from db
      } else if (document.activeElement.value == 'Get expanded user fragments') {
        await getUserFragmentsExpanded(user);  // get expanded fragments from db
      }
    }
  }

  // Event handler to deal with "Get an existing fragment by ID" form submission
  getByIdForm.onsubmit = async (e) => {
    e.preventDefault(); // prevent the browser from automatically submitting the form
    if (user) {
      let fragmentId = fragmentIdInputField.value.trim(); // get the value from the text input field

      if (fragmentId.length > 0) {
        if (document.activeElement.value == 'Get user fragment by ID') {
          await getFragmentById(user, fragmentId);  // get fragment from db
        } else if (document.activeElement.value == 'Get fragment metadata by ID') {
          await getFragmentMetaById(user, fragmentId);  // get fragment metadata from db
        }
      } else {
        alert("No id entered");
      }
    }
  }

  // Event handler to deal with "Delete an existing fragment" form submission
  deleteForm.onsubmit = async (e) => {
    e.preventDefault(); // prevent the browser from automatically submitting the form
    if (user) {
      let fragmentId = deleteFragmentIdInputField.value.trim(); // get the value from the text input field

      if (fragmentId.length > 0) {
        await deleteFragment(user, fragmentId);  // get fragment from db
      } else  {
        alert("No id entered");
      }
    }
  }

  // Event handler to deal with "Update an existing fragment" form submission
  updateForm.onsubmit = async (e) => {
    e.preventDefault(); // prevent the browser from automatically submitting the form
    if (user) {
      let fragmentId = updateFragmentIdInputField.value.trim(); // get the value from the text input field

      if (fragmentId.length > 0) {
        let fragmentDataType = updateFragmentDataTypeDropdown.value; // get the value from the dropdown field
        let fragmentData = updateFragmentDataInputField.value.trim(); // get the value from the text input field

        if (fragmentData.length > 0) {
          await updateFragment(user, fragmentId, fragmentData, fragmentDataType); // update the fragment
          updateFragmentIdInputField.value = ''; // clear the id field
          updateFragmentDataInputField.value = '';  // clear the input field
        } else {
          alert("No data entered");
        }
      } else {
        alert("No id entered");
      }
    }
  }

  // Event handler to deal with "Update an existing image fragment" form submission
  updateImageForm.onsubmit = async (e) => {
    e.preventDefault(); // prevent the browser from automatically submitting the form
    if (user) {
      let fragmentId = updateFragmentImageIdInputField.value.trim(); // get the value from the text input field

      if (fragmentId.length > 0) {
        // get the image from the file input field
        if (document.forms['update-image-form']['updateFragmentImageData'].files.length > 0) {
          let imageFile = document.forms['update-image-form']['updateFragmentImageData'].files[0];

          imageFile.arrayBuffer().then(async buff => {
            let imageArr = new Uint8Array(buff); // convert image to Uint8Array
            await updateFragment(user, fragmentId, imageArr, imageFile.type); // update the fragment
            updateFragmentImageIdInputField.value = ''; // clear the id field
            updateFragmentImageDataInputField.value = '';  // clear the input field
          });
        } else {
          alert("No file chosen");
        }
      } else {
        alert("No id entered");
      }
    }
  }

  // Event handler to deal with "Access health check route" button
  healthCheckBtn.onclick = async () => {
    // Do an authenticated request to the fragments API server and log the result
    await getHealthCheck();
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
  await getUserFragmentsExpanded(user);
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);
