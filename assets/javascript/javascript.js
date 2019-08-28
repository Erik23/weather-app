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
        cities: []
    },
    mounted() {
        this.getWeather()
        this.setState()
    },
    methods: {
        getWeather (city = 'Aguascalientes') {
            const endpoint = `https:\\api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=es&uk&APPID=${apiKey}`
            fetch(endpoint)
                .then(response => response.json())
                .then(response => {
                    // Asignamos solo las propiedades weather, main y wind - son las que vamos a estar trabajando
                    this.weather.weather = response.weather[0]
                    this.weather.main = response.main
                    this.weather.weather.icon = this.findIcon(response.weather[0].icon)
                    this.weather.wind = response.wind
                })
            
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
            this.getWeather(currentState.cities[0].name)
        },
        setCity() {
            const city = document.getElementById('select-city').value
            this.getWeather(city)
        },
        changeTheme() {
            this.theme == 'light' ? this.theme = 'dark' : this.theme = 'light'
            const body = document.querySelector('body').classList.toggle('dark')
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