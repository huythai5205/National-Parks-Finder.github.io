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

    function saveParks() {
        firebase.database().ref('/States Code').set(statesCode);
    }

    $('select').change(function () {
        let statesCode = "parks?stateCode=" + $('select option:selected').val();
        //saveParks(statesCode);
        saveLocal(statesCode);
        //document.location.href = 'parksList.html';

        fetch('./parksList.html').then(response => {
            return response.text();
        }).then(html => {
            $('#container').html(html);
        });

    });


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
            aParks = json.data;

        });
    }


    // Note: This example requires that you consent to location sharing when
    // prompted by your browser. If you see the error "The Geolocation service
    // failed.", it means you probably did not give permission for the browser to
    // locate you.
    var map, infoWindow;

    $('#getCurrentLocationBtn').click(function () {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: -34.397,
                lng: 150.644
            },
            zoom: 6
        });
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log(pos);
                infoWindow.setPosition(pos);
                infoWindow.setContent('Location found.');
                infoWindow.open(map);
                map.setCenter(pos);
            }, function () {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }





    // let slideIndex2 = 0;
    // carouselTwo();

    // function carouselTwo() {
    //     let i;
    //     let x = document.getElementsByClassName("featured1");


    //     for (i = 0; i < x.length; i++) {
    //         x[i].style.display = "none";
    //     };

    //     slideIndex2++;
    //     if (slideIndex2 > x.length) {
    //         slideIndex2 = 1
    //     };

    //     x[slideIndex2 - 1].style.display = "block";
    //     setTimeout(carouselTwo, 2000);
    // };
    // carouselTwo();

    // // //third slide

    // let slideIndex3 = 0;
    // carouselThree();

    // function carouselThree() {
    //     let i;
    //     let x = document.getElementsByClassName("featured2");


    //     for (i = 0; i < x.length; i++) {
    //         x[i].style.display = "none";
    //     };

    //     slideIndex3++;
    //     if (slideIndex3 > x.length) {
    //         slideIndex3 = 1
    //     };

    //     x[slideIndex3 - 1].style.display = "block";
    //     setTimeout(carouselThree, 2000);
    // };

    // // //fourth slide

    // let slideIndex4 = 0;
    // carouselFour();

    // function carouselFour() {
    //     let i;
    //     let x = document.getElementsByClassName("featured3");


    //     for (i = 0; i < x.length; i++) {
    //         x[i].style.display = "none";
    //     };

    //     slideIndex4++;
    //     if (slideIndex4 > x.length) {
    //         slideIndex4 = 1
    //     };

    //     x[slideIndex4 - 1].style.display = "block";
    //     setTimeout(carouselFour, 2000);
    // };
});