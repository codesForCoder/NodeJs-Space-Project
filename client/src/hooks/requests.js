const API_URL = "http://ec2-54-210-249-200.compute-1.amazonaws.com:8000"; // "http://localhost:8000";

async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.
  console.log(`Getting planets !! `);
  const response = await fetch(`${API_URL}/planets`);
  const result = await response.json();
  console.log(`Result from Get all Planets - ${JSON.stringify(result)}`);
  return result.planets;
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
  console.log(`Getting launches !! `);
  const response = await fetch(`${API_URL}/launches`);
  const result = await response.json();
  console.log(`Received httpGetLaunches - ${JSON.stringify(result)}`);
  return result.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
  try {
    console.log(`Launching new Mission - ${JSON.stringify(launch)}`);
    // TODO: Once API is ready.
    // Submit given launch data to launch system.
    //Fetch is default to Get
    const response = await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
    return response;
  } catch (err) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
  try {
    console.log(`Launch aboart is being done - ${id}`);
    const response = await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    });
    return response;
  } catch (err) {
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
