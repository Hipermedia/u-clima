(function() {
	// Declaro algunas constantes
	// El API key del servicio de Pen Wheather Map
	var API_WEATHER_KEY = "b401dd1678a695b4e014724078adb190";
	// El API url a al que se accee el servicio 
	var API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?APPID=" + API_WEATHER_KEY + "&"; //+ "lat=35&lon=139"
	// El URL base donde se encuentran las iágenes con los iconos del clima
	var IMG_WEATHER = "http://openweathermap.org/img/w/";

	// Asigno en una variable el objeto con datos de la fecha de hoy (Importante recordar que ésta es ña fecha del sistema del cliente)
	var hoy = new Date();
	// Del objeto creado solo obtengo la hora y la asigno a la variable horaActual
	var horaActual = hoy.toLocaleTimeString();

	// Creamos el objeto donde recibiremos los datos de clima del API por ciudad y acontinuación definimos algunas propiedades
	var cityWeather = {};
	// La zona en la que estamos
	cityWeather.zone;
	// La imagen que regresa con el icono del clima actual (soleado, nubes, etc) 
	cityWeather.icon;
	// La tempreratura actual
	cityWeather.temp;
	// El objeto data con toda la información; solo para tenerlo en cache por si necesitaramos otro dato.
	cityWeather.main;

	// Si el navegador cuenta con el método geolocation 
	if (navigator.geolocation) 
	{
		/* Obtengo las coordenadas que me proporciona el navegador; 
			El primer parámetro es la función que correrá en caso de ser correcta .
			El segundo parámetro es ka función de lo que hará si ocurre un error. */
		navigator.geolocation.getCurrentPosition(obtenCoords, errorEncontrado);
	} 
	// Si el navegador es muy viejo y no soporta el método geolocation
	else 
	{
		// Envío un mensaje de error, y se acabó.
		alert("Por favor actualiza tu navegador");
	}
	// Función que corre si "getCurrentPosition" regresa un error
	function errorEncontrado(error) {
		// Envío una mensaje de error a la consola con el código de error; 1: permiso denegado, 2: posición no disponible, 3: timeout
		console.log("Un error ocurrió: " + error.code);
	}
	// Función que corre si "getCurrentPosition" regresa los valores esperados
	function obtenCoords(posision) {
		// Asigno valores de latitud y longitud a las variables lat y long
		var lat = posision.coords.latitude;
		var lon = posision.coords.longitude;
		// Imprimo las cordenadas en consola, para mostrar los valores que regresa (ésto se puede comentar)
		console.log("Tu posición es: " + lat + "," + lon);
		/* Corro un AJAX usando jquery con un get simple para traer la información del API del clima
			El primer parametro paso la URL del API (que ya incluye el API KEY) y los valores de lat y long obtenidos
			El segundo parametro es la función callback, que se ejecutará una vez terminada la obtención de los datos que el API envía ne formato en JSON*/
		$.getJSON(API_WEATHER_URL + "lat=" + lat + "&lon=" + lon, getCurrenWeather);
	}

	// Función callack que se ejecutará una vez terminada la obtención de los datos que el API envía ne formato en JSON
	function getCurrenWeather(data) {
		// Imprimo en consola los valores de data, para saber que estoy recibiendo (ésto se puede comentar)
		console.log(data); 
		// Asignamos los datos en unas variables locales
		cityWeather.zone = data.name;
		// Concatenamos la constante con el URL base de la imagen, con el icoo específico que nos regresa el API
		cityWeather.icon = IMG_WEATHER + data.weather[0].icon + ".png";
		// Asignamos los valores de la temperatura, como el API las regresa en grados Kelvin debemos hacer la convesión a Centigrados restando 273.15. 
		cityWeather.temp = data.main.temp - 273.15;
		// Guardo los principales valores del clima; solo para tenerlo en cache por si necesitaramos otro dato.
		cityWeather.main = data.weather[0].main;
		// Llamo a la función renderTemplate para cargar los datos que recibimos e imprimirla en el DOM
		renderTemplate();
	}

	// Creamos la función para instanciar y activar el template de nuestra tarjeta de clima; Esto reciclable ésta función
	function activarTemplate(id) {
		// Asignamos en t el objeto del elemento dle DOM obtenido al pasar el parametro id
		var t = document.querySelector(id);
		// Regresamos el contenido de la plantilla gracias a la función importNode de JS
		return document.importNode(t.content, true);
	}

	function renderTemplate() {
		/* Llamamos a la función activar template para 
			Obtenemos la estructura de la plantilla en clone de la ficha que se encuentra en index.html */
		var clone = activarTemplate("#Template-ciudad");
		// Insertamos el nombre de la ciudad
		clone.querySelector("[data-city]").innerHTML = cityWeather.zone;
		// Insertamos el url de la imagen en su atributo src
		clone.querySelector("[data-icon]").src = cityWeather.icon;
		/* Insertamos los valores de la temperatura, 
			adicional a esto agregamos el metodo toFixed para convertir el numero a una cadena, dejando solo los decimales que necesitemos */
		clone.querySelector("[data-temp='current']").innerHTML = cityWeather.temp.toFixed(1) + "° C";
		// Insertamos la hora actual
		clone.querySelector("[data-time]").innerHTML = "Hora actual: " + horaActual;
		// Escondemos el loader
		$(".loader").hide();
		// Hacemos que la plantilla sea visible en el DOM
		$("body").append(clone);
	}
})();