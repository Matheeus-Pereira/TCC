'use strict';

const icone = document.getElementById('icone');
const menu = document.getElementById('menu');
const mobilemenu = document.getElementById('mobilemenu')
const transferir = document.getElementById('func1');
const editEestoque = document.getElementById('func2');
var canvas = document.getElementById('codereader');

let uso = false;

var video = document.querySelector('video');
var stream;

var constraints = {
    audio: false,
    video: {
        facingMode: {
            ideal: "environment"

        }
    }
};
var erro = document.getElementById('error');

function startcamera() {
    navigator.mediaDevices.getUserMedia(constraints)
        .then((mediaStream) => {
            stream = mediaStream;
            video.srcObject = stream;
        })


}
function stopcamera() {
    if (stream) {
        stream.getTracks().forEach((track) => {
            track.stop();
        });
        video.srcObject = null;
        stream = null;
    }

};


function mobileTransf() {
    var face = document.getElementById('face');
    face.style.transition = '400ms';
    face.style.transitionDelay = '400ms';


    if (stream) {
        face.style.display = 'none';
        video.style.display = 'none';
        stopcamera();
    } else {
        face.style.display = 'flex';
        video.style.display = 'flex';
        mobilemenu.style.display = 'none';
        startcamera();
    }
}
function mobilearmz() {
    const armobile = document.getElementById('armobile');
    const dispmobile = window.getComputedStyle(armobile).display;
    if (dispmobile == 'none') {
        armobile.style.display = 'flex'
        mobilemenu.style.display = 'none'

    }
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
        alert("não é possivel trocar de função sem fechar a função atual");
        console.log("devia fazer o alerta")
    }



});

editEestoque.addEventListener('click', () => {
    const armazens = document.getElementById('editarmazem');
    const armadisplay = window.getComputedStyle(armazens).display;
    if (armadisplay == 'none') {
        armazens.style.display = 'flex';
        menu.style.left = '-42vh';
        uso = true;
    }
})

function pxTovh(numpx) {

    const px = parseFloat(numpx);

    return parseFloat(((px / window.innerHeight) * 100).toFixed(2));
}
function fechar(button) {

    const form = button.closest('form');
    const display = window.getComputedStyle(form).display

    if (display == 'flex') {
        form.style.display = 'none';
        uso = false;
    }
}

function transfere() {

}
function editarmz() {

}

function Photo() {
    var contexto = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

    var img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    return img;
}

function readBarcode(code) {

    if (!code || !code.src) {
        console.error("imagem não fornecida ou não carregada")
        return;
    }

    Quagga.decodeSingle({
        src: code.src,
        numOfWorkers: 0,
        decoder: {
            readers: ["code_128_reader", "ean_8_reader", "upc_reader"]
        }
    },
        (result) => {
            const teset = document.getElementById('teste');
            if (result && result.codeResult) {
                console.log('Código de barras lido: ', result.codeResult.code);
                teset.innerHTML = `<p>${result.codeResult.code}</p>`;

            } else {
                alert("impossivel ler codigo de barras")
            }
        });
}



//---------------------------ACESSANDO ENDPOIT----------------------

try {
    const response = await fetch('http://localhost:3000/transferir-item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: 1, // Substitua com o ID correto do item
            origem: 'Estoque A', // Substitua pela origem correta
            destino: 'Estoque B', // Substitua pelo destino correto
            quantidade: 10 // Substitua pela quantidade correta
        })
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || 'Erro ao fazer login');
    }

    alert('Login bem-sucedido!');
    window.location.href = "principal.html";
} catch (error) {
    alert(error.message);
}
