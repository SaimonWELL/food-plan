function modal(){
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

}

module.exports = modal;