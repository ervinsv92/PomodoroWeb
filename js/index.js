let btnStartWork;
let btnStartRest;
let aStopRest;
let aStopWork;
let currentTitle;
let btnStop;
let _current = "w";//w-r
let _timeInterval;
let textTime;
let btnSave;
let txtMinutesToWork;
let txtMinutesToRest;
const STORAGE_CONFIG = 'storage-config';
const CLASS_WORKING = 'working-color';
const CLASS_RESTING = 'resting-color';

let _config = {
    minutesToWork: 25,
    minutesToRest:5
}

document.addEventListener('DOMContentLoaded', function() {
    btnStartWork = document.getElementById('btnStartWork');
    btnStartRest = document.getElementById('btnStartRest');
    aStopRest = document.getElementById('aStopRest');
    aStopWork = document.getElementById('aStopWork');
    currentTitle = document.getElementById('currentTitle');
    btnStop = document.getElementById('btnStop');
    textTime = document.getElementById('textTime');
    btnSave = document.getElementById('btnSave');
    txtMinutesToWork = document.getElementById('txtMinutesToWork');
    txtMinutesToRest = document.getElementById('txtMinutesToRest');

    btnStartWork.addEventListener('click', ()=>{
        currentTitle.textContent = 'Working...';
        quitClasses()
        _current = 'w'
        addClass()
        startTime()
    })

    btnStartRest.addEventListener('click', ()=>{
        currentTitle.textContent = 'Resting...';
        quitClasses()
        _current = 'r'
        addClass()
        startTime()
    })

    btnStop.addEventListener('click', ()=>{
        stopTimer();
    })

    btnSave.addEventListener('click', ()=>{

        if(txtMinutesToWork.value.trim() == ''){
            alert('Please add the minutes to work')
            return;
        }else if(txtMinutesToRest.value.trim() == ''){
            alert('Please add the minutes to rest')
            return;
        }else if(isNaN(txtMinutesToWork.value.trim())){
            alert('The minutes to work need to be a number')
            return;
        }else if(isNaN(txtMinutesToRest.value.trim())){
            alert('The minutes to rest need to be a number')
            return;
        }

        _config = {
            minutesToWork:Number(txtMinutesToWork.value),
            minutesToRest:Number(txtMinutesToRest.value)
        }

        localStorage.setItem(STORAGE_CONFIG, JSON.stringify(_config))

        alert('Saved!!!');
        stopTimer()
    })

    let configTemp = localStorage.getItem(STORAGE_CONFIG)
    if(configTemp){
        _config = JSON.parse(configTemp);
    }

    txtMinutesToWork.value = _config.minutesToWork;
    txtMinutesToRest.value = _config.minutesToRest;
});

const quitClasses = ()=>{
    textTime.classList.remove(CLASS_RESTING);
    textTime.classList.remove(CLASS_WORKING);
}

const addClass = ()=>{
    textTime.classList.add(_current =='w'?CLASS_WORKING:CLASS_RESTING);
}

const stopTimer = ()=>{
    currentTitle.textContent = 'Stoped';
    clearInterval(_timeInterval);
}

const startTime = ()=>{
    clearInterval(_timeInterval);
    let minutes = _current == 'w'?_config.minutesToWork:_config.minutesToRest;
    
    let tiempoTotal = minutes * 60;

// Actualiza el temporizador cada segundo
_timeInterval = setInterval(function() {
    // Calcula los minutos y segundos restantes
    let minutosRestantes = Math.floor(tiempoTotal / 60);
    let segundosRestantes = tiempoTotal % 60;

    // Formatea los minutos y segundos para que tengan siempre dos dígitos
    let minutosFormateados = minutosRestantes < 10 ? '0' + minutosRestantes : minutosRestantes;
    let segundosFormateados = segundosRestantes < 10 ? '0' + segundosRestantes : segundosRestantes;

    // Actualiza el contenido del elemento donde se muestra el temporizador
    textTime.textContent = minutosFormateados + ':' + segundosFormateados;
    document.title = `${_current == 'w'?'PWorking':'PResting'}: ${textTime.textContent}`;

    // Disminuye el tiempo total en un segundo
    tiempoTotal--;

    // Si el temporizador llega a cero, detén el intervalo
    if (tiempoTotal < 0) {
        clearInterval(_timeInterval);
        if(_current == 'w'){
            _current = 'r'
            aStopWork.play()
        }else{
            _current = 'w'
            aStopRest.play()
        }
    }
}, 1000); // Se ejecuta cada segundo (1000 milisegundos)
}