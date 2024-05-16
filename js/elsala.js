let nameInput = document.getElementById('nameInput');
let drinkInput = document.getElementById('drinkInput');
let priceInput = document.getElementById('priceInput');
let addBtn = document.getElementById("addBtn");
let updateBtn = document.getElementById("updateBtn");
let updateIndex = document.getElementById('editIndex');
let allCustomers = [];

if(localStorage.getItem('customers') != null){
    allCustomers = JSON.parse(localStorage.getItem('customers'))
    displayTable(allCustomers)
}
document.getElementById('addBtn').addEventListener('click',()=>{
    addCustomer();
})
function addCustomer(){
    if(validForm()==true){
        let customer = {
            name : nameInput.value,
            drink : drinkInput.value,
            price : priceInput.value,
        }
        console.log(allCustomers);
        allCustomers.push(customer);
        localStorage.setItem('customers',JSON.stringify(allCustomers));
        displayTable(allCustomers);
        clearForm();
    }
    else{
        console.log("false");
    }
}

function displayTable(arr){
    let cartoona=``;
    for(let i =0 ; i<allCustomers.length ; i++){
        cartoona+=`
        <tr>
                            <td>${allCustomers[i].name}</td>
                            <td>${allCustomers[i].price}</td>
                            <td>${allCustomers[i].drink}</td>
                            <td><button onclick="deleteCustomer(${i})" class="btn btn-danger">مسح</button></td>
                            <td><button onclick="updateCustomer(${i})" class="btn btn-warning">تعديل</button></td>
                        </tr>
        `
    }
    document.getElementById('tableBody').innerHTML = cartoona;
}

function clearForm(){
    nameInput.value =''
    priceInput.value =''
    drinkInput.value =''
}

function deleteCustomer(index){
    if(confirm("متأكد يا ابني؟")){
        allCustomers.splice(index,1)
        localStorage.setItem('customers',JSON.stringify(allCustomers));
        displayTable(allCustomers)
    }
    
}


function updateCustomer(index){
    addBtn.classList.replace('d-block','d-none')
    updateBtn.classList.replace('d-none','d-block')
    nameInput.value = allCustomers[index].name;
    priceInput.value = allCustomers[index].price;
    drinkInput.value = allCustomers[index].drink;

    updateIndex = index;
    console.log(updateIndex);
}

function updateNewInformation(){
    if(validForm()== true){
        let newUpdatedCustomer = {
            name : nameInput.value,
            price : priceInput.value,
            drink : drinkInput.value,
        }
        allCustomers[updateIndex].name = newUpdatedCustomer.name;
        allCustomers[updateIndex].price = newUpdatedCustomer.price;
        allCustomers[updateIndex].drink = newUpdatedCustomer.drink;
        localStorage.setItem("customers",JSON.stringify(allCustomers));
        displayTable(allCustomers);
    clearForm();
    
    addBtn.classList.replace('d-none','d-block')
    updateBtn.classList.replace('d-block','d-none')
    }
    
}
updateBtn.addEventListener('click',()=>{
    updateNewInformation()
})

nameInput.addEventListener('input',validForm);
drinkInput.addEventListener('input',validForm);
priceInput.addEventListener('input',validForm);
function validForm(){
    if(nameInput.value && priceInput.value && drinkInput.value != ''){
        addBtn.disabled = false;
        document.getElementById('errMsg').classList.replace('d-block','d-none')
        return true;
    }
    else{
        addBtn.disabled = true;
        document.getElementById('errMsg').classList.replace('d-none','d-block')
        return false;
    }
}