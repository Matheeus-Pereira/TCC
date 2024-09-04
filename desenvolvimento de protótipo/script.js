'use strict';
const icone = document.getElementById('icone');
const menu = document.getElementById('menu');
const transferir = document.getElementById('func1');
const editEestoque = document.getElementById('func2');
let uso = false;

var video = document.querySelector('video');
var cameraButton = document.getElementById('cameraButton');
var stream;

var constraints = {
    audio: false,
    video: {
        facingMode: {
            exact: "environment"

        }
    }
};
var erro = document.getElementById('error');

function startcamera() {
    navigator.mediaDevices.getUserMedia(constraints)
        .then((mediaStream) => {
            stream = mediaStream;
            video.srcObject = stream;
            cameraButton.textContent = "desligar"
        })
        .catch((error) => {
            error("erro ao acessar cmaera: 0" + error.name)
        });

}
function stopcamera() {
    if (stream) {
        stream.getracks().forEach((track) => {
            track.stop();
        });
        video.srcObject = null;
        stream = null;
        cameraButton.textContent = "ligar";
    }
};

cameraButton.addEventListener('click', () => {
    if (stream) {
        stopcamera();
    } else {
        startcamera();//fazer essa função ligar com o botão de realizar transferencias e desligar com o de ler o codigo de barras
    }
});
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(function (registration) {
            console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch(function (error) {
            console.log('Falha ao registrar o Service Worker:', error);
        });
}

transferir.addEventListener('click', () => {
    const telaTrasf = document.getElementById('transferencia');
    const teladisplay = window.getComputedStyle(telaTrasf).display;
    if (teladisplay == 'none') {
        telaTrasf.style.display = 'flex';
        menu.style.left = '-42vh';
        uso = true;
    }
})


icone.addEventListener('click', () => {

    const leftmenu = pxTovh(window.getComputedStyle(menu).left);
    const value = leftmenu;
    console.log("teste01")
    if (value == -42) {
        menu.style.left = '0vh';
        console.log("teste02")
        console.log(value)
    } else {
        menu.style.left = '-42vh';
        console.log("teste03")
    } if (uso == true) {
        menu.style.left = '-42vh';
        alerta();
        console.log("devia fazer o alerta")
    }



});

function alerta() {
    alert("é necessário fechar a funcionalidade atua!");
}

function pxTovh(numpx) {

    const px = parseFloat(numpx);

    return parseFloat(((px / window.innerHeight) * 100).toFixed(2));
}
function fechar(button) {

    const form = button.closest('form');
    display = window.getComputedStyle(form).display

    if (display == 'flex') {
        form.style.display = 'none';
        uso = false;
    }
}

function transfere() {

}
function editarmz() {

}


function errorMsg(msg, error) {
    errorElement.innerHTML += "<p>" + msg + "</p>";
    if (typeof error !== "undefined") {
        console.error(error);
    }
}