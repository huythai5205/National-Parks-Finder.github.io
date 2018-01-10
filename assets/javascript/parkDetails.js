$(document).ready(function () {

    let oPark;

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

    function initMap(latitude, longitude) {
        var uluru = {
            lat: parseInt(latitude),
            lng: parseInt(longitude)
        };
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 6,
            center: uluru
        });
        var marker = new google.maps.Marker({
            position: uluru,
            map: map
        });

    }

    function getCoordinate(coordinate) {
        //"lat:38.03977546, long:-103.4266499"
        coordinate = coordinate.split(",");
        let latitude = coordinate[0].split(":");
        let longitude = coordinate[1].split(":");

        return [latitude[1], longitude[1]];
    }

    function renderPark() {
        $('.row').append(`
        <div class="park">
        <div class="col">
        <h2>${oPark[0].fullName}</h2>
        <p>${oPark[0].description}</p>
        </div>
        </div>

    `);

        let coordinates = getCoordinate(oPark[0].latLong);
        console.log(coordinates[0], coordinates[1]);
        initMap(coordinates[0], coordinates[1]);
    }


    function fetchNPS(string) {

        let key = 'ZKLb9xO0SnI4KkfXFdoM9fmLuFkJqtfVtXKPpxM0';
        let url = 'https://cors-anywhere.herokuapp.com/https://developer.nps.gov/api/v1/' + string;

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
            oPark = json.data;
            renderPark();
        });
    }

    (function startPage() {
        firebase.database().ref('/Park Code').on('value', function (data) {
            if (data.exists()) {
                parkCode = data.val();
                fetchNPS(parkCode);
            }
        });
    })();
});