/* const searchbar=document.getElementById("forecast");
const btn=document.getElementById("btn");
const heads=document.getElementById("head");
btn.addEventListener("click",()=>
{
   console.log(typeof searchbar.value)
    fetchdata(searchbar.value);

}); */

/* const apiKey="998f05e39b4c6d0e3db492f081392379";
const apiUrl="https://api.openweathermap.org/data/2.5/weather?units=metrix&q=";
async function fetchdata(city)
{
    const response=await fetch(apiUrl + city + `&appid=${apiKey}`);
    const result=await response.json();
    console.log(result.data);
    
   
}

 */











/* let temper= ((temps - 32))*(5/9);
console.log(temper); 

const citys=document.querySelector(".city").innerHTML=result.name;
const temp=document.querySelector(".temp").innerHTML=temper+"℃";
const wind=document.querySelector(".wind").innerHTML=result.wind.speed+ "km/h";
const humid=document.querySelector(".humid").innerHTML=result.main.humidity+ "%"; */

async function fetchForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
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