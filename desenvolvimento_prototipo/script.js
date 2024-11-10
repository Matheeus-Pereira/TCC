'use strict';



const icone = document.getElementById('icone');

const menu = document.getElementById('menu');
const mobilemenu = document.getElementById('mobilemenu')

const transferir = document.getElementById('func1');
const editEestoque = document.getElementById('func2');



let uso = false;
let cdbarra = 0

var canvas = document.getElementById('codereader');
var video = document.querySelector('video');
var stream;

icone.addEventListener('click', () => {

    const leftmenu = pxTovh(window.getComputedStyle(menu).left);
    const value = leftmenu;
    console.log("teste01")
    if (value == -72) {
        menu.style.left = '0vh';
        console.log("teste02")
        console.log(value)
    } else {
        menu.style.left = '-72vh';
        console.log("teste03")
    } if (uso == true) {
        alert("não é possivel trocar de função sem fechar a função atual");
        menu.style.left = '-72vh'
    }



});


transferir.addEventListener('click', () => {
    const telaTrasf = document.getElementById('transferencia');
    const teladisplay = window.getComputedStyle(telaTrasf).display;
    if (teladisplay == 'none') {
        telaTrasf.style.display = 'flex';
        menu.style.left = '-72vh';
        uso = true;
    }
})



editEestoque.addEventListener('click', () => {
    const armazens = document.getElementById('editarmazem');
    const armadisplay = window.getComputedStyle(armazens).display;
    if (armadisplay == 'none') {
        armazens.style.display = 'flex';
        menu.style.left = '-72vh';
        uso = true;
    }
})

function pxTovh(numpx) {

    const px = parseFloat(numpx);

    return parseFloat(((px / window.innerHeight) * 100).toFixed(2));
}



var constraints = {
    audio: false,
    video: {
        facingMode: {
            ideal: "environment"

        }
    }
};

function startcamera() {
    navigator.mediaDevices.getUserMedia(constraints)
        .then((mediaStream) => {
            stream = mediaStream;
            video.srcObject = stream;
        })
    uso = true

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
        uso = true
    }
}


function fechar(button) {

    const form = button.closest('form');
    const display = window.getComputedStyle(form).display

    if (display == 'flex') {
        form.style.display = 'none';
        uso = false;
    }

}

async function transfere(nm, or, des, quant) {

    try {
        const response = await fetch('http://localhost:3000/transfere', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: nm,
                origem: or,
                destino: des,
                quantidade: quant
            })
        });
        if (!response.ok) {
            throw new Error(result.error || 'Erro ao transferir');
        }
        const result = await response.json();

        alert('transferencia bem sucedida!', result);
        console.log(result)
    } catch (error) {
        alert("erro no front", error.message);
    }

}
async function pesquisa() {


    try {
        const response = await fetch('http://localhost:3000/estoques');
        if (!response.ok) {
            throw new Error('Erro ao buscar estoques #1')
        }
        const data = await response.json()
        const tabela = document.getElementById('stqbody')
        tabela.innerHTML = ''

        data.forEach(estoque => {
            const linha = document.createElement('tr');
            console.log(estoque.nome, estoque.codigo)

            // Cria célula para o depósito
            const depositoCelula = document.createElement('td');
            depositoCelula.textContent = estoque.nome;
            linha.appendChild(depositoCelula);

            // Cria célula para a numeração
            const numeroCelula = document.createElement('input');
            numeroCelula.type='text'
            numeroCelula.value = estoque.codigo;
            linha.appendChild(numeroCelula);

            // Adiciona a linha à tabela
            tabela.appendChild(linha);

        })


    } catch (erro) {
        console.error('erro ao pesquisar estoques', erro)
    }
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

//devo definir quando usar essa função e quando não
function readBarcode(Photo) {

    if (!Photo || !Photo.src) {
        console.error("imagem não fornecida ou não carregada")
        return;
    }

    Quagga.decodeSingle({
        src: Photo.src,
        numOfWorkers: 0,
        decoder: {
            readers: ["code_128_reader", "ean_8_reader", "upc_reader"]
        }
    },
        (result) => {
            // provisório para o mobile 
            const table = document.getElementById('mobTransf2');
            const menu = document.getElementById('mobTranf1')
            if (result && result.codeResult) {
                console.log('Código de barras lido: ', result.codeResult.code);
                cdbarra = result.codeResult.code;
                table.style.display = 'flex'
                menu.style.display = 'none'

            } else {
                alert("impossivel ler codigo de barras")
            }
        });



}

async function tranfmobile() {

    const quant = document.getElementById('qtditem2').value
    const depori = document.getElementById('dporigem2').value
    const depdest = document.getElementById('dpdestino2').value
    console.log(quant, depori, depdest);
    await transfere(cdbarra, depori, depdest, quant)
}

async function trasnfdesktop() {
    const cditem = document.getElementById('cditem').value
    const quant = document.getElementById('qtditem').value

    const depori = document.getElementById('dporigem').value
    const depdest = document.getElementById('dpdestino').value

    console.log(cditem, depori, depdest, quant);
    await transfere(cditem, depori, depdest, quant)

}


//---------------------------ACESSANDO ENDPOIT----------------------



// try {
//     const response = await fetch('http://localhost:3000/transferir-item', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             id: 1, // Substitua com o ID correto do item
//             origem: 'Estoque A', // Substitua pela origem correta
//             destino: 'Estoque B', // Substitua pelo destino correto
//             quantidade: 10 // Substitua pela quantidade correta
//         })
//     });

//     const result = await response.json();

//     if (!response.ok) {
//         throw new Error(result.error || 'Erro ao fazer login');
//     }

//     alert('Login bem-sucedido!');
//     window.location.href = "principal.html";
// } catch (error) {
//     alert(error.message);
// }
