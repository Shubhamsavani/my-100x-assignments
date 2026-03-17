import {quizData} from './data.js';

const quizBody = document.getElementById('quizBody');

function renderQuiz(){

    let quizQuestions = '';
    quizData.forEach((Question)=>{
        quizQuestions+=`
        <div class="question" data-questionId="${Question.id}">
            <h3>${Question.question}</h3>
            <input type="radio" id="${Question.id}_a" name="${Question.id}" value="a">
            <label for="${Question.id}_a">${Question.a}</label>
            <input type="radio" id="${Question.id}_b" name="${Question.id}" value="b">
            <label for="${Question.id}_b">${Question.b}</label>
            <input type="radio" id="${Question.id}_c" name="${Question.id}" value="c">
            <label for="${Question.id}_c">${Question.c}</label>
            <input type="radio" id="${Question.id}_d" name="${Question.id}" value="d">
            <label for="${Question.id}_d">${Question.d}</label>
        </div>
        `;
    });
    quizBody.innerHTML = quizQuestions;
}

renderQuiz();

    
// submit logic
function getAnswer(id){
    let answer=null;
    quizData.forEach((data)=>{
        if(data.id == id){
            answer = data.correct;
            return answer;
        }
    });
    return answer;
}


const submitButton = document.getElementById('submitBtn');
function hideSubmitBtn(hide){
    if(hide){
        submitButton.classList.add('hidden');
    }else{
        submitButton.classList.remove('hidden');
    }
}

submitButton.addEventListener('click', ()=>{
    let score =0;
    const answers = document.querySelectorAll('.question');
    console.log(answers);
    answers.forEach((questionContainer)=>{
        // logic to get the ticked answer from the radio options for that particular id
        const qID=questionContainer.getAttribute('data-questionId');
        console.log(qID);
        const selectedOption = questionContainer.querySelector(`input[name="${qID}"]:checked`);

        if(selectedOption){
            const userAnswer = selectedOption.value ;
            console.log('answer by the user:', userAnswer,' || Orignal answer:', getAnswer(qID));
            if(getAnswer(qID)==userAnswer){
                score++;
            }
        }
    });

    quizBody.innerHTML = `
        <h1> Your Score is ${score}/ ${quizData.length}</h1>
        <button id="restartBtn" class="btn">Click here to restart the quiz</button>
    `;
    hideSubmitBtn(true);
});

// 1. We listen for clicks anywhere inside the quizBody
quizBody.addEventListener('click', (event) => {
    // 2. Check if the element clicked has the ID 'restartBtn'
    if (event.target && event.target.id === 'restartBtn') {
        renderQuiz();
        hideSubmitBtn(false);
    }
});



