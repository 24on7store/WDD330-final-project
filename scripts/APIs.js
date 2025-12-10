
const searchBox = document.getElementById("search-box");
const searchInput = document.getElementById("search-input");
const wordTxt = document.getElementById("word-txt");
const typeTxt = document.getElementById("type-txt");
const phoneticTxt = document.getElementById("phonetic-txt");
const soundBtn = document.getElementById("sound-btn");
const definitionTxt = document.getElementById("definition-txt");
const exampleElem = document.getElementById("example-elem");
const synonymsElem = document.getElementById("synonyms-elem");
const antonymsElem = document.getElementById("antonyms-elem");
const audio = new Audio();
const wordDetailsElem = document.querySelector(".word-details")
const errTxt = document.querySelector(".errTxt");

async function getWordDetails(word){
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await res.json();
    const wordData = data[0];
    const phonetics = wordData.phonetics || [];

    let phoneticText = "", phoneticAudio = "";

    for (const phonetic of phonetics) {
        if (phonetic.text && !phoneticText)
            phoneticText = phonetic.text;
        if (phonetic.audio && !phoneticAudio)
            phoneticAudio = phonetic.audio;
        if (phoneticText && phoneticAudio) break;
    }

    const meaning = wordData.meanings[0];

    return {
        word: word.toLowerCase(),
        phonetic: {
            text: phoneticText,
            audio: phoneticAudio
        },
        speechPart: meaning.partOfSpeech,
        definition: meaning.definitions[0].definition,
        synonyms: meaning.synonyms,
        antonyms: meaning.antonyms,
        example: meaning.definitions[0].example || ""
    }
}

searchBox.addEventListener("submit", async e => {
    e.preventDefault();

    if (searchInput.value.trim() === "") {
        errTxt.textContent = "Please Enter a Word";
    } else {
        wordDetailsElem.classList.remove("active");

        try {
            errTxt.textContent = "";
            const wordDetails = await getWordDetails(searchInput.value);

            wordTxt.textContent = wordDetails.word;
            typeTxt.textContent = wordDetails.speechPart;
            phoneticTxt.textContent = wordDetails.phonetic.text;
            audio.src = wordDetails.phonetic.audio;
            definitionTxt.textContent = wordDetails.definition;
            exampleElem.querySelector("p").textContent = wordDetails.example;

            // --- NEW: Clickable synonyms ---
            synonymsElem.querySelector("p").innerHTML = wordDetails.synonyms
                .map(s => `<span class="word-tag">${s}</span>`)
                .join(" ");

            // --- NEW: Clickable antonyms ---
            antonymsElem.querySelector("p").innerHTML = wordDetails.antonyms
                .map(a => `<span class="word-tag">${a}</span>`)
                .join(" ");

            // Show or hide sections
            exampleElem.style.display = wordDetails.example === "" ? "none" : "block";
            synonymsElem.style.display = wordDetails.synonyms.length === 0 ? "none" : "block";
            antonymsElem.style.display = wordDetails.antonyms.length === 0 ? "none" : "block";

            wordDetailsElem.classList.add("active");

            // --- NEW: Add event listeners for clickable tags ---
            document.querySelectorAll(".word-tag").forEach(tag => {
                tag.addEventListener("click", () => {
                    searchInput.value = tag.textContent;
                    searchBox.dispatchEvent(new Event("submit"));
                });
            });

        } catch {
            errTxt.textContent = "Word Not Found";
        }
    }
});

soundBtn.addEventListener("click", () => {
    audio.play();
});

