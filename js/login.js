let users = ['eldra3bayez@ps.com'];
let emailIput =  document.getElementById('Email');
let errMsg = document.getElementById('errMsg');


function login(){
    let emailExist = false;
    for(let i = 0 ; i < users.length ;i++) {
        if(users[i].includes(emailIput.value)){
            emailExist = true
        }
    }
    if(emailExist ==  true){
        localStorage.setItem('user', JSON.stringify(emailIput.value));
        window.location.href = './home.html'
        errMsg.innerHTML = ""
    }
    else{
        errMsg.innerHTML = "incorrect email , try again"
    }
}
function checkActive(){
    if(localStorage.getItem('user')){
        window.location.href = './home.html'
    }
}

window.onload = checkActive


