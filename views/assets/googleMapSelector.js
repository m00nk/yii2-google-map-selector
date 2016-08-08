/**
 * @author Dmitrij "m00nk" Sheremetjev <m00nk1975@gmail.com>
 * Date: 27.07.16, Time: 22:09
 */

var googleMapSelector = {
	s: {
		googleBrowserApiKey: '',
		mapDivSelector: '',

		defaultLatitude: 0,
		defaultLongitude: 0,

		latitudeInputSelector: '',
		longitudeInputSelector: '',

		titleInputSelector: '',

		addressInputSelector: '',
		cityInputSelector: '',
		zipInputSelector: '',
		stateInputSelector: '',
		countryInputSelector: '',
		fullAddressInputSelector: '',

		searchFieldSelector: '',

		autoCompleteOptions: {}
	},

	//-----------------------------------------
	map: null,
	marker: null,

	geocoder: null,
	autocomplete: null,

	inputLatitude: null,
	inputLongitude: null,
	inputTitle: null,
	inputAddress: null,
	inputCity: null,
	inputZip: null,
	inputState: null,
	inputCountry: null,
	inputFullAddress: null,

	init: function(initSettings)
	{
		googleMapSelector.s = initSettings;

		googleMapSelector.inputLatitude = $(googleMapSelector.s.latitudeInputSelector);
		googleMapSelector.inputLongitude = $(googleMapSelector.s.longitudeInputSelector);
		googleMapSelector.inputTitle = $(googleMapSelector.s.titleInputSelector);
		googleMapSelector.inputAddress = $(googleMapSelector.s.addressInputSelector);
		googleMapSelector.inputCity = $(googleMapSelector.s.cityInputSelector);
		googleMapSelector.inputZip = $(googleMapSelector.s.zipInputSelector);
		googleMapSelector.inputCountry = $(googleMapSelector.s.countryInputSelector);
		googleMapSelector.inputState = $(googleMapSelector.s.stateInputSelector);
		googleMapSelector.inputFullAddress = $(googleMapSelector.s.fullAddressInputSelector);

		// блокируем отправку родительской формы по нажатию Enter в выпадающем меню результатов поиска гугла.
		$(googleMapSelector.s.searchFieldSelector).bind('keydown', function(e){
			if(e.which == 13 /* ENTER */)
				e.preventDefault();
			return true;
		});

		if(typeof google == 'undefined')
		{
			var st = document.createElement('script');
			st.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=' + googleMapSelector.s.googleBrowserApiKey;
			st.type = 'text/javascript';
			st.onerror = function(){ console.log('GOOGLE MAP LOADER ERROR: ' + this.src)};
			st.onload = function(){googleMapSelector._run();};
			document.getElementsByTagName('head')[0].appendChild(st);
		}
		else
			googleMapSelector._run();
	},

	_run: function()
	{
		var initLatLng, initLat = NaN, initLong = NaN, initPosition = true;

		if(googleMapSelector.inputLatitude)
			initLat = parseFloat(googleMapSelector.inputLatitude.val());

		if(isNaN(initLat))
		{
			initLat = googleMapSelector.s.defaultLatitude;
			initPosition = false;
		}

		if(googleMapSelector.inputLongitude)
			initLong = parseFloat(googleMapSelector.inputLongitude.val());

		if(isNaN(initLong))
		{
			initLong = googleMapSelector.s.defaultLongitude;
			initPosition = false;
		}

		initLatLng = new google.maps.LatLng(initLat, initLong);

		googleMapSelector.map = new google.maps.Map($(googleMapSelector.s.mapDivSelector)[0], {
			center: initLatLng,
			zoom: initPosition ? 17 : 12,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			panControl: true,

			zoomControl: true,
			mapTypeControl: false,
			scaleControl: false,
			streetViewControl: false,
			rotateControl: false
		});

		googleMapSelector.geocoder = new google.maps.Geocoder;

		googleMapSelector.autocomplete = new google.maps.places.Autocomplete($(googleMapSelector.s.searchFieldSelector)[0], googleMapSelector.s.autoCompleteOptions);

		if(initPosition) googleMapSelector._placeMarker(initLatLng);

		//-----------------------------------------
		google.maps.event.addListener(googleMapSelector.autocomplete, 'place_changed', function()
		{
			var item = googleMapSelector.autocomplete.getPlace();
			if(item)
			{
				if(googleMapSelector.inputTitle) googleMapSelector.inputTitle.val(item.name);

				if(!item.geometry) return;

				var bounds = item.geometry.viewport ? item.geometry.viewport : item.geometry.bounds;
				var center = null;

				googleMapSelector.map.setZoom(17);

				if(item.geometry.location)
				{
					center = item.geometry.location;
				}
				else if(bounds)
				{
					var lat = bounds.getSouthWest().lat() + ((bounds.getNorthEast().lat() - bounds.getSouthWest().lat()) / 2);
					var lng = bounds.getSouthWest().lng() + ((bounds.getNorthEast().lng() - bounds.getSouthWest().lng()) / 2);
					center = new google.maps.LatLng(lat, lng);
				}
				if(center)
				{
					googleMapSelector.map.setCenter(center);
					googleMapSelector._placeMarker(center);
				}
			}
		});

		//-----------------------------------------
		googleMapSelector.map.addListener('click', function(e)
		{
			$(googleMapSelector.s.searchFieldSelector).val('');
			if(googleMapSelector.inputTitle) googleMapSelector.inputTitle.val('');

			googleMapSelector._placeMarker(e.latLng);
		});

		// при ручном изменении данных адреса убиваем координаты и полный адрес, т.к. они уже не будут соответствовать измененному вручную адресу
		$(googleMapSelector.inputState)
			.add(googleMapSelector.inputFullAddress)
			.add(googleMapSelector.inputCountry)
			.add(googleMapSelector.inputCity)
			.add(googleMapSelector.inputZip)
			.add(googleMapSelector.inputAddress)
			.bind('change', function(e)
			{
				googleMapSelector.inputLatitude.val('');
				googleMapSelector.inputLongitude.val('');
				googleMapSelector.inputFullAddress.val('');
			})
	},

	_placeMarker: function(latLng)
	{
		if(googleMapSelector.marker)
		{ // удаляем старый маркер
			google.maps.event.clearInstanceListeners(googleMapSelector.marker);
			googleMapSelector.marker.setMap(null);
			googleMapSelector.marker = null;
		}

		googleMapSelector.marker = new google.maps.Marker({
			position: latLng,
			map: googleMapSelector.map
		});

		googleMapSelector._decodeLatLng(latLng);
	},

	_decodeLatLng: function(latLng)
	{
		googleMapSelector.geocoder.geocode({'location': latLng}, function(results, status)
		{
			if(status === google.maps.GeocoderStatus.OK)
			{
				if(googleMapSelector.inputLatitude) googleMapSelector.inputLatitude.val(latLng.lat());
				if(googleMapSelector.inputLongitude) googleMapSelector.inputLongitude.val(latLng.lng());

				if(results.length)
				{
					if(googleMapSelector.inputFullAddress)
						googleMapSelector.inputFullAddress.val(results[0].formatted_address);

					var address = '';
					var city = '';
					var zip = '';
					var state = '';
					var country = '';

					$.each(results[0].address_components, function(idx, data)
					{
						console.log(data.types[0] + ' : ' + data.long_name);

						if(data.types[0] == 'street_number') address += data.long_name;
						if(data.types[0] == 'route') address += ' ' + data.short_name;
						if(data.types[0] == 'locality') city = data.long_name;
						if(data.types[0] == 'postal_code') zip = data.long_name;
						if(data.types[0] == 'administrative_area_level_1') state = data.long_name;
						if(data.types[0] == 'country') country = data.long_name;
					});

					if(googleMapSelector.inputAddress) googleMapSelector.inputAddress.val(address);
					if(googleMapSelector.inputCity) googleMapSelector.inputCity.val(city);
					if(googleMapSelector.inputZip) googleMapSelector.inputZip.val(zip);
					if(googleMapSelector.inputCountry) googleMapSelector.inputCountry.val(country);
					if(googleMapSelector.inputState) googleMapSelector.inputState.val(state);
				}
				else
					window.alert('No results found');
			}
			else
				window.alert('Geocoder failed due to: ' + status);
		});
	}
};
