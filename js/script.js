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

document.querySelectorAll('.main-nav-link').forEach((link)=>{
    link.addEventListener('click',()=>{
        changeActiveLink(link)
    })
})

function changeActiveLink(link){
    document.querySelector(".main-nav .active").classList.remove("active")
    link.classList.add('active')
}
function showDevices(){
    document.querySelector('.device-blocks').classList.remove('d-none')
    document.querySelector('.summary-table').classList.add('d-none')
    document.querySelector('.main-elsala').classList.add('d-none')

}
function showSummaryTable(){
    document.querySelector('.summary-table').classList.remove('d-none')
    document.querySelector('.device-blocks').classList.add('d-none')
    document.querySelector('.main-elsala').classList.add('d-none')


}
function showSala(){

    document.querySelector('.main-elsala').classList.remove('d-none')
    document.querySelector('.device-blocks').classList.add('d-none')
    document.querySelector('.summary-table').classList.add('d-none')

}
function init() {
    rebuildTable();
    displaySavedTotalCost();
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
    getStartandPausedTime();
    loadRateSelections(); 
    loadMenuCosts(); // This call should happen once for all device setups, ensure it's placed correctly as per your logic
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


function getStartandPausedTime(){
    console.log("testPause");
    for(let i = 0 ; i<=6 ; i++){
        if(localStorage.getItem(`startTime${i}`) != null){
            document.getElementById(`startTime${i}`).innerHTML ="Start Time : " + JSON.parse(localStorage.getItem(`startTime${i}`))
        }
        if(localStorage.getItem(`pauseTime${i}`) != null){
            document.getElementById(`pauseTime${i}`).innerHTML ="Paused at : " + JSON.parse(localStorage.getItem(`pauseTime${i}`));
        }
    }
}


function startTimer(deviceId, resume = false) {
    let savedData = JSON.parse(localStorage.getItem(`device${deviceId}`)) || {
        startTime: new Date().toISOString(),
        elapsedTime: 0,
        cost: 0,
        running: true,
        date: getCurrentDate()
    };

    if (!resume) {
        savedData.startTime = new Date().toISOString();
        savedData.elapsedTime = 0;
        document.getElementById(`startTime${deviceId}`).textContent ="Start Time : " + new Date(savedData.startTime).toLocaleTimeString();
    }

    timers[deviceId] = setInterval(() => updateElapsedTime(deviceId), 1000);
    document.querySelector(`#device${deviceId} button[onclick^="startTimer"]`).disabled = true;
    document.querySelector(`#device${deviceId} button[onclick^="stopTimer"]`).disabled = false;
    document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).disabled = false;
    document.querySelector(`#device${deviceId} button[onclick^="submit"]`).disabled = true;

    localStorage.setItem(`device${deviceId}`, JSON.stringify(savedData));
    localStorage.setItem(`startTime${deviceId}`,JSON.stringify(new Date(savedData.startTime).toLocaleTimeString()))
    document.getElementById(`discountMenu${deviceId}`).classList.add('d-none');
    document.getElementById(`discountRequest${deviceId}`).classList.add('d-none');

}




function stopTimer(deviceId) {
    if (confirm("Are you sure you want to stop the timer?")) {
        clearInterval(timers[deviceId]);
        let savedData = JSON.parse(localStorage.getItem(`device${deviceId}`));
        calculateCost(deviceId, savedData);

        savedData.endTime = new Date().toISOString();
        savedData.running = false;
        savedData.paused = false; // Clear paused state
        localStorage.setItem(`device${deviceId}`, JSON.stringify(savedData));

        document.querySelector(`#device${deviceId} button[onclick^="startTimer"]`).disabled = false;
        document.querySelector(`#device${deviceId} button[onclick^="stopTimer"]`).disabled = true;
        document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).disabled = true;
        document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).classList.add('d-none');
        document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).classList.remove('d-none');
        document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).disabled = true;
        document.querySelector(`#device${deviceId} button[onclick^="submit"]`).disabled = false;
        // document.getElementById(`discountMenu${deviceId}`).classList.remove('d-none');
        document.getElementById(`discountRequest${deviceId}`).classList.remove('d-none');

    }
}



function updateDeviceTable(deviceId, data) {
    const table = document.getElementById("deviceSummary").getElementsByTagName('tbody')[0];
    const row = table.insertRow(0);
    const idCell = row.insertCell(0);
    const dateCell = row.insertCell(1);
    const startTimeCell = row.insertCell(2);
    const endTimeCell = row.insertCell(3);
    const timeCell = row.insertCell(4);
    const costCell = row.insertCell(5);

    idCell.textContent = `Device ${deviceId}`;
    dateCell.textContent = data.date;
    startTimeCell.textContent = new Date(data.startTime).toLocaleTimeString();
    endTimeCell.textContent = new Date(data.endTime).toLocaleTimeString();
    timeCell.textContent = formatTime(data.elapsedTime);
    costCell.textContent = `${data.cost} EGP`;

    let tableData = JSON.parse(localStorage.getItem('tableData')) || [];
    tableData.push({
        deviceId: deviceId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        elapsedTime: data.elapsedTime,
        cost: data.cost
    });
    localStorage.setItem('tableData', JSON.stringify(tableData));

    // Update the total cost
    updateTotalCost();
}



function rebuildTable() {
    const tableData = JSON.parse(localStorage.getItem('tableData'));
    if (tableData) {
        const table = document.getElementById("deviceSummary").getElementsByTagName('tbody')[0];
        table.innerHTML = ""; // Clear the table body before rebuilding
        tableData.forEach(data => {
            const row = table.insertRow(0);
            const idCell = row.insertCell(0);
            const dateCell = row.insertCell(1);
            const startTimeCell = row.insertCell(2);
            const endTimeCell = row.insertCell(3);
            const timeCell = row.insertCell(4);
            const costCell = row.insertCell(5);

            idCell.textContent = `Device ${data.deviceId}`;
            dateCell.textContent = data.date;
            startTimeCell.textContent = new Date(data.startTime).toLocaleTimeString();
            endTimeCell.textContent = new Date(data.endTime).toLocaleTimeString();
            timeCell.textContent = formatTime(data.elapsedTime);
            costCell.textContent = `${data.cost} EGP`;
        });

        // Update the total cost after rebuilding the table
        updateTotalCost();
    }
}




function updateTotalCost() {
    let total = 0;
    const costCells = document.querySelectorAll('#deviceSummary tbody td:nth-child(6)'); // Select all cost cells in the table body
    costCells.forEach(cell => {
        total += parseFloat(cell.textContent.replace(' EGP', ''));
    });
    localStorage.setItem('totalCost', total.toFixed(2)); // Save the total cost to localStorage
    document.getElementById('totalCost').textContent = `${total.toFixed(2)} EGP`; // Display the updated total cost
}



function displaySavedTotalCost() {
    const savedTotalCost = localStorage.getItem('totalCost');
    if (savedTotalCost) {
        document.getElementById('totalCost').textContent = `${savedTotalCost} EGP`;
    }
}

function clearTableData() {
    if (confirm("Are you sure you want to clear all table data? This action cannot be undone.")) {
        window.location.reload();
        // Clear table rows from the DOM
        const table = document.getElementById("deviceSummary");
        while (table.rows.length > 1) {  // Assuming the first row is the header
            table.deleteRow(1);
        }

        // Clear table data from localStorage
        localStorage.removeItem('tableData');
        localStorage.removeItem('totalCost');

        // Reset total cost display
        document.getElementById('totalCost').textContent = '0.00 EGP';
    }
}
function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = today.getFullYear();
    return `${day}/${month}/${year}`; // Formats date as DD/MM/YYYY
}
let pdfCounter = 0;
function downloadPDF() {
    pdfCounter++;
    localStorage.setItem("pdfCounter",pdfCounter)
    let i = pdfCounter;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    // Set font for better compatibility
    doc.setFont('helvetica', 'normal');

    // Get the current date
    const date = getCurrentDate();

    // Optionally add a header with the date
    doc.text(`Date: ${date}`, 14, 10); // Adjust the position as needed

    // Capture the HTML table and use AutoTable to add it to the PDF
    doc.autoTable({
        html: '#deviceSummary',
        theme: 'striped',
        startY: 20, // Make sure this starts below your date text
        margin: { top: 10, bottom: 10 }
    });

    // Optionally add a footer or any additional text
    doc.text("ElDra3 Bayez Devices Summary Report", 14, doc.lastAutoTable.finalY + 10); // Adjust the position as needed

    // Save the PDF
    i = localStorage.getItem('pdfCounter')
    doc.save(`DeviceSummary${i}.pdf`);
}


function pauseTimer(deviceId) {
    if (timers[deviceId]) {
        clearInterval(timers[deviceId]);
        updateElapsedTime(deviceId);
        let savedData = JSON.parse(localStorage.getItem(`device${deviceId}`));
        savedData.running = false;
        savedData.paused = true;
        savedData.pauseTime = new Date().toISOString();

        localStorage.setItem(`device${deviceId}`, JSON.stringify(savedData));

        document.getElementById(`pauseTime${deviceId}`).textContent = "Paused at : " + new Date(savedData.pauseTime).toLocaleTimeString();
        
        document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).disabled = false;
        document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).classList.remove('d-none');
        document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).disabled = true;
        document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).classList.add('d-none');
        localStorage.setItem(`pauseTime${deviceId}`,JSON.stringify(new Date(savedData.pauseTime).toLocaleTimeString()))
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
    if (isNaN(seconds)) {
        return "00:00:00"; // Returns a default time if input is invalid
    }
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
            localStorage.removeItem(`startTime${deviceId}`);
            localStorage.removeItem(`pauseTime${deviceId}`);
            document.getElementById(`startTime${deviceId}`).textContent = "";
            document.getElementById(`pauseTime${deviceId}`).textContent = "";
            document.getElementById(`elapsedTime${deviceId}`).textContent = "00:00:00";
            document.getElementById(`cost${deviceId}`).textContent = "0.00 EGP";
            document.getElementById(`costm${deviceId}`).textContent = "0.00 EGP";
            document.querySelector(`#device${deviceId} button[onclick^="startTimer"]`).disabled = false;
            document.querySelector(`#device${deviceId} button[onclick^="stopTimer"]`).disabled = true;
            document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).disabled = true;
            document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).classList.add('d-none');
            document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).classList.remove('d-none');
            document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).disabled = true;
            resetDrinkQuantities(deviceId);
        }
    }
}


function clearTimer(deviceId) {
        clearInterval(timers[deviceId]);
        localStorage.removeItem(`device${deviceId}`);
        localStorage.removeItem(`startTime${deviceId}`);
        localStorage.removeItem(`pauseTime${deviceId}`);
        document.getElementById(`startTime${deviceId}`).textContent = "";
        document.getElementById(`pauseTime${deviceId}`).textContent = "";
        document.getElementById(`elapsedTime${deviceId}`).textContent = "00:00:00";
        document.getElementById(`cost${deviceId}`).textContent = "0.00 EGP";
        document.getElementById(`costm${deviceId}`).textContent = "0.00 EGP";
        resetDrinkQuantities(deviceId);
        document.querySelector(`#device${deviceId} button[onclick^="startTimer"]`).disabled = false;
        document.querySelector(`#device${deviceId} button[onclick^="stopTimer"]`).disabled = true;
        document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).disabled = true;
        document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).classList.add('d-none');
        document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).classList.remove('d-none');
        document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).disabled = true;
        document.querySelector(`#device${deviceId} button[onclick^="submit"]`).disabled = true;
        document.getElementById(`discountMenu${deviceId}`).classList.add('d-none');
}

function loadMenuCosts() {
    for (let deviceId = 1; deviceId <= 6; deviceId++) {  // Assuming you have 6 devices
        const storedCost = localStorage.getItem(`menuCost${deviceId}`);
        if (storedCost !== null) {
            document.getElementById(`costm${deviceId}`).textContent = `${storedCost} EGP`;
        }
    }
}

function calculateMenuCost(deviceId) {
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
    // Add more items as necessary

    const totalMenuCost = ( sodaS + sodaL + sokhn + coffee + cappuccino + frenchCoffee + netCard + halfHourPS4 + hourPS4 + sandwich + cleaning).toFixed(2);
    document.getElementById(`costm${deviceId}`).textContent = `${totalMenuCost} EGP`; // Display the calculated cost
    localStorage.setItem(`menuCost${deviceId}`, totalMenuCost);  // Save each device's menu cost separately

}

function discountRequest(deviceId){
    document.getElementById(`discountMenu${deviceId}`).classList.toggle('d-none');

}
function calcDiscountCost(deviceId){
    
    let savedData = JSON.parse(localStorage.getItem(`device${deviceId}`));
    let discountValue = document.getElementById(`discount${deviceId}`).value
    let afterDiscount =( savedData.cost - discountValue).toFixed()
    document.getElementById(`discountCost${deviceId}`).innerHTML = afterDiscount + ` EGP`;
    savedData.cost = afterDiscount;
    localStorage.setItem(`device${deviceId}`, JSON.stringify(savedData));
    /*if(discountValue <= savedData.cost){
        let savedData = JSON.parse(localStorage.getItem(`device${deviceId}`));
        let discountValue = document.getElementById(`discount${deviceId}`).value
        let afterDiscount =( savedData.cost - discountValue).toFixed();
        document.getElementById(`cost${deviceId}`).innerHTML =  `${afterDiscount}  EGP`;
        document.getElementById(`discountCost${deviceId}`).innerHTML = `${discountValue} EGP`;
        document.getElementById(`discountLayer${deviceId}`).classList.remove('d-none');
        document.getElementById(`totalDiscount${deviceId}`).classList.remove('d-none');
        setTimeout(() => {
            document.getElementById(`discountLayer${deviceId}`).classList.add('d-none');
            document.getElementById(`discountMenu${deviceId}`).classList.add('d-none');
            document.getElementById(`discount${deviceId}`).value = '';
        }, 1500);
        savedData.cost = afterDiscount;
        localStorage.setItem(`device${deviceId}`, JSON.stringify(savedData));
    }
    else{
        alert(' كدا هتبقي مديون ع فكره , فكر تاني يابا')
    }*/

}

function submit(deviceId){
    document.getElementById(`totalDiscount${deviceId}`).classList.add('d-none');
    let savedData = JSON.parse(localStorage.getItem(`device${deviceId}`));
    document.getElementById(`discountMenu${deviceId}`).classList.add('d-none');
    updateDeviceTable(deviceId, savedData);
    updateTotalCost();
    document.getElementById(`cost${deviceId}`).innerHTML = savedData.cost + " EGP";
    let layer = document.getElementById(`layer${deviceId}`);
    layer.classList.remove('d-none');
    setTimeout(() => {
        layer.classList.add('d-none');
    }, 1000);
    document.querySelector(`#device${deviceId} button[onclick^="submit"]`).disabled = true;
    clearTimer(deviceId)
    document.getElementById(`discountRequest${deviceId}`).classList.add('d-none');
    document.getElementById(`discount${deviceId}`).value = ''

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
        localStorage.removeItem(`menuCost${deviceId}`);
    });
}

window.onload = init;
