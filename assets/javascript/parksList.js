$(document).ready(function () {

    let aParks = [];
    let oParks;
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
        firebase.database().ref('/Park').set(oParks);
    }

    $('#searchParksBtn').click(function () {
        let location = "?stateCode=" + $('#stateInput').val();
        console.log($('#stateInput').val());
        //fetchNPS('parks', location);
    });

    $(document).on('click', '', function () {

    });

    (function renderParks() {
        firebase.database().ref('/Parks').on('value', function (data) {
            if (data.exists()) {
                aParks = data.val();
                console.log(aParks);
            }
            $.each(aParks, function (index, value) {
                if (value.latLong) {
                    aCoordinates.push(getCoordinate(value.latLong));
                }
                $('.row').append(`
                    <div class="col-md-4">
                    images
                    </div>
                    <div class="col-md-9">
                    <h2>${value.fullName}</h2>
                    <p>${value.description}</p>
                    </div>
                `);
            });

        });
    })();


    // function fetchNPS(topic, string) {

    //     let key = 'ZKLb9xO0SnI4KkfXFdoM9fmLuFkJqtfVtXKPpxM0';
    //     let url = 'https://cors-anywhere.herokuapp.com/https://developer.nps.gov/api/v1/' + topic + '' + string;

    //     var myHeaders = new Headers();
    //     myHeaders.append('X-Api-Key', key);
    //     var myInit = {
    //         method: 'GET',
    //         headers: myHeaders,
    //         mode: 'cors',
    //         cache: 'default'
    //     };

    //     fetch(url, myInit).then(function (response) {
    //         return response.json();
    //     }).then(function (json) {
    //         console.log(json);
    //         aParks = json;
    //         saveParks();
    //         document.location.href = 'parksList.html';
    //     });
    // }


    // function initMap() {
    //     console.log("map working");
    //     var uluru = {
    //         lat: -25.363,
    //         lng: 131.044
    //     };
    //     var map = new google.maps.Map(document.getElementById('map'), {
    //         zoom: 4,
    //         center: uluru
    //     });
    //     var marker = new google.maps.Marker({
    //         position: uluru,
    //         map: map
    //     });

    // }
    // initMap();
});