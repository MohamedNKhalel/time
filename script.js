let timers = {};

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
    }
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
    const cost = (elapsedTime * rate).toFixed(2);
    document.getElementById(`cost${deviceId}`).textContent = `${cost} EGP`;
    savedData.cost = cost;
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
        }
    }
}

window.onload = init;
