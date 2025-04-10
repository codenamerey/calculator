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

function convertToDecimal(number, numberSystem) {
  if (numberSystem === "binary") {
    return parseInt(number, 2);
  } else if (numberSystem === "octal") {
    return parseInt(number, 8);
  } else if (numberSystem === "hexadecimal") {
    return parseInt(number, 16);
  } else {
    return parseFloat(number);
  }
}

function convertFromDecimal(number, numberSystem) {
  if (numberSystem === "binary") {
    return number.toString(2);
  } else if (numberSystem === "octal") {
    return number.toString(8);
  } else if (numberSystem === "hexadecimal") {
    return number.toString(16);
  } else {
    return number.toString();
  }
}

function convertNumber(number, fromNumberSystem, toNumberSystem) {
  const decimalNumber = convertToDecimal(number, fromNumberSystem);
  return convertFromDecimal(decimalNumber, toNumberSystem);
}

let firstNum = "";
let secondNum = "";
let operator = "";
let value = [];
let currentNumberSystem = "decimal";
let memory = 0;

let input = document.querySelector(".display > .input");
let upperDisplay = document.querySelector(".upper-display");
let buttons = document.querySelectorAll(".buttons > div");
let newButtons = document.querySelectorAll(".new-buttons > div");

buttons.forEach((button) => {
  button.addEventListener("click", displayContent);
});

newButtons.forEach((button) => {
  button.addEventListener("click", displayContent);
});

function displayContent(e) {
  if (e.target.classList.contains("numeral") || e.target.id == "dot") {
    if (firstNum && !operator) return;
    if (input.textContent.length > 12) return;
    value.push(e.target.textContent);
    input.textContent = value.join("");
  }

  if (e.target.classList.contains("operator")) {
    if (firstNum) {
      operator = e.target.textContent;
      if (upperDisplay.textContent.includes(operator)) return;
      if (upperDisplay.textContent.search(/[+\/*-]/g) !== -1) {
        upperDisplay.textContent = upperDisplay.textContent.replace(
          /[+\/*-]/g,
          operator
        );
        return;
      }
      upperDisplay.textContent += operator;
      return;
    }
    //check if there is input
    if (!input.textContent) return;
    //if there is, save that value
    firstNum = value.join("");
    value.push(e.target.textContent);
    input.textContent = "";
    upperDisplay.textContent = value.join("");
    value = [];
    operator = e.target.textContent;
  }

  if (e.target.classList.contains("conversion")) {
    const conversionType = e.target.id;
    const toConvert = input.textContent || upperDisplay.textContent;
    console.log("to convert:", toConvert);
    console.log("number system now:", currentNumberSystem);
    console.log("conversion type", conversionType);

    const convertedNumber = convertNumber(
      toConvert,
      currentNumberSystem,
      conversionType
    );
    currentNumberSystem = conversionType;
    upperDisplay.textContent = convertedNumber;
    input.textContent = "";
    currentNumberSystem = conversionType;
  }

  if (e.target.classList.contains("memory")) {
    const memoryAction = e.target.id;
    if (memoryAction === "recall") {
      input.textContent = memory;
    } else if (memoryAction === "add") {
      memory += parseFloat(input.textContent);
      input.textContent = memory;
    } else if (memoryAction === "minus") {
      memory -= parseFloat(input.textContent);
      input.textContent = memory;
    } else if (memoryAction === "delete") {
      memory = 0;
    }
  }

  if (e.target.id == "equal") {
    secondNum = input.textContent;
    //if there's nothing to divide, cancel
    if (!firstNum || !secondNum) return;
    //if there's no second number, return
    if (!input.textContent) return;
    value = [];
    upperDisplay.textContent = operate(firstNum, secondNum, operator);
    input.textContent = "";
    firstNum = operate(firstNum, secondNum, operator);
    operator = "";
  }

  if (e.target.id == "clear") {
    value = [];
    firstNum = "";
    secondNum = "";
    numberSystem = "decimal";
    upperDisplay.textContent = "";
    input.textContent = "";
  }
}
