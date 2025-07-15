'use strict';



const icone = document.getElementById('icone');

const menu = document.getElementById('menu');
const mobilemenu = document.getElementById('mobilemenu')

const transferir = document.getElementById('func1');
const editEestoque = document.getElementById('func2');



let uso = false;
let cdbarra = 0

let canvas = document.getElementById('codereader');
let video = document.querySelector('video');
let stream = null;



icone.addEventListener('click', () => {

    const leftmenu = pxTovh(window.getComputedStyle(menu).left);
    const value = leftmenu;
    console.log("teste01")
    console.log(value)
    if (value == -75) {
        menu.style.left = '0vh';
        console.log("teste02")
        console.log(value)
    } else {
        menu.style.left = '-75vh';
        console.log("teste03")
    } if (uso == true) {
        alert("não é possivel trocar de função sem fechar a função atual");
        menu.style.left = '-75vh'
    }



});


transferir.addEventListener('click', () => {
    const telaTrasf = document.getElementById('transferencia');
    const teladisplay = window.getComputedStyle(telaTrasf).display;
    if (teladisplay == 'none') {
        telaTrasf.style.display = 'flex';
        menu.style.left = '-75vh';
        uso = true;
    }
})



editEestoque.addEventListener('click', () => {
    const armazens = document.getElementById('editarmazem');
    const armadisplay = window.getComputedStyle(armazens).display;
    if (armadisplay == 'none') {
        armazens.style.display = 'flex';
        menu.style.left = '-75vh';
        uso = true;
    }
})

function pxTovh(numpx) {

    const px = parseFloat(numpx);

    return parseFloat(((px / window.innerHeight) * 100).toFixed());
}



var constraints = {

    audio: false,
    video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 }
    }
};

function startcamera() {
    if (uso) return;
    navigator.mediaDevices.getUserMedia(constraints)
        .then((mediaStream) => {
            stream = mediaStream;
            video.srcObject = stream;
            video.play();
            uso = true
        }).catch((err) => {
            console.error("Erro ao acessar a câmera ", err)
            alert(err)
        })


}
function stopcamera() {
    if (stream) {
        stream.getTracks().forEach((track) => {
            track.stop();
        });
        video.srcObject = null;
        stream = null;
        uso = false
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
function reload() {
    location.reload()
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
        const response = await fetch('http://192.168.56.1:3000/transfere', {

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
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Erro ao transferir');
        }


        alert('transferencia bem sucedida!', result);
        console.log(result)
    } catch (error) {
        alert("Erro no front-end: " + error.message);
        console.error("Erro na transferência:", error);
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
            numeroCelula.type = 'text'
            numeroCelula.value = estoque.codigo;
            linha.appendChild(numeroCelula);

            // Adiciona a linha à tabela
            tabela.appendChild(linha);

        })


    } catch (erro) {
        console.error('erro ao pesquisar estoques', erro)
    }
}

async function pesquisamobile() {
    try {
        const response = await fetch('http://26.148.67.55:3000 /estoques');
        if (!response.ok) {
            throw new Error('Erro ao buscar estoques #1')
        }
        const data = await response.json()
        const tabela = document.getElementById('stqbodymobile')
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
            numeroCelula.type = 'text'
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
    return new Promise((resolve, reject) => {

        if (!canvas || !video) {
            reject("Canvas ou vídeo não encontrados.");
            return;
        }
        console.log("tirando a foto")
        alert('foto tirada');
        var contexto = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        contexto.drawImage(video, 0, 0, canvas.width, canvas.height);
        const img = document.createElement("img");
        img.src = canvas.toDataURL("image/png");
        img.onload = () => {
            resolve(img)
        }
        img.inerror = () => {
            reject("Erro ao carregar imagem")
        }
    })

}


async function readBarcode() {
    const table = document.getElementById('mobTransf2');
    const menu = document.getElementById('mobTransf1');
    menu.style.display = 'none'

    try {
        alert('Tirando foto...')
        const foto = await Photo();

        alert('Iniciando leitura');
        cdbarra = await new Promise((resolve, reject) => {
            Quagga.decodeSingle({
                src: foto.src,
                numOfWorkers: 0,
                decoder: {
                    readers: ["code_128_reader", "ean_8_reader", "upc_reader"]
                }, locate: true,

            },

                (result) => {
                    if (result && result.codeResult && result.codeResult.code) {
                        resolve(result.codeResult.code);
                    } else {
                        reject("Codigo de barras não lido")

                    }
                })
        })
        // codigo deve ter sido lido
        table.style.display = 'flex'
        alert("Codigo de barras lido com Sucesso: " + cdbarra);
        console.log("Codigo" + cdbarra);
    } catch (err) {
        alert(err);
        console.error(err);
    } finally {
        menu.style.display = 'flex'
    }
}

async function tranfmobile() {

    if (!cdbarra) {
        alert("Código de barras não lido!");
        return;
    }
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
