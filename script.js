document.addEventListener('DOMContentLoaded', function() {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,precipitation,apparent_temperature,wind_speed_10m,is_day,relative_humidity_2m,weather_code&timezone=auto")
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData
        console.log(data)
        showPlace()
        addImages()
        searchCountry()
        changeUnit()
    })
    .catch(error => console.error(error))

    function formatHour(isoTime) {
        return new Date(isoTime).toLocaleTimeString("en-US", {
            hour: "numeric",
            hour12: true
        });
    }

    function getDayName(dateStr) {
        return new Date(dateStr).toLocaleDateString("en-US", {
            weekday: "long"
        });
    }

    function groupHourlyByDay(hourly) {
        const grouped = {};

        hourly.time.forEach((time, index) => {
            const date = time.split("T")[0];

            if (!grouped[date]) grouped[date] = [];

            grouped[date].push({
                time,
                temp: hourly.temperature_2m[index],
                code: hourly.weather_code[index]
            });
        });
        return grouped;
    }

    function initHourlyForecast() {
        const hourlyByDay = groupHourlyByDay(data.hourly);
        const daySelect = document.getElementById("day-select");
        const hourlyForecast = document.getElementById("hourly-forecast");

        if (!daySelect || !hourlyForecast) return;

        daySelect.innerHTML = "";

        Object.keys(hourlyByDay).forEach(date => {
            const option = document.createElement("option");
            option.value = date;
            option.textContent = getDayName(date);
            daySelect.appendChild(option);
        });

        function renderHourly(date) {
            hourlyForecast.innerHTML = "";

            hourlyByDay[date].slice(0, 8).forEach(hour => {
                const row = document.createElement("div");
                row.className = "hour-row";

                row.innerHTML = `
                    <span>${formatHour(hour.time)}</span>
                    <img class="hour-icon" alt="${hour.code}">
                    <span>${Math.round(hour.temp)}°</span>
                `;

                hourlyForecast.appendChild(row);
            });

            applyHourlyIcons();
        }

        daySelect.addEventListener("change", e => {
            renderHourly(e.target.value);
        });

        renderHourly(daySelect.value);
    }

    function showSearchLoading() {
        document.querySelector("#search-loading").classList.remove("hidden");
    }

    function hideSearchLoading() {
        document.querySelector("#search-loading").classList.add("hidden");
    }

    function showPlace(){
        const contentDiv = document.querySelector('#content-div')
        const formattedDate = new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric"
        });
        const days = data.daily.time.map(d =>
            new Date(d).toLocaleDateString("en-US", { weekday: "short" })
        );
        let output = ""
        if (data){
            output = `
                <div id="compass-div">
                    <div id="c1">
                        <div id="place">
                            <div id="spd1">
                                <p id="p1">Berlin</p>
                                <p id="p2">${formattedDate}</p>
                            </div>
                            <div id="spd2">
                                <img src="" alt="${data.current.weather_code}" id="main-img">
                            </div>
                            <div id="spd3">${data.current.temperature_2m}°</div>
                        </div>
                        <div id="fx">
                            <div class="grey-div">
                                <p class="fcb">Feels Like</p>
                                <p class="fct">${data.current.apparent_temperature}°</p>
                            </div>
                            <div class="grey-div">
                                <p class="fcb">Humidity</p>
                                <p class="fct">${data.current.relative_humidity_2m}%</p>
                            </div>
                            <div class="grey-div">
                                <p class="fcb">Wind</p>
                                <p class="fct">${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}</p>
                            </div>
                            <div class="grey-div">
                                <p class="fcb">Precipitation</p>
                                <p class="fct">${data.current.precipitation} ${data.current_units.precipitation}</p>
                            </div>
                        </div>
                        <div id="irr">Daily Forecast</div>
                        <div id="lower">
                            <div class="trt">
                                <p>${days[0]}</p>
                                <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[0]}" src=""></div>
                                <div class="ll">
                                    <p>${data.daily.temperature_2m_max[0]}°</p>
                                    <p>${data.daily.temperature_2m_min[0]}°</p>
                                </div>
                            </div>
                            <div class="trt">
                                <p>${days[1]}</p>
                                <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[1]}" src=""></div>
                                <div class="ll">
                                    <p>${data.daily.temperature_2m_max[1]}°</p>
                                    <p>${data.daily.temperature_2m_min[1]}°</p>
                                </div>
                            </div>
                            <div class="trt">
                                <p>${days[2]}</p>
                                <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[2]}" src=""></div>
                                <div class="ll">
                                    <p>${data.daily.temperature_2m_max[2]}°</p>
                                    <p>${data.daily.temperature_2m_min[2]}°</p>
                                </div>
                            </div>
                            <div class="trt">
                                <p>${days[3]}</p>
                                <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[3]}" src=""></div>
                                <div class="ll">
                                    <p>${data.daily.temperature_2m_max[3]}°</p>
                                    <p>${data.daily.temperature_2m_min[3]}°</p>
                                </div>
                            </div>
                            <div class="trt">
                                <p>${days[4]}</p>
                                <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[4]}" src=""></div>
                                <div class="ll">
                                    <p>${data.daily.temperature_2m_max[4]}°</p>
                                    <p>${data.daily.temperature_2m_min[4]}°</p>
                                </div>
                            </div>
                            <div class="trt">
                                <p>${days[5]}</p>
                                <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[5]}" src=""></div>
                                <div class="ll">
                                    <p>${data.daily.temperature_2m_max[5]}°</p>
                                    <p>${data.daily.temperature_2m_min[5]}°</p>
                                </div>
                            </div>
                            <div class="trt">
                                <p>${days[6]}</p>
                                <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[6]}" src=""></div>
                                <div class="ll">
                                    <p>${data.daily.temperature_2m_max[6]}°</p>
                                    <p>${data.daily.temperature_2m_min[6]}°</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="c2">
                        <div id="hourly-header">
                            <p>Hourly Forecast</p>
                            <select id="day-select"></select>
                        </div>
                        <div id="hourly-forecast"></div>
                    </div>
                </div>
            `
        }
        contentDiv.innerHTML += output
        initHourlyForecast()
    }

    function addImages(){
        toAddImg = document.querySelectorAll('.img-change')
        toAddImg.forEach(g => {
            if(g.alt == "0"){
                g.src = "./assets/images/icon-sunny.webp"
            }
            else if(g.alt == "1" || g.alt == "3"){
                g.src = "./assets/images/icon-overcast.webp"
            }
            else if(g.alt == "2"){
                g.src = "./assets/images/icon-partly-cloudy.webp"
            }
            else if(g.alt == "45" || g.alt == "48"){
                g.src = "./assets/images/icon-fog.webp"
            }
            else if(g.alt == "51" || g.alt == "53" || g.alt == "55" || g.alt == "56" || g.alt == "57"){
                g.src = "./assets/images/icon-drizzle.webp"
            }
            else if(g.alt == "61" || g.alt == "63" || g.alt == "65" || g.alt == "66" || g.alt == "67"){
                g.src = "./assets/images/icon-rain.webp"
            }
            else if(g.alt == "71" || g.alt == "73" || g.alt == "75" || g.alt == "77"){
                g.src = "./assets/images/icon-snow.webp"
            }
            else if(g.alt == "80" || g.alt == "81" || g.alt == "82" || g.alt == "85" || g.alt == "86" || g.alt == "95" || g.alt == "96" || g.alt == "99"){
                g.src = "./assets/images/icon-storm.webp"
            }
        })
        mainImg = document.querySelector('#main-img')
        console.log(mainImg)
        const imAlt = mainImg.alt
        if (imAlt == "0") mainImg.src = "./assets/images/icon-sunny.webp";
        else if (imAlt <= 2) mainImg.src = "./assets/images/icon-partly-cloudy.webp";
        else if (imAlt <= 48) mainImg.src = "./assets/images/icon-overcast.webp";
        else if (imAlt <= 67) mainImg.src = "./assets/images/icon-rain.webp";
        else if (imAlt <= 77) mainImg.src = "./assets/images/icon-snow.webp";
        else mainImg.src = "./assets/images/icon-storm.webp";
    }    

    function applyHourlyIcons() {
        document.querySelectorAll(".hour-icon").forEach(img => {
            const code = img.alt;

            if (code == "0") img.src = "./assets/images/icon-sunny.webp";
            else if (code <= 2) img.src = "./assets/images/icon-partly-cloudy.webp";
            else if (code <= 48) img.src = "./assets/images/icon-overcast.webp";
            else if (code <= 67) img.src = "./assets/images/icon-rain.webp";
            else if (code <= 77) img.src = "./assets/images/icon-snow.webp";
            else img.src = "./assets/images/icon-storm.webp";
        });
    }

    function searchCountry(){
        const searchButton = document.querySelector('#b1')
        const searchInput = document.querySelector('#p-search')
        const searchUnit = document.querySelector('#units')
        searchButton.addEventListener('click', function(){
            if(searchInput.value == ""){
                console.log('No input')
                return;
            }

            showSearchLoading()

            fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchInput.value}&count=1&language=en&format=json`)
            .then(res => res.json())
            .then(results => {
                console.log(results)
                if(!results.results){
                    document.querySelector('#compass-div').style.display = 'none'
                    document.querySelector('#no-search').style.display = 'block'
                }
                else{
                    document.querySelector('#no-search').style.display = 'none'
                    showSearchedCountryData(results.results[0].longitude, results.results[0].latitude, searchUnit.value, results.results[0].name)
                    document.querySelector('#compass-div').style.display = 'block'
                }
            })
            .catch(err => console.error(err))
            .finally(() => {
                hideSearchLoading()
            })
        })
    }

    function changeUnit(){
        const searchUnit = document.querySelector('#units')
        searchUnit.addEventListener('change', function(){
            const currentLoc = document.querySelector('#p1')
            showSearchLoading()
            fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${currentLoc.textContent}&count=1&language=en&format=json`)
            .then(res => res.json())
            .then(results => {
                console.log(currentLoc.textContent)
                showSearchedCountryData(results.results[0].longitude, results.results[0].latitude, searchUnit.value, results.results[0].name)
            })
            .finally(() => {
                hideSearchLoading()
            })
        })
    }

    function showSearchedCountryData(long, lat, unit, name){
        const formattedDate = new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric"
        });

        const days = data.daily.time.map(d =>
            new Date(d).toLocaleDateString("en-US", { weekday: "short" })
        );

        if(unit == 'metric'){
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,precipitation,apparent_temperature,wind_speed_10m,is_day,relative_humidity_2m,weather_code&timezone=auto`)
            .then(res => res.json())
            .then(results => {
                data = results
                let output = ""
                if (data){
                    output = `
                        <div id="compass-div">
                            <div id="c1">
                                <div id="place">
                                    <div id="spd1">
                                        <p id="p1">${name}</p>
                                        <p id="p2">${formattedDate}</p>
                                    </div>
                                    <div id="spd2">
                                        <img src="" alt="${data.current.weather_code}" id="main-img">
                                    </div>
                                    <div id="spd3">${data.current.temperature_2m}°</div>
                                </div>
                                <div id="fx">
                                    <div class="grey-div">
                                        <p class="fcb">Feels Like</p>
                                        <p class="fct">${data.current.apparent_temperature}°</p>
                                    </div>
                                    <div class="grey-div">
                                        <p class="fcb">Humidity</p>
                                        <p class="fct">${data.current.relative_humidity_2m}%</p>
                                    </div>
                                    <div class="grey-div">
                                        <p class="fcb">Wind</p>
                                        <p class="fct">${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}</p>
                                    </div>
                                    <div class="grey-div">
                                        <p class="fcb">Precipitation</p>
                                        <p class="fct">${data.current.precipitation} ${data.current_units.precipitation}</p>
                                    </div>
                                </div>
                                <div id="irr">Daily Forecast</div>
                                <div id="lower">
                                    <div class="trt">
                                        <p>${days[0]}</p>
                                        <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[0]}" src=""></div>
                                        <div class="ll">
                                            <p>${data.daily.temperature_2m_max[0]}°</p>
                                            <p>${data.daily.temperature_2m_min[0]}°</p>
                                        </div>
                                    </div>
                                    <div class="trt">
                                        <p>${days[1]}</p>
                                        <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[1]}" src=""></div>
                                        <div class="ll">
                                            <p>${data.daily.temperature_2m_max[1]}°</p>
                                            <p>${data.daily.temperature_2m_min[1]}°</p>
                                        </div>
                                    </div>
                                    <div class="trt">
                                        <p>${days[2]}</p>
                                        <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[2]}" src=""></div>
                                        <div class="ll">
                                            <p>${data.daily.temperature_2m_max[2]}°</p>
                                            <p>${data.daily.temperature_2m_min[2]}°</p>
                                        </div>
                                    </div>
                                    <div class="trt">
                                        <p>${days[3]}</p>
                                        <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[3]}" src=""></div>
                                        <div class="ll">
                                            <p>${data.daily.temperature_2m_max[3]}°</p>
                                            <p>${data.daily.temperature_2m_min[3]}°</p>
                                        </div>
                                    </div>
                                    <div class="trt">
                                        <p>${days[4]}</p>
                                        <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[4]}" src=""></div>
                                        <div class="ll">
                                            <p>${data.daily.temperature_2m_max[4]}°</p>
                                            <p>${data.daily.temperature_2m_min[4]}°</p>
                                        </div>
                                    </div>
                                    <div class="trt">
                                        <p>${days[5]}</p>
                                        <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[5]}" src=""></div>
                                        <div class="ll">
                                            <p>${data.daily.temperature_2m_max[5]}°</p>
                                            <p>${data.daily.temperature_2m_min[5]}°</p>
                                        </div>
                                    </div>
                                    <div class="trt">
                                        <p>${days[6]}</p>
                                        <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[6]}" src=""></div>
                                        <div class="ll">
                                            <p>${data.daily.temperature_2m_max[6]}°</p>
                                            <p>${data.daily.temperature_2m_min[6]}°</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="c2">
                                <div id="hourly-header">
                                    <p>Hourly Forecast</p>
                                    <select id="day-select"></select>
                                </div>
                                <div id="hourly-forecast"></div>
                            </div>
                        </div>
                    `
                }                
                document.querySelector('#compass-div').remove()
                document.querySelector('#content-div').innerHTML += output
                initHourlyForecast()
                addImages()
                searchCountry()
            })
        } else if(unit == 'imperial'){
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,precipitation,apparent_temperature,wind_speed_10m,is_day,relative_humidity_2m,weather_code&timezone=auto&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`)
            .then(res => res.json())
            .then(results => {
                data = results
                let output = ""
                if (data){
                    output = `
                        <div id="compass-div">
                            <div id="c1">
                                <div id="place">
                                    <div id="spd1">
                                        <p id="p1">${name}</p>
                                        <p id="p2">${formattedDate}</p>
                                    </div>
                                    <div id="spd2">
                                        <img src="" alt="${data.current.weather_code}" id="main-img">
                                    </div>
                                    <div id="spd3">${data.current.temperature_2m}°</div>
                                </div>
                                <div id="fx">
                                    <div class="grey-div">
                                        <p class="fcb" class="fcb">Feels Like</p>
                                        <p class="fct">${data.current.apparent_temperature}°</p>
                                    </div>
                                    <div class="grey-div">
                                        <p class="fcb" class="fcb">Humidity</p>
                                        <p class="fct">${data.current.relative_humidity_2m}%</p>
                                    </div>
                                    <div class="grey-div">
                                        <p class="fcb" class="fcb">Wind</p>
                                        <p class="fct">${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}</p>
                                    </div>
                                    <div class="grey-div">
                                        <p class="fcb" class="fcb">Precipitation</p>
                                        <p class="fct">${data.current.precipitation} ${data.current_units.precipitation}</p>
                                    </div>
                                </div>
                                <div id="irr">Daily Forecast</div>
                                <div id="lower">
                                    <div class="trt">
                                        <p>${days[0]}</p>
                                        <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[0]}" src=""></div>
                                        <div class="ll">
                                            <p>${data.daily.temperature_2m_max[0]}°</p>
                                            <p>${data.daily.temperature_2m_min[0]}°</p>
                                        </div>
                                    </div>
                                    <div class="trt">
                                        <p>${days[1]}</p>
                                        <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[1]}" src=""></div>
                                        <div class="ll">
                                            <p>${data.daily.temperature_2m_max[1]}°</p>
                                            <p>${data.daily.temperature_2m_min[1]}°</p>
                                        </div>
                                    </div>
                                    <div class="trt">
                                        <p>${days[2]}</p>
                                        <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[2]}" src=""></div>
                                        <div class="ll">
                                            <p>${data.daily.temperature_2m_max[2]}°</p>
                                            <p>${data.daily.temperature_2m_min[2]}°</p>
                                        </div>
                                    </div>
                                    <div class="trt">
                                        <p>${days[3]}</p>
                                        <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[3]}" src=""></div>
                                        <div class="ll">
                                            <p>${data.daily.temperature_2m_max[3]}°</p>
                                            <p>${data.daily.temperature_2m_min[3]}°</p>
                                        </div>
                                    </div>
                                    <div class="trt">
                                        <p>${days[4]}</p>
                                        <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[4]}" src=""></div>
                                        <div class="ll">
                                            <p>${data.daily.temperature_2m_max[4]}°</p>
                                            <p>${data.daily.temperature_2m_min[4]}°</p>
                                        </div>
                                    </div>
                                    <div class="trt">
                                        <p>${days[5]}</p>
                                        <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[5]}" src=""></div>
                                        <div class="ll">
                                            <p>${data.daily.temperature_2m_max[5]}°</p>
                                            <p>${data.daily.temperature_2m_min[5]}°</p>
                                        </div>
                                    </div>
                                    <div class="trt">
                                        <p>${days[6]}</p>
                                        <div class="imgd"><img class="img-change" alt="${data.daily.weather_code[6]}" src=""></div>
                                        <div class="ll">
                                            <p>${data.daily.temperature_2m_max[6]}°</p>
                                            <p>${data.daily.temperature_2m_min[6]}°</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="c2">
                                <div id="hourly-header">
                                    <p>Hourly Forecast</p>
                                    <select id="day-select"></select>
                                </div>
                                <div id="hourly-forecast"></div>
                            </div>
                        </div>
                    `
                }
                document.querySelector('#compass-div').remove()
                document.querySelector('#content-div').innerHTML += output
                initHourlyForecast()
                addImages()
                searchCountry()
            })
        }
    }
})




