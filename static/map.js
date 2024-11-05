/* ---------- CALCULATE MINIMUM ZOOM ---------- */

const CLIENT_WIDTH = 768;
const SMALL_SCREEN_ZOOM = 4;
const LARGE_SCREEN_ZOOM = 3;

/* ---------- MAP HANDLING ---------- */

const MAX_BOUNDS = [[44.47, -205.84], [74.64, -116.37]];
const INITIAL_COORDINATES = [64.793, -153.040];
const MAX_BOUNDS_VISCOSITY = 0.5;
const MAX_ZOOM = 8;
const OSM_TILE_LAYER = ['https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', `© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`];

// Function to calculate minimum zoom based on current screen width
const calculateMinZoom = () => {
    return document.documentElement.clientWidth < CLIENT_WIDTH ? LARGE_SCREEN_ZOOM : SMALL_SCREEN_ZOOM;
};

// Function to create tile layer
const createTileLayer = (tileLayer) => {
    const layer = L.tileLayer(tileLayer[0], {
        attribution: tileLayer[1]
    });
    layer.on('tileerror', function (error) {
        console.error('Error loading tile layer:', error);
        layer.setUrl(OSM_TILE_LAYER); // Fallback to OSM tile layer
    });
    return layer;
};

// Map configuration
const mapConfig = {
    layers: createTileLayer(OSM_TILE_LAYER),
    maxBounds: MAX_BOUNDS,
    maxBoundsViscosity: MAX_BOUNDS_VISCOSITY,
    minZoom: calculateMinZoom(),
    maxZoom: MAX_ZOOM
};

// Initialize map
const map = L.map('map', mapConfig).setView(INITIAL_COORDINATES, calculateMinZoom());

// Function to fetch GeoJSON data and add to map
const fetchGeoJson = async () => {
    try {
        var response = await fetch('static/languageBounds.geojson');
        var data = await response.json();
        if (!data) {
            console.error('No data fetched from GeoJSON file.');
            window.alert('Error: No data was found. Please try again later.');
            return;
        }
        // console.log(foundArea);
        L.geoJSON(data, {
            onEachFeature: (feature, layer) => {
                // Add popup
                if (feature.properties && feature.properties.LanguageName) {
                    layer.bindPopup(`<strong>Language:</strong> ${feature.properties.LanguageName}<br>
                                     <strong>Country:</strong> ${feature.properties.Country}<br>
                                     <strong>Family:</strong> ${feature.properties.Family}`);
                }
            },
        }).addTo(map);

    } catch (error) {
        console.error('Error fetching GeoJSON data:', error);
        window.alert('Error: Data was unable to be loaded. Please try again later.');
        throw error;
    }
};

fetchGeoJson();

// Create icon marker
let myIcon = L.icon({
    iconUrl: 'static/icon.png', iconSize: [42, 42], iconAnchor: [21, 21], popupAnchor: [0, -20], //注意坐标轴的方向
    // shadowUrl: 'my-icon-shadow.png',
    // shadowSize: [68, 95],
    // shadowAnchor: [22, 94]
});

let marker = L.marker(INITIAL_COORDINATES, {
    icon: myIcon
}).addTo(map);

marker.bindPopup('<b style="color:blue;">Welcome! ' +
    '<b style="color: red;">You can press the arrows to move me! ' +
    '<b style="color: #28587B;">And click me if you want to ask questions.</b></i>');
//默认打开popup
setTimeout(() => {
    marker.openPopup();
});

// 通过键盘控制Marker
function controlMarkerWithKeys(map, marker) {
    const moveDistance = 0.3;

    document.addEventListener('keydown', function (event) {
        const currentPos = marker.getLatLng();

        switch (event.key) {
            case 'ArrowUp': // 上箭头 - 向北移动
                // case 'w':
                marker.setLatLng([currentPos.lat + moveDistance, currentPos.lng]);
                map.closePopup();
                break;
            case 'ArrowDown': // 下箭头 - 向南移动
                // case 's':
                marker.setLatLng([currentPos.lat - moveDistance, currentPos.lng]);
                map.closePopup();
                break;
            case 'ArrowLeft': // 左箭头 - 向西移动
                // case 'a':
                marker.setLatLng([currentPos.lat, currentPos.lng - moveDistance]);
                map.closePopup();
                break;
            case 'ArrowRight': // 右箭头 - 向东移动
                // case 'd':
                marker.setLatLng([currentPos.lat, currentPos.lng + moveDistance]);
                map.closePopup();
                break;
        }
        // 将地图中心移动到Marker的新位置
        map.panTo(marker.getLatLng());

        const getButton = async () => {
            try {
                var response = await fetch('static/languageBounds.geojson');
                var data = await response.json();
                if (!data) {
                    console.error('No data fetched from GeoJSON file.');
                    window.alert('Error: No data was found. Please try again later.');
                    return;
                }
                const targetName = "Dena'ina";
                // console.log(foundArea);
                L.geoJSON(data, {
                    onEachFeature: (feature, layer) => {

                        if (feature.properties.LanguageName === targetName) {
                            var bounds = layer.getBounds();
                            // console.log(bounds);
                            if (bounds.contains(marker.getLatLng())) {
                                var popup = L.popup()
                                    .setLatLng(marker.getLatLng())
                                    .setContent('<b style="color:blue;">Finding the treasure about Dena’ina!  ' +
                                        '<button onclick="myFunction()" class="btn btn-primary btn-sm click-btn">Click</button>')
                                    .openOn(map);
                            }

                        }
                    },
                });
            } catch (error) {
                console.error('Error fetching GeoJSON data:', error);
                window.alert('Error: Data was unable to be loaded. Please try again later.');
                throw error;
            }
        };
        getButton();

    });
}

// 按钮点击行为
function myFunction() {
    var infoBox = document.getElementById('info-box');
    infoBox.style.display = 'block'; // 显示div
    var videoBox = document.getElementById('video-box');
    videoBox.style.display = 'block';
    var audioBox = document.getElementById('audio-box');
    audioBox.style.display = 'block';
    var alphabetBox = document.getElementById('alphabet-box');
    alphabetBox.style.display = 'block';
    var testBox = document.getElementById('test-box');
    testBox.style.display = 'block';
}

const closeVideo = document.getElementById('closeVideo');
const myVideo = document.getElementById('myVideo');
const closeVideoBtn = document.getElementById('closeVideoBtn');
// 关闭视频div并停止视频播放
closeVideo.addEventListener('click', function () {
    myVideo.pause();  // 暂停视频
    myVideo.currentTime = 0;  // 重置视频播放时间到开始
});
closeVideoBtn.addEventListener('click', function () {
    myVideo.pause();  // 暂停视频
    myVideo.currentTime = 0;  // 重置视频播放时间到开始
});

document.addEventListener('DOMContentLoaded', () => {
    const openFrameBtn = document.getElementById('audio-box');
    const closeFrameBtn = document.getElementById('closeAudio');
    const closeFrameBtn2 = document.getElementById('closeAudioBtn');
    const audioFrame = document.getElementById('audioFrame');
    const soundcloudFrame = document.getElementById('myAudio');

    let soundcloudSrc = soundcloudFrame.src; // 保存原始的 src

    // 打开 frame 并加载 SoundCloud 音频
    openFrameBtn.addEventListener('click', () => {
        audioFrame.style.display = 'block';
        soundcloudFrame.src = soundcloudSrc; // 重新加载音频
    });

    // 关闭 frame 并移除音频源以停止播放
    closeFrameBtn.addEventListener('click', () => {
        audioFrame.style.display = 'none';
        soundcloudFrame.src = ''; // 清空 src 以停止音频播放
    });
    closeFrameBtn2.addEventListener('click', () => {
        audioFrame.style.display = 'none';
        soundcloudFrame.src = ''; // 清空 src 以停止音频播放
    });
});

function checkAnswer() {
    // 获取选择的答案
    var radios = document.getElementsByName('answer');
    var selectedAnswer;
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            selectedAnswer = radios[i].value;
            break;
        }
    }

    // 判断答案是否正确
    var correctAnswer = 'A';
    var resultText = document.getElementById('result');
    if (selectedAnswer) {
        if (selectedAnswer === correctAnswer) {
            resultText.textContent = "Correct!";
            resultText.style.color = "green";
        } else {
            resultText.textContent = "Wrong, the correct answer is A.";
            resultText.style.color = "red";
        }
    } else {
        resultText.textContent = "Please select an answer.";
        resultText.style.color = "black";
    }
}

// 添加键盘事件监听
map.on('keydown', controlMarkerWithKeys(map, marker));


// 点击Marker事件
marker.on('click', function (e) {
    var popupContent = `
<form id="inputForm" class="input-group-sm myInput">
    <label for="inputText"></label>
    <input list="questions" type="text" class="form-control" id="inputText" name="inputText" placeholder="Input your question..."
           required/>
    <datalist id="questions">
        <option value="What is the Alaska Native Claims Settlement Act (ANCSA)?">
        <option value="What are some traditions of Alaska Native people?">
        <option value="What are the epidemic diseases introduced by the western settlers among Alaska Native communities?">
        <option value="How do Alaska Natives hunt bowhead whales?">
    </datalist>
    <button type="submit" class="btn btn-outline-secondary">Submit</button>
</form>`;

    var popup = L.popup()
        .setLatLng(e.latlng)
        .setContent(popupContent)
        .openOn(map);

    // 监听表单提交
    document.getElementById('inputForm').addEventListener('submit', function (event) {
        event.preventDefault();

        var inputText = document.getElementById('inputText').value;

        // 将输入信息通过AJAX发送到后端Python
        fetch('/process_input', {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({text: inputText})
        })
            .then(response => response.json())
            .then(data => {
                alert('My Answer: ' + data.response);
            });
    });
});


let quizData = [];
let randomizedQuizData = [];  // Store randomized questions
let currentQuestionIndex = 0;
let userAnswers = [];  // Store the user's answers
let correctAnswersCount = 0; // Count the number of correct answers

// Function to load the quiz data from the JSON file
async function loadQuizData() {
    try {
        const response = await fetch('static/test.json'); // Fetch questions from JSON file
        quizData = await response.json();
        randomizedQuizData = shuffleArray(quizData); // Shuffle the questions
        loadQuestion(); // Load the first question after data is fetched
    } catch (error) {
        console.error('Error loading quiz data:', error);
    }
}

// Function to shuffle the questions array
function shuffleArray(array) {
    let shuffledArray = array.slice();  // Copy the array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

// Function to load the current question with numbering
function loadQuestion() {
    const questionData = randomizedQuizData[currentQuestionIndex];
    const questionText = document.getElementById('question-text');
    const form = document.getElementById('question-form');
    const warningMessage = document.getElementById('warning-message');

    // Set the question text with numbering
    questionText.textContent = `Q${currentQuestionIndex + 1}: ${questionData.question}`;

    // Clear previous options and hide warning message
    form.innerHTML = '';
    warningMessage.style.display = 'none';

    // Generate new options
    questionData.options.forEach((option, index) => {
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'answer';
        input.value = index;
        input.id = `option${index}`;

        const label = document.createElement('label');
        label.htmlFor = `option${index}`;
        label.textContent = option.text;

        form.appendChild(input);
        form.appendChild(label);
        form.appendChild(document.createElement('br'));
    });
}

// Function to save the user's answer without checking correctness yet
function saveAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption) {
        return null; // No answer selected
    }
    return selectedOption.value;
}

// Function to move to the next question
function nextQuestion() {
    const answer = saveAnswer();
    const warningMessage = document.getElementById('warning-message');

    if (answer === null) {
        warningMessage.style.display = 'block';  // Show warning if no answer selected
        return;
    }

    warningMessage.style.display = 'none';  // Hide warning if answer selected

    userAnswers[currentQuestionIndex] = answer; // Save selected answer

    if (currentQuestionIndex < randomizedQuizData.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    }

    // Check if it's the last question
    if (currentQuestionIndex === randomizedQuizData.length - 1) {
        // Last question: hide 'Next' button and show 'Submit' button
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('submit-btn').style.display = 'inline';
    }
}

// Function to submit the quiz and display the results
function submitQuiz() {
    const answer = saveAnswer(); // Save the last question's answer
    const warningMessage = document.getElementById('warning-message');

    if (answer === null) {
        warningMessage.style.display = 'block';  // Show warning if no answer selected for last question
        return;
    }

    warningMessage.style.display = 'none';  // Hide warning if last answer selected
    userAnswers[currentQuestionIndex] = answer; // Save the last question's answer

    const reviewContainer = document.getElementById('review-container');
    reviewContainer.innerHTML = '';  // Clear previous review
    correctAnswersCount = 0;  // Reset correct answers count

    // Loop through each question and display the options with color coding
    randomizedQuizData.forEach((question, index) => {
        const userAnswerIndex = userAnswers[index];
        const correctAnswerIndex = question.options.findIndex(option => option.correct);

        const questionDiv = document.createElement('div');
        questionDiv.innerHTML = `<strong>Q${index + 1}: ${question.question}</strong><br>`;
        questionDiv.style.marginBottom = '10px';

        // Create radio buttons for review
        question.options.forEach((option, optIndex) => {
            const input = document.createElement('input');
            input.type = 'radio';
            input.disabled = true;  // Disable for review
            input.checked = (userAnswerIndex == optIndex);  // Mark user's choice

            const label = document.createElement('label');
            label.textContent = option.text;

            // Mark correct answer green, incorrect answer red
            if (optIndex == correctAnswerIndex) {
                label.style.color = 'green';
                if (userAnswerIndex == optIndex) {
                    correctAnswersCount++;  // Increment count for correct answers
                }
            } else if (optIndex == userAnswerIndex) {
                label.style.color = 'red';
            }

            questionDiv.appendChild(input);
            questionDiv.appendChild(label);
            questionDiv.appendChild(document.createElement('br'));
        });

        reviewContainer.appendChild(questionDiv);
    });

    // Display the score
    const scoreContainer = document.getElementById('score-container');
    scoreContainer.innerHTML = `<p><strong>Your Score: ${correctAnswersCount} / ${randomizedQuizData.length}</strong></p>`;

    // Hide quiz and show review section
    document.querySelector('.question-container').style.display = 'none';
    document.querySelector('.question-review').style.display = 'block';
}


// Function to restart the quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    userAnswers = [];
    document.querySelector('.question-review').style.display = 'none';
    document.querySelector('.question-container').style.display = 'block';
    document.getElementById('next-btn').style.display = 'inline';
    document.getElementById('submit-btn').style.display = 'none';
    randomizedQuizData = shuffleArray(quizData);  // Re-shuffle the questions
    loadQuestion();
}

// Load the quiz data when the page loads
window.onload = loadQuizData();

// 页面加载后显示玩法说明
window.onload = function () {
    var overlay = document.getElementById('overlay');
    var instructions = document.getElementById('game-instructions');
    var startButton = document.getElementById('start-game-btn');
    var helpButton = document.getElementById('help-btn');

    // 显示玩法说明和遮罩层
    function showInstructions() {
        overlay.style.display = 'block';
        instructions.style.display = 'block';
    }

    // 隐藏玩法说明和遮罩层
    function hideInstructions() {
        overlay.style.display = 'none';
        instructions.style.display = 'none';
    }

    // 页面加载时首次显示玩法说明
    showInstructions();

    // 点击"开始游戏"按钮时关闭卡片
    startButton.onclick = function () {
        hideInstructions();
    };

    // 点击问号按钮时再次显示卡片
    helpButton.onclick = function () {
        showInstructions();
    };
};
