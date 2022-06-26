$(function () {
  // $("#header").load("header.html");
  $("footer").load("footer.html");
});

// MENU.HTML

// remove style from all cards in a specific grouping
function deselect(classToDeselect) {
  var cards = document.getElementsByClassName(classToDeselect);
  for (var i = 0; i < cards.length; i++) {
    cards[i].classList.remove("selected");
  }
}

// add event listener to all cards
var cards = document.getElementsByClassName("card");
for (var i = 0; i < cards.length; i++) {
  cards[i].addEventListener("click", select);
}

var teaSelected = false;
var milkSelected = false;
var sweetSelected = false;
var toppingSelected = false;

// change the style of the selected card to indicate that its selected
// deselect all other cards in the relevant group
function select(e) {
  // extract the specific class type from the clicked div:
  // (tea-card, milk-card, sweet-card, or topping-card)
  var target = e.currentTarget;
  var specificClass = target.className.split(" ")[1];
  // remove styling from all other cards in that group (e.g. remove styling from all milk cards)
  deselect(specificClass);
  // add styling to the selected card
  target.classList.add("selected");
  // keep track which menu type is selected
  if (specificClass == "tea-card") {
    console.log("yee");
    teaSelected = true;
  } else if (specificClass == "milk-card") {
    milkSelected = true;
  } else if (specificClass == "sweet-card") {
    sweetSelected = true;
  } else if (specificClass == "topping-card") {
    toppingSelected = true;
  }
}

// add even listener when user is on menu.html page
var orderButton = document.getElementById("order-button");
if (orderButton) {
  orderButton.addEventListener("click", calculate);
}

// calculates order cost based on user's selections
function calculate(e) {
  var target = e.currentTarget;

  // display cost only if user has selected an item from each group
  if (teaSelected && milkSelected && sweetSelected && toppingSelected) {
    // extract the values of the selected cards
    var selected = document.getElementsByClassName("selected");
    for (var i = 0; i < selected.length; i++) {
      var cardBody = selected[i].getElementsByClassName("card-body")[0];
      var h1 = cardBody.getElementsByTagName("h5")[0];
      if (i == 0) {
        var teaChoice = h1.textContent;
      } else if (i == 1) {
        var milkChoice = h1.textContent;
      } else if (i == 2) {
        var sweetChoice = h1.textContent;
      } else if (i == 3) {
        var toppingChoice = h1.textContent;
      }
    }

    // base total cost of a drink is $4.50
    var total = 4.5;
    // add 50 cents to cost if oat milk was chosen
    if (milkChoice == "Oat Milk (+$0.50)") {
      total += 0.5;
      // add 25 cents to cost if almond milk was chosen
    } else if (milkChoice == "Almond Milk (+$0.25)") {
      total += 0.25;
    }
    // add 25 cents to cost if aloe jelly topping was chosen
    if (toppingChoice == "Aloe Jelly (+$0.25)") {
      total += 0.25;
    }

    // display user's full order and the total cost of the drink
    var orderDiv = document.getElementById("order");
    orderDiv.innerHTML = `
      <h2 class="header">Your Order:</h2><br>
      Tea: ${teaChoice}<br>
      Milk: ${milkChoice}<br>
      Sweetness: ${sweetChoice}<br>
      Topping: ${toppingChoice}<hr id="total-divider">
      <span id="total">Total: $${total.toFixed(2)}</span>`;
    orderDiv.style.padding = "40px";
    orderDiv.scrollIntoView();

    // reset warning div to contain no text if applicable
    var warningDiv = document.getElementById("warning");
    warningDiv.innerHTML = "";
    warningDiv.style.padding = "0px";
    // user did not select one of each customization type
  } else {
    // indicate to uesr that they did not select something
    var warningDiv = document.getElementById("warning");
    warningDiv.innerHTML = "✘ Please select an item in each step.";
    warningDiv.style.paddingTop = "30px";
  }
}

// ABOUT.HTML

// display on the about.html page if the shop is open or closed
// by default, closedAlert and openAlert are hidden
var closedAlert = document.getElementById("closed-alert");
var openAlert = document.getElementById("open-alert");
var currentTime = new Date();
var currentDay = currentTime.getDay();
var currentHour = currentTime.getHours();

// only run code if alerts exist (i.e. we are on about.html)
if (closedAlert) {
  // Sunday = 0; Saturday = 6
  // open weekend hours
  if (
    (currentDay == 0 || currentDay == 6) &&
    currentHour >= 8 &&
    currentHour <= 22
  ) {
    openAlert.style.display = "block";
    // open weekday hours
  } else if (currentHour >= 9 && currentHour <= 19) {
    openAlert.style.display = "block";
    // store is not open
  } else {
    closedAlert.style.display = "block";
  }
}

// CONTACT.HTML

// stores user's information from contact form, posts to http://httpbin.org/post,
// indicates to the user that the message was successfully sent and displays
// message content back to user
function postData(event) {
  var req = new XMLHttpRequest();
  // contact form accepts first name, last name, email, reason for contact & message
  var info = {
    firstname: null,
    lastname: null,
    email: null,
    reason: null,
    message: null,
  };
  info.firstname = document.getElementById("firstname").value;
  info.lastname = document.getElementById("lastname").value;
  info.email = document.getElementById("email").value;
  info.reason = document.getElementById("reason").value;
  info.message = document.getElementById("message").value;
  req.open("POST", "http://httpbin.org/post", true);
  req.setRequestHeader("Content-Type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >= 200 && req.status < 400) {
      var response = JSON.parse(req.responseText);
      // the data property is stringified and requires parsing
      var data = JSON.parse(response.data);
      // displays success message and message contents to webpage
      var successMsg = document.getElementById("message-sent");
      successMsg.innerHTML =
        "Thank you, your message was sent! We will reply as soon as possible.";
      var responseDiv = document.getElementById("response");
      responseDiv.innerHTML = `<em>Message Content</em><br>
        <span class="underlined">First Name</span>: ${data.firstname}<br>
        <span class="underlined">Last Name</span>: ${data.lastname}<br>
        <span class="underlined">Email</span>: ${data.email}<br>
        <span class="underlined">Reason</span>: ${data.reason}<br>
        <span class="underlined">Message</span>: ${data.message}`;
      responseDiv.style.display = "block";
    } else {
      console.log("Error: " + req.statusText);
    }
  });
  req.send(JSON.stringify(info));
  event.preventDefault();
}

// only add event listener when user is on contact.html page
var form = document.getElementById("post-form");
if (form) {
  form.addEventListener("submit", postData);
}
