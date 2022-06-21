// API key, hidden 
const key = config.MY_API_KEY;
const googleKey = config.GOOGLE_KEY;

// Global Variables
let resultsEl = document.querySelector("#results");
const cities = [];
let cityData = {};
let cityRestaurants = {};

// This function converts the entered location into a location ID
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

        // getting information from the server
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
            // pushes the city to an array, which is then saved to localstorage
            cities.push(cityName)
            // pushes the returned data to an object, which will be called later
            cityData = data
            localStorage.setItem("cities", JSON.stringify(cities))
        })
        .catch((error) => console.error("FETCH ERROR:", error));

    setTimeout(searchRest, 2000);
    
};

// this is the function to search for the highest rated restaurants, using the city ID returned from the previous function
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
        // pushes data to object
        cityRestaurants = data;
      })
      .catch((error) => console.error("FETCH ERROR:", error));


      setTimeout(showResults, 7000);
    
};

// displaying the returned results on the page
function showResults () {
    let restRow = document.createElement("div");
    restRow.className = "results"
    console.log(cityRestaurants);

    // results are returned in an array, this loops through the results to display them on the page
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
        restType.textContent = cityRestaurants.results.data[i].cuisine[0].name + ", " + cityRestaurants.results.data[i].cuisine[1].name
        

        restPrice = document.createElement("div");
        restPrice.className = "rest-price"
        restPrice.innerHTML = "<h3>" + cityRestaurants.results.data[i].price_level + "</h3>"

        restBox.append(restPic, restTitle, restType, restPrice)
        restRow.appendChild(restBox);

       
    };

    resultsEl.appendChild(restRow);   
    initMap(); 
}

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: { lat: cityData.results.data[0].latitude, lng: cityData.results.data[0].longitude },
    });
    const infoWindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true,
    });

    // Add some markers to the map.
    const eqfeed_callback = function (cityData) {
        for (let i = 0; i < cityData.results.data.length; i++) {
          const coords = [cityData.results.data[i].latitude, cityData.results.data[i].longitude];
          const latLng = new google.maps.LatLng(coords[1], coords[0]);
      
          new google.maps.Marker({
            position: latLng,
            map: map,
          });
        }
      };
    window.eqfeed_callback = eqfeed_callback;
};


// autocomplete function
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

 
//         $('#search-bar').autocomplete({
//             source: availableCity.predictions
//         });
    
// });

$('#search-button').on('click', getCityId);
