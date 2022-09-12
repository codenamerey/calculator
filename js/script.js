function add(num1, num2) {
    return parseFloat(num1) + parseFloat(num2);
}

function divide(num1, num2) {
    return parseFloat(num1) / parseFloat(num2);
}

function multiply(num1, num2) {
    return parseFloat(num1) * parseFloat(num2);
}

function subtract(num1, num2) {
    return parseFloat(num1) - parseFloat(num2);
}

function operate(num1, num2, operator) {
    switch (operator) {
        case "+":
            return add(num1, num2);
            break;

        case "-":
            return subtract(num1, num2);
            break;

        case "/":
            return divide(num1, num2);
            break;

        case "*":
            return multiply(num1, num2);
            break;
    }
}

let firstNum = '';
let secondNum = '';
let operator = '';
let value = [];
let input = document.querySelector('.display > .input');
let upperDisplay = document.querySelector('.upper-display');
let buttons = document.querySelectorAll('.buttons > div');
buttons.forEach(button => {
    button.addEventListener('click', displayContent);
});

function displayContent(e) {
    if(e.target.classList.contains('numeral')) {
        value.push(e.target.textContent);
        input.textContent = value.join('');
    }

    if((e.target.classList.contains('operator'))) {
        if(firstNum) {
            operator = e.target.textContent;
            if(upperDisplay.textContent.includes(operator)) return;
            upperDisplay.textContent += operator;
            return;
        }
        //check if there is input
        if(!input.textContent) return;
        //if there is, save that value
        firstNum = value.join('');
        value.push(e.target.textContent);
        input.textContent = '';
        upperDisplay.textContent = value.join('');
        value = [];
        operator = e.target.textContent;
    }

    if(e.target.id == 'equal') {
        secondNum = input.textContent;
        //if there's nothing to divide, cancel
        if(!firstNum || !secondNum) return;
        //if there's no second number, return
        if(!input.textContent) return;
        value = [];
        upperDisplay.textContent = operate(firstNum, secondNum, operator);
        input.textContent = '';
        firstNum = operate(firstNum, secondNum, operator);
        operator = '';
    }
}