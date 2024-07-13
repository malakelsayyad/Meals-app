let rowData = document.getElementById("rowData");
let loading = document.querySelector('.loading-screen')
let searchContainer = document.getElementById("searchContainer");
let submitBtn;


function openNav() {
    $(".side-nav-menu").animate({
        left: 0
    }, 500)


    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");


    for (let i = 0; i < 5; i++) {
        $(".list li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}

function closeNav() {
    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth()
    $(".side-nav-menu").animate({
        left: -boxWidth
    }, 500)

    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-x");


    $(".list li").animate({
        top: 300
    }, 500)
}

closeNav()
$(".side-nav-menu i.open-close-icon").click(() => {
    if ($(".side-nav-menu").css("left") == "0px") {
        closeNav()
    } else {
        openNav()
    }
})



// display meals

function displayMeals(list) {
    let meals = "";

    for (let i = 0; i < list.length; i++) {
        meals += `
        <div class="col-md-3">
                <div onclick="getMealDetails('${list[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${list[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${list[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }

    rowData.innerHTML = meals
}

// Random 

async function getRandomMeals() {

    rowData.innerHTML = ""
    $(".inner-loading").fadeIn(300)

    let meals = [];
    for (let i = 0; i < 20; i++) {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
        let data = await response.json();
        meals.push(data.meals[0]);
        displayMeals(meals);
        $(".inner-loading").fadeOut(300)
    }



}


getRandomMeals();

// details

async function getMealDetails(mealID) {
    closeNav()
    rowData.innerHTML = ""
    $(".inner-loading").fadeIn(300)

    searchContainer.innerHTML = "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    let data = await response.json();

    console.log(data)
    displayDetails(data.meals[0])
    $(".inner-loading").fadeOut(300)

}


function displayDetails(meal) {

        searchContainer.innerHTML = "";


    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags?.split(",")
    // let tags = meal.strTags.split(",")
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }
     
    let box = ''
    
        box += ` <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    

    rowData.innerHTML = box
    
}

// search

function searchInputs() {

    searchContainer.innerHTML = `
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control  " type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFirst(this.value)" maxlength="1" class="form-control " type="text" placeholder="Search By First Letter">
        </div>
    </div>`

    rowData.innerHTML = ""

}

async function searchByName(term) {
    closeNav()
    rowData.innerHTML = ""
    $(".inner-loading").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    let data = await response.json();

    if (data.meals) {
        displayMeals(data.meals.slice(0, 20))
        $(".inner-loading").fadeOut(300)
    }
    else {
        displayMeals([])
    }


}
async function searchByFirst(letter) {
    closeNav()
    rowData.innerHTML = ""
    $(".inner-loading").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
    let data = await response.json();

    if (data.meals) {
        displayMeals(data.meals.slice(0, 20))
        $(".inner-loading").fadeOut(300)
    }
    else {
        displayMeals([])
    }



}

// category

async function getCategories() {

    $(".inner-loading").fadeIn(300)
    searchContainer.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    let data = await response.json();

    displayCategories(data.categories)
    $(".inner-loading").fadeOut(300)

}


function displayCategories(category) {
    let categories = "";

    for (let i = 0; i < category.length; i++) {
        categories += `
        <div class="col-md-3">
                <div onclick="getMealsByCategory('${category[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${category[i].strCategoryThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${category[i].strCategory}</h3>
                        <p>${category[i].strCategoryDescription}</p>
                    </div>
                </div>
        </div>
        `
    }

    rowData.innerHTML = categories
}
async function getMealsByCategory(category) {
    rowData.innerHTML = ""
    $(".inner-loading").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    let data = await response.json()


    displayMeals(data.meals.slice(0, 20))
    $(".inner-loading").fadeOut(300)

}

//  area

async function getByArea() {

    rowData.innerHTML = ""
    $(".inner-loading").fadeIn(300)

    searchContainer.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    let data = await response.json()

    displayAreas(data.meals)
    $(".inner-loading").fadeOut(300)

}
async function getMealsByArea(area) {
    rowData.innerHTML = ""
    $(".inner-loading").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    let data = await response.json()


    displayMeals(data.meals.slice(0, 20))
    $(".inner-loading").fadeOut(300)

}

function displayAreas(area) {
    let areas = "";

    for (let i = 0; i < area.length; i++) {
        areas += `
        <div class="col-md-3">
                <div onclick="getMealsByArea('${area[i].strArea}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                     <i class="fa-solid fa-house-laptop fa-3x"></i>
                        <h3>${area[i].strArea}</h3>
                </div>
        </div>
        `
    }

    rowData.innerHTML = areas
}

// ingredients

async function getIngredients() {

    rowData.innerHTML = ""
    $(".inner-loading").fadeIn(300)

    searchContainer.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    data = await response.json()
    console.log(data.meals);

    displayIngredients(data.meals.slice(0, 20))
    $(".inner-loading").fadeOut(300)
}

function displayIngredients(ing) {
    let ingredients = "";

    for (let i = 0; i < ing.length; i++) {
        ingredients += `
        <div class="col-md-3">
                <div onclick="getIncludedIngredient('${ing[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${ing[i].strIngredient}</h3>
                        <p>${ing[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
        </div>
        `
    }

    rowData.innerHTML = ingredients
}
async function getIncludedIngredient(ingredients) {

    rowData.innerHTML = ""
    $(".inner-loading").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    data = await response.json()


    displayMeals(data.meals.slice(0, 20))
    $(".inner-loading").fadeOut(300)
}

// contact us

function contactUs() {
    rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid example Lahmed@gmail.com
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight mixed characters : *
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
    submitBtn = document.getElementById("submitBtn")


    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputTouched = true
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputTouched = true
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputTouched = true
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputTouched = true
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputTouched = true
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputTouched = true
    })
}


//validation 

function inputsValidation() {
    if (nameInputTouched) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")

        }
    }
    if (emailInputTouched) {

        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")

        }
    }

    if (phoneInputTouched) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

        }
    }

    if (ageInputTouched) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")

        }
    }

    if (passwordInputTouched) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

        }
    }
    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

        }
    }


    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}

function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}