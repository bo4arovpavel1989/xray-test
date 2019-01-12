export const API_URL='http://localhost:3001';

export const defaultFetch = function(method='GET', body){
  const configFetch = {
      method,
      mode:'cors',
      headers: {
        'Accept': 'application/json,text/plain',
        'Content-Type': 'application/json,text/plain'
      }
    }

  if(body) Object.assign(configFetch, {body:JSON.stringify(body)})

  return configFetch;
}
