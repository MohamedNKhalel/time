let room,timers={},devices=[],counter=0,addDeviceLayer=document.querySelector(".add-device-layer"),addForm=document.querySelector(".add-form"),roomNumber=document.getElementById("roomNumber"),formBtn=document.getElementById("formBtn"),showAddBtn=document.getElementById("showAddBtn");document.getElementById("logOutBtn").addEventListener("click",()=>{localStorage.removeItem("email"),location.reload()}),showAddBtn.addEventListener("click",()=>{addDeviceLayer.classList.toggle("d-none")}),roomNumber.addEventListener("input",()=>{formBtn.disabled=!(""!=roomNumber.value)}),formBtn.addEventListener("click",()=>{room=roomNumber.value,deviceExists(room)?document.getElementById("existingRoom").innerHTML=`<span class="text-danger fw-bolder">room ${room}</span> already exist <i class="fa-solid fa-triangle-exclamation"></i>`:(window.location.reload(),document.getElementById("existingRoom").innerHTML=``,addDevice(),addDeviceLayer.classList.toggle("d-none"),roomNumber.value="")});function deviceExists(a){return devices.some(b=>b.id===a)}addDeviceLayer.addEventListener("click",()=>{addDeviceLayer.classList.toggle("d-none")}),addForm.addEventListener("click",a=>{a.stopPropagation()});let numOfDevices=document.getElementById("numOfDevices");function addDevice(){counter++;let a={id:room};devices.push(a);let b=JSON.stringify(devices);localStorage.setItem("devices",b),localStorage.setItem("counterOfDevices",counter),numOfDevices.innerHTML=counter,displayDevices()}function deleteDevice(a){let b=JSON.parse(localStorage.getItem(`device${a+1}`));b?alert("\u0645\u064A\u0646\u0641\u0639\u0634 \u0648\u0627\u0644\u062C\u0647\u0627\u0632 \u0634\u063A\u0627\u0644 , \u0627\u0642\u0641\u0644\u0647 \u0627\u0644\u0627\u0648\u0644"):confirm(`Are you sure you want to delete device${a+1} ?`)?(window.location.reload(),devices.splice(a,1),localStorage.setItem("devices",JSON.stringify(devices)),displayDevices(),counter=devices.length,localStorage.setItem("counterOfDevices",counter),numOfDevices.innerHTML=counter):alert("\u062C\u062F\u0639 \u064A\u0633\u0637\u0627")}function displayDevices(){numOfDevices.innerHTML=counter;let a=``;for(let b=0;b<devices.length;b++)a+=`<div class="col-lg-4 col-md-6">
            <div id="device${devices[b].id}" class="device position-relative">
                <div id="layer${devices[b].id}" class="layer-succes position-absolute top-0 start-0 end-0 bottom-0 bg-success z-3 d-flex justify-content-center align-items-center  d-none">
                <i class="fa-regular fa-circle-check fa-4x"></i>
                <h3>Successfully added to the table</h3>
              </div>
              
              <div class="d-flex justify-content-between  align-items-center device-header">
                <span class="running-device d-none d-flex justify-content-between align-items-center gap-1 text-success text-uppercase"><i class="fa-solid fa-circle  ms-1 fa-beat "></i> On</span> <span class="not-running-device d-flex justify-content-between align-items-center gap-1 text-danger "><i class="fa-solid fa-circle ms-1 "></i>off</span>
                <h2 class="fw-bolder text-uppercase  device-num ">Room ${devices[b].id}</h2>
                <div class="d-flex justify-content-center gap-3 p-2 align-items-center position-relative">
                    <i title="Reset" onclick="resetDevice(${devices[b].id})" class="fa-solid fa-arrows-rotate fa-2x"></i>
                    <span id="break"></span>
                    <i title="Delete" onclick="deleteDevice(${b})" class="fa-solid fa-trash-can fa-2x"></i>
                </div>
                </div>
              <div class="d-flex justify-content-between align-items-center">
                <button class="w-100" onclick="startTimer(${devices[b].id})">Start</button>
                <button title="pause" onclick="pauseTimer(${devices[b].id})" id="pauseTimer${devices[b].id}" disabled><i class="fa fa-pause fa-xl"></i></button>
                <button title="play" type="button" class="d-none" onclick="resumeTimer(${devices[b].id})" id="continueTimer${devices[b].id}" disabled><i class="fa fa-play fa-xl "></i></button>
              </div>
              <button onclick="stopTimer(${devices[b].id})" disabled>Stop</button>

              <div class="info-time">
                <span><span class="start-time" id="startTime${devices[b].id}"></span></span>
                <span><span class="pause-time" id="pauseTime${devices[b].id}"></span></span>
              </div>
              <div>Elapsed Time: <span id="elapsedTime${devices[b].id}">00:00:00</span></div>
              <select title="rate" id="rateSelector${devices[b].id}" onchange="saveRateSelection(${devices[b].id})">
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
                          <input title="drink" class="drink-input" data-device-id="${devices[b].id}" id="sodaS${devices[b].id}" type="number" value="0"  onchange="saveDrinkQuantities(${devices[b].id})">
                        </div>
                        <div class="my-2">
                          <label>Soda Large (20 EGP)</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[b].id}" type="number" id="sodaL${devices[b].id}" min="0" value="0"  onchange="saveDrinkQuantities(${devices[b].id})">
                        </div>
                        <div class="my-2">
                          <label>Sokhn  (10 EGP)</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[b].id}" type="number" id="sokhn${devices[b].id}" min="0" value="0"  onchange="saveDrinkQuantities(${devices[b].id})">
                        </div>
                        <div class="my-2">
                          <label>Coffee (15 EGP)</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[b].id}" type="number" id="coffee${devices[b].id}" min="0" value="0"  onchange="saveDrinkQuantities(${devices[b].id})">
                        </div>
                        <div class="my-2">
                          <label>Cappuccino (15 EGP):</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[b].id}" type="number" id="cappuccino${devices[b].id}" value="0"  onchange="saveDrinkQuantities(${devices[b].id})">
                        </div>
                        <div class="my-2">
                          <label>French Coffee (25 EGP):</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[b].id}" type="number" id="frenchCoffee${devices[b].id}" value="0"  onchange="saveDrinkQuantities(${devices[b].id})">
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
                          <input title="sandwich" class="drink-input" data-device-id="${devices[b].id}" type="number" id="sandwich${devices[b].id}" min="0" value="0"  onchange="saveDrinkQuantities(${devices[b].id})">
                        </div>
                        <div class="my-2">
                          <label>Net Card (5 EGP):</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[b].id}" type="number" id="netCard${devices[b].id}" value="0"  onchange="saveDrinkQuantities(${devices[b].id})">
                        </div>
                        <div class="my-2">
                          <label>Half Hour PS4 (10 EGP):</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[b].id}" type="number" id="halfHourPS4${devices[b].id}" value="0"  onchange="saveDrinkQuantities(${devices[b].id})">
                        </div>
                        <div class="my-2">
                          <label>Hour PS4 (20 EGP):</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[b].id}" type="number" id="hourPS4${devices[b].id}" value="0"  onchange="saveDrinkQuantities(${devices[b].id})">
                        </div>
                        <div class="my-2">
                          <label>Cleaning (3 EGP):</label>
                          <input title="drink" class="drink-input" data-device-id="${devices[b].id}" type="number" id="cleaning${devices[b].id}" value="0"  onchange="saveDrinkQuantities(${devices[b].id})">
                        </div>
                      </div>
                    </div>
                    <button onclick="calculateMenuCost(${devices[b].id})" class="w-100 m-auto mt-2 calc-menu">Show menu cost</button>
                    <div class="mt-2">Menu Cost: <span id="costm${devices[b].id}">0</span></div>
                  </div>
                </div>
              </div>
              <!-- End Menu -->
              <div id="totalDiscount${devices[b].id}" class="mt-2 d-none">Discount Value: <span id="discountCost${devices[b].id}">0</span></div>
              <div>Total Cost: <span id="cost${devices[b].id}">0</span></div>
              <h4 id="discountRequest${devices[b].id}" onclick="discountRequest(${devices[b].id})" class="h5 d-flex justify-content-between align-items-center d-none"><span>Add Discount ?</span> <i class="fa fa-plus-circle fa-xl"></i></h4>
              <div id="discountMenu${devices[b].id}" class="discount-menu  p-3 rounded-2 position-relative d-none">
                <div class="d-flex justify-content-between align-items-center  ">
                  <div class="position-relative"><input id="discount${devices[b].id}" type="number" placeholder="Enter Discount Value"> <img src="assets/images/discount-svgrepo-com.svg" class="discount-image" alt=""></div>
                  <i onclick="calcDiscountCost(${devices[b].id})" class="fa fa-plus fa-2x ms-2 add-icon"></i>
                  <div id="discountLayer${devices[b].id}" class="d-none discount-layer position-absolute d-flex justify-content-center align-items-center bg-success rounded-2 top-0 bottom-0 start-0 end-0"> 
                    <h2>Discount Added</h2>
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-between">
                <button  class="submit w-100" onclick="submit(${devices[b].id})" disabled>Submit</button>
              </div>
            </div>
        </div>`;document.getElementById("deviceContainer").innerHTML=a}function resetDevice(a){confirm(`are you sure you want to delete device${a} data`)&&clearTimer(a)}function toggleMenu(a,b){let c=a.parentElement.querySelector(b),d=a.parentElement.querySelector(".show-"+b.replace(".","")),e=a.parentElement.querySelector(".hide-"+b.replace(".",""));c.classList.toggle("d-none"),d.classList.toggle("d-none"),e.classList.toggle("d-none")}function toggleDrinks(a){let b=a.closest(".device"),c=b.querySelector(".drinks-menu"),d=b.querySelector(".show-drinks-bar"),e=b.querySelector(".hide-drinks-bar");c.classList.toggle("d-none"),d.classList.toggle("d-none"),e.classList.toggle("d-none")}function toggleOthers(a){let b=a.closest(".device"),c=b.querySelector(".others-menu"),d=b.querySelector(".show-others-bar"),e=b.querySelector(".hide-others-bar");c.classList.toggle("d-none"),d.classList.toggle("d-none"),e.classList.toggle("d-none")}document.querySelectorAll(".main-nav-link").forEach(a=>{a.addEventListener("click",()=>{changeActiveLink(a)})});function changeActiveLink(a){document.querySelector(".main-nav .active").classList.remove("active"),a.classList.add("active")}function showDevices(){document.querySelector(".device-blocks").classList.remove("d-none"),document.querySelector(".summary-table").classList.add("d-none"),document.querySelector(".main-elsala").classList.add("d-none")}function showSummaryTable(){document.querySelector(".summary-table").classList.remove("d-none"),document.querySelector(".device-blocks").classList.add("d-none"),document.querySelector(".main-elsala").classList.add("d-none")}function showSala(){document.querySelector(".main-elsala").classList.remove("d-none"),document.querySelector(".device-blocks").classList.add("d-none"),document.querySelector(".summary-table").classList.add("d-none")}function init(){"eldra3bayez@ps.com"!=localStorage.getItem("email")&&(window.location.href="../index.html"),null!=localStorage.getItem("devices")&&(devices=JSON.parse(localStorage.getItem("devices")),counter=JSON.parse(localStorage.getItem("counterOfDevices")),displayDevices()),rebuildTable(),displaySavedTotalCost();for(let a,b=1;b<=devices.length;b++)a=localStorage.getItem(`device${b}`),a&&(a=JSON.parse(a),a.running?(startTimer(b,new Date(a.startTime)),document.querySelector(`#device${b} button[onclick^="startTimer"]`).disabled=!0,document.querySelector(`#device${b} button[onclick^="stopTimer"]`).disabled=!1,document.querySelector(`#device${b} button[onclick^="pauseTimer"]`).disabled=!1,document.querySelector(`#device${b} button[onclick^="resumeTimer"]`).disabled=!0,document.querySelector(`#device${b} button[onclick^="pauseTimer"]`).classList.remove("d-none"),document.querySelector(`#device${b} button[onclick^="resumeTimer"]`).classList.add("d-none")):!1==a.running&&!0==a.paused?(document.querySelector(`#device${b} button[onclick^="startTimer"]`).disabled=!0,document.querySelector(`#device${b} button[onclick^="stopTimer"]`).disabled=!1,document.querySelector(`#device${b} button[onclick^="pauseTimer"]`).disabled=!0,document.querySelector(`#device${b} button[onclick^="pauseTimer"]`).classList.add("d-none"),document.querySelector(`#device${b} button[onclick^="resumeTimer"]`).disabled=!1,document.querySelector(`#device${b} button[onclick^="resumeTimer"]`).classList.remove("d-none")):(document.getElementById(`elapsedTime${b}`).innerHTML=formatTime(a.elapsedTime),document.getElementById(`cost${b}`).innerHTML=`${a.cost} EGP`,document.querySelector(`#device${b} button[onclick^="startTimer"]`).disabled=!1,document.querySelector(`#device${b} button[onclick^="stopTimer"]`).disabled=!0,document.querySelector(`#device${b} button[onclick^="pauseTimer"]`).disabled=!0,document.querySelector(`#device${b} button[onclick^="resumeTimer"]`).disabled=!1)),loadDrinkQuantities(b);getStartandPausedTime(),loadRateSelections(),loadMenuCosts()}document.querySelectorAll(".drink-input").forEach(a=>{a.addEventListener("change",a=>{const b=a.target.dataset.deviceId;saveDrinkQuantities(b)})});function saveRateSelection(a){var b=document.getElementById(`rateSelector${a}`),c=b.value;localStorage.setItem(`rateSelection${a}`,c)}function loadRateSelections(){for(let d=1;d<=devices.length;d++){var a=localStorage.getItem(`rateSelection${d}`);if(a)for(var b=document.getElementById(`rateSelector${d}`),c=0;c<b.options.length;c++)if(b.options[c].value===a){b.selectedIndex=c;break}}}function saveDrinkQuantities(a){["sodaS","sodaL","sokhn","coffee","cappuccino","frenchCoffee","netCard","halfHourPS4","hourPS4","sandwich","cleaning"].forEach(b=>{let c=document.getElementById(`${b}${a}`).value;localStorage.setItem(`${b}${a}`,c)})}function loadDrinkQuantities(a){["sodaS","sodaL","sokhn","coffee","cappuccino","frenchCoffee","netCard","halfHourPS4","hourPS4","sandwich","cleaning"].forEach(b=>{let c=localStorage.getItem(`${b}${a}`);c&&(document.getElementById(`${b}${a}`).value=c)})}function getStartandPausedTime(){console.log("testPause");for(let a=0;a<=devices.length;a++)null!=localStorage.getItem(`startTime${a}`)&&(document.getElementById(`startTime${a}`).innerHTML="Start Time : "+JSON.parse(localStorage.getItem(`startTime${a}`))),null!=localStorage.getItem(`pauseTime${a}`)&&(document.getElementById(`pauseTime${a}`).innerHTML="Paused at : "+JSON.parse(localStorage.getItem(`pauseTime${a}`)))}function startTimer(a,b=!1){let c=JSON.parse(localStorage.getItem(`device${a}`))||{startTime:new Date().toISOString(),elapsedTime:0,cost:0,running:!0,date:getCurrentDate()};b||(c.startTime=new Date().toISOString(),c.elapsedTime=0,document.getElementById(`startTime${a}`).innerHTML="Start Time : "+new Date(c.startTime).toLocaleTimeString()),timers[a]=setInterval(()=>updateElapsedTime(a),1e3),document.querySelector(`#device${a} .running-device`).classList.remove("d-none"),document.querySelector(`#device${a} .not-running-device`).classList.add("d-none"),document.querySelector(`#device${a} button[onclick^="startTimer"]`).disabled=!0,document.querySelector(`#device${a} button[onclick^="stopTimer"]`).disabled=!1,document.querySelector(`#device${a} button[onclick^="pauseTimer"]`).disabled=!1,document.querySelector(`#device${a} button[onclick^="submit"]`).disabled=!0,localStorage.setItem(`device${a}`,JSON.stringify(c)),localStorage.setItem(`startTime${a}`,JSON.stringify(new Date(c.startTime).toLocaleTimeString())),document.getElementById(`discountMenu${a}`).classList.add("d-none"),document.getElementById(`discountRequest${a}`).classList.add("d-none")}function stopTimer(a){if(confirm("Are you sure you want to stop the timer?")){clearInterval(timers[a]);let b=JSON.parse(localStorage.getItem(`device${a}`));calculateCost(a,b),b.endTime=new Date().toISOString(),b.running=!1,b.paused=!1,localStorage.setItem(`device${a}`,JSON.stringify(b)),document.querySelector(`#device${a} .not-running-device`).classList.remove("d-none"),document.querySelector(`#device${a} .running-device`).classList.add("d-none"),document.querySelector(`#device${a} button[onclick^="startTimer"]`).disabled=!1,document.querySelector(`#device${a} button[onclick^="stopTimer"]`).disabled=!0,document.querySelector(`#device${a} button[onclick^="resumeTimer"]`).disabled=!0,document.querySelector(`#device${a} button[onclick^="resumeTimer"]`).classList.add("d-none"),document.querySelector(`#device${a} button[onclick^="pauseTimer"]`).classList.remove("d-none"),document.querySelector(`#device${a} button[onclick^="pauseTimer"]`).disabled=!0,document.querySelector(`#device${a} button[onclick^="submit"]`).disabled=!1,document.getElementById(`discountRequest${a}`).classList.remove("d-none")}}function updateDeviceTable(a,b){const c=document.getElementById("deviceSummary").getElementsByTagName("tbody")[0],d=c.insertRow(0),e=d.insertCell(0),f=d.insertCell(1),g=d.insertCell(2),h=d.insertCell(3),i=d.insertCell(4),j=d.insertCell(5);e.innerHTML=`Device ${a}`,f.innerHTML=b.date,g.innerHTML=new Date(b.startTime).toLocaleTimeString(),h.innerHTML=new Date(b.endTime).toLocaleTimeString(),i.innerHTML=formatTime(b.elapsedTime),j.innerHTML=`${b.cost} EGP`;let k=JSON.parse(localStorage.getItem("tableData"))||[];k.push({deviceId:a,date:b.date,startTime:b.startTime,endTime:b.endTime,elapsedTime:b.elapsedTime,cost:b.cost}),localStorage.setItem("tableData",JSON.stringify(k)),updateTotalCost()}function rebuildTable(){const a=JSON.parse(localStorage.getItem("tableData"));if(a){const b=document.getElementById("deviceSummary").getElementsByTagName("tbody")[0];b.innerHTML="",a.forEach(a=>{const c=b.insertRow(0),d=c.insertCell(0),e=c.insertCell(1),f=c.insertCell(2),g=c.insertCell(3),h=c.insertCell(4),i=c.insertCell(5);d.innerHTML=`Device ${a.deviceId}`,e.innerHTML=a.date,f.innerHTML=new Date(a.startTime).toLocaleTimeString(),g.innerHTML=new Date(a.endTime).toLocaleTimeString(),h.innerHTML=formatTime(a.elapsedTime),i.innerHTML=`${a.cost} EGP`}),updateTotalCost()}}function updateTotalCost(){let a=0;const b=document.querySelectorAll("#deviceSummary tbody td:nth-child(6)");b.forEach(b=>{a+=parseFloat(b.innerHTML.replace(" EGP",""))}),localStorage.setItem("totalCost",a.toFixed(2)),document.getElementById("totalCost").innerHTML=`${a.toFixed(2)} EGP`}function displaySavedTotalCost(){const a=localStorage.getItem("totalCost");a&&(document.getElementById("totalCost").innerHTML=`${a} EGP`)}function clearTableData(){if(confirm("Are you sure you want to clear all table data? This action cannot be undone.")){for(const a=document.getElementById("deviceSummary");2<a.rows.length;)a.deleteRow(1);localStorage.removeItem("tableData"),localStorage.removeItem("totalCost"),document.getElementById("totalCost").innerHTML="0.00 EGP"}}function getCurrentDate(){const a=new Date,b=(a.getDate()+"").padStart(2,"0"),c=(a.getMonth()+1+"").padStart(2,"0"),d=a.getFullYear();return`${b}/${c}/${d}`}let pdfCounter=0;function downloadPDF(){pdfCounter++,localStorage.setItem("pdfCounter",pdfCounter);let a=pdfCounter;const{jsPDF:b}=window.jspdf,c=new b;c.setFont("helvetica","normal");const d=getCurrentDate();c.text(`Date: ${d}`,14,10),c.autoTable({html:"#deviceSummary",theme:"striped",startY:20,margin:{top:10,bottom:10}}),c.text("ElDra3 Bayez Devices Summary Report",14,c.lastAutoTable.finalY+10),a=localStorage.getItem("pdfCounter"),c.save(`DeviceSummary${a}.pdf`)}function pauseTimer(a){if(timers[a]){clearInterval(timers[a]),updateElapsedTime(a);let b=JSON.parse(localStorage.getItem(`device${a}`));b.running=!1,b.paused=!0,b.pauseTime=new Date().toISOString(),localStorage.setItem(`device${a}`,JSON.stringify(b)),document.getElementById(`pauseTime${a}`).innerHTML="Paused at : "+new Date(b.pauseTime).toLocaleTimeString(),document.querySelector(`#device${a} button[onclick^="resumeTimer"]`).disabled=!1,document.querySelector(`#device${a} button[onclick^="resumeTimer"]`).classList.remove("d-none"),document.querySelector(`#device${a} button[onclick^="pauseTimer"]`).disabled=!0,document.querySelector(`#device${a} button[onclick^="pauseTimer"]`).classList.add("d-none"),localStorage.setItem(`pauseTime${a}`,JSON.stringify(new Date(b.pauseTime).toLocaleTimeString()))}}function resumeTimer(a){let b=JSON.parse(localStorage.getItem(`device${a}`));if(!b.running){let c=new Date,d=1e3*b.elapsedTime;b.startTime=new Date(c-d).toISOString(),b.paused=!1,b.running=!0,localStorage.setItem(`device${a}`,JSON.stringify(b)),startTimer(a,!0),document.querySelector(`#device${a} button[onclick^="resumeTimer"]`).disabled=!0,document.querySelector(`#device${a} button[onclick^="resumeTimer"]`).classList.add("d-none"),document.querySelector(`#device${a} button[onclick^="pauseTimer"]`).disabled=!1,document.querySelector(`#device${a} button[onclick^="pauseTimer"]`).classList.remove("d-none")}}function updateElapsedTime(a){let b=JSON.parse(localStorage.getItem(`device${a}`));const c=Math.floor((new Date-new Date(b.startTime))/1e3);document.getElementById(`elapsedTime${a}`).innerHTML=formatTime(c),b.elapsedTime=c,localStorage.setItem(`device${a}`,JSON.stringify(b))}function formatTime(a){if(isNaN(a))return"00:00:00";const b=Math.floor(a/3600),c=Math.floor(a%3600/60);return[b,c,a%60].map(a=>10>a?"0"+a:a).join(":")}function clearAllTimers(){if(confirm("Are you sure you want to clear all timers? This action cannot be undone."))for(let a=1;a<=devices.length;a++)clearInterval(timers[a]),localStorage.removeItem(`device${a}`),localStorage.removeItem(`startTime${a}`),localStorage.removeItem(`pauseTime${a}`),document.getElementById(`startTime${a}`).innerHTML="",document.getElementById(`pauseTime${a}`).innerHTML="",document.getElementById(`elapsedTime${a}`).innerHTML="00:00:00",document.getElementById(`cost${a}`).innerHTML="0.00 EGP",document.getElementById(`costm${a}`).innerHTML="0.00 EGP",document.querySelector(`#device${a} button[onclick^="startTimer"]`).disabled=!1,document.querySelector(`#device${a} button[onclick^="stopTimer"]`).disabled=!0,document.querySelector(`#device${a} button[onclick^="resumeTimer"]`).disabled=!0,document.querySelector(`#device${a} button[onclick^="resumeTimer"]`).classList.add("d-none"),document.querySelector(`#device${a} button[onclick^="pauseTimer"]`).classList.remove("d-none"),document.querySelector(`#device${a} button[onclick^="pauseTimer"]`).disabled=!0,resetDrinkQuantities(a)}function clearTimer(a){let b=JSON.parse(localStorage.getItem(`device${a}`));clearInterval(timers[a]),document.getElementById(`discountMenu${a}`).classList.add("d-none"),document.getElementById(`cost${a}`).innerHTML=b.cost+" EGP",document.getElementById(`discountRequest${a}`).classList.add("d-none"),document.getElementById(`discount${a}`).value="",document.querySelector(`#device${a} .running-device`).classList.add("d-none"),document.querySelector(`#device${a} .not-running-device`).classList.remove("d-none"),localStorage.removeItem(`device${a}`),localStorage.removeItem(`startTime${a}`),localStorage.removeItem(`pauseTime${a}`),document.getElementById(`startTime${a}`).innerHTML="",document.getElementById(`pauseTime${a}`).innerHTML="",document.getElementById(`elapsedTime${a}`).innerHTML="00:00:00",document.getElementById(`cost${a}`).innerHTML="0.00 EGP",document.getElementById(`costm${a}`).innerHTML="0.00 EGP",resetDrinkQuantities(a),document.querySelector(`#device${a} button[onclick^="startTimer"]`).disabled=!1,document.querySelector(`#device${a} button[onclick^="stopTimer"]`).disabled=!0,document.querySelector(`#device${a} button[onclick^="resumeTimer"]`).disabled=!0,document.querySelector(`#device${a} button[onclick^="resumeTimer"]`).classList.add("d-none"),document.querySelector(`#device${a} button[onclick^="pauseTimer"]`).classList.remove("d-none"),document.querySelector(`#device${a} button[onclick^="pauseTimer"]`).disabled=!0,document.querySelector(`#device${a} button[onclick^="submit"]`).disabled=!0,document.getElementById(`discountMenu${a}`).classList.add("d-none")}function loadMenuCosts(){for(let a=1;a<=devices.length;a++){const b=localStorage.getItem(`menuCost${a}`);null!==b&&(document.getElementById(`costm${a}`).innerHTML=`${b} EGP`)}}function calculateMenuCost(a){const b=15*parseInt(document.getElementById(`sodaS${a}`).value,10),c=20*parseInt(document.getElementById(`sodaL${a}`).value,10),d=10*parseInt(document.getElementById(`sokhn${a}`).value,10),e=15*parseInt(document.getElementById(`coffee${a}`).value,10),f=15*parseInt(document.getElementById(`cappuccino${a}`).value),g=25*parseInt(document.getElementById(`frenchCoffee${a}`).value),h=5*parseInt(document.getElementById(`netCard${a}`).value),i=10*parseInt(document.getElementById(`halfHourPS4${a}`).value),j=20*parseInt(document.getElementById(`hourPS4${a}`).value),k=15*parseInt(document.getElementById(`sandwich${a}`).value),l=3*parseInt(document.getElementById(`cleaning${a}`).value),m=(b+c+d+e+f+g+h+i+j+k+l).toFixed(2);document.getElementById(`costm${a}`).innerHTML=`${m} EGP`,localStorage.setItem(`menuCost${a}`,m)}function discountRequest(a){document.getElementById(`discountMenu${a}`).classList.toggle("d-none")}function calcDiscountCost(a){console.log("test");let b=JSON.parse(localStorage.getItem(`device${a}`)),c=document.getElementById(`discount${a}`).value,d=(b.cost-c).toFixed();0<=d?(document.getElementById(`cost${a}`).innerHTML=`${d}  EGP`,document.getElementById(`discountCost${a}`).innerHTML=`${c} EGP`,document.getElementById(`discountLayer${a}`).classList.remove("d-none"),document.getElementById(`totalDiscount${a}`).classList.remove("d-none"),setTimeout(()=>{document.getElementById(`discountLayer${a}`).classList.add("d-none"),document.getElementById(`discountMenu${a}`).classList.add("d-none"),document.getElementById(`discount${a}`).value=""},1500),b.cost=d,localStorage.setItem(`device${a}`,JSON.stringify(b))):alert(" \u0643\u062F\u0627 \u0647\u062A\u0628\u0642\u064A \u0645\u062F\u064A\u0648\u0646 \u0639 \u0641\u0643\u0631\u0647 , \u0641\u0643\u0631 \u062A\u0627\u0646\u064A \u064A\u0627\u0628\u0627")}function submit(a){document.getElementById(`totalDiscount${a}`).classList.add("d-none");let b=JSON.parse(localStorage.getItem(`device${a}`));document.getElementById(`discountMenu${a}`).classList.add("d-none"),updateDeviceTable(a,b),updateTotalCost(),document.getElementById(`cost${a}`).innerHTML=b.cost+" EGP";let c=document.getElementById(`layer${a}`);c.classList.remove("d-none"),setTimeout(()=>{c.classList.add("d-none")},1e3),document.querySelector(`#device${a} button[onclick^="submit"]`).disabled=!0,clearTimer(a),document.getElementById(`discountRequest${a}`).classList.add("d-none"),document.getElementById(`discount${a}`).value=""}function calculateCost(a,b){const c=b.elapsedTime/3600,d=parseFloat(document.getElementById(`rateSelector${a}`).value),e=15*parseInt(document.getElementById(`sodaS${a}`).value,10),f=20*parseInt(document.getElementById(`sodaL${a}`).value,10),g=10*parseInt(document.getElementById(`sokhn${a}`).value,10),h=15*parseInt(document.getElementById(`coffee${a}`).value,10),i=15*parseInt(document.getElementById(`cappuccino${a}`).value),j=25*parseInt(document.getElementById(`frenchCoffee${a}`).value),k=5*parseInt(document.getElementById(`netCard${a}`).value),l=10*parseInt(document.getElementById(`halfHourPS4${a}`).value),m=20*parseInt(document.getElementById(`hourPS4${a}`).value),n=15*parseInt(document.getElementById(`sandwich${a}`).value),o=3*parseInt(document.getElementById(`cleaning${a}`).value),p=(c*d+e+f+g+h+i+j+k+l+m+n+o).toFixed(2);document.getElementById(`cost${a}`).innerHTML=`${p} EGP`,b.cost=p,localStorage.setItem(`device${a}`,JSON.stringify(b))}function calculateDrinkCost(a){const b=parseFloat(document.getElementById(`drinkSelector${a}`).value),c=parseInt(document.getElementById(`drinkQuantity${a}`).value,10);return b*c}function resetDrinkQuantities(a){["sodaS","sodaL","sokhn","coffee","cappuccino","frenchCoffee","netCard","halfHourPS4","hourPS4","sandwich","cleaning"].forEach(b=>{document.getElementById(`${b}${a}`).value=0,localStorage.removeItem(`${b}${a}`),localStorage.removeItem(`menuCost${a}`)})}window.onload=init;