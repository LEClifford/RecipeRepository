// Define the API URL
const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
// DOM
const searchForm = document.querySelector("form");
const searchInput = document.getElementById("searchMenus");

// images container
const imagesContainer = document.querySelector(".images-container-swiper");

// Set up form submission
searchForm.addEventListener("submit", event => {
  event.preventDefault();

  const query = searchInput.value.trim();
  if (query === "") {
    alert("What are you looking for?");
    return;
  }

  // Make a GET request
  fetch(`${apiUrl}${query}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      const searchHeader = document.getElementById("searchHeader");
      if (data.meals) {
        console.log(data);
        searchHeader.textContent = `These are the results for "${query}":`
        displayMeals(data.meals);
      } else {
        searchHeader.textContent = `Sorry, no results found for "${query}"`;
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert(`Oh dear! An error occurred while fetching data: ${error.message}`);
    });
});

function displayMeals(meals) {
  /*const searchHeader = document.getElementById("searchHeader");*/
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  swiperWrapper.innerHTML = "";

  meals.forEach(meal => {
    const slideElement = document.createElement("div");
    slideElement.classList.add("swiper-slide");

    const imgElement = document.createElement("img");
    imgElement.src = meal.strMealThumb;
    imgElement.alt = meal.strMeal;
    imgElement.classList.add("meal-image");

    const titleElement = document.createElement("h2");
    titleElement.textContent = meal.strMeal;

    slideElement.appendChild(imgElement);
    slideElement.appendChild(titleElement);
    swiperWrapper.appendChild(slideElement);

    imgElement.addEventListener("click", () => {
      const previouslySelected = document.querySelector(".meal-image.selected");
      if (previouslySelected) {
        previouslySelected.classList.remove("selected");
      }
      imgElement.classList.add("selected");

      displayMealDetails(meal);
    });
  });
  setTimeout(initialiseSwiper, 0);
}

function initialiseSwiper() {
  new Swiper(".images-container-swiper", {
    direction: "horizontal",
    loop: false,
    slidesPerView: 3,
    spaceBetween: 10,
    grid: {
      rows: 2,
      fill: "row"
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    }
  });
}

function displayMealDetails(meal) {
  const recipeDetails = document.querySelector(".recipeDetails");
  const recipeModal = document.getElementById("recipeModal");
  const modalContent = document.querySelector(".modal-content");
  recipeDetails.innerHTML = "";

  recipeDetails.innerHTML = `
  <h1>${meal.strMeal}</h1>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
  <h3>Category: ${meal.strCategory || "Unknown"}</h3>
  <h3>Cuisine: ${meal.strArea || "Unknown"}</h3>
  <h3>Ingredients:</h3>
  <ul>${generateIngredientsList(meal).join("")}</ul>
  <h3>Instructions:</h3>
  <p>${meal.strInstructions || "No instructions available"}</p> 
  }
  `;

  recipeModal.style.display = "block";

  const closeButton = document.querySelector(".close");
  closeButton.addEventListener("click", () => {
    recipeModal.style.display = "none";
  });

  recipeModal.addEventListener("click", (event) => {
    if (!modalContent.contains(event.target)) {
      recipeModal.style.display = "none";
    }
  })
}

function generateIngredientsList(meal) {
  if (!meal || typeof meal !== "object") {
    console.error("Meal object not working", meal);
    return [];
  }

  const ingredients = [];
  let i = 1;

  while (meal[`strIngredient${i}`]) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push(`<li>${ingredient} - ${measure || ""}</li>`);
    }
    i++;
  }
  return ingredients;
}

function initialiseSwiperText() {
  new Swiper(".recipeDetails", {
    direction: "horizontal",
    loop: false,
    slidesPerView: 1,
    spaceBetween: 10
  });
}
