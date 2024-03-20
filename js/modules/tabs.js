function tabs(tabsSelector, tabsContentSelector,tabsParentSelector,activeClass){
    // tabs
    const tabs = document.querySelectorAll(tabsSelector),
    tabsHeader = document.querySelectorAll(tabsContentSelector),
    tabsParent = document.querySelector(tabsParentSelector);

    function hideTabContent(){
        tabs.forEach(item =>{
            item.classList.add('hide')
            item.classList.remove('show','fade')
        })
        tabsHeader.forEach(item => {
            item.classList.remove(activeClass)
        })
    }
    function showTabContent(i = 0){

        tabs[i].classList.add('show','fade');
        tabs[i].classList.remove('hide');
        tabsHeader[i].classList.add(activeClass)
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event)=>{
        const target = event.target;

        if(target && target.classList.contains(tabsContentSelector.slice(1))){
            tabsHeader.forEach((item, i ) => {
                if(target === item){
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    });
}

export default tabs;