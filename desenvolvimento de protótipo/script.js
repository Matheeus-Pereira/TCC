const icone = document.getElementById('icone');
const menu = document.getElementById('menu');
const transferir = document.getElementById('func1');
const editEestoque = document.getElementById('func1');
let uso = false;


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