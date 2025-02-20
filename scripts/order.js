/*
  Description: Midterm Sprint - Code Brew Café
  Authors:  Ashton Dennis,
            Joseph Gallant,
            Justin Greenslade
  Dates:  February 17, 2025 - 
*/

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#orderBtn").addEventListener("click", () => {
    // Submit an order and display an appropriate message
    submitOrder()
      .then((response) => {
        displayStatus(response, "success");
      })
      .catch((response) => {
        displayStatus(response, "fail");
      });
  });

  document.querySelector("#updateOrderBtn").addEventListener("click", () => {
    // Update the quantities, clear the order elements and reload the updated values

    updateItems();

    document.querySelector("#order-details").innerHTML = "";
    menuItems = [];
    createOrderItems();

    // TODO: make it work with Promise instead
    setTimeout(() => {
      console.log(calculateSubtotal());
    }, 150);
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

  // Create an array of the required MenuItem objects from a JSON file, and then call
  // the displayOrder function to generate every element on the page.
  function createOrderItems() {
    let menuPromise = fetch("../data/menu.json");

    menuPromise
      .then((response) => {
        if (response.status === 200) {
          // Get the current data from the order storage
          let orderItems = JSON.parse(getItems());

          if (orderItems.length >= 1) {
            let itemSet = new Set();

            orderItems.forEach((orderItem) => {
              itemSet.add(orderItem.itemId);
            });

            response
              .json()
              .then((data) => {
                data.forEach((element) => {
                  if (itemSet.has(element.itemId)) {
                    let menuItem = new MenuItem(
                      element.itemId,
                      element.itemCategory,
                      element.itemName,
                      element.itemDesc,
                      element.itemPrice,
                      element.itemImage
                    );

                    menuItems.push(menuItem);
                  }
                });

                // Generate the order elements
                displayOrder();
              })
              .catch((reject) => alert(reject));
          } else {
            showEmptyCartMessage();
          }
        }
      })
      .catch((reject) => alert(reject));

    return menuPromise;
  }

  function showEmptyCartMessage() {
    let orderElement = document.querySelector("#order-details");

    let menuElement = document.createElement("div");

    menuElement.className = "menu-item";
    menuElement.innerHTML = `<p>Your Cart is Empty</p>`;

    // let image = document.createElement("img");
    // image.src = element.itemImage;
    // image.alt = element.itemName;

    // menuElement.appendChild(image);
    orderElement.appendChild(menuElement);
  }

  // Generate every order element to be displayed
  function displayOrder() {
    let orderElement = document.querySelector("#order-details");
    let orderItems = JSON.parse(getItems());

    menuItems.forEach((element) => {
      let menuElement = document.createElement("div");

      menuElement.className = "menu-item";
      menuElement.id = `menu-item-${element.itemId}`;

      let image = document.createElement("img");
      image.src = element.itemImage;
      image.alt = element.itemName;

      menuElement.appendChild(image);

      // Get the quantity of the selected item
      let currItemQuantity = orderItems.filter(
        (orderItem) => orderItem.itemId === element.itemId
      )[0].itemQuantity;

      let menuElementHTML = `<h3 class="item-name">${element.itemName}</h3>
                             <p class="item-description">${element.itemDesc}</p>
                             <h4 class="item-price">\$${element.itemPrice}</h4>
                             <div class="quantity-element">
                             <label for="quantityTextBox${element.itemId}">Quantity</label>
                             <button class="menubutton" onclick="changeQuantity('quantityTextBox${element.itemId}',-1)">-</button>
                             <input type="text" name="quantityTextBox${element.itemId}" id="quantityTextBox${element.itemId}" value="${currItemQuantity}" />
                             <button class="menubutton" onclick="changeQuantity('quantityTextBox${element.itemId}',1)">+</button>
                             </div>
                             <button class="menubutton" onclick="removeOrderItem(${element.itemId})">Remove</button>`;

      menuElement.innerHTML += menuElementHTML;

      orderElement.appendChild(menuElement);
    });
  }

  // Get the item price given its itemId
  function getItemPrice(itemId) {
    console.log(menuItems);
    let itemPrice = menuItems.filter((item) => item.itemId === itemId)[0]
      .itemPrice;

    return itemPrice;
  }

  function calculateSubtotal() {
    let orderItems = JSON.parse(getItems());
    let subTotal = 0;

    orderItems.forEach((orderItem) => {
      subTotal += getItemPrice(orderItem.itemId) * orderItem.itemQuantity;
    });

    return subTotal;
  }

  // Create the Order Items elements with their corresponding quantity
  createOrderItems();
});

// Increase or decrease the value of an element
function changeQuantity(elementId, value) {
  let element = document.querySelector(`#${elementId}`);

  let elementValue = element.value;

  if (!isNaN(elementValue)) {
    elementValue = parseInt(elementValue);

    // Prevent from going under 0
    if (elementValue + value >= 0) {
      element.value = elementValue + value;
    }
  }
}

// Remove an order item from the "order" localStorage key, based on a given itemId
function removeOrderItem(itemId) {
  return new Promise((resolve, reject) => {
    try {
      removeOrderStorageItem(itemId);

      resolve("Item Successfully Removed From the Order");
    } catch (error) {
      reject(`Error While Removing the Item: ${error.message}`);
    }
  })
    .then((response) => {
      document.querySelector(`#menu-item-${itemId}`).remove();
      updateItems();
      console.log(response);

      // TODO: Fix to show an empty cart message
      console.dir(document.querySelector("#order-details"));
      //showEmptyCartMessage();
    })
    .catch((response) => {
      alert(response);
    });
}

// Function to remove an item from the "order" localStorage key, given the itemId
function removeOrderStorageItem(itemId) {
  let orderStorage = localStorage.getItem("order");

  if (orderStorage !== null) {
    let orders = JSON.parse(orderStorage);

    orders = orders.filter((order) => order.itemId !== itemId);

    localStorage.setItem("order", JSON.stringify(orders));
  }
}

// Get the items stored in the "order" localStorage key in a String format
function getItems() {
  let orderStorage = localStorage.getItem("order");

  if (orderStorage === null) {
    return "[]";
  } else {
    return orderStorage;
  }
}

// Update the "order" localStorage key data with the new quantities
function updateItems() {
  let orderDetails = document.querySelector("#order-details").childNodes;

  let orderStorage = [];

  // TODO: Find a better way to handle when the order is empty
  // If order-details contains no element, error on the quantityTextBox querySelector as it doesn't exist
  try {
    orderDetails.forEach((element) => {
      let itemId = parseInt(element.id.match(/\d+$/));
      let quantity = parseInt(
        element.querySelector(`#quantityTextBox${itemId}`).value
      );

      // Only add the element if the quantity is over 0
      if (quantity > 0) {
        // Update the element with the corresponding itemId and itemQuantity in the "order" localStorage key
        orderStorage.push(orderItem(itemId, quantity));
      }

      localStorage.setItem("order", JSON.stringify(orderStorage));
    });
  } catch (error) {
    console.log(error);
  }
}

function orderItem(id, quantity) {
  return { itemId: id, itemQuantity: quantity };
}
