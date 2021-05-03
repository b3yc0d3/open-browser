var symboleNames = {
    ad: 'icon-ad',
    gif: 'icon-gif',
    location: 'icon-location',
    mic: 'icon-mic',
    nsfw: 'icon-nsfw',
    pin: 'icon-pin',
    sensors: 'icon-sensors',
    videocam: 'icon-videocam',
}

function addSymbol(name) {
    var icons = document.getElementById(`icons-${focusedTab}`)

    if (name in symboleNames) {
        /* create icon item */
        var div = document.createElement('div')
        var i_tag = document.createElement('i')
        i_tag.classList.add('symbole', `icon-${name}`)
        div.appendChild(i_tag)
        div.setAttribute('name', name)
        div.classList.add('icon')
        icons.appendChild(div)
    }
}

function removeSymbole(name) {
    var icons = document.getElementById(`icons-${focusedTab}`)

    if (name in symboleNames) {
        var items = icons.children

        for (var i = 0; i < items.length; i++) {
            var icon = items[i]

            if (icon.getAttribute('name') === name) {
                icon.remove()
            }
        }
    }
}

function clearSymboles() {
    var icons = document.getElementById(`icons-${focusedTab}`)

    icons.innerHTML = ''
}