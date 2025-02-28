
// const API_BASE_URL = 'https://beta.hru.today/hru/staffApp/';
const API_BASE_URL = 'https://6142-2405-201-5c06-c0e6-bda1-4895-cf32-adb2.ngrok-free.app/hru/staffApp/';


const apiClient = async (endpoint, method = 'POST', body = null) => {
  const headers = { 
    'Content-Type': 'application/json' 
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });


  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || 'Something went wrong');
  }

  return response.json();
};

export default apiClient;



// const API_BASE_URL = 'https://beta.hru.today/hru/Doctorappapi/';

// const apiClient = async (endpoint, method = 'POST', body = null, headers = {}) => {
//   const defaultHeaders = {
//     'Content-Type': 'application/json', // Default for JSON
//     ...headers,
//   };

//   // Explicitly handle multipart/form-data
//   if (body instanceof FormData) {
//     defaultHeaders['Content-Type'] = 'multipart/form-data';
//   }

//   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//     method,
//     headers: defaultHeaders,
//     body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
//   });

//   if (!response.ok) {
//     const errorMessage = await response.text();
//     throw new Error(errorMessage || 'Something went wrong');
//   }

//   return response.json();
// };

// export default apiClient;
