//this code should be on top of each file and run on global scope

var query = firebase.database().ref("users");

query.once("value").then(function(snapshot) {
  //check to see if there is an user object on local storage and
  //if there is
  //query the databsase and see if that user object matches up with a user in our db
  //if it does we will fire of user logged in functions and ler app run accordingly
  //else fire off userNotLoggedIn and show stuff acordingly

  var retrievedObject = JSON.parse(localStorage.getItem("user"));

  console.log("retrievedObject: ", retrievedObject);

  snapshot.forEach(function(childSnapshot) {
    // childData will be the actual contents of the child
    var childData = childSnapshot.val();
    if (
      childData.email == retrievedObject.email &&
      childData.password == retrievedObject.password
    ) {
      console.log("user is still logged in successfully");
      // Put the object into storage
      localStorage.setItem("user", JSON.stringify(childData));
      userLoggedIn();
    }
    console.log(childData);
  });
});

function userLoggedIn() {
  //do stuff that you want the page to do if user was logged in
  console.log("yo we are still logged in");
}

jQuery(document).ready(function($) {
  const database = firebase.database();

  const ref = database.ref();

  const userRef = database.ref("users");
  //this is the start of the for modal logic
  var $form_modal = $(".cd-user-modal"),
    $form_login = $form_modal.find("#cd-login"),
    $form_signup = $form_modal.find("#cd-signup"),
    $form_forgot_password = $form_modal.find("#cd-reset-password"),
    $form_modal_tab = $(".cd-switcher"),
    $tab_login = $form_modal_tab
      .children("li")
      .eq(0)
      .children("a"),
    $tab_signup = $form_modal_tab
      .children("li")
      .eq(1)
      .children("a"),
    $forgot_password_link = $form_login.find(".cd-form-bottom-message a"),
    $back_to_login_link = $form_forgot_password.find(
      ".cd-form-bottom-message a"
    ),
    $main_nav = $(".main-nav");

  //open modal
  $main_nav.on("click", function(event) {
    if ($(event.target).is($main_nav)) {
      // on mobile open the submenu
      $(this)
        .children("ul")
        .toggleClass("is-visible");
    } else {
      // on mobile close submenu
      $main_nav.children("ul").removeClass("is-visible");
      //show modal layer
      $form_modal.addClass("is-visible");
      //show the selected form
      $(event.target).is(".cd-signup") ? signup_selected() : login_selected();
    }
  });

  //close modal
  $(".cd-user-modal").on("click", function(event) {
    if (
      $(event.target).is($form_modal) ||
      $(event.target).is(".cd-close-form")
    ) {
      $form_modal.removeClass("is-visible");
    }
  });
  //close modal when clicking the esc keyboard button
  $(document).keyup(function(event) {
    if (event.which == "27") {
      $form_modal.removeClass("is-visible");
    }
  });

  //switch from a tab to another
  $form_modal_tab.on("click", function(event) {
    event.preventDefault();
    $(event.target).is($tab_login) ? login_selected() : signup_selected();
  });

  //hide or show password
  $(".hide-password").on("click", function() {
    var $this = $(this),
      $password_field = $this.prev("input");

    "password" == $password_field.attr("type")
      ? $password_field.attr("type", "text")
      : $password_field.attr("type", "password");
    "Hide" == $this.text() ? $this.text("Show") : $this.text("Hide");
    //focus and move cursor to the end of input field
    $password_field.putCursorAtEnd();
  });

  //show forgot-password form
  $forgot_password_link.on("click", function(event) {
    event.preventDefault();
    forgot_password_selected();
  });

  //back to login from the forgot-password form
  $back_to_login_link.on("click", function(event) {
    event.preventDefault();
    login_selected();
  });

  function login_selected() {
    $form_login.addClass("is-selected");
    $form_signup.removeClass("is-selected");
    $form_forgot_password.removeClass("is-selected");
    $tab_login.addClass("selected");
    $tab_signup.removeClass("selected");
  }

  function signup_selected() {
    $form_login.removeClass("is-selected");
    $form_signup.addClass("is-selected");
    $form_forgot_password.removeClass("is-selected");
    $tab_login.removeClass("selected");
    $tab_signup.addClass("selected");
  }

  function forgot_password_selected() {
    $form_login.removeClass("is-selected");
    $form_signup.removeClass("is-selected");
    $form_forgot_password.addClass("is-selected");
  }

  //this is event listener for the login user form
  $form_login.find('input[type="submit"]').on("click", function(event) {
    event.preventDefault();
    console.log("hi");

    var userEmail = $("#signin-email")
      .val()
      .trim();

    var password = $("#signin-password")
      .val()
      .trim();

    var query = firebase.database().ref("users");

    query.once("value").then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        // childData will be the actual contents of the child
        var childData = childSnapshot.val();
        if (childData.email == userEmail && childData.password == password) {
          console.log("signin successfull");
          // Put the object into storage
          localStorage.setItem("user", JSON.stringify(childData));
          $form_modal.removeClass("is-visible");
        } else {
          console.log(`your passwords do not match`);
        }
        console.log(childData);
      });
    });
  });

  //this is the event listner for the user signup form
  $form_signup.find('input[type="submit"]').on("click", function(event) {
    event.preventDefault();
    console.log("hi");

    //grab the inputs from the user
    //check to see if both paswords are teh same
    //if true
    //allow that user to be created
    //else let them know they screwed up their pword
    var userName = $("#signup-username")
      .val()
      .trim();
    var email = $("#signup-email")
      .val()
      .trim();
    var password = $("#signup-password")
      .val()
      .trim();
    var conPWord = $("#signup-password-confirm")
      .val()
      .trim();

    if (password == conPWord) {
      var userObj = {
        username: userName,
        email: email,
        password: password
      };

      // Put the object into storage
      localStorage.setItem("user", JSON.stringify(userObj));

      // Retrieve the object from storage
      var retrievedObject = localStorage.getItem("user");

      console.log("retrievedObject: ", JSON.parse(retrievedObject));

      firebase
        .database()
        .ref("users/" + userName)
        .set(userObj);

      // hide modal
      $form_modal.removeClass("is-visible");
    } else {
      console.log(`Your passwords do not match`);
    }
  });

  //IE9 placeholder fallback
  //credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
  if (!Modernizr.input.placeholder) {
    $("[placeholder]")
      .focus(function() {
        var input = $(this);
        if (input.val() == input.attr("placeholder")) {
          input.val("");
        }
      })
      .blur(function() {
        var input = $(this);
        if (input.val() == "" || input.val() == input.attr("placeholder")) {
          input.val(input.attr("placeholder"));
        }
      })
      .blur();
    $("[placeholder]")
      .parents("form")
      .submit(function() {
        $(this)
          .find("[placeholder]")
          .each(function() {
            var input = $(this);
            if (input.val() == input.attr("placeholder")) {
              input.val("");
            }
          });
      });
  }
});

//credits https://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
jQuery.fn.putCursorAtEnd = function() {
  return this.each(function() {
    // If this function exists...
    if (this.setSelectionRange) {
      // ... then use it (Doesn't work in IE)
      // Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
      var len = $(this).val().length * 2;
      this.setSelectionRange(len, len);
    } else {
      // ... otherwise replace the contents with itself
      // (Doesn't work in Google Chrome)
      $(this).val($(this).val());
    }
  });
};
