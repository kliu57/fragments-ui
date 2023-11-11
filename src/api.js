// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Got user fragments data', { data });
  } catch (err) {
    console.error('Unable to call GET /v1/fragments', { err });
  }
}

/**
 * Given an authenticated user, create a text fragment for this user and 
 * save it to the fragments microservice (currently only running locally). 
 * We expect a user to have an `idToken` attached, so we can send that  
 * along with the request.
 */
export async function postFragment(user, fragmentData, fragmentDataType) {
  console.log('Posting user fragment data...');

  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.postAuthorizationHeaders(fragmentDataType),
      body: fragmentData,
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Got posted fragment data', { data });
  } catch (err) {
    console.error('Unable to call POST /v1/fragment', { err });
  }
}

/**
 * Given an authenticated user, get a text fragment by ID from the fragments
 * microservice (currently only running locally). We expect a user to have 
 * an `idToken` attached, so we can send that along with the request.
 */
export async function getFragmentById(user, fragmentId) {
  console.log(`Requesting user fragment data of id: ${fragmentId}`);
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log(`Got user fragment data of id: ${fragmentId}`, { data });
  } catch (err) {
    console.error(`Unable to call GET /v1/fragments/${fragmentId}`, { err });
  }
}

/**
 * Given an authenticated user, get a text fragment's metadata by ID from the fragments
 * microservice (currently only running locally). We expect a user to have 
 * an `idToken` attached, so we can send that along with the request.
 */
export async function getFragmentMetaById(user, fragmentId) {
  console.log(`Requesting user fragment metadata of id: ${fragmentId}`);
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}/info`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log(`Got user fragment metadata of id: ${fragmentId}`, { data });
  } catch (err) {
    console.error(`Unable to call GET /v1/fragments/${fragmentId}/info`, { err });
  }
}

/**
 * Access the health check route for checking the health of the service
 */
export async function getHealthCheck() {
  console.log('Requesting health check...');
  try {
    const res = await fetch(`${apiUrl}/`);

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('Got health check', { data });
  } catch (err) {
    console.error('Unable to call GET /', { err });
  }
}