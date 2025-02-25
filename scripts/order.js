/*
  Description: Midterm Sprint - Code Brew Café
  Authors:  Ashton Dennis,
            Joseph Gallant,
            Justin Greenslade
  Dates:  February 17, 2025 - February 26, 2025
*/

// "order" localStorage contains values in the following format:
// [{
//   "itemId": 0,
//   "itemQuantity": 1,
//   "itemPrice": 1.99,
//   "itemName": "Coffee",
// }]

const PROMO_CODES = [
  ["TEACHER100", 100],
  ["BREW75", 75],
  ["BREW50", 50],
  ["BREW25", 25],
  ["BREW10", 10],
];

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#orderBtn").addEventListener("click", () => {
    // Submit an order and display an appropriate message
    submitOrder()
      .then((response) => {
        displayStatus(response, "success", 5000);

        // Clear all the value
        document.querySelector("#orderForm").reset();
      })
      .catch((response) => {
        displayStatus(response, "fail", 2000);
      });
  });

  document.querySelector("#updateOrderBtn").addEventListener("click", () => {
    // Update the quantities, clear the order elements and reload the updated values

    updateItems();

    document.querySelector("#order-details").innerHTML = "";
    menuItems = [];
    createOrderItems();

    // TODO: make it work with Promise instead

    let orderItems;
    setTimeout(() => {
      orderItems = JSON.parse(getItems());
    }, 150);

    setTimeout(() => {
      generateReceipt(orderItems);
    }, 150);

    updateCartBubble();

    // Scroll back at the top of the page after the update
    document.getElementById("pageContainer").scrollIntoView({ behavior: "smooth" });
  });

  document.querySelector("#cashPaymentRdio").addEventListener("click", () => {
    document.querySelector("#credit-card-info").style.opacity = "0";
  });

  document.querySelector("#creditPaymentRdio").addEventListener("click", () => {
    document.querySelector("#credit-card-info").style.opacity = "1";
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
    let addressRegex = /^\d+(\-?[\d\w]+)*([\,\s]\s?\w+)+$/; // Accepts a: "#(-#*/X*), Street Name" Format, (i.e. 123-A, Main Street)

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
    if (!document.querySelector("#pickUpRdio").checked && !document.querySelector("#deliveryRdio").checked) {
      error += "Select an Order Type<br />";
    }

    // Validate the Payment Method and Credit Card details, if necessary
    if (!document.querySelector("#cashPaymentRdio").checked && !document.querySelector("#creditPaymentRdio").checked) {
      error += "Select a Payment Method<br />";
    } else if (document.querySelector("#creditPaymentRdio").checked) {
      // Validate the Credit Card details

      let creditCardRegex = /^\d{16}$/;
      let expiryDateRegex = /^\d{2}\/\d{2}$/;
      let cvvNumRegex = /^\d{3,4}$/;

      let creditCardNumber = document.querySelector("#creditCardNumberTextBox").value.trim();
      let expiryDate = document.querySelector("#expiryDateTextBox").value.trim();
      let cvvNum = document.querySelector("#cvvCodeTextBox").value.trim();

      if (creditCardNumber === "") {
        error += "Enter a Credit Card Number<br />";
      } else if (!creditCardRegex.test(creditCardNumber)) {
        error += "Invalid Credit Card Number<br />";
      }

      if (expiryDate === "") {
        error += "Enter an Expiry Date<br />";
      } else if (!expiryDateRegex.test(expiryDate)) {
        error += "Invalid Expiry Date<br />";
      }

      if (cvvNum === "") {
        error += "Enter a CVV Number<br />";
      } else if (!cvvNumRegex.test(cvvNum)) {
        error += "Invalid CVV Number<br />";
      }
    }

    if (error !== "") {
      throw new Error(error);
    }
  }

  // Displays a message inside statusText, with a class name. Clears after a few seconds.
  function displayStatus(message, className, timeOut) {
    let statusText = document.querySelector("#statusText");
    statusText.innerHTML = message;
    statusText.className = className;
    statusText.style.opacity = 1;

    setTimeout(() => {
      // Hide the message
      statusText.style.opacity = 0;

      // Clear the message
      setTimeout(() => {
        statusText.innerHTML = "";
      }, 200);
    }, timeOut);
  }

  // Each order is in the following format:
  // {
  //   itemId: id,
  //   itemQuantity: quantity,
  //   itemPrice: price,
  //   itemName: name,
  // }
  function generateReceipt(orders) {
    let subtotal = 0.0;

    // Begin the table
    let receiptHTML = `
    <table class="receipttable">
      <th colspan="2" class="centertext">-------------CODE BREW CAF&Eacute;-------------</th>`;
    orders.forEach((order) => {
      // For each item, add a row to the table with item name and price
      let quantity = parseInt(order.itemQuantity);
      let price = parseFloat(order.itemPrice);
      let name = order.itemName;

      let cost = quantity * price;
      subtotal += cost;

      receiptHTML += `
      <tr>
        <td>${quantity}x ${name.toUpperCase()}</td>
        <td class="righttable">$${cost.toFixed(2)}</td>
      </tr>
      `;
    });

    // Calculate HST and Total
    let hst = subtotal * 0.15;
    let total = subtotal + hst;

    // Check discount code for validity
    let promoCode = document.querySelector("#promoCodeTextBox").value.toUpperCase();
    let discountAmount = 0;
    let codeUsed = "";
    for (element of PROMO_CODES) {
      if (element[0] === promoCode) {
        codeUsed = element[0];
        discountAmount = element[1] / 100;
        break;
      }
    }

    // If discount exists, display and deduct
    let discountHTML = ``;
    if (discountAmount !== 0) {
      let discount = total * discountAmount;
      let discountedTotal = total - discount;
      discountHTML = `
      <tr>
        <td>CODE "${codeUsed}"</td>
        <td class="righttable">-$${discount.toFixed(2)}</td>
      </tr>

      <tr>
        <td></td>
        <td class="righttable">--------</td>
      </tr>

      <tr>
        <td>NEW TOTAL</td>
        <td class="righttable">$${discountedTotal.toFixed(2)}</td>
      </tr>
      `;
    }

    // Display remaining variables
    receiptHTML += `
      <tr>
        <td></td>
        <td class="righttable">--------</td>
      </tr>

      <tr>
        <td>SUBTOTAL</td>
        <td class="righttable">$${subtotal.toFixed(2)}</td>
      </tr>

      <tr>
        <td>HST</td>
        <td class="righttable">$${hst.toFixed(2)}</td>
      </tr>

      <tr>
        <td></td>
        <td class="righttable">--------</td>
      </tr>

      <tr>
        <td>TOTAL</td>
        <td class="righttable">$${total.toFixed(2)}</td>
      </tr>

      ${discountHTML}

      <tr>
        <td colspan="2" class="foot">------------------------------------------</td>
      </tr>
    </table>
    `;

    document.querySelector("#order-receipt").innerHTML = orders.length !== 0 ? receiptHTML : "";
  }

  // Show the Current Order Section
  class MenuItem {
    constructor(itemId, itemCategory, itemName, itemDesc, itemPrice, itemImage) {
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
                // return data
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

    menuElement.className = "order-item";
    menuElement.innerHTML = `<p>Your Cart is Empty</p>`;

    orderElement.appendChild(menuElement);
  }

  // Generate every order element to be displayed
  function displayOrder() {
    let orderElement = document.querySelector("#order-details");
    let orderItems = JSON.parse(getItems());

    menuItems.forEach((element) => {
      let menuElement = document.createElement("div");

      menuElement.className = "order-item";
      menuElement.id = `order-item-${element.itemId}`;

      let image = document.createElement("img");
      image.src = element.itemImage;
      image.alt = element.itemName;

      menuElement.appendChild(image);

      // Get the quantity of the selected item
      let currItemQuantity = orderItems.filter((orderItem) => orderItem.itemId === element.itemId)[0].itemQuantity;

      let menuElementHTML = `<h3 class="item-name">${element.itemName}</h3>
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

  // Create the Order Items elements with their corresponding quantity
  createOrderItems();

  let orderItems;
  setTimeout(() => {
    orderItems = JSON.parse(getItems());
  }, 150);

  setTimeout(() => {
    generateReceipt(orderItems);
  }, 150);

  updateCartBubble();
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
      document.querySelector(`#order-item-${itemId}`).remove();

      updateCartBubble();

      // If the order still contains items, update order item elements, otherwise, show an empty cart
      if (getItems() !== "[]") {
        updateItems();
      } else {
        showEmptyCartMessage();
      }
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
  console.dir(orderDetails);
  try {
    orderDetails.forEach((element) => {
      let itemId = parseInt(element.id.match(/\d+$/));
      let quantity = parseInt(element.querySelector(`#quantityTextBox${itemId}`).value);
      let price = parseFloat(element.querySelector(".item-price").innerText.slice(1));
      let name = element.querySelector(".item-name").innerText;

      // Only add the element if the quantity is over 0
      if (quantity > 0) {
        // Update the element with the corresponding itemId and itemQuantity in the "order" localStorage key
        orderStorage.push(orderItem(itemId, quantity, price, name));
      }

      localStorage.setItem("order", JSON.stringify(orderStorage));
    });
  } catch (error) {
    console.log(error);
  }
}

function orderItem(id, quantity, price, name) {
  return {
    itemId: id,
    itemQuantity: quantity,
    itemPrice: price,
    itemName: name,
  };
}

function showEmptyCartMessage() {
  let orderElement = document.querySelector("#order-details");

  let menuElement = document.createElement("div");

  menuElement.className = "order-item";
  menuElement.innerHTML = `<p>Your Cart is Empty</p>`;

  orderElement.appendChild(menuElement);
}

function updateCartBubble() {
  let orders = JSON.parse(getItems());
  let cartBubble = document.getElementById("cart-bubble");

  if (orders.length === 0) {
    cartBubble.style.visibility = "hidden";
    return;
  } else {
    cartBubble.style.visibility = "visible";
  }

  let totalItems = 0;
  for (let i = 0; i < orders.length; i++) {
    totalItems += orders[i].itemQuantity;
  }
  cartBubble.textContent = totalItems;
}
