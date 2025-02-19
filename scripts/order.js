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
    menuItems.forEach((menuItem) => {
      console.log(menuItem.itemName);
    });
  }

  createMenuItems();

  // // TODO: Find a way to only execute code after the createMenuItems is done
  setTimeout(() => {
    displayOrder();
  }, 500);
});
