function doGet() {
  var ebu = document.getElementById('base_url');
  var base_url = ebu.options[ebu.selectedIndex].value;
  var ec = document.getElementById('get_dd');
  var context = ec.options[ec.selectedIndex].value;
  var result_area = document.getElementById('response_area');
  var get_url = base_url + context;
  result_area.value = get_url;

  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  xhr.open('GET', get_url, true);
  //xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
  console.log('Request sent');

  // 4. This will be called after the response is received
  xhr.onload = function () {
    if (xhr.status != 200) {
      console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
    } else {
      // show the result
      console.log(`Done, got ${xhr.response.length} bytes`); // response is the server response
      result_area.value = JSON.stringify(xhr.response);
    }
  };

  xhr.onprogress = function (event) {
    if (event.lengthComputable) {
      console.log(`Received ${event.loaded} of ${event.total} bytes`);
    } else {
      console.log(`Received ${event.loaded} bytes`); // no Content-Length
    }
  };

  xhr.onerror = function () {
    console.log(`Request failed: ${xhr.status}`);
  };
}

function doPost() {
  var ebu = document.getElementById('base_url');
  var base_url = ebu.options[ebu.selectedIndex].value;
  var post_area = document.getElementById('post_area');
  var pc = document.getElementById('post_dd');
  var result_area = document.getElementById('response_area');
  var get_url = base_url + context;
  var context = pc.options[pc.selectedIndex].value;
  var post_url = base_url + context;
  console.log(post_url);

  let xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  if (post_area.value === '') {
    alert('Please enter a json string in the POST area!');
    return -1;
  }
  //  let json = JSON.stringify(post_area.value);
  let json = post_area.value;

  console.log(json);
  // track upload progress
  xhr.upload.onprogress = function (event) {
    console.log(`Uploaded ${event.loaded} of ${event.total}`);
  };

  // track completion: both successful or not
  xhr.onloadend = function () {
    if (xhr.status == 200) {
      console.log('200 - OK!');
      result_area.value = JSON.stringify(xhr.response);
    } else {
      console.log('Error ' + this.status);
      alert('Error: ' + xhr.status);
    }
  };

  xhr.open('POST', post_url);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.send(json);
}
