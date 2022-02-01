const choices=Array.from(document.getElementsByClassName('choice-text'));
const question=document.getElementById('question');
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");
const progressFullBar=document.getElementById('progressFullBar');
const game=document.getElementById('game');
const loader=document.getElementById('loader');

let currentQuestion={};
let acceptingAnswers=false;
let score=0;
let questionCounter=0;
let availableQuestions=[];

let questions = [];

fetch(
    'https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple'
)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

// Constants

const CORRECT_BONUS=10;
const MAX_QUESTIONS=5;

function startGame (){
    questionCounter=0;
    score=0;
    availableQuestions=[...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

function getNewQuestion(){
    if (availableQuestions.length===0 || questionCounter >= MAX_QUESTIONS){
        
        localStorage.setItem("mostRecentScore", score);

        return window.location.assign('end.html');
    }
    questionCounter++;
    questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;
    progressFullBar.style.width = `${(questionCounter / MAX_QUESTIONS)*100}%`;

    const questionIndex=Math.floor(Math.random()*availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText=currentQuestion.question;

    choices.forEach( (choice)=>{
        const number=choice.dataset['number'];
        choice.innerText=currentQuestion['choice' + number];
    } );

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice)=>{
    choice.addEventListener('click',(e)=>{
        if (!acceptingAnswers) return;

        acceptingAnswers=false;
        const selectedChoice = e.target;
        const selectedAnswer=selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if (classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
            }
            
        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply);
        getNewQuestion();
        }, 1000);
        
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
  };

