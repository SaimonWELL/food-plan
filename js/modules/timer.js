function timer(){

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
}

module.exports = timer;