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
      image.width = 350;
      image.height = 350;
      image.src = element.itemImage;
      image.alt = element.itemName;

      menuElement.appendChild(image);

      let itemPrice = element.itemPrice;

      let menuElementHTML = `<h3 class="item-name">${element.itemName}</h3>
                             <p class = "item-description">${element.itemDesc}</p>
                             <h4 class = "item-price">\$${element.itemPrice}</h4>
                             <button class="menubutton" onclick="event.preventDefault">Add to Cart</button>`;

      menuElement.innerHTML += menuElementHTML;

      document.querySelector("#menu-section").appendChild(menuElement);
    });
  }

  function addItem(id, evt) {
    evt.preventDefault();
  }

  generateMenu();
});
