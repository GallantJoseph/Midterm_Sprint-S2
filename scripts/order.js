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

                resolve("Order Submitted");
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
        if (!document.querySelector("#pickUpRdio").checked && !document.querySelector("#deliveryRdio").checked) {
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
        }, 5000);
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
});
