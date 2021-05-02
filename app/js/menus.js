var mainMenu = null

document.addEventListener('DOMContentLoaded', (e) => {
    mainMenu = document.getElementById('main_menu')

    document.addEventListener('click', (e) => {

        hideMainMenu()

        if (e.target.classList.contains('btn_mainMenu')) {
            mainMenu.style.display = 'flex'
            var y = getOffsetTop(e.target.offsetParent) + e.target.offsetParent.offsetWidth
            var x = getOffsetLeft(e.target.offsetParent) - (200 - e.target.offsetParent.offsetWidth)

            mainMenu.style.top = y
            mainMenu.style.left = x
        }
    })
})

function getWidth(e) {
    var style = e.currentStyle || window.getComputedStyle(e)
    var width = e.offsetWidth,
        margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
        padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
        border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth)

    return width + margin + padding + border
}

function getOffsetLeft(elem) {
    var offsetLeft = 0;
    do {
        if (!isNaN(elem.offsetLeft)) {
            offsetLeft += elem.offsetLeft;
        }
    } while (elem = elem.offsetParent);
    return offsetLeft;
}

function getOffsetTop(elem) {
    var offsetTop = 0;
    do {
        if (!isNaN(elem.offsetTop)) {
            offsetTop += elem.offsetTop;
        }
    } while (elem = elem.offsetParent);
    return offsetTop;
}

function hideMainMenu() {
    mainMenu.style.display = 'none'
}