var apiKey = "63ace9a18e2df2f35573367277a78e65";
var now = dayjs().unix();
var formEl = document.getElementById("search-input")
var searchBtn = document.getElementById("search-button");
var cityDisplayEl = document.querySelector(".city-display");
var forecastDisplayEl = document.querySelector(".forecast-item");
var historyTabEl = document.querySelector(".history-tabs")
var searchHistory = JSON.parse(localStorage.getItem("city")) || [];

//search button functionality
searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    getAPI(formEl.value);
    formEl.value = "";
})

//getting user's geolocation to display on landing
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        cityDisplayEl.innerHTML = "<p>Geolocation is not supported by this browser. Search for a city on the left</p>";
    }
}

function showPosition(position) {
    fetch("http://api.openweathermap.org/geo/1.0/reverse?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&limit=5&appid=" + apiKey)

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            getAPI(data[0].name)
        })
}

//load previously searched city in search history panel
function renderHistory() {
    historyTabEl.innerHTML = '';
    var searchHistory = JSON.parse(localStorage.getItem("city")) || [];

    for (i = 0; i < searchHistory.length; i++) {
        var tab = document.createElement("li");
        tab.innerHTML = "<button>" + searchHistory[i] + "</button>";
        historyTabEl.append(tab);
    }
}

renderHistory();
getLocation();

//create click function on each search history tab
historyTabEl.addEventListener("click", function (event) {
    event.preventDefault();
    getAPI(event.target.textContent)
})


//main function to get API
function getAPI(cityName) {
    //clear out current and five day forecast display containers
    cityDisplayEl.innerHTML = ""
    cityDisplayEl.textContent = "Loading..."
    forecastDisplayEl.innerHTML = ""
    
    //fetch city longtitude and lattitude from city name entered
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=63ace9a18e2df2f35573367277a78e65")

        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            var lat = (data[0].lat)
            var lon = (data[0].lon)
            cityName = (data[0].name)

            //store searched city name in local storage, if it hasn't been added already, to avoid duplicate items.
            if (searchHistory.indexOf(cityName) == -1) {
                searchHistory.push(cityName);
                localStorage.setItem("city", JSON.stringify(searchHistory))
            };

            //render history tab on left panel when new city is searched
            renderHistory();

            //fetch weather data from lattitude and longtitude from previous API interaction  
            return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey)
        })

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayToday(data)
            forecastDisplayEl.innerHTML = "";

            //generate five day forecast display
            for (i = 0; i < 5; i++) { displayForecast(data, i) }
            return;
        })


    //dynamically create display for current weather condition
    function displayToday(dataSet) {
        cityDisplayEl.innerHTML = "";
        city = document.createElement("div")
        city.innerHTML = "<h1>" + cityName + "</h1>" + "<image src='https://openweathermap.org/img/w/" + dataSet.current.weather[0].icon + ".png'>";
        temp = document.createElement("p")
        temp.textContent = "Temp: " + dataSet.current.temp;
        wind = document.createElement("p")
        wind.textContent = "Wind: " + dataSet.current.wind_speed + "MPH"
        humidity = document.createElement("p")
        humidity.textContent = "Humidity: " + dataSet.current.humidity
        UVIndex = document.createElement("div")
        UVIndex.setAttribute("style", "display: flex; flex-wrap: wrap")
        UVIndex.innerHTML = "<p>UV Index: <p>"
        UVIndexNum = document.createElement("p")
        UVIndexNum.textContent = dataSet.current.uvi
        UVIndex.append(UVIndexNum)

        //UV Index color code 
        if (dataSet.current.uvi < 3) { UVIndexNum.setAttribute("style", "background-color: #558B2F;width: 30px") }
        else if (3 <= dataSet.current.uvi < 6) { UVIndexNum.setAttribute("style", "background-color: #F9A825;width: 30px") }
        else if (6 <= dataSet.current.uvi < 11) { UVIndexNum.setAttribute("style", "background-color: #B71C1C;width: 30px") }
        else { UVIndexNum.setAttribute("style", "background-color: #6A1B9A;width: 30px") }
        cityDisplayEl.append(city, temp, wind, humidity, UVIndex)

    }

    //dynamically create display for five day forecast 
    function displayForecast(dataSet, i) {

        date = document.createElement("p")
        date.textContent = dayjs().add(i, "day").format("MM/DD/YYYY")
        city = document.createElement("div")
        city.innerHTML = "<image src='https://openweathermap.org/img/w/" + dataSet.daily[i].weather[0].icon + ".png'>";
        temp = document.createElement("p")
        temp.textContent = "Temp: " + dataSet.daily[i].temp.day;
        wind = document.createElement("p")
        wind.textContent = "Wind: " + dataSet.daily[i].wind_speed + "MPH"
        humidity = document.createElement("p")
        humidity.textContent = "Humidity: " + dataSet.daily[i].humidity
        UVIndex = document.createElement("p")
        UVIndex.textContent = "UV Index: " + dataSet.daily[i].uvi

        card = document.createElement("div")
        card.classList.add("card")
        card.append(date, city, temp, wind, humidity, UVIndex)
        forecastDisplayEl.append(card);
    }
}



