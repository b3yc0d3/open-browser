
var menu = document.getElementById('main_menu')

document.addEventListener('click', (e) => {

    if (!e.target.classList.contains('menu_btn')) {
        menu.style.display = 'none'

    } else if (e.target.classList.contains('menu_btn')) {
        var style = e.target.currentStyle || window.getComputedStyle(e.target)
        var width = e.target.offsetWidth,
            margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
            padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
            border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth)

        var y = e.path[0].offsetTop + e.target.offsetHeight
        var x = e.path[0].offsetLeft - (width + margin - padding + border)

        menu.style.top = y
        menu.style.left = x
        menu.style.display = 'block'
    }
})