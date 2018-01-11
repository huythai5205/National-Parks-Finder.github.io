$(document).ready(function () {

    let aCoordinates = [];
    let aParks = [];



    function getCoordinate(coordinate) {
        //"lat:38.03977546, long:-103.4266499"
        coordinate = coordinate.split(",");
        let latitude = coordinate[0].split(":");
        let longitude = coordinate[1].split(":");

        return [latitude[1], longitude[1]];
    }

    function savePark() {
        firebase.database().ref('/Park Code').set(parkCode);
    }

    function saveLocal() {
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem("parkCode", parkCode);
        } else {
            // Sorry! No Web Storage support..
        }
    }
    $(document).on('click', '.park-div', function () {
        let parkCode = '?parkCode=' + $(this).attr('id');
        //savePark();
        saveLocal(parkCode);
        document.location.href = 'parkDetails.html';
    });

    function renderList() {
        $.each(aParks, function (index, value) {
            if (value.latLong) {
                aCoordinates.push(getCoordinate(value.latLong));
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
        $.each(aCoordinates, function (index, value) {

        });
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
            aParks = json.data;
            renderList();
        });
    }


    (function startPage() {
        // firebase.database().ref('/States Code').on('value', function (data) {
        //     if (data.exists()) {
        //         statesCode = data.val();
        //         fetchNPS(statesCode);
        //     }
        // });
        if (typeof (Storage) !== "undefined") {
            let statesCode = localStorage.getItem("statesCode");
            fetchNPS(statesCode);
        } else {
            // Sorry! No Web Storage support..
        }
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