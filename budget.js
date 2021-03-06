/* www.youtube.com/CodeExplained */

// SELECT ELEMENTS
const balanceEl = document.querySelector(".balance .value");
const incomeTotalEl = document.querySelector(".income-total");
const outcomeTotalEl = document.querySelector(".outcome-total");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const exchangeEl = document.querySelector("#exchange");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const allList = document.querySelector("#all .list");

// SELECT BTNS
const exchangeBtn = document.querySelector(".tab4");
const expenseBtn = document.querySelector(".tab1");
const incomeBtn = document.querySelector(".tab2");
const allBtn = document.querySelector(".tab3");

/// INPUT BTS
const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title-input");
const expenseAmount = document.getElementById("expense-amount-input");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");

// VARIABLES
let ENTRY_LIST;
let balance = 0, income = 0, outcome = 0;
const DELETE = "delete", EDIT = "edit";

// LOOK IF THERE IS SAVED DATA IN THE LOCALSTORAGE
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();

// EVENT LISTENERS
window.addEventListener('load', (event) => {
    show(exchangeEl);
    hide( [expenseEl, incomeEl, allEl] );
    active( exchangeBtn );
    inactive( [expenseBtn, incomeBtn, allBtn] );
});

exchangeBtn.addEventListener("click", function(){
    show(exchangeEl);
    hide( [expenseEl, incomeEl, allEl] );
    active( exchangeBtn );
    inactive( [expenseBtn, incomeBtn, allBtn] );
})

expenseBtn.addEventListener("click", function(){
    show(expenseEl);
    hide( [exchangeEl,incomeEl, allEl] );
    active( expenseBtn );
    inactive( [exchangeBtn, incomeBtn, allBtn] );
})

incomeBtn.addEventListener("click", function(){
    show(incomeEl);
    hide( [exchangeEl, expenseEl, allEl] );
    active( incomeBtn );
    inactive( [exchangeBtn, expenseBtn, allBtn] );
})

allBtn.addEventListener("click", function(){
    show(allEl);
    hide( [exchangeEl, incomeEl, expenseEl] );
    active( allBtn );
    inactive( [exchangeBtn, incomeBtn, expenseBtn] );
})

// ADD EXPENSE
addExpense.addEventListener("click", function(){
    // console.log("add clicked");
    // IF ONE OF THE INPUTS IS EMPTY => EXIT
    if(!expenseTitle.value || !expenseAmount.value ) return;

    // SAVE THE ENTRY TO ENTRY_LIST
    let expense = {
        type : "expense",
        title : expenseTitle.value,
        amount : parseFloat(expenseAmount.value)
    }
    ENTRY_LIST.push(expense);

    updateUI();
    clearInput( [expenseTitle,expenseAmount] );
})

// ADD INCOME
addIncome.addEventListener("click", function(){
    // IF ONE OF THE INPUTS IS EMPTY => EXIT
    if(!incomeTitle.value || !incomeAmount.value ) return;

    // SAVE THE ENTRY TO ENTRY_LIST
    let income = {
        type : "income",
        title : incomeTitle.value,
        amount : parseFloat(incomeAmount.value)
    }
    ENTRY_LIST.push(income);

    updateUI();
    clearInput( [incomeTitle,incomeAmount] );
})

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

// HELPERS
function deleteOrEdit(event){
    const targetBtn = event.target;

    const entry = targetBtn.parentNode;

    if( targetBtn.id == DELETE){
        deleteEntry(entry);
    }else if(targetBtn.id == EDIT){
        editEntry(entry);
    }
}

function deleteEntry(entry){
    ENTRY_LIST.splice(entry.id, 1);

    updateUI();
}

function editEntry(entry){
    let ENTRY = ENTRY_LIST[entry.id];

    if(ENTRY.type == "income"){
        incomeAmount.value = ENTRY.amount;
        incomeTitle.value = ENTRY.title;
    }else if(ENTRY.type == "expense"){
        expenseAmount.value = ENTRY.amount;
        expenseTitle.value = ENTRY.title;
    }

    deleteEntry(entry);
}

function updateUI(){
    income = calculateTotal("income", ENTRY_LIST);
    outcome = calculateTotal("expense", ENTRY_LIST);
    balance = Math.abs(calculateBalance(income, outcome));

    // DETERMINE SIGN OF THE BALANCE
    let sign = (income >= outcome) ? "$" : "-$";

    // UPDATE UI
    balanceEl.innerHTML = `<small>${sign}</small>${balance}`;
    outcomeTotalEl.innerHTML = `<small>$</small>${outcome}`;
    incomeTotalEl.innerHTML = `<small>$</small>${income}`;

    clearElement( [expenseList, incomeList, allList ]);

    ENTRY_LIST.forEach( (entry, index) => {
        if( entry.type == "expense"){
            showEntry(expenseList, entry.type, entry.title, entry.amount, index)
        }else if( entry.type == "income"){
            showEntry(incomeList, entry.type, entry.title, entry.amount, index)
        }
        showEntry(allList, entry.type, entry.title, entry.amount, index)
    });

    updateChart(income, outcome);

    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type, title, amount, id){
    const entry = `<li id="${id}" class="${type}">
                        <div class="entry">${title}: $${amount}</div>
                        <div id="edit"></div>
                        <div id="delete"></div>
                    </li>`;

    const position = "afterbegin";

    list.insertAdjacentHTML(position, entry);
}

function clearElement(elements){
    elements.forEach( element => {
        element.innerHTML = "";
    })
}

function calculateTotal(type, list){
    let sum = 0;

    list.forEach( entry => {
        if(entry.type == type ){
            sum += entry.amount;
        }
    })

    return sum;
}

function calculateBalance(income, outcome){
    return income - outcome;
}

function clearInput(inputs){
    inputs.forEach(input => {
        input.value = "";
    })
}

function show(element){
    element.classList.remove("hide");
}

function hide( elements){
    elements.forEach(element => {
        element.classList.add("hide");
    })
}

function active(element){
    element.classList.add("active");
}

function inactive( elements){
    elements.forEach(element => {
        element.classList.remove("active");
    })
}

// Exchange
// const from_currencyEl = document.getElementById('from_currency');
// const from_ammountEl = document.getElementById('from_ammount');
// const to_currencyEl = document.getElementById('to_currency');
// const to_ammountEl = document.getElementById('to_ammount');
// const rateEl = document.getElementById('rate');
// const exchange = document.getElementById('exchange');
 
// from_currencyEl.addEventListener('change', calculate);
// from_ammountEl.addEventListener('input', calculate);
// to_currencyEl.addEventListener('change', calculate);
// to_ammountEl.addEventListener('input', calculate);
 
// exchange.addEventListener('click', () => {
// 	const temp = from_currencyEl.value;
// 	from_currencyEl.value = to_currencyEl.value;
// 	to_currencyEl.value = temp;
// 	calculate();
// });
 
// function calculate() {
// 	const from_currency = from_currencyEl.value;
// 	const to_currency = to_currencyEl.value;
	
// 	fetch(`https://api.exchangerate-api.com/v4/latest/${from_currency}`)
// 		.then(res => res.json())
// 		.then(res => {
// 		const rate = res.rates[to_currency];
// 		rateEl.innerText = `1 ${from_currency} = ${rate} ${to_currency}`
// 		to_ammountEl.value = (from_ammountEl.value * rate).toFixed(2);
// 	})
// }
 
// calculate();