const draggables = document.querySelectorAll('.draggable');
const containers = document.querySelectorAll('.container');

draggables.forEach((draggable) => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging');
  });

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging');
  });
});

containers.forEach((container) => {
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll('.draggable:not(.dragging)'),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// function doGet() {
//   var ebu = document.getElementById("base_url");
//   var base_url = ebu.options[ebu.selectedIndex].value;
//   var ec = document.getElementById("get_dd");
//   var context = ec.options[ec.selectedIndex].value;
//   var result_area = document.getElementById("text_area"); 
//   var get_url = base_url + context;
//   result_area.value = get_url;
  
// let xhr = new XMLHttpRequest();
// xhr.responseType = 'json';

// xhr.open('GET', get_url);
// xhr.setRequestHeader('Content-Type', 'application/json');
// xhr.send();
// console.log("Request sent");

// // 4. This will be called after the response is received
// xhr.onload = function() {
//   if (xhr.status != 200) {
//     console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
//   } else { // show the result
//     console.log(`Done, got ${xhr.response.length} bytes`); // response is the server response
//     var resp=xhr.response;
//     result_area.value = resp;
//   }
// };

// xhr.onprogress = function(event) {
//   if (event.lengthComputable) {
//     console.log(`Received ${event.loaded} of ${event.total} bytes`);
//   } else {
//     console.log(`Received ${event.loaded} bytes`); // no Content-Length
//   }

// };

// xhr.onerror = function() {
//   console.log(`Request failed: ${xhr.status}`);
// };

// } //end