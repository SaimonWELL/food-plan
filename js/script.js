"use strict";



window.addEventListener('DOMContentLoaded',()=>{
    // tabs
    const tabs = document.querySelectorAll('.tabcontent'),
        tabsHeader = document.querySelectorAll('.tabheader__item'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent(){
        tabs.forEach(item =>{
            item.classList.add('hide')
            item.classList.remove('show','fade')
        })
        tabsHeader.forEach(item => {
            item.classList.remove('tabheader__item_active')
        })
    }
    function showTabContent(i = 0){

        tabs[i].classList.add('show','fade');
        tabs[i].classList.remove('hide');
        tabsHeader[i].classList.add('tabheader__item_active')
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event)=>{
        const target = event.target;

        if(target && target.classList.contains('tabheader__item')){
            tabsHeader.forEach((item, i ) => {
                if(target === item){
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    });


    // timer

    const deadline = '2023-05-12';

    function getTimeRemaining (endtime){
        const t = (Date.parse(endtime) - Date.parse(new Date())<0) ? 0 :Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000*60*60*24)),
            hours = Math.floor((t / (1000*60*60) % 24)),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return{
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        }
    }
    function getZero(num){
        if(num <= 10 && num >= 0){
            return `0${num}`
        }else {
            return num
        }
    }

    function setClock(endtime){


        const days = document.querySelector('#days'),
            hours = document.querySelector('#hours'),
            minutes = document.querySelector('#minutes'),
            seconds = document.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);


        updateClock();
        function updateClock(){
            const objTime = getTimeRemaining(endtime)
            days.innerHTML = getZero(objTime.days);
            hours.innerHTML = getZero(objTime.hours);
            minutes.innerHTML = getZero(objTime.minutes);
            seconds.innerHTML = getZero(objTime.seconds);

            if(objTime.total<=0){
                clearInterval(timeInterval)
            }
        }
    }
    setClock(deadline)

    // modal window

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');
    function openModal(){
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModal(){
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    const modalTimerId = setTimeout(openModal, 300000);
    modalTrigger.forEach(btn =>{
        btn.addEventListener('click',openModal);
    });



    function showModalByScroll(){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1){
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    modal.addEventListener('click', (e)=>{
        if(e.target === modal || e.target.getAttribute('data-close')===''){
            closeModal();
        }
    })

    document.addEventListener('keydown',(e)=>{
        if(e.code ==='Escape' && modal.classList.contains('show')){
            closeModal()
        }
    });

    const modelTimerId = setTimeout(openModal,50000);

    window.addEventListener('scroll', showModalByScroll)


    // work with Class
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = "menu__item";
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        14,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        21,
        ".menu .container"
    ).render();

    //FORMS
    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Форма получена!',
        failure: 'Что-то пошло не так('
    }

    forms.forEach(item=> {
        postDate(item);
    })
    
    function postDate(form) {
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

            const object = {};
            formData.forEach(function (value,key){
                object[key]= value;
            });


            fetch('server.php',{
                method:'POST',
                headers:{
                    'Content-type':'application/json'
                },
                body:JSON.stringify(object)
            })
                .then(data => data.text())
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
        openModal();

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
            closeModal();
        }, 4000)
    }

    fetch('http://localhost:3000/menu')
        .then(data=>data.json())
        .then(res => console.log(res))

});