const key = config.MY_API_KEY

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
};

$('#restaurant-search').on('click', searchRest);