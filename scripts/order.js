/*
  Description: Midterm Sprint - Code Brew Café
  Authors:  Ashton Dennis,
            Joseph Gallant,
            Justin Greenslade
  Dates:  February 17, 2025 - 
*/

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#orderBtn").addEventListener("click", () => {
    submitOrder()
      .then((resolve) => {
        displayStatus(resolve, "success");
      })
      .catch((reject) => {
        displayStatus(reject, "fail");
      });
  });

  function submitOrder() {
    return new Promise((resolve, reject) => {
      try {
        validateOrderFields();

        resolve("Thank You For Your Order!");
      } catch (error) {
        reject(error.message);
      }
    });
  }

  function validateOrderFields() {
    let name = document.querySelector("#userFNameTextBox").value.trim();
    let phone = document.querySelector("#userPhoneTextBox").value.trim();
    let email = document.querySelector("#userEmailTextBox").value.trim();
    let address = document.querySelector("#userAddressTextBox").value.trim();
    let error = "";

    let phoneRegex = /^\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}$/;
    let emailRegex = /^\w+\@\w+(\.\w{2,})+$/;
    let addressRegex = /^\d+(\-?[\d\w]+)*[\,\s]\s?\w+$/; // Accepts a: "#(-#*/X*), Street Name" Format, (i.e. 123-A, Main Street)

    // Validate Name
    if (name === "") {
      error += "Enter Your Name<br />";
    }

    // Validate Phone Number
    if (phone === "") {
      error += "Enter Your Phone Number<br />";
    } else if (!phoneRegex.test(phone)) {
      error += "Invalid Phone Number<br />";
    }

    // Validate Email
    if (email === "") {
      error += "Enter Your Email<br />";
    } else if (!emailRegex.test(email)) {
      error += "Invalid Email<br />";
    }

    // Validate Address
    if (address === "") {
      error += "Enter Your Address<br />";
    } else if (!addressRegex.test(address)) {
      error += "Invalid Address<br />";
    }

    // Validate Order Type
    if (
      !document.querySelector("#pickUpRdio").checked &&
      !document.querySelector("#deliveryRdio").checked
    ) {
      error += "Select an Order Type (Pickup or Delivery)<br />";
    }

    if (error !== "") {
      throw new Error(error);
    }
  }

  // Displays a message inside statusText, with a class name. Clears after a few seconds.
  async function displayStatus(message, className) {
    let statusText = document.querySelector("#statusText");
    statusText.innerHTML = message;
    statusText.className = className;

    setTimeout(() => {
      statusText.innerHTML = "";
    }, 2000);
  }

  function receiptValues(discountAmount = 0, ...cartItemsPrice) {
    // Have a list of valid discounts with corresponding discount amounts in decimal format
    // e.g. "Python" = 20% off = 0.2

    let allItemsPrice = 0;
    cartItemsPrice.forEach((price) => {
      allItemsPrice += price;
    });

    let hst = allItemsPrice * 0.15;
    let total = allItemsPrice + hst;

    let discount = 0;
    let discountedTotal = 0;
    if (discountAmount !== 0) {
      discount = total * discountAmount;
      discountedTotal = total - discountAmount;
    }

    return [allItemsPrice, hst, total, discount, discountedTotal];
    // since i dont really know how the receipt should look,
    // i calculate all the values and return them in an array
    // so its easy to implement elsewhere.
    // you can probably just do something like:
    // let receiptValues = receiptValues(1.99, 2.38, etc...);
  }

  // Show the Current Order Section
  class MenuItem {
    constructor(
      itemId,
      itemCategory,
      itemName,
      itemDesc,
      itemPrice,
      itemImage
    ) {
      this.itemId = itemId;
      this.itemCategory = itemCategory;
      this.itemName = itemName;
      this.itemDesc = itemDesc;
      this.itemPrice = itemPrice;
      this.itemImage = itemImage;
    }
  }

  let menuItems = [];

  // Create an array of all the MenuItem objects from a JSON file
  function createMenuItems() {
    let menuPromise = fetch("../data/menu.json");

    menuPromise
      .then((response) => {
        if (response.status === 200) {
          response
            .json()
            .then((data) => {
              data.forEach((element) => {
                let menuItem = new MenuItem(
                  element.itemId,
                  element.itemCategory,
                  element.itemName,
                  element.itemDesc,
                  element.itemPrice,
                  element.itemImage
                );

                menuItems.push(menuItem);
              });
            })
            .catch((reject) => alert(reject));
        }
      })
      .catch((reject) => alert(reject));

    return menuPromise;
  }

  // Display the order
  function displayOrder() {
    let orderElement = document.querySelector("#order-details");

    menuItems.forEach((element) => {
      let menuElement = document.createElement("div");

      menuElement.className = "menu-item";

      let image = document.createElement("img");
      image.src = element.itemImage;
      image.alt = element.itemName;

      menuElement.appendChild(image);

      let menuElementHTML = `<h3 class="item-name">${element.itemName}</h3>
                             <p class = "item-description">${element.itemDesc}</p>
                             <h4 class = "item-price">\$${element.itemPrice}</h4>
                             <div class="quantity-element">
                             <label for="quantityTextBox${element.itemId}">Quantity</label>
                             <button class="menubutton">-</button>
                             <input type="text" name="quantityTextBox${element.itemId}" id="quantityTextBox${element.itemId}" value="1" />
                             <button class="menubutton">+</button>
                             </div>
                             <button class="menubutton" onclick="updateItem(${element.itemId},0)">Remove</button>`;

      menuElement.innerHTML += menuElementHTML;

      orderElement.appendChild(menuElement);
    });
  }

  createMenuItems();

  // // TODO: Find a way to only execute code after the createMenuItems is done
  setTimeout(() => {
    displayOrder();
  }, 500);
});
