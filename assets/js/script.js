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

        $('#results').empty();
    
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
        .then(searchRest)
        .catch((error) => console.error("FETCH ERROR:", error));
    
    recentlyViewed();
    
};

function searchRecent () {
    $('#results').empty();

    let city = JSON.parse(localStorage.getItem('cities'))
    
    const cityName = city[0]
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
        cityData = data
    })
    .then(searchRest)
    .catch((error) => console.error("FETCH ERROR:", error));
}

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
    .then(showResults)
    .catch((error) => console.error("FETCH ERROR:", error)); 
    
};

// displaying the returned results on the page
function showResults () {
    let restRow = document.createElement("div");
    restRow.className = "results tile is-parent level"
    console.log(cityRestaurants);

    // results are returned in an array, this loops through the results to display them on the page
    for (let i = 0; i < 10; i++) {
        let restBox = document.createElement("div");
        restBox.className = "restaurant-box column card tile level";

        let restInfo = document.createElement("div")
        restInfo.className = "is-one-third-desktop column title-img"

        restPic = document.createElement("div")
        restPic.className = "restaurant-image card-image is-one-third-desktop"
        restPic.innerHTML = "<img src=" + cityRestaurants.results.data[i].photo.images.large.url + ">"

        restTitle = document.createElement("h2");
        restTitle.className = "title is-centered"
        restTitle.textContent = cityRestaurants.results.data[i].name

        
        restType = document.createElement("h3")
        restType.className = "cuisine-type is-centered";
        restType.textContent = cityRestaurants.results.data[i].cuisine[0].name + ", " + cityRestaurants.results.data[i].cuisine[1].name
        

        restPrice = document.createElement("div");
        restPrice.className = "rest-price "
        restPrice.innerHTML = "<h3>" + cityRestaurants.results.data[i].price_level + "</h3>"
        restMap = document.createElement("div")
        restMap.id = "map" + [i]
        restMap.className = "map column is-one-third-desktop"

        restDesc = document.createElement("div")
        restDesc.className = 'description is-one-third-desktop column rest-desc '

        restDescript = document.createElement('p')
        restDescript.textContent = cityRestaurants.results.data[i].description

        restLink = document.createElement("div")
        restLink.className = "link"
        restLink.innerHTML = "<p>See more information <a href='" + cityRestaurants.results.data[i].web_url + 
        "'>here</a></p><p>Or visit the restaurant's website <a href='" + cityRestaurants.results.data[i].website + "'>here</a></p>"

        
        function initMap() {
        
        const mark = { lat: parseFloat(cityRestaurants.results.data[i].latitude), lng: parseFloat(cityRestaurants.results.data[i].longitude) };
        
        const map = new google.maps.Map(document.getElementById("map" + [i]), {
        zoom: 15,
        center: mark,
        });
        
        const marker = new google.maps.Marker({
        position: mark,
        map: map,
        });        
        };

        setTimeout(initMap, 2000);

        restInfo.append(restPic, restTitle, restType, restPrice)
        restDesc.append(restDescript, restLink)
        restBox.append(restInfo, restDesc, restMap)
        restRow.appendChild(restBox);

    
    };

    resultsEl.appendChild(restRow);   
};



function recentlyViewed() {
    let city = JSON.parse(localStorage.getItem('cities'))

    if (city) {
    for (let i = 0; i < city.length; i++) {
        let dropMenu = document.querySelector("#drop")
        let dropDown = document.createElement("div")
        dropDown.id = 'recent-' + city[i]
        dropDown.value = city[i]
        dropDown.innerHTML = "<a class='dropdown-item' >" + city[i] + "</a>"

        dropMenu.appendChild(dropDown)

        dropDown.addEventListener('click', push)

        function push () {
            city.unshift(dropDown.value);
            localStorage.setItem('cities', JSON.stringify(city))
            setTimeout(refresh, 2000)
        }
    }
}
};

function refresh () {
    sessionStorage.setItem("reloading", "true");
    document.location.reload()
};

window.onload = function() {
    var reloading = sessionStorage.getItem("reloading");
    if (reloading) {
        sessionStorage.removeItem("reloading");
        searchRecent();
    }
}

$('#search-button').on('click', getCityId);