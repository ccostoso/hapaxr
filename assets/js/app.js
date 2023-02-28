const submitBtnFile = document.getElementById("submit-btn-file");
const submitBtnTextarea = document.getElementById("submit-btn-textarea");
const submitBtns = document.getElementsByClassName("submit-btn");
const textareaInput = document.getElementById("textarea-input");
const fileInput = document.getElementById("file-input");
const results = document.getElementById("results");

const frequencyInput = document.getElementById("frequency-input");
const frequencyDisplay = document.getElementById("frequency-display");

let frequency = 1;
let textFromFile = "";

const renderFrequency = () => {
    const frequencyWords = ["once", "twice", "three", "four", "five", "six", "seven", "eight", "nine"];
    let frequencyDescription = frequency > 9 ? `${frequency} times` : frequencyWords[frequency - 1];
    if (frequency > 2 && frequency < 10) frequencyDescription += " times";
    frequencyDisplay.innerHTML = `${frequencyDescription}`;
}

const renderResults = (arr) => {
    results.innerHTML = '';

    for (word of arr) {
        const resultCard = document.createElement("article");
        resultCard.classList.add("col", "s2");
        resultCard.innerHTML = `<div class="card horizontal">
            <div class="card-stacked">
            <div class="card-content">
                <p>${word}</p>
            </div>
            </div>
        </div>`;

        results.append(resultCard);
    }
}

const analyzeText = (textArr, frequency) => {
    const counter = {};

    for (let word of textArr) {
        if (!word) continue;

        word = formatWord(word)

        if (!counter[word]) {
            counter[word] = 1;
        } else {
            counter[word]++;
        }

    }

    console.log(counter);

    const allWords = Object.keys(counter);
    const selectedWords = [];

    for (let word of allWords) {
        if (counter[word] === frequency) {
            console.log(counter[word]);
            selectedWords.push(word)
        }
    }

    return selectedWords;
}

// Do not count possessive forms of words separately
const formatWord = word => {
    word = word.toLowerCase();

    if (word.length > 2) {
        if (word.slice(-2).match(/[\\'\\’\\`][s]/g)) {
            word = word.slice(0, -2);
            // console.log(word);
        } else if (word.slice(-2).match(/[s][\\'\\’\\`]/g)) {
            word = word.slice(0, -1);
            // console.log(word);
        }
    }

    return word;
}

const resetLastSelected = () => {
    lastSelected = 0;
}

const changeFrequencyCount = e => {
    e.preventDefault();

    frequency = parseInt(frequencyInput.value);

    if (frequency < 0) frequency *= -1;
    if (!frequency) frequency = 1;

    console.log(`Frequency: ${frequency}`);
    renderFrequency();
}

frequencyInput.addEventListener('change', changeFrequencyCount);

frequencyInput.addEventListener('keydown', e => {
    if (e.key == 'Enter') {
        e.preventDefault();
    }
})

const readFileAsync = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsText(file);
    })
}

const renderText = async e => {
    e.preventDefault();

    let text = e.target.dataset.button === "file" ? await readFileAsync(fileInput.files[0]) : textareaInput.value;

    text = text.replace(/[^0-9a-zA-Z\u00C0-\u017F_\\-\\-\\.\\'\\’\\`]/g, ' ');
    text = text.replace(/[\.]/g, '');
    text = text.replace(/\-\-/g, ' ');
    const textArr = text.split(' ');

    console.log(textArr);

    const selectedWords = analyzeText(textArr, frequency);

    selectedWords.sort();

    renderResults(selectedWords);
}

for (let button of submitBtns) {
    button.addEventListener('click', renderText);
}

renderFrequency();