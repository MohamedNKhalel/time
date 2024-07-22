let emailInput = document.getElementById('Email')

function email(){
    console.log(emailInput.value);
    if(emailInput.value === 'eldra3bayez@ps.com')
    {
        window.location.href = '../home.html'
        localStorage.setItem('email',emailInput.value)
        document.getElementById('errMsg').innerHTML = ''
    }
    else{
        console.log("error");
        document.getElementById('errMsg').innerHTML = 'Incorrect Email please try again'
    }
}
function init(){
    if(localStorage.getItem('email') == 'eldra3bayez@ps.com'){
        window.location.href = '../home.html'
    }
}
window.onload = init;