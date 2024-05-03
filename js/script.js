let timers = {};

document.querySelectorAll('.show-drinks-btn, .hide-drinks-btn').forEach(button => {
    button.addEventListener("click", function() {
        let device = this.closest('.device'); // Find the closest parent '.device' container
        let drinksMenu = device.querySelector('.drinks'); // Select the drinks menu within this device
        let showBtn = device.querySelector('.show-drinks-btn');
        let hideBtn = device.querySelector('.hide-drinks-btn');

        drinksMenu.classList.toggle('d-none');
        showBtn.classList.toggle('d-none');
        hideBtn.classList.toggle('d-none');
    });
});

function init() {
    for (let deviceId = 1; deviceId <= 6; deviceId++) {
        let savedData = localStorage.getItem(`device${deviceId}`);
        if (savedData) {
            savedData = JSON.parse(savedData);
            if (savedData.running) {
                startTimer(deviceId, new Date(savedData.startTime));
            } else {
                document.getElementById(`elapsedTime${deviceId}`).textContent = formatTime(savedData.elapsedTime);
                document.getElementById(`cost${deviceId}`).textContent = `${savedData.cost} EGP`;
            }
        }
        loadRateSelections(deviceId);
        loadDrinkQuantities(deviceId);  // Load the drink quantities for each device
    }
}
document.querySelectorAll('.drink-input').forEach(input => {
    input.addEventListener('change', (event) => {
        const deviceId = event.target.dataset.deviceId; // Assuming you have a data-device-id attribute
        saveDrinkQuantities(deviceId);
    });
});


function saveRateSelection(deviceId) {
    var rateSelector = document.getElementById(`rateSelector${deviceId}`);
    var selectedRate = rateSelector.value;
    localStorage.setItem(`rateSelection${deviceId}`, selectedRate);
}

function loadRateSelections() {
    for (let deviceId = 1; deviceId <= 6; deviceId++) {
        var savedRate = localStorage.getItem(`rateSelection${deviceId}`);
        if (savedRate) {
            var rateSelector = document.getElementById(`rateSelector${deviceId}`);
            // Loop through options to find the one with the saved value
            for (var i = 0; i < rateSelector.options.length; i++) {
                if (rateSelector.options[i].value === savedRate) {
                    rateSelector.selectedIndex = i;
                    break;
                }
            }
        }
    }
}

function loadDrinkQuantities(deviceId) {
    // Load saved drink quantities from localStorage
    const drinkIds = ['sodaS', 'sodaL', 'sokhn', 'coffee', 'cappuccino', 'frenchCoffee', 'netCard', 'halfHourPS4', 'hourPS4'];
    drinkIds.forEach(drinkId => {
        let savedQuantity = localStorage.getItem(`${drinkId}${deviceId}`);
        if (savedQuantity) {
            document.getElementById(`${drinkId}${deviceId}`).value = savedQuantity;
        }
    });
}

function saveDrinkQuantities(deviceId) {
    // Save current drink quantities to localStorage
    const drinkIds = ['sodaS', 'sodaL', 'sokhn', 'coffee', 'cappuccino', 'frenchCoffee', 'netCard', 'halfHourPS4', 'hourPS4'];
    drinkIds.forEach(drinkId => {
        let quantity = document.getElementById(`${drinkId}${deviceId}`).value;
        localStorage.setItem(`${drinkId}${deviceId}`, quantity);
    });
}


function startTimer(deviceId, startTime = new Date()) {
    timers[deviceId] = setInterval(() => updateElapsedTime(deviceId), 1000);
    document.querySelector(`#device${deviceId} button[onclick^="startTimer"]`).disabled = true;
    document.querySelector(`#device${deviceId} button[onclick^="stopTimer"]`).disabled = false;
    localStorage.setItem(`device${deviceId}`, JSON.stringify({
        startTime: startTime.toISOString(),
        elapsedTime: 0,
        cost: 0,
        running: true
    }));
}

function stopTimer(deviceId) {
    if (confirm("Are you sure you want to stop the timer?")) {
        clearInterval(timers[deviceId]);
        let savedData = JSON.parse(localStorage.getItem(`device${deviceId}`));
        calculateCost(deviceId, savedData);
        document.querySelector(`#device${deviceId} button[onclick^="startTimer"]`).disabled = false;
        document.querySelector(`#device${deviceId} button[onclick^="stopTimer"]`).disabled = true;
        savedData.running = false;
        localStorage.setItem(`device${deviceId}`, JSON.stringify(savedData));
    }
}

function updateElapsedTime(deviceId) {
    let savedData = JSON.parse(localStorage.getItem(`device${deviceId}`));
    const elapsedTime = Math.floor((new Date() - new Date(savedData.startTime)) / 1000);
    document.getElementById(`elapsedTime${deviceId}`).textContent = formatTime(elapsedTime);
    savedData.elapsedTime = elapsedTime;
    localStorage.setItem(`device${deviceId}`, JSON.stringify(savedData));
}

function calculateCost(deviceId, savedData) {
    const elapsedTime = savedData.elapsedTime / 3600; // convert seconds to hours
    const rate = parseFloat(document.getElementById(`rateSelector${deviceId}`).value);
    const costFromTime = elapsedTime * rate;

    // Sum up costs from drinks
    const sodaS = parseInt(document.getElementById(`sodaS${deviceId}`).value, 10) * 15;
    const sodaL = parseInt(document.getElementById(`sodaL${deviceId}`).value, 10) * 15;
    const sokhn = parseInt(document.getElementById(`sokhn${deviceId}`).value, 10) * 10;
    const coffee = parseInt(document.getElementById(`coffee${deviceId}`).value, 10) * 15;
    const cappuccino = parseInt(document.getElementById(`cappuccino${deviceId}`).value) * 15;
    const frenchCoffee = parseInt(document.getElementById(`frenchCoffee${deviceId}`).value) * 20;
    const netCard = parseInt(document.getElementById(`netCard${deviceId}`).value) * 5;
    const halfHourPS4 = parseInt(document.getElementById(`halfHourPS4${deviceId}`).value) * 10;
    const hourPS4 = parseInt(document.getElementById(`hourPS4${deviceId}`).value) * 20;

    const totalCost = (costFromTime + sodaS + sodaL + sokhn + coffee + cappuccino + frenchCoffee + netCard + halfHourPS4 + hourPS4).toFixed(2);
    document.getElementById(`cost${deviceId}`).textContent = `${totalCost} EGP`;
    savedData.cost = totalCost;
    localStorage.setItem(`device${deviceId}`, JSON.stringify(savedData));
}

function calculateDrinkCost(deviceId) {
  const drinkPrice = parseFloat(document.getElementById(`drinkSelector${deviceId}`).value);
  const quantity = parseInt(document.getElementById(`drinkQuantity${deviceId}`).value, 10);
  return drinkPrice * quantity;
}
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hrs, mins, secs].map(v => v < 10 ? "0" + v : v).join(":");
}
function clearAllTimers() {
    if (confirm("Are you sure you want to clear all timers? This action cannot be undone.")) {
        for (let deviceId = 1; deviceId <= 6; deviceId++) {
            clearInterval(timers[deviceId]);
            localStorage.removeItem(`device${deviceId}`);
            document.getElementById(`elapsedTime${deviceId}`).textContent = "00:00:00";
            document.getElementById(`cost${deviceId}`).textContent = "0.00 EGP";
            document.querySelector(`#device${deviceId} button[onclick^="startTimer"]`).disabled = false;
            document.querySelector(`#device${deviceId} button[onclick^="stopTimer"]`).disabled = true;
        }
    }
}
function clearTimer(deviceId) {
    if (confirm(`Are you sure you want to clear the timer for device ${deviceId}? This action cannot be undone.`)) {
        clearInterval(timers[deviceId]);
        localStorage.removeItem(`device${deviceId}`);
        document.getElementById(`elapsedTime${deviceId}`).textContent = "00:00:00";
        document.getElementById(`cost${deviceId}`).textContent = "0.00 EGP";
        resetDrinkQuantities(deviceId);
        document.querySelector(`#device${deviceId} button[onclick^="startTimer"]`).disabled = false;
        document.querySelector(`#device${deviceId} button[onclick^="stopTimer"]`).disabled = true;
    }
}

function resetDrinkQuantities(deviceId) {
    const drinkIds = ['sodaS', 'sodaL', 'sokhn', 'coffee', 'cappuccino', 'frenchCoffee', 'netCard', 'halfHourPS4', 'hourPS4'];
    drinkIds.forEach(drinkId => {
        document.getElementById(`${drinkId}${deviceId}`).value = 0;
        localStorage.removeItem(`${drinkId}${deviceId}`);
    });
}

window.onload = init;