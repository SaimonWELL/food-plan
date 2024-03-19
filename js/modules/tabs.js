function tabs(){
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
}

module.exports = tabs;