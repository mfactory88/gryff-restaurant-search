//const key = config.MY_API_KEY

let results = document.querySelector("#results");

function searchRest (event) {
    event.preventDefault();
    function getCityId () {
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
            localStorage.setItem("city id", JSON.stringify(data))
        })
        .catch((error) => console.error("FETCH ERROR:", error));
    
    };

    getCityId();

    let cityData = JSON.parse(localStorage.getItem("city id"));
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
        localStorage.setItem("restaurants", JSON.stringify(data))
    })
    .catch((error) => console.error("FETCH ERROR:", error));


    showResults();
};

function showResults () {
    let restRow = document.createElement("div");
    restRow.className = "results"

    let restaurants = JSON.parse(localStorage.getItem("restaurants"));

    for (i = 0; i < 10; i++) {
        let restBox = document.createElement("div");
        restBox.className = "restaurant-box";

        restBox.innerHTML = "<h2>" + restaurants.results.data[i].name + "</h2><br><p>" + restaurants.results.data[i].description + "</p>";

        restRow.appendChild(restBox);
    };

    results.appendChild(restRow);    
}

$('#search-button').on('click', searchRest);
