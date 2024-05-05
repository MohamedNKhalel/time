let timers = {};

document.querySelectorAll('.show-drinks-bar, .hide-drinks-bar').forEach(bar=>{
    bar.addEventListener('click',function(){
        let device = this.closest('.device'); // Find the closest parent '.device' container
        let drinksMenu = device.querySelector('.drinks-menu');
        let showBtn = device.querySelector('.show-drinks-bar');
        let hideBtn = device.querySelector('.hide-drinks-bar');
        drinksMenu.classList.toggle('d-none');
        showBtn.classList.toggle('d-none');
        hideBtn.classList.toggle('d-none');
    })
})
document.querySelectorAll('.show-others-bar, .hide-others-bar').forEach(bar=>{
    bar.addEventListener('click',function(){
        let device = this.closest('.device'); // Find the closest parent '.device' container
        let drinksMenu = device.querySelector('.others-menu');
        let showBtn = device.querySelector('.show-others-bar');
        let hideBtn = device.querySelector('.hide-others-bar');
        drinksMenu.classList.toggle('d-none');
        showBtn.classList.toggle('d-none');
        hideBtn.classList.toggle('d-none');
    })
})

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
                document.querySelector(`#device${deviceId} button[onclick^="startTimer"]`).disabled = true;
                document.querySelector(`#device${deviceId} button[onclick^="stopTimer"]`).disabled = false;
                document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).disabled = false;
                document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).disabled = true;
                document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).classList.remove('d-none');
                document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).classList.add('d-none')


            }
            else if(savedData.running==false && savedData.paused == true){
                document.querySelector(`#device${deviceId} button[onclick^="startTimer"]`).disabled = true;
                document.querySelector(`#device${deviceId} button[onclick^="stopTimer"]`).disabled = false;
                document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).disabled = true;
                document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).classList.add('d-none');
                document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).disabled = false;
                document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).classList.remove('d-none')
            } 
            else {
                document.getElementById(`elapsedTime${deviceId}`).textContent = formatTime(savedData.elapsedTime);
                document.getElementById(`cost${deviceId}`).textContent = `${savedData.cost} EGP`;
                document.querySelector(`#device${deviceId} button[onclick^="startTimer"]`).disabled = false;
                document.querySelector(`#device${deviceId} button[onclick^="stopTimer"]`).disabled = true;
                document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).disabled = true;
                document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).disabled = false;
            }
        } else {
            // Ensure all controls are reset to a default state if no saved data exists
            document.getElementById(`elapsedTime${deviceId}`).textContent = "00:00:00";
            document.getElementById(`cost${deviceId}`).textContent = "0.00 EGP";
            document.querySelector(`#device${deviceId} button[onclick^="startTimer"]`).disabled = false;
            document.querySelector(`#device${deviceId} button[onclick^="stopTimer"]`).disabled = true;
            document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).disabled = true;
            document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).disabled = true;
        }
        loadDrinkQuantities(deviceId);  // Load the drink quantities for each device
    }
    loadRateSelections();  // This call should happen once for all device setups, ensure it's placed correctly as per your logic
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
    const drinkIds = ['sodaS', 'sodaL', 'sokhn', 'coffee', 'cappuccino', 'frenchCoffee', 'netCard', 'halfHourPS4', 'hourPS4','sandwich','cleaning'];
    drinkIds.forEach(drinkId => {
        let savedQuantity = localStorage.getItem(`${drinkId}${deviceId}`);
        if (savedQuantity) {
            document.getElementById(`${drinkId}${deviceId}`).value = savedQuantity;
        }
    });
}

function saveDrinkQuantities(deviceId) {
    // Save current drink quantities to localStorage
    const drinkIds = ['sodaS', 'sodaL', 'sokhn', 'coffee', 'cappuccino', 'frenchCoffee', 'netCard', 'halfHourPS4', 'hourPS4','sandwich','cleaning'];
    drinkIds.forEach(drinkId => {
        let quantity = document.getElementById(`${drinkId}${deviceId}`).value;
        localStorage.setItem(`${drinkId}${deviceId}`, quantity);
    });
}



function startTimer(deviceId, resume = false) {
    let savedData = JSON.parse(localStorage.getItem(`device${deviceId}`)) || {
        startTime: new Date().toISOString(),
        elapsedTime: 0,
        cost: 0,
        running: true
    };

    if (!resume) {
        savedData.startTime = new Date().toISOString();
        savedData.elapsedTime = 0;
    }

    timers[deviceId] = setInterval(() => updateElapsedTime(deviceId), 1000);
    document.querySelector(`#device${deviceId} button[onclick^="startTimer"]`).disabled = true;
    document.querySelector(`#device${deviceId} button[onclick^="stopTimer"]`).disabled = false;
    document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).disabled = false;
    localStorage.setItem(`device${deviceId}`, JSON.stringify(savedData));
}

function stopTimer(deviceId) {
    if (confirm("Are you sure you want to stop the timer?")) {
        clearInterval(timers[deviceId]);
        let savedData = JSON.parse(localStorage.getItem(`device${deviceId}`));
        calculateCost(deviceId, savedData);
        document.querySelector(`#device${deviceId} button[onclick^="startTimer"]`).disabled = false;
        document.querySelector(`#device${deviceId} button[onclick^="stopTimer"]`).disabled = true;
        document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).disabled = true;
        document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).disabled = true;
        savedData.running = false;
        localStorage.setItem(`device${deviceId}`, JSON.stringify(savedData));
    }
}
function pauseTimer(deviceId) {
    if (timers[deviceId]) {
        clearInterval(timers[deviceId]);
        updateElapsedTime(deviceId); // Make sure elapsed time is updated before pausing
        let savedData = JSON.parse(localStorage.getItem(`device${deviceId}`));
        savedData.running = false;
        savedData.paused = true; // Save paused state
        localStorage.setItem(`device${deviceId}`, JSON.stringify(savedData));

        // Update button visibility
        document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).disabled = false;
        document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).classList.remove('d-none');
        document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).disabled = true;
        document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).classList.add('d-none');
    }
}


function resumeTimer(deviceId) {
    let savedData = JSON.parse(localStorage.getItem(`device${deviceId}`));
    if (!savedData.running) {
        let currentTime = new Date();
        let elapsedTimeInMs = savedData.elapsedTime * 1000;
        savedData.startTime = new Date(currentTime - elapsedTimeInMs).toISOString();
        savedData.paused = false; // Clear paused state
        savedData.running = true;

        localStorage.setItem(`device${deviceId}`, JSON.stringify(savedData));

        startTimer(deviceId, true); // Resume with true to keep current elapsed time
        document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).disabled = true;
        document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).classList.add('d-none');
        document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).disabled = false;
        document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).classList.remove('d-none');
    }
}



function updateElapsedTime(deviceId) {
    let savedData = JSON.parse(localStorage.getItem(`device${deviceId}`));
    const elapsedTime = Math.floor((new Date() - new Date(savedData.startTime)) / 1000);
    document.getElementById(`elapsedTime${deviceId}`).textContent = formatTime(elapsedTime);
    savedData.elapsedTime = elapsedTime;
    localStorage.setItem(`device${deviceId}`, JSON.stringify(savedData));
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
            document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).disabled = true;
            document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).classList.add('d-none');
            document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).classList.remove('d-none');
            document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).disabled = true;
            
        }
    }
}
function clearTimer(deviceId) {
    if (confirm(`Are you sure you want to clear the data for device ${deviceId}? This action cannot be undone.`)) {
        clearInterval(timers[deviceId]);
        localStorage.removeItem(`device${deviceId}`);
        document.getElementById(`elapsedTime${deviceId}`).textContent = "00:00:00";
        document.getElementById(`cost${deviceId}`).textContent = "0.00 EGP";
        resetDrinkQuantities(deviceId);
        document.querySelector(`#device${deviceId} button[onclick^="startTimer"]`).disabled = false;
        document.querySelector(`#device${deviceId} button[onclick^="stopTimer"]`).disabled = true;
        document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).disabled = true;
        document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).classList.add('d-none');
        document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).classList.remove('d-none');
        document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).disabled = true;
    }
}

function calculateCost(deviceId, savedData) {
    const elapsedTime = savedData.elapsedTime / 3600; // convert seconds to hours
    const rate = parseFloat(document.getElementById(`rateSelector${deviceId}`).value);
    const costFromTime = elapsedTime * rate;
    // Sum up costs from drinks
    const sodaS = parseInt(document.getElementById(`sodaS${deviceId}`).value, 10) * 15;
    const sodaL = parseInt(document.getElementById(`sodaL${deviceId}`).value, 10) * 20;
    const sokhn = parseInt(document.getElementById(`sokhn${deviceId}`).value, 10) * 10;
    const coffee = parseInt(document.getElementById(`coffee${deviceId}`).value, 10) * 15;
    const cappuccino = parseInt(document.getElementById(`cappuccino${deviceId}`).value) * 15;
    const frenchCoffee = parseInt(document.getElementById(`frenchCoffee${deviceId}`).value) * 25;
    const netCard = parseInt(document.getElementById(`netCard${deviceId}`).value) * 5;
    const halfHourPS4 = parseInt(document.getElementById(`halfHourPS4${deviceId}`).value) * 10;
    const hourPS4 = parseInt(document.getElementById(`hourPS4${deviceId}`).value) * 20;
    const sandwich = parseInt(document.getElementById(`sandwich${deviceId}`).value) * 15;
    const cleaning = parseInt(document.getElementById(`cleaning${deviceId}`).value) * 3;
    const totalCost = (costFromTime + sodaS + sodaL + sokhn + coffee + cappuccino + frenchCoffee + netCard + halfHourPS4 + hourPS4 + sandwich + cleaning).toFixed(2);
    document.getElementById(`cost${deviceId}`).textContent = `${totalCost} EGP`;
    savedData.cost = totalCost;
    localStorage.setItem(`device${deviceId}`, JSON.stringify(savedData));
}

function calculateDrinkCost(deviceId) {
  const drinkPrice = parseFloat(document.getElementById(`drinkSelector${deviceId}`).value);
  const quantity = parseInt(document.getElementById(`drinkQuantity${deviceId}`).value, 10);
  return drinkPrice * quantity;
}

function resetDrinkQuantities(deviceId) {
    const drinkIds = ['sodaS', 'sodaL', 'sokhn', 'coffee', 'cappuccino', 'frenchCoffee', 'netCard', 'halfHourPS4', 'hourPS4','sandwich','cleaning'];
    drinkIds.forEach(drinkId => {
        document.getElementById(`${drinkId}${deviceId}`).value = 0;
        localStorage.removeItem(`${drinkId}${deviceId}`);
    });
}

window.onload = init;
