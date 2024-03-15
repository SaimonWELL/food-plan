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

    const getResource = async (url) =>{
        const res = await fetch(url);

        if(!res.ok){
            throw new Error(`Could not fetch ${url}, status:${res.status}`);
        }

        return await res.json()
    };

    // getResource('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img,altimg,title,descr,price} )=>{
    //             new MenuCard(img,altimg,title,descr,price, '.menu .container').render();
    //         });
    //     });

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img,altimg,title,descr,price} )=>{
                new MenuCard(img,altimg,title,descr,price, '.menu .container').render();
            });
        })

    //FORMS
    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Форма получена!',
        failure: 'Что-то пошло не так('
    }

    forms.forEach(item=> {
        bindPostDate(item);
    })

    const postData = async (url, data) =>{
        const res = await fetch(url,{
            method: "POST",
            headers:{
                'Content-type': 'application/json'
            },
            body:data
        });

        return await res.json()
    }
    
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

    //Slider

    const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1;
    let offset = 0;

    if(slides.length<10){
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`
    }else{
        total.textContent = slides.length;
        current.textContent = slideIndex
    }

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    })

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
        dots = [];

    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);

    for(let i = 0; i < slides.length; i++){
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to',i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        if( i === 0 ){
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    function deleteNotDigits(str){
        return +str.replace(/\D/g, ' ')
    }
    function updateSliderStatus() {
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }

        dots.forEach(dot => {
            dot.style.opacity = '.5';
            dots[slideIndex - 1].style.opacity = 1;
        });
    }

    next.addEventListener('click',()=>{
        if (offset === deleteNotDigits(width) * (slides.length-1)){
            offset = 0;
        }else{
            offset +=deleteNotDigits(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if(slideIndex=== slides.length){
            slideIndex = 1;
        }else{
            slideIndex++;
        }

        updateSliderStatus()
    });

    prev.addEventListener('click',()=>{
        if (offset === 0){
            offset = deleteNotDigits(width) * (slides.length-1);
        }else{
            offset -= deleteNotDigits(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if(slideIndex=== 1){
            slideIndex = slides.length;
        }else{
            slideIndex--;
        }

        updateSliderStatus()
    });

    dots.forEach(dot => {
        dot.addEventListener('click',(e)=>{
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = deleteNotDigits(width) * (slideTo-1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            updateSliderStatus()
        })
    })

    // Calc

    const result = document.querySelector('.calculating__result span');
    let sex = 'female'
        , height, weight, age,
        ration = 1.375;

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ration){
            result.textContent = '____';
            return;
        }

        if(sex === 'female'){
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ration);
        }else{
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ration);
        }
    }



    function getStaticInformation(parentSelector,activeClass){
        const elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(elem =>{
            elem.addEventListener('click', (e)=>{
                if(e.target.getAttribute('data-ratio')){
                    ration = +e.target.getAttribute('data-ratio');
                } else{
                    sex = e.target.getAttribute('id')
                }


                elements.forEach(elem =>{
                    elem.classList.remove(activeClass);
                });

                e.target.classList.add(activeClass);

                calcTotal();
            })
        })

    }

    getStaticInformation('#gender','calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big','calculating__choose-item_active');

    function getDynamicInformation(selector){
        const input = document.querySelector(selector);

        input.addEventListener('input', ()=>{
            switch (input.getAttribute('id')){
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value
                    break;
            }
            calcTotal();
        });

    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
});