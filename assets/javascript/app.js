$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBbhqfr6ojolDSamP-4uuWc-CbdOVqee14",
        authDomain: "national-parks-finder.firebaseapp.com",
        databaseURL: "https://national-parks-finder.firebaseio.com",
        projectId: "national-parks-finder",
        storageBucket: "",
        messagingSenderId: "928628829701"
    };
    firebase.initializeApp(config);

    function getCoordinates(coordinates) {
        var aCoordinates = coordinates.split(",");
        var latitude = aCoordinates[0].split(":");
        latitude = latitude[1];
        var longitude = aCoordinates[1].split(":");
        longitude = longitude[1];
        return [latitude, longitude];
    }

    function displayParksList(parks) {
        fetch('./parksList.html').then(response => {
            return response.text();
        }).then(html => {
            $('.container').html(html);

            $.each(parks.data, function (index, value) {

                let park = `
                <div class="col-sm-4">map</div>
                <div class="col-sm-8 park-details">
                <h1>${value.name}</h1>
                <h2>${value.description}</h2>
                <h2>${value.directionsUrl}</h2>
                <h2>${value.url}</h2>
                </div>
                `;

                $('.parks-list').append(park);
            });
        });

    };

    function fetchNPS(topic, string) {

        let key = 'ZKLb9xO0SnI4KkfXFdoM9fmLuFkJqtfVtXKPpxM0';
        let url = 'https://cors-anywhere.herokuapp.com/https://developer.nps.gov/api/v1/' + topic + '' + string;

        var myHeaders = new Headers();
        myHeaders.append('X-Api-Key', key);
        var myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
        };

        fetch(url, myInit).then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log(json);
            displayParksList(json);
        });
    }

    function initMap(latitude, longitude, map) {

        var uluru = {
            lat: latitude,
            lng: longitude
        };
        console.log(map);
        var map = new google.maps.Map(document.getElementById(map), {
            zoom: 4,
            center: uluru
        });
        var marker = new google.maps.Marker({
            position: uluru,
            map: map
        });

    }

    $('#getLocation').click(function () {
        let location = "?stateCode=" + $('#locationInput').val();
        fetchNPS('parks', location);
    });

});