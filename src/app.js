import {Question} from './question.js'
import {createModal, isValid} from './utils'
import {getAuthForm, authWithEmailAndPassword} from './auth'
import './style.css';

window.addEventListener('DOMContentLoaded', () => {
    const questionForm = document.querySelector('#question-form');
    const input = document.querySelector('#question-input');
    const submitBtn = document.querySelector('#submit');
    const modalBtn = document.querySelector('#modal-btn');

    window.addEventListener('load', Question.renderList);
    questionForm.addEventListener('submit', submitFormHandler);
    modalBtn.addEventListener('click', openModal);
    input.addEventListener('input', () => {
        submitBtn.disabled = !isValid(input.value)
    })
    function submitFormHandler(event){
        event.preventDefault();
        
        if (isValid(input.value)){
            const question = {
                text: input.value.trim(),
                date: new Date().toJSON()
            };
            submit.disabled = true;
            Question.create(question).then(() => {
                input.value = '';
                input.className = '';
                submitBtn.disabled = false;
            })
        }
    }

    function openModal(){
        createModal('Авторизация', getAuthForm());
        document.getElementById('auth-form').addEventListener('submit', authFormHandler, {once: true});
    }

    function authFormHandler(event) {
        event.preventDefault();

        const email = event.target.querySelector('#email').value;
        const password = event.target.querySelector('#password').value;
        const btn = event.target.querySelector('button');
        btn.disabled = true;

        authWithEmailAndPassword(email, password)
        .then(token => {
            return Question.fetch(token)
        })
        .then(renderModalAfterAuth)
        .then(() => {
            btn.disabled = false;

        })

    }
function renderModalAfterAuth(content) {
    if (typeof content === 'string') {
        createModal('Ошибка!', content)

    } else {
        createModal('Список вопросов', Question.listToHTML(content))
    }
}

});
