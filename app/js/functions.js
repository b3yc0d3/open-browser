var settings = remote.getGlobal('browser').settings

function addTab(tabObject) {
    var title = (tabObject.title == null ? "New Title" : tabObject.title)
    var favicon = (tabObject.favicon == null ? 'app/images/favicon_404.svg' : tabObject.favicon)
    var id = counter
    var url = tabObject.url || newTabURL

    var tab_obj = {
        title: title,
        favicon: favicon,
        tabId: id,
        url: url
    }

    //#region TabItem

    var tab_li = document.createElement('li')   // 1
    var line_div = document.createElement('div') // 2
    var img_favicon = document.createElement('img') // 3
    var a_title = document.createElement('a')     // 4

    var button_close = document.createElement('button') // 5
    var i_tag = document.createElement('i')       // 5.1

    tab_li.setAttribute('tabID', id)
    tab_li.id = `tab-${id}`
    tab_li.addEventListener('click', (e) => {
        focuseTab(id)
        tabFocusChanged(tabObject)
    })

    line_div.classList.add('top')
    img_favicon.src = favicon
    img_favicon.id = `favicon-${id}`
    img_favicon.setAttribute('onerror', 'this.src="app/images/favicon_404.svg"')

    a_title.innerText = title
    a_title.id = `title-${id}`

    button_close.classList.add('btnCloseTab')
    button_close.addEventListener('click', (e) => {
        closeTab(id)
        tabClosed(tabObject)
    })
    i_tag.classList.add('symbol')
    i_tag.classList.add('icon-close')

    button_close.appendChild(i_tag)
    tab_li.appendChild(line_div)
    tab_li.appendChild(img_favicon)
    tab_li.appendChild(a_title)
    tab_li.appendChild(button_close)
    //#endregion

    //#region TabContent
    var div_0 = document.createElement('div')
    var div_ctrls = document.createElement('div')
    var div_inputb = document.createElement('div')
    var webv = document.createElement('webview')
    var inp_url = document.createElement('input')
    var page_icons = document.createElement('div')

    div_0.classList.add('tab-pane')
    div_0.id = `container-${id}`

    var btnGoBack = document.createElement('button')
    btnGoBack.id = `btnGoBack-${id}`
    btnGoBack.classList.add('disabled')
    btnGoBack.innerHTML = `<i class="icon icon-arrow_back"></i>`
    btnGoBack.setAttribute('onclick', `goBack(${id})`)

    var btnGoForward = document.createElement('button')
    btnGoForward.id = `btnGoForward-${id}`
    btnGoForward.classList.add('disabled')
    btnGoForward.innerHTML = `<i class="icon icon-arrow_forward"></i>`
    btnGoForward.setAttribute('onclick', `goForward(${id})`)

    var btnReload = document.createElement('button')
    btnReload.id = `btnreload-${id}`
    var btnReload_icon = document.createElement('i')
    btnReload_icon.id = `reloadIcon-${id}`
    btnReload_icon.classList.add('icon', 'icon-refresh')
    btnReload.appendChild(btnReload_icon)
    //btnReload.setAttribute('onclick', `reload(${id})`)

    inp_url.id = `inpurl-${id}`
    inp_url.setAttribute('type', 'text')
    inp_url.setAttribute('placeholder', 'search with duckduckgo or enter url')
    inp_url.setAttribute('value', (url != "ob://new_tab" ? url : ''))

    page_icons.classList.add('icons')
    page_icons.id = `icons-${id}`

    div_inputb.classList.add('inputURL')
    div_inputb.appendChild(inp_url)
    div_inputb.appendChild(page_icons)

    div_ctrls.appendChild(btnGoBack)
    div_ctrls.appendChild(btnGoForward)
    div_ctrls.appendChild(btnReload)
    div_ctrls.appendChild(div_inputb)
    div_ctrls.classList.add('controls')
    div_ctrls.innerHTML += `<div id="custom-btns-${id}" style="display: flex; margin: 0 2.5px;"><button class="disabled"><i class="icon icon-download"></i></button></div>`
    div_ctrls.innerHTML += `<button class="btn_mainMenu"><i class="icon icon-more_vert btn_mainMenu"></i></button>`

    webv.id = `webview-${id}`
    webv.setAttribute('src', url)
    webv.setAttribute('nodeintegration', '')
    webv.setAttribute('preload', 'app/js/preload.js')
    webv.setAttribute('tabindex', '0')

    div_0.appendChild(div_ctrls)
    div_0.appendChild(webv)
    //#endregion

    tabList.insertBefore(tab_li, document.getElementById('buttonAddNewTab'))
    tabContentContainer.appendChild(div_0)
    tabs[id] = tab_obj
    counter++

    addEventListeners(id)
    focuseTab(id)
}

function addEventListeners(id) {
    var webv = document.getElementById(`webview-${id}`)
    var inp_url = document.getElementById(`inpurl-${id}`)
    var btnGoBack = document.getElementById(`btnGoBack-${id}`)
    var btnGoForward = document.getElementById(`btnGoForward-${id}`)
    var btnReload = document.getElementById(`btnreload-${id}`)
    var reloadIcon = document.getElementById(`reloadIcon-${id}`)


    btnReload.addEventListener('click', (e) => {
        if (webv.isLoading()) {
            webv.stop()
        } else {
            reloadTab(id)
        }
    })
    inp_url.addEventListener('keydown', (e) => {
        if (e.code === 'Enter') {
            var url = inp_url.value
            loadUrl(url, id)
        }
    })

    /* WebView */
    webv.addEventListener('dom-ready', (e) => {
        webv.executeJavaScript(`navigator.globalPrivacyControl = ${settings.get('gpc.enabled', false)}`)
    })

    webv.addEventListener('did-start-loading', (e) => {
        clearSymboles(id)
        webview_didStartLoading(webv, reloadIcon, btnGoBack, btnGoForward)
    })
    webv.addEventListener('did-finish-load', (e) => {
        webview_didFinishlLoad(webv, reloadIcon, btnGoBack, btnGoForward)

        var url = e.target.getURL()
        let domain = (new URL(url))

        if (isNSFW(url) && !isInNSFWOfList(domain.hostname)) {
            webv.send('nsfw_warning')
            addSymbol('nsfw', id)
        }
    })
    webv.addEventListener('page-favicon-updated', (e) => {
        setFavicon(id, e.favicons[0])
    })
    webv.addEventListener('will-navigate', (e) => {
        if (!e.url.includes('ob://new_tab')) {
            inp_url.value = e.url
        }
    })
    webv.addEventListener('did-navigate', (e) => {
        var url = e.url
        if (!url.includes('ob://new_tab')) {
            inp_url.value = url
        }
    })
    webv.addEventListener('page-title-updated', (e) => {
        setTabTitle(id, e.title)
    })
    webv.addEventListener('new-window', (e) => {
        addTab({
            title: '',
            favicon: null,
            url: e.url
        })
    })
    webv.addEventListener('ipc-message', onIpcMessage)
}

function onIpcMessage(event) {
    const { args, channel } = event

    switch (channel) {

        case 'reload':
            reload(focusedTab)
            break;

        case 'toggleDevTools':
            toggleDevTools(focusedTab)
            break;

        case 'blur':
            webViewBlur()
            break;

        case 'focus':
            webViewFocused()
            break;

        case 'nsfw--addToWhiteList':
            console.log(args[0])
            settings.nsfw_addToWhiteList(args[0])
            break;
    }
}

function reloadTab(id = null) {
    var webv = document.getElementById(`webview-${(id == null ? focusedTab : id)}`)
    if (webv.isLoading()) {
        webv.stop()
    } else {
        webv.reload()
    }
}

function focuseTab(id) {
    var _id = (id == null ? focusedTab : id)

    /* Check if given ID is valid */
    if (document.getElementById(`tab-${_id}`) == undefined) {
        _id = lastFocusedTabID
    }

    var tab = document.getElementById(`tab-${_id}`) // get tab
    var tabContent = document.getElementById(`container-${_id}`) // get tab container

    /* Try to remove "acvtive" from current focused Tab */
    try {
        document.getElementById(`tab-${focusedTab}`).classList.remove('active')
        document.getElementById(`container-${focusedTab}`).classList.remove('active')
    } catch (err) {
        // i dont care if here is a error tbh
    }

    lastFocusedTabID = focusedTab
    focusedTab = _id
    tab.classList.add('active')
    tabContent.classList.add('active')

    /* Trigger Event for user */
    tabFocusChanged(tabs[_id])
}

function toggleNodeintegration(id, on_off) {
    var webv = document.getElementById(`webview-${id}`)

    if (!on_off && webv.hasAttribute('nodeintegration')) {
        webv.removeAttribute('nodeintegration')
    } else if (on_off && !webv.hasAttribute('nodeintegration')) {
        webv.setAttribute('nodeintegration', '')
    }
}

function setTabTitle(id, text) {
    var title = document.getElementById(`title-${id}`)
    title.innerText = text
    title.setAttribute('title', text)
    tabs[id].title = text
    onTitleChange({ id: id, title: text })
}

function setFavicon(id, url) {
    tabs[id]['favicon'] = url
    var tabIcon = document.getElementById(`favicon-${id}`)
    tabIcon.src = url
}

function loadUrl(url, id) {
    var webv = document.getElementById(`webview-${id}`)
    var inpURL = document.getElementById(`inpurl-${id}`)
    var _url = ""

    webv.focus()

    toggleNodeintegration(id, false)

    if (isURL(url) || isIP(url)) {
        if (!url.startsWith('http')) {
            _url = `http://${url}`
        } else {
            _url = `${url}`
        }

    } else {
        if (url.startsWith('ob://') || url.startsWith('file://')) {
            toggleNodeintegration(id, true)
            _url = url
        } else {
            _url = `https://duckduckgo.com/?q=${url.replaceAll(' ', '+')}`
        }
    }

    webv.src = _url
    inpURL.value = _url
}

function goBack(id) {
    var webv = document.getElementById(`webview-${(id == null ? focusedTab : id)}`)
    if (webv.canGoBack()) {
        webv.goBack()
    }
}

function goForward(id) {
    var webv = document.getElementById(`webview-${(id == null ? focusedTab : id)}`)
    if (webv.canGoForward()) {
        webv.goForward()
    }
}

function closeTab(id) {
    var _id = (id == null ? focusedTab : id)
    document.getElementById(`tab-${_id}`).remove()
    document.getElementById(`container-${_id}`).remove()
    delete tabs[_id]

    if (lastFocusedTabID != null && focusedTab.id == _id) {
        focuseTab(lastFocusedTabID)
    }
}

function isURL(url) {
    var regex = /((http|https):\/\/)?([a-z._0-9]{2,})\.?([a-z0-9]{3,})\.([a-z0-9]{2,5})(\/.*)?/gim
    if (!regex.test(url)) {
        return false
    }

    return true
}

function isIP(url) {
    var regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/gim
    if (regex.test(url) || url.includes('localhost')) {
        return true
    }

    return false
}

function toggleDevTools(id) {
    var _id = (id == null ? focusedTab : id)
    var webv = document.getElementById(`webview-${_id}`)

    if (webv.isDevToolsOpened()) {
        webv.closeDevTools()
    } else {
        webv.openDevTools()
    }
}
