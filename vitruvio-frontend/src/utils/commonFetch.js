async function fetchBackend(
  endpoint,
  method,
  bodyData = {},
  queryUrl = {},
) {
  const URL = process.env.NEXT_PUBLIC_NODE_BACKEND_URL || "http://localhost:8000"

  function objectToQueryString(obj) {
    return Object.entries(obj)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }

  function getFinalURL() {
    let finalURL = `${URL}${endpoint}`
    if ((!queryUrl || Object.keys(queryUrl).length > 0) && method === "GET") {
      finalURL += `?${objectToQueryString(queryUrl)}`;
    }
    return finalURL;
  }


  function getFinalOptions() {
    const options = {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    };

    if (bodyData && Object.keys(bodyData).length > 0) {
      options["body"] = JSON.stringify(bodyData)
    }
    return options;
  }

  try {
    const response = await fetch(getFinalURL(), getFinalOptions());
    const responseData = await response.json();

    if (!response.ok) {
      return { ok: false, data: responseData.detail }
    }
    console.log('Datos recibidos:', responseData);

    return responseData;
  } catch (error) {
    console.error('Hubo un problema con la solicitud:', error);
  }
}

export default fetchBackend;