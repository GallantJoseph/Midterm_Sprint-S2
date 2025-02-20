/*
  Description: Midterm Sprint - Code Brew Café
  Authors:  Ashton Dennis,
            Joseph Gallant,
            Justin Greenslade
  Dates:  February 17, 2025 - 
*/

window.addEventListener("DOMContentLoaded", () => {
  // Read menu from JSON file
  function generateMenu() {
    let menuPromise = fetch("../data/menu.json");

    menuPromise
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            createMenuElement(data);
          });
        }
      })
      .catch((reject) => alert(reject));
  }

  function createMenuElement(data) {
    data.forEach((element) => {
      let menuElement = document.createElement("div");

      menuElement.className = "menu-item";

      let image = document.createElement("img");
      image.src = element.itemImage;
      image.alt = element.itemName;

      menuElement.appendChild(image);

      let menuElementHTML = `<h3 class="item-name">${element.itemName}</h3>
                             <p class="item-description">${element.itemDesc}</p>
                             <h4 class="item-price">\$${element.itemPrice}</h4>
                             <div id="button${element.itemId}"><button class="menubutton" onclick="addItem(${element.itemId}, ${element.itemPrice}, '${element.itemName}')">Add to Cart</button></div>`;

      menuElement.innerHTML += menuElementHTML;

      let itemCategory = element.itemCategory;

      document.querySelector(`#${itemCategory}`).appendChild(menuElement);
    });
  }

  generateMenu();
});

// Add an Item to localStorage order key
let orderStorage = localStorage.getItem("order");
function addItem(id, price, name) {
  let orderObj = {
    itemId: id,
    itemQuantity: 1,
    itemPrice: price,
    itemName: name,
  };

  if (orderStorage === null) {
    localStorage.setItem("order", `[${JSON.stringify(orderObj)}]`);
  } else {
    let orders = JSON.parse(orderStorage);

    let replaced = false;
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].itemId === id) {
        orders[i].itemQuantity += 1;
        replaced = true;
        break;
      }
    }

    if (!replaced) {
      orders.push(orderObj);
    }

    localStorage.setItem("order", JSON.stringify(orders));
  }
  document.querySelector(`#button${id}`).innerHTML = `<button class="menubuttonClicked" id="button${id}">&#10003;</button>`;
  setTimeout(() => {
    document.querySelector(
      `#button${id}`
    ).innerHTML = `<button class="menubutton" onclick="addItem(${id}, ${price}, '${name}')">Add to Cart</button>`;
  }, 2000);
}
