// Initialize and add the map

var provincia = '';
var canton = '';
var distrito = '';

var provinciaName = '';
var cantonName = '';
var distritoName = '';

var latitud;
var longitud

function initMap() {
    let zoom = 7;
    if (provincia != '') {
        zoom = 10;
    }
    if (canton != '') {
        zoom = 15;
    }

    if (distrito != '') {
        zoom = 22;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address:'Costa Rica ' + provinciaName + ' ' + cantonName + ' ' + distritoName }, function (results, status) {
        if (status === "OK") {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();

            latitud = lat;
            longitud = lng;
            // utilizar las coordenadas geográficas para definir la ubicación del mapa y del marcador
            // The location of Uluru
            const uluru = { lat: lat, lng: lng };
            // The map, centered at Uluru
            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: zoom,
                center: uluru,
                mapTypeId: 'hybrid', // set map type to hybrid
            });

            // The marker, positioned at Uluru
            const marker = new google.maps.Marker({
                position: uluru,
                map: map,
            });
        }
    });

}

$.ajax({
    url: 'https://ubicaciones.paginasweb.cr/provincias.json', // URL del API
    type: 'GET', // Método HTTP a utilizar (en este caso, GET)
    dataType: 'json', // Tipo de datos esperados en la respuesta (en este caso, JSON)
    success: function (data) {
        // Si la solicitud es exitosa, procesar los datos
        $.each(data, function (key, value) {
            $('#provincias').append($("<option value='" + key + "'>" + data[key] + "</option>").attr('value', key).text(data[key]));
        });
    },
});

$(document).ready(function () {

    const containerwater = document.querySelector('.container-water');
    const search = document.querySelector('.search-box button');
    const weatherBox = document.querySelector('.weather-box');
    const weatherDetails = document.querySelector('.weather-details');
    const error404 = document.querySelector('.not-found');

    const provinciaCartago = document.getElementById("cartago");
    const provinciaHeredia = document.getElementById("heredia");
    const provinciaLimon = document.getElementById("limon");
    const provinciaSanJose = document.getElementById("san-jose");
    const provinciaAlajuela = document.getElementById("alajuela");
    const provinciaPuntarena = document.getElementById("puntarenas");
    const provinciaGuanacaste = document.getElementById("guanacaste");

    const selectProvincias = document.getElementById("provincias");
    const selectCantones = document.getElementById("cantones");
    const selectDristritos = document.getElementById("distrito");

    const inpLongitud = document.getElementById("longitud");
    const inpLatitud = document.getElementById("latitud");

    $('#provincias').change(function () {
        provincia = $(this).val();
        $.ajax({
            url: 'https://ubicaciones.paginasweb.cr/provincia/' + provincia + '/cantones.json', // URL del API
            type: 'GET', // Método HTTP a utilizar (en este caso, GET)
            dataType: 'json', // Tipo de datos esperados en la respuesta (en este caso, JSON)
            success: function (data) {
                // Si la solicitud es exitosa, procesar los datos
                $.each(data, function (key, value) {
                    $('#cantones').append($("<option value='" + key + "'>" + data[key] + "</option>").attr('value', key).text(data[key]));
                });
            },
        });
    });

    $('#cantones').change(function () {
        canton = $(this).val();
        
        $.ajax({
            url: 'https://ubicaciones.paginasweb.cr/provincia/' + provincia + '/canton/' + canton + '/distritos.json', // URL del API
            type: 'GET', // Método HTTP a utilizar (en este caso, GET)
            dataType: 'json', // Tipo de datos esperados en la respuesta (en este caso, JSON)
            success: function (data) {
                // Si la solicitud es exitosa, procesar los datos
                $.each(data, function (key, value) {
                    $('#distrito').append($("<option value='" + key + "'>" + data[key] + "</option>").attr('value', key).text(data[key]));
                });
            },
        });
    });


    selectProvincias.addEventListener("change", function () {
        provinciaName = this.options[this.selectedIndex].text;
        while (selectCantones.options.length > 1) {
            selectCantones.remove(selectCantones.options.length - 1);
        }
        while (selectDristritos.options.length > 1) {
            selectDristritos.remove(selectDristritos.options.length - 1);
        }
        if (provinciaName == 'Selecione una opcion') {
            provincia = '';
        }
        canton = '';
        distrito = '';
        initMap();
        inpLatitud.value = latitud;
        inpLongitud.value = longitud;
    });

    selectCantones.addEventListener("change", function () {
        cantonName = this.options[this.selectedIndex].text;
        while (selectDristritos.options.length > 1) {
            selectDristritos.remove(selectDristritos.options.length - 1);
        }
        distrito = ''
        initMap();
        inpLatitud.value = latitud;
        inpLongitud.value = longitud;
    });

    selectDristritos.addEventListener("change", function () {
        distritoName = this.options[this.selectedIndex].text;
        initMap();
        inpLatitud.value = latitud;
        inpLongitud.value = longitud;
    });

    search.addEventListener('click', () => {
        climaProvincia('');
    });

    provinciaCartago.addEventListener('click', () => {
        document.querySelector('.search-box input').value = '';
        climaProvincia('Cartago, CR')
    });

    provinciaHeredia.addEventListener('click', () => {
        document.querySelector('.search-box input').value = '';
        climaProvincia('Heredia, CR')
    });

    provinciaLimon.addEventListener('click', () => {
        document.querySelector('.search-box input').value = '';
        climaProvincia('Limón, CR')
    });

    provinciaAlajuela.addEventListener('click', () => {
        document.querySelector('.search-box input').value = '';
        climaProvincia('Alajuela, CR')
    });

    provinciaSanJose.addEventListener('click', () => {
        document.querySelector('.search-box input').value = '';
        climaProvincia('san Jose, CR')
    });

    provinciaPuntarena.addEventListener('click', () => {
        document.querySelector('.search-box input').value = '';
        climaProvincia('Puntarenas, CR')
    });

    provinciaGuanacaste.addEventListener('click', () => {
        document.querySelector('.search-box input').value = '';
        climaProvincia('Guanacaste, CR')
    });

    async function climaProvincia(provinciaP) {

        const APIKey = '4b934c7a18843743669428d794efc4f9';
        let city = document.querySelector('.search-box input').value;

        if (city === '') {
            city = provinciaP;
            document.querySelector('.search-box input').value = provinciaP
        } else {
            provinciaP = city
        }

        fetch('https://api.openweathermap.org/data/2.5/weather?q=' + provinciaP + '&units=metric&appid=' + '4b934c7a18843743669428d794efc4f9')
            .then(response => response.json())
            .then(json => {

                if (json.cod === '404') {
                    containerwater.style.height = '400px';
                    weatherBox.style.display = 'none';
                    weatherDetails.style.display = 'none';
                    error404.style.display = 'block';
                    error404.classList.add('fadeIn');
                    return;
                }

                error404.style.display = 'none';
                error404.classList.remove('fadeIn');

                const image = document.querySelector('.weather-box img');
                const temperature = document.querySelector('.weather-box .temperature');
                const description = document.querySelector('.weather-box .description');
                const humidity = document.querySelector('.weather-details .humidity span');
                const wind = document.querySelector('.weather-details .wind span');

                switch (json.weather[0].main) {
                    case 'Clear':
                        image.src = 'images/clear.png';
                        break;

                    case 'Rain':
                        image.src = 'images/rain.png';
                        break;

                    case 'Snow':
                        image.src = 'images/snow.png';
                        break;

                    case 'Clouds':
                        image.src = 'images/cloud.png';
                        break;

                    case 'Haze':
                        image.src = 'images/mist.png';
                        break;

                    case 'Drizzle':
                        image.src = 'images/lluvia.png';
                        break;

                    default:
                        image.src = '';
                }

                temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
                description.innerHTML = `${json.weather[0].description}`;
                humidity.innerHTML = `${json.main.humidity}%`;
                wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

                weatherBox.style.display = '';
                weatherDetails.style.display = '';
                weatherBox.classList.add('fadeIn');
                weatherDetails.classList.add('fadeIn');
                containerwater.style.height = '590px';

            });
    }

});

window.initMap = initMap;
