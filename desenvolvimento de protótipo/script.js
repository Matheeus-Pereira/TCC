const icone = document.getElementById('icone');
const menu = document.getElementById('menu');





icone.addEventListener('click', () => {

    const leftmenu = pxTovh(window.getComputedStyle(menu).left);
    const value = leftmenu;
    console.log("teste01")
    if (value == -42 || value==-46) {
        menu.style.left = '0vh';
        console.log("teste02")
        console.log(value)
        vmobile = value;
    } else if(vmobile==-46) {
        menu.style.left = '-46vh';
        console.log("teste03")
    }else{
        menu.style.left = '-42vh';
        console.log('teste04');
    }



});

function pxTovh(numpx) {

    const px = parseFloat(numpx);

    return parseFloat(((px / window.innerHeight) * 100).toFixed(2));
}

function transferir() {

}
function editarmz() {

}
