const MET_API = {
  BASE_URL: 'https://collectionapi.metmuseum.org/public/collection/v1',
  endpoints: {
    departments: '/departments',
    search: '/search',
    objects: '/objects'
  }
};

async function fetchMetData(endpoint, params = '') {
  const url = `${MET_API.BASE_URL}${endpoint}${params}`;
  
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); 

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') console.error('Petición cancelada por timeout');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}