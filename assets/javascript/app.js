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

    let currentLoction = [];

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

    function renderPark(data) {
        $('.row').append(`
        <div class="park">
            <div class="col">
                <h2>${data[0].fullName}</h2>
                <p>${data[0].description}</p>
            </div>
        </div>
        `);

        let coordinates = getCoordinate(data[0].latLong);
        initMap(coordinates[0], coordinates[1]);
    }

    $(document).on('click', '.park-div', function () {
        let parkCode = 'parks?parkCode=' + $(this).attr('id');
        fetchPage('./parkDetails.html', parkCode, renderPark);
    });

    function multiMarker(locations, mapCenter) {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 5,
            center: mapCenter,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var infowindow = new google.maps.InfoWindow();

        var marker, i;

        for (i = 0; i < locations.length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                map: map
            });

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(locations[i][0]);
                    infowindow.open(map, marker);
                }
            })(marker, i));
        }
    }

    function getCoordinate(coordinate) {
        //"lat:38.03977546, long:-103.4266499"
        coordinate = coordinate.split(",");
        let latitude = coordinate[0].split(":");
        let longitude = coordinate[1].split(":");

        return [parseInt(latitude[1]), parseInt(longitude[1])];
    }

    function renderList(data) {
        let aCoordinates = [];
        $.each(data, function (index, value) {
            if (value.latLong) {
                let coordinates = getCoordinate(value.latLong);
                aCoordinates.push([value.name, coordinates[0], coordinates[1]]);
                $('.row').append(`
                <div class="park-div" id="${value.parkCode}">
                    <div class="col">
                    <h2>${value.fullName}</h2>
                    <p>${value.description}</p>
                    </div>
                </div>
            `);
            }
        });
        let center = getLatLngCenter(aCoordinates);
        multiMarker(aCoordinates, center);
    }

    function fetchNPS(string, functionToExecute) {
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
            let data = json.data;
            functionToExecute(data);
        });
    }

    function fetchPage(page, string, functionToExecute) {
        fetch(page).then(response => {
            return response.text();
        }).then(html => {
            fetchNPS(string, functionToExecute);
            $('#container').html(html);
        });
    }

    $('select').change(function () {
        let statesCode = "parks?stateCode=" + $('select option:selected').val();
        fetchPage('./parksList.html', statesCode, renderList);
    });

    function getLatLngCenter(latLngInDegr) {
        var LATIDX = 1;
        var LNGIDX = 2;
        var sumX = 0;
        var sumY = 0;
        var sumZ = 0;

        for (var i = 0; i < latLngInDegr.length; i++) {
            var lat = Math.PI / 180 * latLngInDegr[i][LATIDX];
            var lng = Math.PI / 180 * latLngInDegr[i][LNGIDX];
            // sum of cartesian coordinates
            sumX += Math.cos(lat) * Math.cos(lng);
            sumY += Math.cos(lat) * Math.sin(lng);
            sumZ += Math.sin(lat);
        }

        var avgX = sumX / latLngInDegr.length;
        var avgY = sumY / latLngInDegr.length;
        var avgZ = sumZ / latLngInDegr.length;

        // convert average x, y, z coordinate to latitude and longtitude
        var lng = Math.atan2(avgY, avgX);
        var hyp = Math.sqrt(avgX * avgX + avgY * avgY);
        var lat = Math.atan2(avgZ, hyp);

        return {
            lat: 180 / Math.PI * lat,
            lng: 180 / Math.PI * lng
        };
    }

    function getStateCode(string) {
        string = string.trim().split(",");
        string = string[2].trim().split(" ");
        return string[0];
    }

    //takes in an array of object
    function getClosestParks(oParks) {
        let aDistance = [
            [Number.MAX_VALUE, {}],
            [Number.MAX_VALUE, {}],
            [Number.MAX_VALUE, {}],
            [Number.MAX_VALUE, {}]
        ];
        let radlat1 = Math.PI * currentLoction[0] / 180;
        let coordinate;
        $.each(oParks, function (index, value) {
            if (value.latLong) {
                coordinate = getCoordinate(value.latLong);
            }
            let radlat2 = Math.PI * coordinate[0] / 180;
            let theta = currentLoction[1] - coordinate[1];
            let radtheta = Math.PI * theta / 180;
            let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            if (dist < aDistance[3][0]) {
                aDistance[3] = [dist, value];
                aDistance.sort(function (a, b) {
                    return a[0] - b[0];
                });
            }
        });

        let aParks = [aDistance[0][1], aDistance[1][1], aDistance[2][1], aDistance[3][1]];
        renderList(aParks);
    }

    function getBorderStates(currentState) {
        //%2C%20
        let statesCode = neighbors[currentState];
        let statesString = 'parks?stateCode=' + statesCode[0];
        for (let i = 1; i < statesCode.length; i++) {
            statesString += '%2C%20' + statesCode[i];
        }
        fetchPage('./parksList.html', statesString, getClosestParks);
    }

    $('#getCurrentLocationBtn').click(function () {
        var geocoder = new google.maps.Geocoder;
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                let string = JSON.stringify(pos);
                currentLoction = getCoordinate(string);
                geocoder.geocode({
                    'location': pos
                }, function (results, status) {
                    if (status === 'OK') {
                        if (results[0]) {
                            let stateCode = getStateCode(results[0].formatted_address);
                            getBorderStates(stateCode);
                            //fetchPage('./parksList.html', stateCode, getClosestParks);
                        } else {
                            console.log('No state found');
                        }
                    } else {
                        console.log('Geocoder failed due to: ' + status);
                    }
                });
            });
        }
    });



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