const display = document.getElementById("number-display"),
      decimal = document.getElementById("decimal"),
      CE = document.getElementById("CE"),
      C = document.getElementById("C"),
      operators = ["plus", "minus", "times", "divide", "equals"],
      opKeys = [107, 109, 106, 111, 13];

let current = [],
    part1, part2, sum,
    opPressed = [],
    opLast = false,
    numLast = false,
    firstRun = true,
    firstEquals = true;


for (let i = 0; i <= 9; i++) {
  // Add event listeners to number keys and operators
  (() => {
    document.getElementById(`no${i}`).addEventListener("click", (() => {
      numberPress(i);
    }));

    window.addEventListener("keyup", ((e) => {
      if(e.which === i + 48 || e.which === i + 96) {
        numberPress(i);
      }
    }));
  })();
  if (i < operators.length) {
    (() => {
      document.getElementById(operators[i]).addEventListener("click", (() => {
        operator(operators[i]);
      }));
      window.addEventListener("keyup", ((e) => {
        if(e.which === opKeys[i]) {
          operator(operators[i]);
        }
      }));
    })();
  }
}

function numberPress(number) {
  // If an operator was pressed last clear display before next number shown
  if (opLast) {
    while(display.firstChild){
      display.removeChild(display.firstChild);
    }
  }
  // If equals last pressed start fresh calculation
  if (opPressed[opPressed.length - 1] === "equals") {
    part2 = undefined;
    firstRun = true;
    firstEquals = true;
  }
  current.length < 12 ? display.innerHTML += number : display.innerHTML = "Digit Limit Met";
  opLast = false;
  numLast = true;
  current.push(number);
}


function operator(opName) {

  function calculateAndPrint(piece1, addThis) {
    // Find last operator pressed and add two calculation parts
    sum = operatorFunction[opPressedNoEq[opPressedNoEq.length - 1]](piece1, addThis);
    // Find out how long number to be printed is and either display or show digit limit
    String(sum).match(/\d/g).length <= 12 ? display.innerHTML = sum : display.innerHTML = "Digit Limit Met";
  }


  // Object containing each operator function
  var operatorFunction = {
    "plus" : function(a, b) { return a + b; },
    "minus" : function(a, b) { return a - b; },
    "times" : function(a, b) { return a * b; },
    "divide" : function(a, b) { return a / b; }
  };
  // Save copy of opPressed and filter out equals
  let opPressedNoEq = opPressed;
  opPressedNoEq = opPressedNoEq.filter(function(operator){ return operator !== "equals"; });

  // Add the operator pressed name to opPressed array
  opPressed.push(opName);

  // Once first operator is pressed take user input number and assign to part1
  if (firstRun && current.length > 0) {
    part1 = Number(current.join(""));
    firstRun = false;
  }
  else if (opName === "equals") {
    if(firstEquals) {
       // If part2 is undefined assign it current array them add it to
       // part1 (previously stored current array). Store result to sum and print to display
      if(part2 === undefined) {
        part2 = Number(current.join(""));
        calculateAndPrint(part1, part2);  // a + b =
      }
      else {
        // If part2 has previously been assigned current array update it with latest
        // and add to previous sum. Store the result to sum for next calculation
        part2 = Number(current.join(""));
        calculateAndPrint(sum, part2); // a + b + c =
      }
      firstEquals = false;
    }
    else { // If it's not first time equals has been pressed
      part1 = sum;
      if (current.length === 0) {
        // If user pressing equals again without adding more numbers keep making same calculation adding to prev sum
        calculateAndPrint(part1, part2); // a + b = =
        part1 = sum;
      } else {
        // If user has added more numbers assign those to part2 and add to previous sum amount
        part2 = Number(current.join(""));
        calculateAndPrint(sum, part2); // a + b = + c =
      }
    }
  }
  else if (part2 === undefined && current.length > 0){
    // If making a calculation and pressed another operator instead of = display each calculation result
    part2 = Number(current.join(""));
    sum = operatorFunction[opPressed[opPressed.length - 2]](part1, part2); // a + b +
    String(sum).length <= 12 ? display.innerHTML = sum : display.innerHTML = "Digit Limit Met";
  }
  else if (part2 !== undefined && current.length > 0) {
    // If making continuous calculations without hitting = store previous if statements sum
    // and add to new current user input then keep repeating until = pressed
    part1 = sum;
    part2 = Number(current.join(""));
    calculateAndPrint(part1, part2); // a + b + c +
  }
  current = [];
  numLast = false;
  opLast = true;
}

function clearCE(){
  // When CE pressed revert calculator to the beginning state
  current = [];
  part1 = undefined;
  part2 = undefined;
  sum = 0;
  display.innerHTML = "";
  firstRun = true;
}

function clearC(){
  // When C is pressed remove data from current array and clear display
  current = [];
  display.innerHTML = "";
}

function decimalEvent(){
  // If a decimal point is already used stop from being able to add another
  if (current.indexOf('.') === -1) {
    numberPress('.');
  }
}

decimal.addEventListener("click", decimalEvent);
window.addEventListener("keyup", ((e) => {
  if(e.which === 110) {
    decimalEvent();
  }
}));


CE.addEventListener("click", clearCE);
C.addEventListener("click", clearC);

window.addEventListener("keyup", ((e) => {
  if(e.which === 27) {
    clearCE();
  }
}));
