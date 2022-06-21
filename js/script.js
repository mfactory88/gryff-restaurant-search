const key = config.MY_API_KEY

let resultsEl = document.querySelector("#results");
const cities = [];

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
            cities.push(cityName)
            let cityData = JSON.stringify(data)
            localStorage.setItem("cities", JSON.stringify(cities))
            localStorage.setItem("ID", cityData);
        })
        .catch((error) => console.error("FETCH ERROR:", error));

    searchRest();
    
};

function searchRest () {


    let city = JSON.parse(localStorage.getItem("ID"));
    console.log(city)

    let name = city.results.data[0].result_object.location_id;
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
        let results = JSON.stringify(data)
        localStorage.setItem("results", results);
      })
      .catch((error) => console.error("FETCH ERROR:", error));


      showResults();
    
};

$('#search-button').on('click', searchRest);
$('#search-button').on('click', getCityId);