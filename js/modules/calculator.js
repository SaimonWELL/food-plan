function calculator(){
    // Calc

    const result = document.querySelector('.calculating__result span');


    let sex, height, weight, age, ration;

    if (localStorage.getItem('sex')){
        sex = localStorage.getItem('sex');
    }else{
        sex= 'female';
        localStorage.setItem('sex','female');
    }

    if (localStorage.getItem('ration')){
        ration = localStorage.getItem('ration')
    }else{
        ration= 'female'
        localStorage.setItem('ration',1.375)
    }

    function initLocalSettings(selector,activeClass){
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem =>{
            elem.classList.remove(activeClass);
            if(elem.getAttribute('id') === localStorage.getItem('sex')){
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ration')){
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div','calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div','calculating__choose-item_active');


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



    function getStaticInformation(selector,activeClass){
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem =>{
            elem.addEventListener('click', (e)=>{
                if(e.target.getAttribute('data-ratio')){
                    ration = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ration',ration);
                } else{
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex',sex);
                }


                elements.forEach(elem =>{
                    elem.classList.remove(activeClass);
                });

                e.target.classList.add(activeClass);

                calcTotal();
            })
        })

    }

    getStaticInformation('#gender div','calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div','calculating__choose-item_active');

    function getDynamicInformation(selector){
        const input = document.querySelector(selector);

        input.addEventListener('input', ()=>{

            if (input.value.match(/\D/g)){
                input.style.border = '10px solid red';
            }else{
                input.style.border = 'none';
            }

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
}

export default calculator;