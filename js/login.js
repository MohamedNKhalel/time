let emailInput=document.getElementById("Email");function email(){console.log(emailInput.value),"eldra3bayez@ps.com"===emailInput.value?(window.location.href="home.html",localStorage.setItem("email",emailInput.value),document.getElementById("errMsg").innerHTML=""):(console.log("error"),document.getElementById("errMsg").innerHTML="Incorrect Email please try again")}function init(){"eldra3bayez@ps.com"==localStorage.getItem("email")&&(window.location.href="home.html")}window.onload=init;
