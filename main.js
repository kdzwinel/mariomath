// Timer functionality
let timer;
let totalTime = 10;
let points = 0; // Initialize points
let currentEquation; // Variable to hold the current equation
const history = [];

function startTimer() {
    totalTime = parseInt(document.getElementById('game-time').value, 10) * 60;
    timer = setInterval(() => {
        if (totalTime <= 0) {
            clearInterval(timer);
            onEnd();

            return;
        }
        totalTime--;
        const minutes = Math.floor(totalTime / 60);
        const secs = totalTime % 60;
        document.getElementById('timer').innerText = `Time: ${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, 1000);
}

// Function to generate a new equation
function generateEquation() {
    const [eqType,eqMin,eqMax] = document.getElementById('game-type').value.split('-');
    const min = parseInt(eqMin, 10);
    const max = parseInt(eqMax, 10);

    const num1 = Math.floor(Math.random() * (max-min+1)) + min;
    const num2 = Math.floor(Math.random() * (max-min+1)) + min;

    currentEquation = { num1, num2}; // Store the equation and answer
    let sign = '';

    if(eqType === 'add') {
        currentEquation.answer = num1 + num2;
        sign = '+';
    } else if (eqType === 'sub') {
        currentEquation.answer = num1 - num2;
        sign = '−';
    } else if (eqType === 'multi') {
        currentEquation.answer = num1 * num2;
        sign = '×';
    }

    document.getElementById('input-click').style.display = 'none';
    document.getElementById('input-write').style.display = 'none';

    if (Math.random() < 0.5) {
        document.getElementById('input-click').style.display = 'block';

        const buttonValuesSet = new Set();
        buttonValuesSet.add(currentEquation.answer);
        while (buttonValuesSet.size < 4) { // generate unique incorrect answers
            buttonValuesSet.add(currentEquation.answer + Math.floor(Math.random() * eqMax) - Math.floor(eqMax/2));
        }
        const buttonValues = Array.from(buttonValuesSet).sort(() => Math.random() - 0.5); // randomize order

        document.getElementById('input-click').querySelectorAll('button').forEach((button, i) => {
            button.innerText = buttonValues[i];
            button.value = buttonValues[i];
        });
    } else {
        document.getElementById('input-write').style.display = 'block';
    }

    document.getElementById('equation').innerText = `${num1} ${sign} ${num2} = ?`; // Display the equation
}

function onStart() {
    document.getElementById('menu').style.display = 'none';
    
    startTimer();
    generateEquation(); // Generate the first equation
    document.getElementById('startSound').play();

    document.getElementById('game').style.display = 'block';
    document.getElementById('result').focus(); // Refocus on the input field
}

function onEnd() {
    document.getElementById('endSound').play();
    document.getElementById('equation').style.display = 'none';
    document.getElementById('input-click').style.display = 'none';
    document.getElementById('input-write').style.display = 'none';
    document.getElementById('points').classList.add('win');

    const historyList = document.getElementById('history');

    history.forEach(item => {
        const itemLi = document.createElement('li');
        itemLi.innerText = item.equation.replace('?', item.answer).trim();
        if(item.correct) {
            itemLi.classList.add('history-correct');
        }
        historyList.appendChild(itemLi);
    });
}

document.getElementById('start').addEventListener('click', () => {
    onStart();
});

// Function to flash the background color
function flashBackground(color) {
    document.body.style.backgroundColor = color; // Set the background color
    setTimeout(() => {
        document.body.style.backgroundColor = ''; // Reset the background color after 0.5 seconds
    }, 300);
}

function animation(name) {
    const div = document.createElement('div');
    div.classList.add('animation');
    div.classList.add(name);
    document.body.appendChild(div);

    // Start the animation after a short delay
    setTimeout(() => {
        div.style.top = '-100px'; // Move to the bottom of the viewport
        div.style.opacity = '0'; // Fade out
    }, 100); // Delay before starting the animation
    setTimeout(() => {
        document.body.removeChild(div);
    }, 500);
}

function handleSubmit(raw) {
    const userAnswer = parseInt(raw, 10);

    if (isNaN(userAnswer)) {
        return;
    }

    history.push({
        equation: document.getElementById('equation').innerText,
        answer: userAnswer,
        correct: (userAnswer === currentEquation.answer)
    });

    if (userAnswer === currentEquation.answer) {
        points++; // Increment points for correct answer
        document.getElementById('correctSound').play(); // Play correct sound
        generateEquation(); // Generate a new equation
        flashBackground('yellow');
        animation('coin');
    } else {
        document.getElementById('incorrectSound').play(); // Play incorrect sound
        flashBackground('brown');
        animation('incorrect');
    }

    document.getElementById('points').innerText = `Points: ${points}`; // Update points display
    document.getElementById('result').value = ''; // Clear the input after submission
    document.getElementById('result').focus(); // Refocus on the input field
}

// Submit button functionality
document.getElementById('submit').onclick = () => { handleSubmit(document.getElementById('result').value) };

// Allow Enter key to submit
document.getElementById('result').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleSubmit(document.getElementById('result').value);
    }
});

document.getElementById('input-click').querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => { handleSubmit(button.value) });
}); 