/*
  Description: Midterm Sprint - Code Brew Café
  Authors:  Ashton Dennis,
            Joseph Gallant,
            Justin Greenslade
  Dates:  February 17, 2025 - 
*/

window.addEventListener("DOMContentLoaded", function () {
  // Read review from JSON file
  function generateReviews() {
    let reviewPromise = fetch("../data/reviews.json");

    reviewPromise
      .then(function (response) {
        if (response.status === 200) {
          response.json().then(function (data) {
            createReviewElement(data);
          });
        }
      })
      .catch(function (reject) {
        alert(reject);
      });
  }

  function createReviewElement(data) {
    let reviewContainer = document.querySelector("#review-section");
    let currentIndex = 0;

    function displayReview() {
      let reviewElement = document.createElement("div");
      reviewElement.className = "review-card fade";

      let rating = data[currentIndex].rating;
      let stars = "";

      for (let i = 0; i < 5; i++) {
        if (i < rating) {
          stars += "★";
        } else {
          stars += "☆";
        }
      }

      let reviewElementHTML = `<h3>${data[currentIndex].firstName} ${data[currentIndex].lastName}</h3>
                               <p>${data[currentIndex].date}</p>
                               <p class="star">${stars}</p>
                               <p>${data[currentIndex].review}</p>`;

      reviewElement.innerHTML = reviewElementHTML;

      // Add review to container
      reviewContainer.innerHTML = "";
      reviewContainer.appendChild(reviewElement);

      // Fade in effect
      setTimeout(function () {
        reviewElement.style.opacity = 1;
      }, 50);

      // Fade out effect after (after 5 seconds)
      setTimeout(function () {
        reviewElement.style.opacity = 0;
      }, 4000);

      // Move to the next review after 5 seconds
      currentIndex = (currentIndex + 1) % data.length;
      setTimeout(displayReview, 5000);
    }

    displayReview();
  }

  generateReviews();
});
