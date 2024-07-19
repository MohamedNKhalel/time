let timers = {};
let devices = [] 
let counter = 0 
let addDeviceLayer = document.querySelector('.add-device-layer')
let addForm = document.querySelector('.add-form')
let roomNumber = document.getElementById('roomNumber')
let formBtn = document.getElementById('formBtn');
let showAddBtn = document.getElementById('showAddBtn')
let room ;
showAddBtn.addEventListener('click',()=>{
    addDeviceLayer.classList.toggle('d-none')
})
roomNumber.addEventListener('input',()=>{
    if(roomNumber.value == ''){
        formBtn.disabled = true
    }
    else{
        formBtn.disabled = false

    }
})
formBtn.addEventListener('click',()=>{
    room = roomNumber.value;
    if(deviceExists(room)){
        // alert('This device number already exists.');
        document.getElementById('existingRoom').innerHTML = `<span class="text-danger fw-bolder">room ${room}</span> already exist <i class="fa-solid fa-triangle-exclamation"></i>`
    } else{
        window.location.reload()
        document.getElementById('existingRoom').innerHTML = ``
        addDevice();
        addDeviceLayer.classList.toggle('d-none')
        roomNumber.value = ''
    }
})

function deviceExists(room) {
    return devices.some(device => device.id === room);
}

addDeviceLayer.addEventListener('click',()=>{
    addDeviceLayer.classList.toggle('d-none')
})
addForm.addEventListener('click',(e)=>{
    e.stopPropagation()
})
let numOfDevices = document.getElementById('numOfDevices');


function addDevice(){
    counter ++;
    let device ={
        id:room
    }
    devices.push(device)
    let devicesJson = JSON.stringify(devices);
    localStorage.setItem('devices',devicesJson)
    localStorage.setItem('counterOfDevices',counter)
    numOfDevices.innerHTML = counter
    displayDevices();
}
function deleteDevice(index){
    let savedData = JSON.parse(localStorage.getItem(`device${index+1}`));
    
    if(savedData){
        alert("مينفعش والجهاز شغال , اقفله الاول")
    }
    else{
        if(confirm(`Are you sure you want to delete device${index+1} ?`)){
            window.location.reload()
            devices.splice(index, 1);
            localStorage.setItem('devices',JSON.stringify(devices))
            displayDevices()
            counter = devices.length;
            localStorage.setItem('counterOfDevices',counter)
            numOfDevices.innerHTML = counter;
        }
        else{
            alert('جدع يسطا')
        }
    }
        
}
function displayDevices(){
    numOfDevices.innerHTML = counter
    let container = ``
    for(let i = 0; i < devices.length;i++){
        container+=`<div class="col-lg-4 col-md-6">
            <div id="device${devices[i].id}" class="device position-relative">
              <div id="layer${devices[i].id}" class="layer-succes position-absolute top-0 start-0 end-0 bottom-0 bg-success z-3 d-flex justify-content-center align-items-center  d-none">
                <i class="fa-regular fa-circle-check fa-4x"></i>
                <h3>Successfully added to the table</h3>
              </div>
              
              <div class="d-flex justify-content-between  align-items-center device-header">
                <span class="running-device d-none d-flex justify-content-between align-items-center gap-1 text-success text-uppercase"><i class="fa-solid fa-circle  ms-1 fa-beat "></i> On</span> <span class="not-running-device d-flex justify-content-between align-items-center gap-1 text-danger "><i class="fa-solid fa-circle ms-1 "></i>off</span>
                <h2 class="fw-bolder text-uppercase  device-num ">Room ${devices[i].id}</h2>
                <i onclick="deleteDevice(${i})" class="fa-solid  p-4 fa-trash-can fa-2x"></i>
                </div>
              <div class="d-flex justify-content-between align-items-center">
                <button class="w-100" onclick="startTimer(${devices[i].id})">Start</button>
                <button title="pause" onclick="pauseTimer(${devices[i].id})" id="pauseTimer${devices[i].id}" disabled><i class="fa fa-pause fa-xl"></i></button>
                <button title="play" type="button" class="d-none" onclick="resumeTimer(${devices[i].id})" id="continueTimer${devices[i].id}" disabled><i class="fa fa-play fa-xl "></i></button>
              </div>
              <button onclick="stopTimer(${devices[i].id})" disabled>Stop</button>

              <div class="info-time">
                <span><span class="start-time" id="startTime${devices[i].id}"></span></span>
                <span><span class="pause-time" id="pauseTime${devices[i].id}"></span></span>
              </div>
              <div>Elapsed Time: <span id="elapsedTime${devices[i].id}">00:00:00</span></div>
              <select title="rate" id="rateSelector${devices[i].id}" onchange="saveRateSelection(${devices[i].id})">
                  <option  value="10">10 EGP/hour</option>
                  <option  value="15">15 EGP/hour</option>
                  <option  value="20">20 EGP/hour</option>
                  <option  value="25">25 EGP/hour</option>
                  <option  value="30">30 EGP/hour</option>
                  <option  value="35">35 EGP/hour</option>
                  <option  value="40">40 EGP/hour</option>
              </select>
              <!-- Start Menu -->
              <div class="menu">
                Menu:
                <button  onclick="toggleMenu(this, '.drinks')" class="show-drinks-btn mb-2 d-block m-auto">Show Menu <i class="fa-solid fa-caret-down fa-xl"></i></button>
                <button  onclick="toggleMenu(this, '.drinks')" class="hide-drinks-btn mb-2 d-none m-auto">Hide Menu <i class="fa-solid fa-caret-up fa-xl"></i></button>
                <div class="drinks d-none ">
                  <div class="p-3 bg-dark rounded-2 shadow">
                    <div class="bg-dark p-3 rounded-3 all-drinks shadow">
                      <div class="d-flex justify-content-between align-items-center">
                        <h2 class="h4 pt-2">Drinks :</h2>
                        <i  onclick="toggleDrinks(this)"  class="fa-solid fa-caret-down fa-xl show-drinks-bar"></i>
                        <i  onclick="toggleDrinks(this)"  class="fa-solid fa-caret-up fa-xl d-none hide-drinks-bar"></i>
                      </div>
                      <div class="d-none drinks-menu">
                        <div class="my-2">
                          <label>Soda Small (15 EGP)</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[i].id}" id="sodaS${devices[i].id}" type="number" value="0"  onchange="saveDrinkQuantities(${devices[i].id})">
                        </div>
                        <div class="my-2">
                          <label>Soda Large (20 EGP)</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[i].id}" type="number" id="sodaL${devices[i].id}" min="0" value="0"  onchange="saveDrinkQuantities(${devices[i].id})">
                        </div>
                        <div class="my-2">
                          <label>Sokhn  (10 EGP)</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[i].id}" type="number" id="sokhn${devices[i].id}" min="0" value="0"  onchange="saveDrinkQuantities(${devices[i].id})">
                        </div>
                        <div class="my-2">
                          <label>Coffee (15 EGP)</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[i].id}" type="number" id="coffee${devices[i].id}" min="0" value="0"  onchange="saveDrinkQuantities(${devices[i].id})">
                        </div>
                        <div class="my-2">
                          <label>Cappuccino (15 EGP):</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[i].id}" type="number" id="cappuccino${devices[i].id}" value="0"  onchange="saveDrinkQuantities(${devices[i].id})">
                        </div>
                        <div class="my-2">
                          <label>French Coffee (25 EGP):</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[i].id}" type="number" id="frenchCoffee${devices[i].id}" value="0"  onchange="saveDrinkQuantities(${devices[i].id})">
                        </div>
                      </div>
                    </div>
                    <div class="bg-dark p-3 rounded-3 mt-2 all-others shadow">
                      <div class="d-flex justify-content-between align-items-center">
                        <h2 class="h4 pt-2">Others :</h2>
                        <i onclick="toggleOthers(this)"  class="fa-solid fa-caret-down fa-xl show-others-bar"></i>
                        <i onclick="toggleOthers(this)"  class="fa-solid fa-caret-up d-none fa-xl hide-others-bar"></i>
                      </div>
                      <div class="d-none others-menu">
                        <div>
                          <label for="sandwich">Sandwich (15 EGP)</label>
                          <input title="sandwich" class="drink-input" data-device-id="${devices[i].id}" type="number" id="sandwich${devices[i].id}" min="0" value="0"  onchange="saveDrinkQuantities(${devices[i].id})">
                        </div>
                        <div class="my-2">
                          <label>Net Card (5 EGP):</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[i].id}" type="number" id="netCard${devices[i].id}" value="0"  onchange="saveDrinkQuantities(${devices[i].id})">
                        </div>
                        <div class="my-2">
                          <label>Half Hour PS4 (10 EGP):</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[i].id}" type="number" id="halfHourPS4${devices[i].id}" value="0"  onchange="saveDrinkQuantities(${devices[i].id})">
                        </div>
                        <div class="my-2">
                          <label>Hour PS4 (20 EGP):</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[i].id}" type="number" id="hourPS4${devices[i].id}" value="0"  onchange="saveDrinkQuantities(${devices[i].id})">
                        </div>
                        <div class="my-2">
                          <label>Cleaning (3 EGP):</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[i].id}" type="number" id="cleaning${devices[i].id}" value="0"  onchange="saveDrinkQuantities(${devices[i].id})">
                        </div>
                      </div>
                    </div>
                    <button onclick="calculateMenuCost(${devices[i].id})" class="w-100 m-auto mt-2 calc-menu">Show menu cost</button>
                    <div class="mt-2">Menu Cost: <span id="costm${devices[i].id}">0</span></div>
                  </div>
                </div>
              </div>
              <!-- End Menu -->
              <div id="totalDiscount${devices[i].id}" class="mt-2 d-none">Discount Value: <span id="discountCost${devices[i].id}">0</span></div>
              <div>Total Cost: <span id="cost${devices[i].id}">0</span></div>
              <h4 id="discountRequest${devices[i].id}" onclick="discountRequest(${devices[i].id})" class="h5 d-flex justify-content-between align-items-center d-none"><span>Add Discount ?</span> <i class="fa fa-plus-circle fa-xl"></i></h4>
              <div id="discountMenu${devices[i].id}" class="discount-menu  p-3 rounded-2 position-relative d-none">
                <div class="d-flex justify-content-between align-items-center  ">
                  <div class="position-relative"><input id="discount${devices[i].id}" type="number" placeholder="Enter Discount Value"> <img src="assets/images/discount-svgrepo-com.svg" class="discount-image" alt=""></div>
                  <i onclick="calcDiscountCost(${devices[i].id})" class="fa fa-plus fa-2x ms-2 add-icon"></i>
                  <div id="discountLayer${devices[i].id}" class="d-none discount-layer position-absolute d-flex justify-content-center align-items-center bg-success rounded-2 top-0 bottom-0 start-0 end-0">
                    <h2>Discount Added</h2>
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-between">
                <button  class="submit w-100" onclick="submit(${devices[i].id})" disabled>Submit</button>
              </div>
            </div>
        </div>`
    }
    document.getElementById('deviceContainer').innerHTML = container
}



function toggleMenu(button, menuSelector) {
    let menu = button.parentElement.querySelector(menuSelector); // Find the menu within the parent container
    let showBtn = button.parentElement.querySelector('.show-' + menuSelector.replace('.', ''));
    let hideBtn = button.parentElement.querySelector('.hide-' + menuSelector.replace('.', ''));

    menu.classList.toggle('d-none');
    showBtn.classList.toggle('d-none');
    hideBtn.classList.toggle('d-none');
}

function toggleDrinks(bar) {
    let device = bar.closest('.device'); // Find the closest parent '.device' container
    let drinksMenu = device.querySelector('.drinks-menu');
    let showBtn = device.querySelector('.show-drinks-bar');
    let hideBtn = device.querySelector('.hide-drinks-bar');

    drinksMenu.classList.toggle('d-none');
    showBtn.classList.toggle('d-none');
    hideBtn.classList.toggle('d-none');
}


function toggleOthers(bar) {
    let device = bar.closest('.device'); // Find the closest parent '.device' container
    let othersMenu = device.querySelector('.others-menu');
    let showBtn = device.querySelector('.show-others-bar');
    let hideBtn = device.querySelector('.hide-others-bar');

    othersMenu.classList.toggle('d-none');
    showBtn.classList.toggle('d-none');
    hideBtn.classList.toggle('d-none');
}





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
    if(localStorage.getItem('devices') != null){
        devices = JSON.parse(localStorage.getItem('devices'))
        counter = JSON.parse(localStorage.getItem('counterOfDevices'))
        displayDevices();

        // console.log(devices);
    }
    rebuildTable();
    displaySavedTotalCost();
    for (let deviceId = 1; deviceId <= devices.length; deviceId++) {
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
                document.getElementById(`elapsedTime${deviceId}`).innerHTML = formatTime(savedData.elapsedTime);
                document.getElementById(`cost${deviceId}`).innerHTML = `${savedData.cost} EGP`;
                document.querySelector(`#device${deviceId} button[onclick^="startTimer"]`).disabled = false;
                document.querySelector(`#device${deviceId} button[onclick^="stopTimer"]`).disabled = true;
                document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).disabled = true;
                document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).disabled = false;
            }
        } 
        // else {
        //     // Ensure all controls are reset to a default state if no saved data exists
        //     document.getElementById(`elapsedTime${deviceId}`).innerHTML = "00:00:00";
        //     document.getElementById(`cost${deviceId}`).innerHTML = "0.00 EGP";
        //     document.querySelector(`#device${deviceId} button[onclick^="startTimer"]`).disabled = false;
        //     document.querySelector(`#device${deviceId} button[onclick^="stopTimer"]`).disabled = true;
        //     document.querySelector(`#device${deviceId} button[onclick^="pauseTimer"]`).disabled = true;
        //     document.querySelector(`#device${deviceId} button[onclick^="resumeTimer"]`).disabled = true;
        // }
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
    for (let deviceId = 1; deviceId <= devices.length; deviceId++) {
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

// function loadDrinkQuantities(deviceId) {
//     // Load saved drink quantities from localStorage
//     const drinkIds = ['sodaS', 'sodaL', 'sokhn', 'coffee', 'cappuccino', 'frenchCoffee', 'netCard', 'halfHourPS4', 'hourPS4','sandwich','cleaning'];
//     drinkIds.forEach(drinkId => {
//         let savedQuantity = localStorage.getItem(`${drinkId}${deviceId}`);
//         if (savedQuantity) {
//             document.getElementById(`${drinkId}${deviceId}`).value = savedQuantity;
//         }
//     });
// }

// function saveDrinkQuantities(deviceId) {
//     // Save current drink quantities to localStorage
//     const drinkIds = ['sodaS', 'sodaL', 'sokhn', 'coffee', 'cappuccino', 'frenchCoffee', 'netCard', 'halfHourPS4', 'hourPS4','sandwich','cleaning'];
//     drinkIds.forEach(drinkId => {
//         let quantity = document.getElementById(`${drinkId}${deviceId}`).value;
//         localStorage.setItem(`${drinkId}${deviceId}`, quantity);
//         console.log(q);
//     });
// }
function saveDrinkQuantities(deviceId) {
    // Save current drink quantities to localStorage
    const drinkIds = ['sodaS', 'sodaL', 'sokhn', 'coffee', 'cappuccino', 'frenchCoffee', 'netCard', 'halfHourPS4', 'hourPS4', 'sandwich', 'cleaning'];
    drinkIds.forEach(drinkId => {
        let quantity = document.getElementById(`${drinkId}${deviceId}`).value;
        localStorage.setItem(`${drinkId}${deviceId}`, quantity);
    });
}

function loadDrinkQuantities(deviceId) {
    // Load saved drink quantities from localStorage
    const drinkIds = ['sodaS', 'sodaL', 'sokhn', 'coffee', 'cappuccino', 'frenchCoffee', 'netCard', 'halfHourPS4', 'hourPS4', 'sandwich', 'cleaning'];
    drinkIds.forEach(drinkId => {
        let savedQuantity = localStorage.getItem(`${drinkId}${deviceId}`);
        if (savedQuantity) {
            document.getElementById(`${drinkId}${deviceId}`).value = savedQuantity;
        }
    });
}

function getStartandPausedTime(){
    console.log("testPause");
    for(let i = 0 ; i<=devices.length ; i++){
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
        document.getElementById(`startTime${deviceId}`).innerHTML ="Start Time : " + new Date(savedData.startTime).toLocaleTimeString();
    }

    timers[deviceId] = setInterval(() => updateElapsedTime(deviceId), 1000);
    document.querySelector(`#device${deviceId} .running-device`).classList.remove('d-none')
    document.querySelector(`#device${deviceId} .not-running-device`).classList.add('d-none')

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

        document.querySelector(`#device${deviceId} .not-running-device`).classList.remove('d-none')
        document.querySelector(`#device${deviceId} .running-device`).classList.add('d-none')

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

    idCell.innerHTML = `Device ${deviceId}`;
    dateCell.innerHTML = data.date;
    startTimeCell.innerHTML = new Date(data.startTime).toLocaleTimeString();
    endTimeCell.innerHTML = new Date(data.endTime).toLocaleTimeString();
    timeCell.innerHTML = formatTime(data.elapsedTime);
    costCell.innerHTML = `${data.cost} EGP`;

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

            idCell.innerHTML = `Device ${data.deviceId}`;
            dateCell.innerHTML = data.date;
            startTimeCell.innerHTML = new Date(data.startTime).toLocaleTimeString();
            endTimeCell.innerHTML = new Date(data.endTime).toLocaleTimeString();
            timeCell.innerHTML = formatTime(data.elapsedTime);
            costCell.innerHTML = `${data.cost} EGP`;
        });

        // Update the total cost after rebuilding the table
        updateTotalCost();
    }
}




function updateTotalCost() {
    let total = 0;
    const costCells = document.querySelectorAll('#deviceSummary tbody td:nth-child(6)'); // Select all cost cells in the table body
    costCells.forEach(cell => {
        total += parseFloat(cell.innerHTML.replace(' EGP', ''));
    });
    localStorage.setItem('totalCost', total.toFixed(2)); // Save the total cost to localStorage
    document.getElementById('totalCost').innerHTML = `${total.toFixed(2)} EGP`; // Display the updated total cost
}



function displaySavedTotalCost() {
    const savedTotalCost = localStorage.getItem('totalCost');
    if (savedTotalCost) {
        document.getElementById('totalCost').innerHTML = `${savedTotalCost} EGP`;
    }
}

function clearTableData() {
    if (confirm("Are you sure you want to clear all table data? This action cannot be undone.")) {
        // Clear table rows from the DOM
        const table = document.getElementById("deviceSummary");
        while (table.rows.length > 2) {  // Assuming the first row is the header
            table.deleteRow(1);
        }

        // Clear table data from localStorage
        localStorage.removeItem('tableData');
        localStorage.removeItem('totalCost');

        // Reset total cost display
        document.getElementById('totalCost').innerHTML = '0.00 EGP';
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

        document.getElementById(`pauseTime${deviceId}`).innerHTML = "Paused at : " + new Date(savedData.pauseTime).toLocaleTimeString();
        
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
    document.getElementById(`elapsedTime${deviceId}`).innerHTML = formatTime(elapsedTime);
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
        for (let deviceId = 1; deviceId <= devices.length; deviceId++) {
            clearInterval(timers[deviceId]);
            localStorage.removeItem(`device${deviceId}`);
            localStorage.removeItem(`startTime${deviceId}`);
            localStorage.removeItem(`pauseTime${deviceId}`);
            document.getElementById(`startTime${deviceId}`).innerHTML = "";
            document.getElementById(`pauseTime${deviceId}`).innerHTML = "";
            document.getElementById(`elapsedTime${deviceId}`).innerHTML = "00:00:00";
            document.getElementById(`cost${deviceId}`).innerHTML = "0.00 EGP";
            document.getElementById(`costm${deviceId}`).innerHTML = "0.00 EGP";
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
        document.getElementById(`startTime${deviceId}`).innerHTML = "";
        document.getElementById(`pauseTime${deviceId}`).innerHTML = "";
        document.getElementById(`elapsedTime${deviceId}`).innerHTML = "00:00:00";
        document.getElementById(`cost${deviceId}`).innerHTML = "0.00 EGP";
        document.getElementById(`costm${deviceId}`).innerHTML = "0.00 EGP";
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
    for (let deviceId = 1; deviceId <= devices.length; deviceId++) {  // Assuming you have 6 devices
        const storedCost = localStorage.getItem(`menuCost${deviceId}`);
        if (storedCost !== null) {
            document.getElementById(`costm${deviceId}`).innerHTML = `${storedCost} EGP`;
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
    document.getElementById(`costm${deviceId}`).innerHTML = `${totalMenuCost} EGP`; // Display the calculated cost
    localStorage.setItem(`menuCost${deviceId}`, totalMenuCost);  // Save each device's menu cost separately

}

function discountRequest(deviceId){
    document.getElementById(`discountMenu${deviceId}`).classList.toggle('d-none');

}
function calcDiscountCost(deviceId){
    console.log("test");
    let savedData = JSON.parse(localStorage.getItem(`device${deviceId}`));
    let discountValue = document.getElementById(`discount${deviceId}`).value
    let afterDiscount =( savedData.cost - discountValue).toFixed();
    if(afterDiscount >= 0){
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
    }

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
    document.getElementById(`cost${deviceId}`).innerHTML = `${totalCost} EGP`;
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
