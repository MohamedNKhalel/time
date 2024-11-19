let nameInput = document.getElementById('nameInput');
let drinkInput = document.getElementById('drinkInput');
let priceInput = document.getElementById('priceInput');
let addBtn = document.getElementById("addBtn");
let updateBtn = document.getElementById("updateBtn");
let updateIndex = document.getElementById('editIndex');
let allCustomers = [];
let drinks =[
    'مشروب سخن',
    'شاي',
    ' قهوه تركي',
    'نسكافيه',
    'ساقع صغير',
    'ساقع كبير',
    'قهوه فرنساوي',
    'كابتشينو',
    
];

drinkInput.addEventListener("input",()=>{
    for(let i = 0 ; i<drinks.length ; i++){
        if(drinks[i].includes(drinkInput.value)){
            document.getElementById('drinkSuggest').classList.remove('d-none')
            document.getElementById('drinkSuggest').innerHTML = drinks[i]
            document.getElementById('drinkSuggest').addEventListener('click',(e)=>{
                drinkInput.value =e.target.innerHTML;
            })
        }
    }
})


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
                            <td><button onclick="deleteCustomer(${i})" class="delete-btn">مسح</button></td>
                            <td><button onclick="updateCustomer(${i})" class="update-btn">تعديل</button></td>
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
const text = 'Summary table'
const summaryTitle= document.getElementById('summaryTitle');
let index = 0;
function letterAnimate(){  
    if(index < text.length){
        summaryTitle.textContent += text.charAt(index);
        index++
        setTimeout(() => {
            letterAnimate()
        }, 100);
    }
    else{
        index = 0;
        setTimeout(()=>{
            summaryTitle.textContent = ''
            letterAnimate()
        },1000)
    }
}
letterAnimate()