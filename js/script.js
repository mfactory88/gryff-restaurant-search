const key = config.MY_API_KEY

let resultsEl = document.querySelector("#results");
const cities = [];
let cityData = {};
let cityRestaurants = {};

function getCityId() {
    
        const cityName = $("#search-bar").val();
        const encodedParams = new URLSearchParams();
        encodedParams.append("q", cityName);
        encodedParams.append("language", "en_US");

        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': key,
                'X-RapidAPI-Host': 'worldwide-restaurants.p.rapidapi.com'
            },
            body: encodedParams
        };

        fetch('https://worldwide-restaurants.p.rapidapi.com/typeahead', options)
        .then((response) => {
            if (response.ok) {
            return response.json();
            } else {
            throw new Error("Sorry, we were unable to complete your request.");
            }
        })
        .then(data => {
            console.log(data);
            cities.push(cityName)
            cityData = data
            localStorage.setItem("cities", JSON.stringify(cities))
        })
        .catch((error) => console.error("FETCH ERROR:", error));

    setTimeout(searchRest, 2000);
    
};

// function chooseCity () {
//     let choices = document.createElement("div")
//     choices.className = "city-choice";

//     for (let i = 0; i < cityData.results.data.length; i++) {
//         let city = document.createElement("button")
//         city.id = "city-" + JSON.stringify(cityData.results.data[i].result_object.location_string)
//         city.textContent = cityData.results.data[i].result_object.location_string

//        choices.appendChild(city)
//        $('#city-' + JSON.stringify(cityData.results.data[i].result_object.location_string)).on('click', searchRest);
//     }
     
//     resultsEl.appendChild(choices)
// }

function searchRest() {
    
    console.log(cityData)

    let name = cityData.results.data[0].result_object.location_id;
    const encodedParams = new URLSearchParams();
    encodedParams.append("language", "en_US");
    encodedParams.append("limit", "30");
    encodedParams.append("location_id", name);
    encodedParams.append("currency", "USD");
    

        
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': key,
            'X-RapidAPI-Host': 'worldwide-restaurants.p.rapidapi.com'
        },
        body: encodedParams
    };

    fetch('https://worldwide-restaurants.p.rapidapi.com/search', options)
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Sorry, we were unable to complete your request.");
        }
        })
        .then(data => {
        console.log(data);
        cityRestaurants = data;
      })
      .catch((error) => console.error("FETCH ERROR:", error));


      setTimeout(showResults, 7000);
    
};

function showResults () {
    let restRow = document.createElement("div");
    restRow.className = "results"
    console.log(cityRestaurants);

    for (let i = 0; i < 10; i++) {
        let restBox = document.createElement("div");
        restBox.className = "restaurant-box";

        restPic = document.createElement("div")
        restPic.className = "restaurant-image"
        restPic.innerHTML = "<img src=" + cityRestaurants.results.data[i].photo.images.small.url + ">"

        restTitle = document.createElement("h2");
        restTitle.textContent = cityRestaurants.results.data[i].name

        
        restType = document.createElement("h3")
        restType.className = "cuisine-type";
        restType.textContent = cityRestaurants.results.data[i].cuisine[0].name
        

        restPrice = document.createElement("div");
        restPrice.className = "rest-price"
        restPrice.innerHTML = "<h3>" + cityRestaurants.results.data[i].price_level + "</h3>"

        restBox.append(restPic, restTitle, restType, restPrice)
        restRow.appendChild(restBox);

        // let restMap = document.createElement("div");
        // restMap.innerHTML = "<iframe src='https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13826.508551359952!2d-95.5512289!3d29.96140185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1655759798004!5m2!1sen!2sus" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>"
    };

    resultsEl.appendChild(restRow);    
}

// $( function () {
//     let availableCity = [];
//     const options = {
//         method: 'GET',
//         headers: {
//             'X-RapidAPI-Key': key,
//             'X-RapidAPI-Host': 'google-maps28.p.rapidapi.com'
//         }
//     };
    
//     fetch('https://google-maps28.p.rapidapi.com/maps/api/place/queryautocomplete/json?input=' + $('#search-bar').val() + '&language=en', options)
//     .then((response) => {
//         if (response.ok) {
//             return response.json();
//         } else {
//             throw new Error("Sorry, we were unable to complete your request.");
//         }
//         })
//         .then(data => {
//         console.log(data);
//         availableCity.push(JSON.stringify(data));
//       })
//       .catch((error) => console.error("FETCH ERROR:", error));

//     for (let i = 0; i < availableCity.predictions.length; i++) {
//         $('#search-bar').autocomplete({
//             source: availableCity.predictions[i]
//         });
//     };
// });

$('#search-button').on('click', getCityId);
