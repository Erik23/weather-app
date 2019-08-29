import { icons } from './icons-relation.js'
import { states } from './states.js'
const apiKey = 'a394f14579c209bc08a9820366607dbd';
const app = new Vue({
    el: '#app',
    data: {
        weather: {
            weather: [],
            main: [],
            wind: []
        },
        theme: 'light',
        states,
        selectedState: 'Aguascalientes',
        selectedCity: 'Aguascalientes',
        cities: []
    },
    mounted() {
        this.getLocalStorage()
        this.setState()
    },
    methods: {
        getWeather (city) {
            const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=es&uk&APPID=${apiKey}`
            fetch(endpoint)
                .then(response => response.json())
                .then(response => {
                    // Asignamos solo las propiedades weather, main y wind - son las que vamos a estar trabajando
                    this.weather.weather = response.weather[0]
                    this.weather.main = response.main
                    this.weather.weather.icon = this.findIcon(response.weather[0].icon)
                    this.weather.wind = response.wind
                })
                .catch(() => {
                    alert(`No encontramos información de ${city}`)
                })
            
        },
        getLocalStorage() {
            const theme = localStorage.getItem("theme")
            if(theme) {
                this.changeTheme(theme)
            }
            const state = localStorage.getItem("state")
            const city = localStorage.getItem("city")
            if(state) {
                this.getWeather(city)
                this.selectedState = state
                this.selectedCity = city
            } else {
                this.getWeather('Aguascalientes')
            }
        },
        findIcon(current) { // Buscamos el ícono adecuado, recibimos como argumento el icon que nos devuelve la api
            const icon  = icons.find(icon => {
                return icon.current === current
            })
            return icon
        },
        setState() {
            const currentState = states.find((state) => {
                return state.name == this.selectedState
            })
            this.cities = currentState.cities;

            if(!this.findCity()) {
                const firstCityName = currentState.cities[0].name // Primera ciudad del estado
                this.selectedCity = firstCityName;
            }
            this.getWeather(this.selectedCity)

            // Guardamos en localstorage
            localStorage.setItem("state", currentState.name);
            localStorage.setItem("city", this.selectedCity)
        },
        findCity() { //buscamos si la ciudad que se encuentra en selectedCity pertenece al estado 
            const city = this.cities.find((city) => {
                return city.name == this.selectedCity
            })
            return city
        },
        setCity() {
            const city = document.getElementById('select-city').value
            this.getWeather(city)
            localStorage.setItem("city", city)
        },
        changeTheme(theme) {
            this.theme = theme
            const current = theme == 'dark' ? 'light' : 'dark'
            const body = document.querySelector('body')
            body.classList.remove(current) // Eliminamos el tema actual
            body.classList.add(theme) // Agregamos el tema nuevo

            // Guardamos en localstorage
            localStorage.setItem("theme", theme);
        }
    },
    filters: {
        capitalize: function (value) {
          if (!value) return ''
          value = value.toString()
          return value.charAt(0).toUpperCase() + value.slice(1)
        }
    }
})