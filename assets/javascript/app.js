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

    let slideIndex = 0;
    carousel();

    function carousel() {
        let i;
        let x = document.getElementsByClassName("mySlides");

        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        };

        slideIndex++;
        if (slideIndex > x.length) {
            slideIndex = 1
        };

        x[slideIndex - 1].style.display = "block";
        setTimeout(carousel, 2000);
    };

    function displayParksList(parks) {
        fetch('./parksList.html').then(response => {
            return response.text();
        }).then(html => {
            $('.container').html(html);

            $.each(parks.data, function (index, value) {
                console.log(value.name);
                let park = `
                <div class="col-sm-4 park-img">working</div>
                <div class="col-sm-8 park-details">${value.name}</div>
                `;
                $('.parks-list').append(park);
            });
        });
        // document.location.href = '/parksList.html';
        console.log(parks.data[1].name);

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

    function initMap() {
        var uluru = {
            lat: -25.363,
            lng: 131.044
        };
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: uluru
        });
        var marker = new google.maps.Marker({
            position: uluru,
            map: map
        });

    }
    initMap();

    $('#getLocation').click(function () {
        let location = "?stateCode=" + $('#locationInput').val();
        fetchNPS('parks', location);
    });

});