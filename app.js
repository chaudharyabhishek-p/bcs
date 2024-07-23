const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
const quotesDiv = document.querySelector('.quotes');
const newsDiv = document.querySelector('.news');
const recipesDiv = document.querySelector('.recipes');
const jokesDiv = document.querySelector('.jokes');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.lang = "hi-IN"; // Set the language to Hindi
    text_speak.rate = 0.9;
    text_speak.volume = 1;
    text_speak.pitch = 0.6;
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    const day = new Date();
    const hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("सुप्रभात अभिषेक सर...");
    } else if (hour >= 12 && hour < 17) {
        speak("नमस्ते मास्टर...");
    } else {
        speak("शुभ संध्या सर...");
    }
}

window.addEventListener('load', () => {
    speak("जेएआरवीआईएस को आरंभ कर रहा हूँ..");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
}

btn.addEventListener('click', () => {
    content.textContent = "सुन रहा हूँ....";
    recognition.start();
});

function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("नमस्ते सर, मैं आपकी किस प्रकार मदद कर सकता हूँ?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("गूगल खोल रहा हूँ...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("यूट्यूब खोल रहा हूँ...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("फेसबुक खोल रहा हूँ...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "यहां इंटरनेट पर " + message + " के बारे में मिली जानकारी है।";
        speak(finalText);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`, "_blank");
        const finalText = "यहां विकिपीडिया पर " + message + " के बारे में मिली जानकारी है।";
        speak(finalText);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak("समय है " + time);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        speak("आज की तारीख है " + date);
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        speak("कैलकुलेटर खोल रहा हूँ...");
    } else if (message.includes('weather')) {
        getWeather();
    } else if (message.includes('news')) {
        getNews();
    } else if (message.includes('lucifer')) {
        getLuciferQuote();
    } else if (message.includes('joke') || message.includes('jokes')) {
        tellJokeInHindi();
    } else if (message.includes('recipe')) {
        suggestRecipe();
    } else if (message.includes('whatsapp')) {
        sendWhatsAppMessage();
    } else if (message.includes('screenshot')) {
        takeScreenshot();
    } else if (message.includes('camera')) {
        openCamera();
    } else if (message.includes('play game')) {
        playGame();
    } else if (message.includes('quiz') || message.includes('brainstorming')) {
        startQuiz();
    } else {
        handleUnknownCommand(message);
    }
}

function getWeather() {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=yourcity&appid=yourapikey')
        .then(response => response.json())
        .then(data => {
            const temp = data.main.temp - 273.15;
            const weather = data.weather[0].description;
            speak(`वर्तमान तापमान ${temp.toFixed(1)} डिग्री सेल्सियस है और मौसम ${weather} है।`);
        })
        .catch(error => {
            speak("मैं अभी मौसम की जानकारी नहीं प्राप्त कर सका।");
        });
}

function getNews() {
    fetch('https://newsapi.org/v2/top-headlines?country=in&apiKey=2ba314cb259b4a6b828b19b18d23b576')
        .then(response => response.json())
        .then(data => {
            const articles = data.articles;
            if (articles.length > 0) {
                speak("यहाँ प्रमुख समाचार शीर्षक हैं।");
                newsDiv.innerHTML = '';
                articles.slice(0, 5).forEach((article, index) => {
                    const newsElement = document.createElement('p');
                    newsElement.textContent = `${index + 1}. ${article.title}`;
                    newsDiv.appendChild(newsElement);
                    speak(`${index + 1}. ${article.title}`);
                });
            } else {
                speak("मुझे अभी कोई समाचार अपडेट नहीं मिला।");
            }
        })
        .catch(error => {
            speak("मैं अभी समाचार अपडेट प्राप्त नहीं कर सका।");
        });
}

function getLuciferQuote() {
    fetch('https://hindi-quotes.vercel.app/random')
        .then(response => response.json())
        .then(data => {
            if (data && data.quote) {
                const quote = data.quote;
                speak(quote);
                displayQuote(quote);
            } else {
                speak("मुझे अभी कोई लूसिफर उद्धरण नहीं मिला।");
            }
        })
        .catch(error => {
            speak("मुझे लूसिफर उद्धरण प्राप्त करने में समस्या हो रही है।");
        });
}

function displayQuote(quote) {
    const quoteElement = document.createElement('p');
    quoteElement.textContent = quote;
    quotesDiv.innerHTML = '';
    quotesDiv.appendChild(quoteElement);
}

function tellJokeInHindi() {
    fetch('https://hindi-jokes-api.onrender.com/jokes?api_key=4b5966cd3b2f758a501ea8870a1c')
        .then(response => response.json())
        .then(data => {
            if (data && data.jokeContent) {
                const joke = data.jokeContent;
                speak(joke);
                displayJoke(joke);
            } else {
                speak("इस समय मुझे कोई चुटकुले नहीं मिल रहे हैं।");
            }
        })
        .catch(error => {
            speak("इस समय मैं चुटकुले नहीं पा सका।");
        });
}

function displayJoke(joke) {
    const jokeElement = document.createElement('p');
    jokeElement.textContent = joke;
    jokesDiv.innerHTML = '';
    jokesDiv.appendChild(jokeElement);
}

function suggestRecipe() {
    const morningRecipes = [
        "पोहा",
        "इडली",
        "उपमा",
        "डोसा",
        "पराठा",
    ];

    const afternoonRecipes = [
        "दाल तड़का",
        "पनीर बटर मसाला",
        "छोले भटूरे",
        "बिरयानी",
        "राजमा चावल",
    ];

    const eveningRecipes = [
        "पाव भाजी",
        "दही पुरी",
        "वड़ा पाव",
        "समोसा",
        "आलू टिक्की",
    ];

    const nightRecipes = [
        "खिचड़ी",
        "आलू पराठा",
        "मटर पनीर",
        "छोले कुलचे",
        "बैंगन का भर्ता",
    ];

    const hour = new Date().getHours();
    let recipes = [];

    if (hour >= 0 && hour < 12) {
        recipes = morningRecipes;
    } else if (hour >= 12 && hour < 17) {
        recipes = afternoonRecipes;
    } else if (hour >= 17 && hour < 21) {
        recipes = eveningRecipes;
    } else {
        recipes = nightRecipes;
    }

    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    speak(`आपके लिए ${randomRecipe} बनाने का सुझाव है।`);
    displayRecipe(randomRecipe);
}

function displayRecipe(recipe) {
    const recipeElement = document.createElement('p');
    recipeElement.textContent = recipe;
    recipesDiv.innerHTML = '';
    recipesDiv.appendChild(recipeElement);
}

// Function to send WhatsApp message
function sendWhatsAppMessage() {
    const message = prompt("कृपया संदेश दर्ज करें जिसे आप व्हाट्सएप पर भेजना चाहते हैं:");
    if (message) {window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, "_blank");
        speak("व्हाट्सएप संदेश भेज रहा हूँ...");
    } else {
        speak("कोई संदेश दर्ज नहीं किया गया।");
    }
}

// Function to take a screenshot
function takeScreenshot() {
    html2canvas(document.body).then(canvas => {
        const base64image = canvas.toDataURL("image/png");
        
        // Create a link element to download the screenshot
        const link = document.createElement('a');
        link.href = base64image;
        link.download = 'screenshot.png';
        
        // Append the link to the body and click it to trigger the download
        document.body.appendChild(link);
        link.click();
        
        // Remove the link from the body
        document.body.removeChild(link);

        speak("स्क्रीनशॉट ले लिया गया है और डाउनलोड हो रहा है...");
    }).catch(error => {
        speak("स्क्रीनशॉट लेने में समस्या हो रही है।");
    });
}

// Function to open the camera
function openCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const videoElement = document.createElement('video');
            videoElement.srcObject = stream;
            videoElement.play();
            document.body.appendChild(videoElement);
            speak("कैमरा खोल रहा हूँ...");
        })
        .catch(error => {
            speak("मैं कैमरा नहीं खोल सका।");
        });
}

// Function to play a game
function playGame() {
    speak("आपके लिए एक मजेदार गेम खोल रहा हूँ...");
    window.open("https://www.example.com/play-game", "_blank");
}

// Function to start a quiz or brainstorming session
function startQuiz() {
    speak("ब्रेनस्टॉर्मिंग प्रश्नोत्तरी शुरू कर रहा हूँ...");
    // Example questions, you can add more or fetch from an API
    const questions = [
        "भारत का राष्ट्रीय पशु कौन सा है?",
        "ताज महल कहाँ स्थित है?",
        "भारत की राजधानी क्या है?",
        "गणेश चतुर्थी किस महीने में मनाई जाती है?",
        "महात्मा गांधी का पूरा नाम क्या था?"
    ];

    let index = 0;
    function askQuestion() {
        if (index < questions.length) {
            speak(questions[index]);
            index++;
            setTimeout(askQuestion, 10000); // Wait 10 seconds before asking the next question
        } else {
            speak("ब्रेनस्टॉर्मिंग प्रश्नोत्तरी समाप्त हुई।");
        }
    }

    askQuestion();
}

// Function to handle unknown commands
function handleUnknownCommand(command) {
    speak("मुझे माफ़ करना, मैं आपकी बात को समझ नहीं पाया। कृपया दोहराएँ।");
}

// The existing event listener for the 'load' event
window.addEventListener('load', () => {
    speak("जेएआरवीआईएस को आरंभ कर रहा हूँ..");
    wishMe();
});