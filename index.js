// Initialize and add the map
var pais = 'Costa Rica';
var provincia = '';
var canton = '';
var distrito = '';

var provinciaName = '';
var cantonName = '';
var distritoName = '';

var latitud;
var longitud

function initMap() {
    let zoom =7;
    if(provincia != ''){
        zoom=8;
    }
    if(canton != ''){
        zoom=10;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: pais + ' ' + provinciaName + ' ' + cantonName + ' ' + distritoName }, function (results, status) {
        if (status === "OK") {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();

            latitud  = lat;
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

    const selectProvincias = document.getElementById("provincias");
    const selectCantones = document.getElementById("cantones");
    const selectDristritos = document.getElementById("distrito");

    const inpLongitud = document.getElementById("longitud");
    const inpLatitud = document.getElementById("latitud");

    $('#provincias').change(function () {
        provincia = $(this).val();
        $.ajax({
            url: 'https://ubicaciones.paginasweb.cr/provincia/'+provincia+'/cantones.json', // URL del API
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
        console.log(canton)
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
        initMap();
        inpLatitud.value = latitud;
        inpLongitud.value = longitud;
    });

    selectCantones.addEventListener("change", function () {
        cantonName = this.options[this.selectedIndex].text;
        while (selectDristritos.options.length > 1) {
            selectDristritos.remove(selectDristritos.options.length - 1);
        }
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
});
window.initMap = initMap;