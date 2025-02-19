/*
  Description: Midterm Sprint - Code Brew Café
  Authors:  Ashton Dennis,
            Joseph Gallant,
            Justin Greenslade
  Dates:  February 17, 2025 - 
*/

window.addEventListener("DOMContentLoaded", () => {
  // Read reviewfrom JSON file
  function generateReviews() {
    let reviewPromise = fetch("../data/reviews.json");

    reviewPromise
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            createReviewElement(data);
          });
        }
      })
      .catch((reject) => alert(reject));
  }

  function createReviewElement(data) {
    data.forEach((element) => {
      let reviewElement = document.createElement("div");
      reviewElement.className = "review-card";
      let raiting = element.rating;
      let stars = "";
      for (let i = 0; i < 5; i++) {
        if (i < raiting) {
          stars += "★";
        } else stars += "☆";
      }

      let reviewElementHTML = `<h3>${element.firstName} ${element.lastName}</h3>
                             <p>${element.date}</p>
                             <p class = "star">${stars}</p>
                             <p>${element.review}</p>`;

      reviewElement.innerHTML += reviewElementHTML;

      document.querySelector("#review-section").appendChild(reviewElement);
    });
  }

  generateReviews();
});
