$(document).ready(function () {

    let aParks = [];

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
        firebase.database().ref('/Parks').set(aParks);
    }

    $('#searchParksBtn').click(function () {
        let location = "?stateCode=" + $('#stateInput').val();
        fetchNPS('parks', location);
    });

    function fetchNPS(topic, string) {
        console.log(topic, string);
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
            aParks = json.data;
            saveParks();
            document.location.href = 'parksList.html';
        });
    }


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




    let slideIndex2 = 0;
    carouselTwo();

    function carouselTwo() {
        let i;
        let x = document.getElementsByClassName("featured1");


        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        };

        slideIndex2++;
        if (slideIndex2 > x.length) {
            slideIndex2 = 1
        };

        x[slideIndex2 - 1].style.display = "block";
        setTimeout(carouselTwo, 2000);
    };

    // //third slide

    let slideIndex3 = 0;
    carouselThree();

    function carouselThree() {
        let i;
        let x = document.getElementsByClassName("featured2");


        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        };

        slideIndex3++;
        if (slideIndex3 > x.length) {
            slideIndex3 = 1
        };

        x[slideIndex3 - 1].style.display = "block";
        setTimeout(carouselThree, 2000);
    };

    // //fourth slide

    let slideIndex4 = 0;
    carouselFour();

    function carouselFour() {
        let i;
        let x = document.getElementsByClassName("featured3");


        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        };

        slideIndex4++;
        if (slideIndex4 > x.length) {
            slideIndex4 = 1
        };

        x[slideIndex4 - 1].style.display = "block";
        setTimeout(carouselFour, 2000);
    };
});