// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice. We expect a user
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
      // Show popup with error
      alert(`${res.statusText}`);

      throw new Error(`${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Got user fragments', { data });

    // Show popup with result
    let msg = '<title>Got user fragments!</title>';
    msg += 'Got user fragments:<br/><br/>';
    data.fragments.forEach(function (id) {
      msg += `${id}<br/>`;
    });

    let newWin = window.open('', '', `width=400,height=200,top=${(screen.height/2)-(200*2)},left=${(screen.width/2)-(400/2)}`);
    newWin.document.write(`${msg}`);
  } catch (err) {
    console.error('Unable to call GET /v1/fragments', { err });
  }
}

/**
 * Given an authenticated user, request all fragments, expanded to include a 
 * full representation of the fragments' metadata, for this user from the
 * fragments microservice. We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragmentsExpanded(user) {
  console.log('Requesting expanded user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });

    if (!res.ok) {
      // Show popup with error
      alert(`${res.statusText}`);

      throw new Error(`${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Got expanded user fragments data', { data });

    // Show popup with result
    let msg = '<title>Got expanded user fragments</title>';
    msg += 'Got expanded user fragments:<br/><br/>';
    data.fragments.forEach(function (fragment) {
      msg += `size: ${fragment.size}<br/>`;
      msg += `updated: ${fragment.created}<br/>`;
      msg += `created: ${fragment.updated}<br/>`;
      msg += `id: ${fragment.id}<br/>`;
      msg += `ownerId: ${fragment.ownerId}<br/>`;
      msg += `type: ${fragment.type}<br/><br/>`;
    });
    let newWin = window.open('', '', `width=600,height=500,top=${(screen.height/2)-(200*2)},left=${(screen.width/2)-(600/2)}`);
    newWin.document.write(`${msg}`);
  } catch (err) {
    console.error('Unable to call GET /v1/fragments?expand=1', { err });
  }
}

/**
 * Given an authenticated user, create a fragment for this user and 
 * save it to the fragments microservice. 
 * We expect a user to have an `idToken` attached, so we can send that  
 * along with the request.
 */
export async function postFragment(user, fragmentData, fragmentDataType) {
  console.log(`Posting user fragment data of type ${fragmentDataType}...`);

  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.postAuthorizationHeaders(fragmentDataType),
      body: fragmentData,
    });

    if (!res.ok) {
      // Show popup with error
      alert(`${res.statusText}`);

      throw new Error(`${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Got posted fragment data', { data });

    // Show popup with result
    let msg = '<title>Posted user fragment!</title>';
    msg += 'Posted user fragment:<br/><br/>';
    msg += `id: ${data.fragment.id}<br/>`;
    msg += `ownerId: ${data.fragment.ownerId}<br/>`;
    msg += `created: ${data.fragment.updated}<br/>`;
    msg += `updated: ${data.fragment.created}<br/>`;
    msg += `type: ${data.fragment.type}<br/>`;
    msg += `size: ${data.fragment.size}`;
    let newWin = window.open('', '', `width=600,height=200,top=${(screen.height/2)-(200*2)},left=${(screen.width/2)-(600/2)}`);
    newWin.document.write(`${msg}`);
  } catch (err) {
    console.error('Unable to call POST /v1/fragment', { err });
  }
}

/**
 * Given an authenticated user, update the fragment for this user and 
 * save it to the fragments microservice. 
 * We expect a user to have an `idToken` attached, so we can send that  
 * along with the request.
 */
export async function updateFragment(user, fragmentId, fragmentData, fragmentDataType) {
  console.log(`Updating user fragment data of id: ${fragmentId}`);

  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
      method: "PUT",
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.postAuthorizationHeaders(fragmentDataType),
      body: fragmentData,
    });

    if (!res.ok) {
      // Show popup with error
      alert(`${res.statusText}`);

      throw new Error(`${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Updated fragment data', { data });

    // Show popup with result
    let msg = '<title>Updated user fragment!</title>';
    msg += `Updated user fragment data of id: ${fragmentId}<br/><br/>`;
    msg += `id: ${data.fragment.id}<br/>`;
    msg += `ownerId: ${data.fragment.ownerId}<br/>`;
    msg += `created: ${data.fragment.updated}<br/>`;
    msg += `updated: ${data.fragment.created}<br/>`;
    msg += `type: ${data.fragment.type}<br/>`;
    msg += `size: ${data.fragment.size}`;
    let newWin = window.open('', '', `width=600,height=200,top=${(screen.height/2)-(200*2)},left=${(screen.width/2)-(600/2)}`);
    newWin.document.write(`${msg}`);
  } catch (err) {
    console.error('Unable to call POST /v1/fragment', { err });
  }
}

/**
 * Given an authenticated user, get a fragment by ID from the fragments
 * microservice. We expect a user to have 
 * an `idToken` attached, so we can send that along with the request.
 */
export async function getFragmentById(user, fragmentId) {
  console.log(`Requesting user fragment data of id: ${fragmentId}`);
  try {
    // Page element used for displaying response images
    let imageDisplayElement = document.querySelector("#photo");
    // Clear the current image displayed on page
    imageDisplayElement.src = "";

    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    })

    if (!res.ok) {
      // Show popup with error
      alert(`${res.statusText}`);

      throw new Error(`${res.status} ${res.statusText}`);
    }

    let type = res.headers.get("content-type");
    let msg = "<title>Got fragment data!</title>";
    msg += `Got fragment data of id: ${fragmentId}<br/><br/>`;
    msg += `Fragment type: ${type}<br/>`;
    
    // Check if response is an image
    if(type.startsWith("image/")) {
      // for images, get blob display it on page
      let blob = await res.blob(); 
      const blobUrl = URL.createObjectURL(blob);
      imageDisplayElement.src = blobUrl;

      msg += `Fragment data: See on page`;
    } else {
      let text = await res.text();
      msg += `Fragment data: ${text}`;
    }

    console.log(`Got user fragment data of id: ${fragmentId}`);

    // Show popup with result
    let newWin = window.open('', '', `width=600,height=200,top=${(screen.height/2)-(200*2)},left=${(screen.width/2)-(600/2)}`);
    newWin.document.write(`${msg}`);
  } catch (err) {
    console.error(`Unable to call GET /v1/fragments/${fragmentId}`, { err });
  }
}

/**
 * Given an authenticated user, delete a fragment by ID from the fragments
 * microservice. We expect a user to have 
 * an `idToken` attached, so we can send that along with the request.
 */
export async function deleteFragment(user, fragmentId) {
  console.log(`Deleting user fragment data of id: ${fragmentId}`);
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
      method: "DELETE",
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });

    if (!res.ok) {
      // Show popup with error
      alert(`${res.statusText}`);

      throw new Error(`${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log(`Got delete result for fragment id: ${fragmentId}`, { data });

    // Show popup with result
    let msg = "<title>Deleted fragment!</title>";
    msg += `Deleted fragment data of id: ${fragmentId}`;
    let newWin = window.open('', '', `width=600,height=200,top=${(screen.height/2)-(200*2)},left=${(screen.width/2)-(600/2)}`);
    newWin.document.write(`${msg}`);
  } catch (err) {
    console.error(`Unable to call DELETE /v1/fragments/${fragmentId}`, { err });
  }
}

/**
 * Given an authenticated user, get a fragment's metadata by ID from the fragments
 * microservice. We expect a user to have 
 * an `idToken` attached, so we can send that along with the request.
 */
export async function getFragmentMetaById(user, fragmentId) {
  console.log(`Requesting user fragment metadata of id: ${fragmentId}`);
  try {
    // Page element used for displaying response images
    let imageDisplayElement = document.querySelector("#photo");
    // Clear the current image displayed on page
    imageDisplayElement.src = "";

    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}/info`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });

    if (!res.ok) {
      // Show popup with error
      alert(`${res.statusText}`);

      throw new Error(`${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log(`Got user fragment metadata of id: ${fragmentId}`, { data });

    // Show popup with result
    let msg = "<title>Got fragment metadata!</title>";
    msg += `Got fragment metadata of id: ${fragmentId}<br/><br/>`;
    msg += `id: ${data.fragment.id}<br/>`;
    msg += `ownerId: ${data.fragment.ownerId}<br/>`;
    msg += `created: ${data.fragment.updated}<br/>`;
    msg += `updated: ${data.fragment.created}<br/>`;
    msg += `type: ${data.fragment.type}<br/>`;
    msg += `size: ${data.fragment.size}`;
    let newWin = window.open('', '', `width=600,height=200,top=${(screen.height/2)-(200*2)},left=${(screen.width/2)-(600/2)}`);
    newWin.document.write(`${msg}`);
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
      // Show popup with error
      alert(`${res.statusText}`);

      throw new Error(`${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('Got health check', { data });

    // Show popup with result
    let msg = "<title>Health Check successful!</title>";
    msg += "Health Check:<br/><br/>";
    msg += `status: ${data.status}<br/>`;
    msg += `author: ${data.author}<br/>`;
    msg += `githubUrl: ${data.githubUrl}<br/>`;
    msg += `version: ${data.version}<br/>`;
    msg += `hostname: ${data.hostname}`;
    let newWin = window.open('', '', `width=400,height=200,top=${(screen.height/2)-(200*2)},left=${(screen.width/2)-(400/2)}`);
    newWin.document.write(`${msg}`);
  } catch (err) {
    console.error('Unable to call GET /', { err });
  }
}
