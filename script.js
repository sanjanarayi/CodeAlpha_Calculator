const display = document.getElementById("display");
const historyList = document.getElementById("history-list");
const themeToggle = document.getElementById("theme-toggle");
const angleModeBtn = document.getElementById("angle-mode");

let isDegreeMode = true;

/* =========================
   BASIC INPUT FUNCTIONS
========================= */

function appendValue(value){
    display.value += value;
}

function appendFunction(func){
    display.value += func;
}

function appendConstant(constant){

    if(constant === "PI"){
        display.value += "PI";
    }

    if(constant === "E"){
        display.value += "E";
    }

}

function clearDisplay(){
    display.value = "";
}

function deleteLast(){
    display.value = display.value.slice(0,-1);
}

function squareCurrent(){

    if(display.value !== ""){
        display.value += "^2";
    }

}

function appendFactorial(){
    display.value += "!";
}

/* =========================
   DEG / RAD
========================= */

function toggleMode(){

    isDegreeMode = !isDegreeMode;

    angleModeBtn.textContent =
        isDegreeMode ? "DEG" : "RAD";

}

/* =========================
   FACTORIAL
========================= */

function factorial(n){

    if(n < 0) return NaN;

    if(n === 0 || n === 1){
        return 1;
    }

    let result = 1;

    for(let i = 2; i <= n; i++){
        result *= i;
    }

    return result;
}

/* =========================
   PROCESS EXPRESSION
========================= */

function processExpression(expression){

    expression = expression.replace(/PI/g, Math.PI);
    expression = expression.replace(/E/g, Math.E);

    expression = expression.replace(
        /sqrt\(([^)]+)\)/g,
        "Math.sqrt($1)"
    );

    expression = expression.replace(
        /log\(([^)]+)\)/g,
        "Math.log10($1)"
    );

    expression = expression.replace(
        /ln\(([^)]+)\)/g,
        "Math.log($1)"
    );

    expression = expression.replace(
        /(\d+)!/g,
        (_, num) => factorial(Number(num))
    );

    expression = expression.replace(
        /(\d+)\^(\d+)/g,
        "Math.pow($1,$2)"
    );

    expression = expression.replace(
        /sin\(([^)]+)\)/g,
        (_, value) => {

            let num = Number(value);

            if(isDegreeMode){
                num = num * Math.PI / 180;
            }

            return Math.sin(num);

        }
    );

    expression = expression.replace(
        /cos\(([^)]+)\)/g,
        (_, value) => {

            let num = Number(value);

            if(isDegreeMode){
                num = num * Math.PI / 180;
            }

            return Math.cos(num);

        }
    );

    expression = expression.replace(
        /tan\(([^)]+)\)/g,
        (_, value) => {

            let num = Number(value);

            if(isDegreeMode){
                num = num * Math.PI / 180;
            }

            return Math.tan(num);

        }
    );

    expression = expression.replace(
        /%/g,
        "/100"
    );

    return expression;
}

/* =========================
   CALCULATE
========================= */

function calculate(){

    try{

        let expression =
            processExpression(display.value);

        let result = eval(expression);

        addHistory(
            display.value,
            result
        );

        display.value = result;

    }
    catch{

        display.value = "Error";

    }

}

/* =========================
   HISTORY
========================= */

function addHistory(expression,result){

    const li = document.createElement("li");

    li.textContent =
        `${expression} = ${result}`;

    historyList.prepend(li);

}

/* =========================
   COPY RESULT
========================= */

function copyResult(){

    navigator.clipboard.writeText(
        display.value
    );

    alert("Result Copied!");

}

/* =========================
   THEME TOGGLE
========================= */

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("light");

        if(document.body.classList.contains("light")){

            themeToggle.textContent = "☀️";

        }
        else{

            themeToggle.textContent = "🌙";

        }

    }
);

/* =========================
   KEYBOARD SUPPORT
========================= */

document.addEventListener(
    "keydown",
    function(event){

        const key = event.key;

        if(
            "0123456789+-*/().".includes(key)
        ){
            display.value += key;
        }

        if(key === "Enter"){
            event.preventDefault();
            calculate();
        }

        if(key === "Backspace"){
            deleteLast();
        }

        if(key === "Escape"){
            clearDisplay();
        }

        if(key === "%"){
            display.value += "%";
        }

    }
);

/* =========================
   LOAD
========================= */

clearDisplay();