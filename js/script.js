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
let memoryIndicator = document.querySelector(".memory-indicator");
let systemIndicator = document.querySelector(".system-indicator");

// Update indicators on page load
updateMemoryIndicator();
updateSystemIndicator();

// Function to update memory indicator visibility
function updateMemoryIndicator() {
  if (memory !== 0) {
    memoryIndicator.classList.add("active");
  } else {
    memoryIndicator.classList.remove("active");
  }
}

// Function to update number system indicator
function updateSystemIndicator() {
  switch (currentNumberSystem) {
    case "decimal":
      systemIndicator.textContent = "DEC";
      break;
    case "binary":
      systemIndicator.textContent = "BIN";
      break;
    case "hexadecimal":
      systemIndicator.textContent = "HEX";
      break;
    case "octal":
      systemIndicator.textContent = "OCT";
      break;
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", handleClick);
});

newButtons.forEach((button) => {
  button.addEventListener("click", handleClick);
});

function handleClick(e) {
  // If the click is on the paragraph, use its parent (the button div)
  const targetElement =
    e.target.tagName === "P" ? e.target.parentElement : e.target;

  // Create a new event with the correct target
  const syntheticEvent = {
    target: targetElement,
    currentTarget: e.currentTarget,
  };

  // Call the display content function with our synthetic event
  displayContent(syntheticEvent);
}

function displayContent(e) {
  if (e.target.classList.contains("numeral") || e.target.id == "dot") {
    if (firstNum && !operator) return;
    if (input.textContent.length > 12) return;

    // Prevent adding multiple decimal points
    if (e.target.id == "dot" && value.includes(".")) return;

    value.push(e.target.textContent);
    input.textContent = value.join("");
  }

  if (e.target.id == "negate") {
    // Handle the negation - prioritize input field, but affect result if input is empty
    if (input.textContent) {
      // Toggle the sign of the current input
      const currentValue = parseFloat(input.textContent);
      const negatedValue = -currentValue;

      // Update the input display and value array
      input.textContent = negatedValue.toString();
      value = negatedValue.toString().split("");
    } else if (upperDisplay.textContent) {
      // If there's no input but there is a result in the upper display, negate that result
      const currentValue = parseFloat(upperDisplay.textContent);
      const negatedValue = -currentValue;

      upperDisplay.textContent = negatedValue.toString();
      firstNum = negatedValue.toString();
    }
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

    // Update the system indicator
    updateSystemIndicator();
  }

  if (e.target.classList.contains("memory")) {
    const memoryAction = e.target.id;
    
    // Check if there's an ongoing operation
    const isOngoingOperation = firstNum && operator && !secondNum;
    
    // For memory add and minus operations, check if there's an ongoing operation
    if ((memoryAction === "add" || memoryAction === "minus") && isOngoingOperation) {
      // Display ERROR message
      upperDisplay.textContent = "ERROR";
      input.textContent = "";
      
      // Clear everything
      value = [];
      firstNum = "";
      secondNum = "";
      operator = "";
      
      // Update the indicators
      updateSystemIndicator();
      return;
    }

    // Determine which value to use
    let valueToUse = null;

    // First check if there's a value in the input field
    if (input.textContent) {
      valueToUse = parseFloat(input.textContent);
    }
    // Otherwise, check for a value in the upper display
    else if (upperDisplay.textContent) {
      // If there's an operator in the display, only use the number part
      if (
        upperDisplay.textContent.includes("+") ||
        upperDisplay.textContent.includes("-") ||
        upperDisplay.textContent.includes("*") ||
        upperDisplay.textContent.includes("/")
      ) {
        // Get the value before the operator
        const match = upperDisplay.textContent.match(/^(-?\d+(\.\d+)?)/);
        if (match) {
          valueToUse = parseFloat(match[0]);
        }
      } else {
        // No operator, use the full value
        valueToUse = parseFloat(upperDisplay.textContent);
      }
    }

    console.log("Memory before:", memory);
    console.log("Value to use:", valueToUse);

    if (memoryAction === "recall") {
      // Set input to memory value
      input.textContent = memory;
      value = memory.toString().split("");
    } else if (memoryAction === "add") {
      // Add to memory
      if (valueToUse !== null) {
        memory += valueToUse;
        console.log("Memory after add:", memory);
        // Show the new memory value in the input field
        input.textContent = memory;
        value = memory.toString().split("");
      }
    } else if (memoryAction === "minus") {
      // Subtract from memory
      if (valueToUse !== null) {
        memory -= valueToUse;
        console.log("Memory after subtract:", memory);
        // Show the new memory value in the input field
        input.textContent = memory;
        value = memory.toString().split("");
      }
    } else if (memoryAction === "delete") {
      // Clear memory
      memory = 0;
      // Clear the input if it's showing a memory value
      if (input.textContent) {
        input.textContent = "";
        value = [];
      }
    }

    // Update the memory indicator
    updateMemoryIndicator();
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
    currentNumberSystem = "decimal";
    upperDisplay.textContent = "";
    input.textContent = "";

    // Update both indicators
    updateSystemIndicator();
    // Note: We don't reset memory on clear, only update system
  }
}
