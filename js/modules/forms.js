import {closeModal,openModal} from "./modal";
import {postData} from "../services/services";

function forms(formSelector,modalTimerId){
    //FORMS
    const forms = document.querySelectorAll(formSelector);

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Форма получена!',
        failure: 'Что-то пошло не так('
    }

    forms.forEach(item=> {
        bindPostDate(item);
    })



    function bindPostDate(form) {
        form.addEventListener('submit', (e)=>{
            e.preventDefault(); // Отмена стандартного поведения браузера

            const statusMessages = document.createElement('img');
            statusMessages.src = message.loading;
            statusMessages.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessages);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests',json)
                .then(data => {
                    console.log(data)
                    showThanksModal(message.success);
                    statusMessages.remove();
                }).catch(() => {
                showThanksModal(message.failure)
            }).finally(() => form.reset())


        })
    }

    function showThanksModal(message){
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal('.modal',modalTimerId);

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('.modal__dialog');
        thanksModal.innerHTML=`
        <div class="modal__content">
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${message}</div>
        </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(()=>{
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal('.modal');
        }, 4000)
    }

}

export default forms;