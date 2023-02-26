const submitBtnTwo = document.getElementById("submit-btn-two");
const textInput = document.getElementById("textarea-input");
const results = document.getElementById("results");
const frequencyInput = document.getElementById("frequency-input");
const frequencyDisplay = document.getElementById("frequency-display");

let frequency = 1;

const renderFrequency = () => {
    const timeOrTimes = frequency === 1 ? 'time' : 'times';
    frequencyDisplay.innerHTML = `${frequency} ${timeOrTimes}`;
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
            console.log(word);
        } else if (word.slice(-2).match(/[s][\\'\\’\\`]/g)) {
            word = word.slice(0, -1);
            console.log(word);
        }
    }

    return word;
}

frequencyInput.addEventListener('change', e => {
    e.preventDefault();

    frequency = parseInt(frequencyInput.value);

    if (frequency < 0) frequency *= -1;
    if (!frequency) frequency = 1;

    renderFrequency();
})

frequencyInput.addEventListener('keydown', e => {
    if (e.key == 'Enter') {
        e.preventDefault();
    }
})

const renderText = e => {
    e.preventDefault();
    let text = textInput.value;
    text = text.replace(/[^0-9a-zA-Z_\\-\\-\\.\\'\\’\\`]/g, ' ');
    text = text.replace(/[\.]/g, '');
    const textArr = text.split(' ');
    
    const selectedWords = analyzeText(textArr, frequency);
    
    selectedWords.sort();
    
    renderResults(selectedWords);
}

submitBtnTwo.addEventListener('click', renderText);

renderFrequency();