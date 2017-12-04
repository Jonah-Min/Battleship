
// This file is a small wrapper around window.XMLHttpRequest
// This file assumes that every post request sends and receives JSON
// and that every GET request receives JSON from the server.

function toQueryString(paramsObject) {
  return Object
    .keys(paramsObject)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsObject[key])}`)
    .join('&')
  ;
}


async function request(config) {
  return new Promise((resolve, reject) => {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function onreadystatechange() {
      if (xmlhttp.readyState !== 4) {
        return;
      }

      if (xmlhttp.status !== 200) {
        console.error('There was an error downloading', config.url, config.body);
        reject();
        return;
      }

      let resp = xmlhttp.response;

      try {
        resp = JSON.parse(resp)
      }
      catch(e) {

      }
      resolve(resp)
    };

    let method = 'GET';
    if (config.body) {
      method = 'POST';
    }

    // Send the request
    xmlhttp.open(method, config.url, true);
    if (config.body) {

      // Add a application/json header if this request is a post request. 
      if (config.form) {
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // _csrf_token=ISI%2BFRNaIjcxPgMsejkHKwE5XQMsJgAANiRGk9nqWGiD%2BmQsmM5ngw%3D%3D&
        xmlhttp.send('_utf8=%E2%9C%93&' + toQueryString(config.body));
      }
      else {
        xmlhttp.setRequestHeader('Content-Type', 'application/json');      
        xmlhttp.send(JSON.stringify(config.body));

      }
    } else {
      xmlhttp.send();
    }
  });
}

export default request;
