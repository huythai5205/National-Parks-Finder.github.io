$(document).ready(function () {

    let aParks = [];
    let oPark;
    let aCoordinates = [];

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

    function getCoordinate(coordinate) {
        //"lat:38.03977546, long:-103.4266499"
        coordinate = coordinate.split(",");
        let latitude = coordinate[0].split(":");
        let longitude = coordinate[1].split(":");

        return [latitude[1], longitude[1]];
    }

    function savePark() {
        firebase.database().ref('/Park').set(oPark);
    }

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
            oPark = json.data;
            savePark();
            //document.location.href = 'parkDetails.html';
        });
    }


    $('#searchParksBtn').click(function () {
        let location = "?stateCode=" + $('#stateInput').val();
        console.log($('#stateInput').val());
        //fetchNPS('parks', location);
    });

    $(document).on('click', '.park', function () {
        let parkId = '?parkCode=' + $(this).attr('id');

        fetchNPS('parks', parkId);
    });

    (function renderPark() {
        firebase.database().ref('/Park').on('value', function (data) {
            if (data.exists()) {
                oPark = data.val();
                console.log(oPark);

                $('.row').append(`
                    <div class="park">
                    <div class="col">
                    <h2>${oPark[0].fullName}</h2>
                    <p>${oPark[0].description}</p>
                    </div>
                    </div>

                `);

                let coord = getCoordinate(oPark[0].latLong);
                console.log(coord[0], coord[1]);
                initMap(coord[0], coord[1]);
            }
        });
    })();




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
});