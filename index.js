const searchbar=document.getElementById("input");
const btn=document.getElementById("btn");
const currentlocations=document.getElementById("currentlocation");
const recentCitiesDropdown=document.getElementById("recentCitiesDropdown");
const forecastData=document.getElementById("forecastData");


//by using local storage we store the data what we searsh in serachbar
function loadRecentCities() {
    const data = JSON.parse(localStorage.getItem('recentcities')) || [];
    console.log(data);
    recentCitiesDropdown.innerHTML = '';
    if (data.length > 0) 
        {
            recentCitiesDropdown.style.display="block";
            data.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            recentCitiesDropdown.appendChild(option);
        });
    
    } 
    else{
        recentCitiesDropdown.style.display="none";
    }
}

//---------------------------------------------------------

//to store the data in the local storage by creating new array and push the elements into an array
function save(city)
{
    let data=JSON.parse(localStorage.getItem('recentcities',))||[];
    if(!data.includes(city))
    {
        data.push(city);
        localStorage.setItem('recentcities',JSON.stringify(data));
    }
}

//----------------------------------------------------------------------------------------------------------------
const apiKey="24a7280350189717b5c06e8b746ecf57";
const apiUrl="https://api.openweathermap.org/data/2.5/weather?units=metrix&q=";
async function fetchdata(city)
{
    try
    {
        const response=await fetch(apiUrl + city + `&appid=${apiKey}`);
        const result=await response.json();
        if(result.cod==200)
        {
            displayweathercity(result);
            fetchForecast(city);
            save(city);
            loadRecentCities();    

        }
    }
    catch(e){
        console.log(e);

    }
}
//-------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------
function displayweathercity(result)
{
    const { name, main, weather, wind } = result;
    const tempCelsius = (main.temp - 273.15).toFixed(2);
    
    content.innerHTML = `
        <h2>${name}</h2>
        <img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
        <p>Temperature: ${tempCelsius}°C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
        <p>Condition: ${weather[0].description}</p>
       
    `; 
}
//----------------------------------------------------------------------------------------------------------------




// Fetch 5-day forecast data
async function fetchForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        if (data.cod === '200') {
            displayForecast(data);
        } else {
            forecastData.innerHTML = '<p class="text-gray-600">Unable to fetch forecast data.</p>';
        }
    } catch (error) {
        console.error('Error fetching forecast data:', error);
    }
}

function displayForecast(data) {
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00")); // Filter to get data for around midday
    forecastData.innerHTML = dailyData.map(day => {
        const date = new Date(day.dt_txt).toLocaleDateString();
        return `
            <div class="bg-gray-100 p-4 rounded-lg shadow-lg mb-4">
                <h3 class="text-lg font-semibold text-gray-800">${date}</h3>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}" class="mx-auto my-2">
                <p class="text-gray-600">Temp: ${day.main.temp}°C</p>
                <p class="text-gray-600">Wind: ${day.wind.speed} m/s</p>
                <p class="text-gray-600">Humidity: ${day.main.humidity}%</p>
                <p class="text-gray-600">Condition: ${day.weather[0].description}</p>
            </div>
        `;
    }).join('');
}
//------------------------------------------------------------------------------------------------------




function currentlocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(async (position)=>
        {
            const { latitude, longitude } = position.coords;
            try
            {
                const apiKey="24a7280350189717b5c06e8b746ecf57";
                const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
                const result=await response.json();
                if(result.cod==200)
                {
                    displayweathercity(result);
                    fetchForecast(result.name);
                    save(city);
                    loadRecentCities();

        
                }
                else
                {
                    console.error("error");
                }
            }
            catch(e){
                console.log(e);
        
            }
        });
        
    }
    else {
        alert('Geolocation is not supported by this browser');
    }
}
btn.addEventListener("click",()=>
    {
        const city=searchbar.value;
        if(city)
        {
            fetchdata(city);
    
        }
        else{
            alert("enter the city name");
        }
       
    })


currentlocations.addEventListener("click",currentlocation);

recentCitiesDropdown.addEventListener("click",()=>
{
    const select=recentCitiesDropdown.value;
    console.log(select);
    fetchdata(select);

})
loadRecentCities();
currentlocation();