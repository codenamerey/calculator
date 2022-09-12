function add(num1, num2) {
    return num1 + num2;
}

function divide(num1, num2) {
    return num1 / num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function operate(num1, num2, operator) {
    switch (operator) {
        case "+":
            add(num1, num2);
            break;

        case "-":
            subtract(num1, num2);
            break;

        case "/":
            divide(num1, num2);
            break;

        case "*":
            multiply(num1, num2);
            break;
    }
}

let value = [];
let input = document.querySelector('.display > .input')
let buttons = document.querySelectorAll('.buttons > div');
console.log(buttons);
buttons.forEach(button => {
    button.addEventListener('click', displayContent);
});

function displayContent(e) {
    if(!(e.target.classList.contains('numeral'))) return;
    value.push(e.target.textContent);
    input.textContent = value.join('');
}