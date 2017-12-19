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

    console.log("working");

    function ajaxCall() {

        let key = 'ZKLb9xO0SnI4KkfXFdoM9fmLuFkJqtfVtXKPpxM0';
        let p
        $.ajax({
            type: "POST",
            url: "curl -v -XPOST https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=" + key,
            dataType: "json",
            success: function (data) {
                console.log(data);
            }
        }
});

//https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=ZKLb9xO0SnI4KkfXFdoM9fmLuFkJqtfVtXKPpxM0
//Account ID: eac74705-6bb1-4ee4-96ab-95e2fef6999a