var cards = document.getElementsByClassName('card');

for (var i = 0; i < cards.length; i++) {
  cards[i].addEventListener('click', select);
}

function deselect(classToDeselect) {
  var cards = document.getElementsByClassName(classToDeselect);
  for (var i = 0; i < cards.length; i++) {
    cards[i].classList.remove("selected");
  }
}

var teaSelected = false;
var milkSelected = false;
var sweetSelected = false;
var toppingSelected = false;

function select(e) {
  var target = e.currentTarget;
  console.log(target.className);
  var specificClass = target.className.split(" ")[1];
  deselect(specificClass);
  target.classList.add("selected");
  if (specificClass == 'tea-card') {
    console.log('yee');
    teaSelected = true;
  } else if (specificClass == 'milk-card') {
    milkSelected = true;
  } else if (specificClass == 'sweet-card') {
    sweetSelected = true;
  } else if (specificClass == 'topping-card') {
    toppingSelected = true;
  }
}

// display on the about.html page if the shop is open or closed
var closedAlert = document.getElementById("closed-alert");
var openAlert = document.getElementById("open-alert");
var currentTime = new Date();
var currentDay = currentTime.getDay();
var currentHour = currentTime.getHours();
// only run code if alerts exist (i.e. we are on menu.html)
if(closedAlert) {
  // Sunday = 0; Saturday = 6
  if ((currentDay == 0 || currentDay == 6) && currentHour >= 8 && currentHour <= 22) {
    openAlert.style.display = "block";
  } else if (currentHour >= 9 && currentHour <= 19) {
    openAlert.style.display = "block";
  } else {
    closedAlert.style.display = "block";
  }

}

var orderButton = document.getElementById('order-button');
if (orderButton) {
  orderButton.addEventListener('click', calculate);
}

// calculates order cost based on user's selections
function calculate(e) {
  var target = e.currentTarget;

  if (teaSelected && milkSelected && sweetSelected && toppingSelected) {
    var selected = document.getElementsByClassName('selected');
    for (var i = 0; i < selected.length; i++) {
      var cardBody = selected[i].getElementsByClassName('card-body')[0];
      var h1 = cardBody.getElementsByTagName('h5')[0];
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

    var total = 4.5;
    if (milkChoice == 'Oat Milk (+$0.50)') {
      total += 0.5;
    } else if (milkChoice == 'Almond Milk (+$0.25)') {
      total += 0.25;
    }

    if (toppingChoice == 'Aloe Jelly (+$0.25)') {
      total += 0.25;
    }

    var orderDiv = document.getElementById('order');
    orderDiv.innerHTML = `
      <h2 class="header">Your Order:</h2><br>
      Tea: ${teaChoice}<br>
      Milk: ${milkChoice}<br>
      Sweetness: ${sweetChoice}<br>
      Topping: ${toppingChoice}<hr id="total-divider">
      <span id="total">Total: $${total.toFixed(2)}</span>`;
    orderDiv.style.padding = '40px';
    orderDiv.scrollIntoView();

    // reset warning div to contain no text
    var warningDiv = document.getElementById('warning');
    warningDiv.innerHTML = '';
    warningDiv.style.padding = '0px';
  // user did not select one of each customization type
  } else {
    // indicate to uesr that they did not select something
    var warningDiv = document.getElementById('warning');
    warningDiv.innerHTML = '✘ Please select an item in each step.';
    warningDiv.style.paddingTop = '30px';
    console.log(warningDiv);
  }
}
