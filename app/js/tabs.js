class chromeLikeTabs {

  /**
   * Constructor
   * @param {ConstructorOBJ} obj 
   */
  constructor(obj) {
    this['tabContainer'] = obj.tabContainer // Tab List
    this['tabContentContainer'] = obj.tabContentContainer // Tab Content with controls and WebView

    this['varName'] = obj.varName // Name of this decleration
    // Events
    this['tabOnClick'] = obj.tabClickEvent
    this['tabAddClick'] = obj.tabAddClickEvent
    this['tabFocusChanged'] = obj.tabFocusChanged
    this['onTitleChange'] = obj.onTitleChange

    this['counter'] = 0
    this['tabs'] = {} // List of all currently created Tabs
    this['inited'] = false

    this['focusedTab'] = null
    this['focusedTabContainer'] = null
  }

  /**
   * Initialize Tab Container
   */
  init() {
    this['tabContainer'].innerHTML = `<ul id="tabs"><button id="buttonAddNewTab" class="btn btn-default" onclick="${this['varName']}.addTab({ title: 'New Tab', favicon: null })"><i class="symbol icon-add"></i></button></ul>`
    this['tabList'] = document.getElementById('tabs')

    this['inited'] = true
  }

  /**
   * Add's a new Tab
   * @param {TabObject} tabObject 
   */
  addTab(tabObject) {
    if (this['inited']) {
      var title = tabObject.title
      var favicon = tabObject.favicon || 'app/images/favicon_404.svg'
      var id = this['counter']
      var url = tabObject.url || "https://duckduckgo.com/chrome_newtab"

      var tab_obj = {
        title: title,
        favicon: favicon,
        tabId: id,
        url: url
      }

      //#region TabItem
      var LI = document.createElement('li')   // 1
      var div = document.createElement('div') // 2
      var img = document.createElement('img') // 3
      var a = document.createElement('a')     // 4

      var button = document.createElement('button') // 5
      var i_tag = document.createElement('i')       // 5.1

      LI.setAttribute('tabID', id)
      LI.id = `tab-${id}`
      LI.addEventListener('click', (e) => {
        this['tabOnClick'](tab_obj)
        this.focuseTab(id)
      })

      div.classList.add('top')
      img.src = favicon
      img.id = `favicon-${id}`
      a.innerText = title
      a.id = `title-${id}`

      button.classList.add('btnCloseTab')
      button.setAttribute('onclick', `${this['varName']}.closeTab(${id})`)
      i_tag.classList.add('symbol')
      i_tag.classList.add('icon-close')

      button.appendChild(i_tag)
      LI.appendChild(div)
      LI.appendChild(img)
      LI.appendChild(a)
      LI.appendChild(button)
      //#endregion

      //#region TabContent
      var div_0 = document.createElement('div')
      var div_ctrls = document.createElement('div')
      var div_inputb = document.createElement('div')
      var webv = document.createElement('webview')
      var inp_url = document.createElement('input')

      div_0.classList.add('tab-pane')
      div_0.id = `container-${id}`

      div_ctrls.innerHTML += `<button id="goback-${id}" onclick="${this['varName']}.webview_goBack(${id})" class="disabled"><i class="icon icon-arrow_back"></i></button>`
      div_ctrls.innerHTML += `<button id="goforward-${id}" onclick="${this['varName']}.webview_goForward(${id})" class="disabled"><i class="icon icon-arrow_forward"></i></button>`
      div_ctrls.innerHTML += `<button onclick="${this['varName']}.webview_reload(${id})" ><i id="reload-${id}" class="icon icon-refresh"></i></button>`

      inp_url.id = `inpurl-${id}`
      inp_url.setAttribute('type', 'text')
      inp_url.setAttribute('placeholder', 'URL')
      inp_url.setAttribute('autocomplete', 'url')
      inp_url.setAttribute('onfocus', 'this.select()')

      div_inputb.classList.add('inputURL')
      div_inputb.appendChild(inp_url)

      div_ctrls.appendChild(div_inputb)
      div_ctrls.classList.add('controls')
      div_ctrls.innerHTML += `<div id="custom-btns-${id}" style="display: flex; margin: 0 2.5px;"><button class="disabled"><i class="icon icon-extension"></i></button><button class="disabled"><i style="color: var(--background-accent) !important; opacity: .5;" class="icon icon-agent"></i></button></div>`
      div_ctrls.innerHTML += `<button onclick=""><i class="icon icon-more_vert"></i></button>`

      webv.id = `webview-${id}`
      webv.setAttribute('src', url)

      div_0.appendChild(div_ctrls)
      div_0.appendChild(webv)
      //#endregion

      this['tabList'].insertBefore(LI, document.getElementById('buttonAddNewTab'))
      this['tabContentContainer'].appendChild(div_0)
      this['tabs'][id] = tab_obj
      this['counter']++

      this.addEventListeners(id)

      this.focuseTab(id)
      //this['tabAddClick'](id)
    }
  }

  addEventListeners(id) {
    var inp_url = document.getElementById(`inpurl-${id}`)
    var webv = document.getElementById(`webview-${id}`)
    var btnGoBack = document.getElementById(`goback-${id}`)
    var btnGoForward = document.getElementById(`goforward-${id}`)
    var rl_button = document.getElementById(`reload-${id}`)

    //#region url input
    inp_url.addEventListener('keydown', (e) => {

      if (e.code === 'Enter') {
        webv.focus()

        // Internal URL matching like "chrome://<page>"
        if (inp_url.value.startsWith('ob://')) {
          this.webviewChangeURL(`https://duckduckgo.com/chrome_newtab`, id)
          return
        }

        // Normal URL Matching
        if (/(https?:\/\/|file:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/gm.test(inp_url.value)) {
          this.webviewChangeURL((!inp_url.value.startsWith('https://') || !inp_url.value.startsWith('http://') || !inp_url.value.startsWith('file://') ? `http://${inp_url.value}` : inp_url.value), id)
        } else {
          this.webviewChangeURL(`https://duckduckgo.com/?q=${inp_url.value.replace(' ', '+')}`, id)
        }
      }
    })
    //#endregion

    //#region webview event listsners
    webv.addEventListener('did-start-loading', (e) => {
      rl_button.classList.remove('icon-refresh')
      rl_button.classList.add('icon-close')

      if (webv.canGoBack()) {
        btnGoBack.classList.remove('disabled')
      } else {
        btnGoBack.classList.add('disabled')
      }

      if (webv.canGoForward()) {
        btnGoForward.classList.remove('disabled')
      } else {
        btnGoForward.classList.add('disabled')
      }
    })

    webv.addEventListener('did-finish-load', (e) => {
      rl_button.classList.remove('icon-close')
      rl_button.classList.add('icon-refresh')

      if (webv.canGoBack()) {
        btnGoBack.classList.remove('disabled')
      } else {
        btnGoBack.classList.add('disabled')
      }

      if (webv.canGoForward()) {
        btnGoForward.classList.remove('disabled')
      } else {
        btnGoForward.classList.add('disabled')
      }
    })

    webv.addEventListener('page-favicon-updated', (e) => {
      this.changeTabFavicon(id, e.favicons[0])
    })

    webv.addEventListener('will-navigate', (e) => {
      inp_url.value = e.url
    })

    webv.addEventListener('page-title-updated', (e) => {
      this.setTabTitle(id, e.title)
    })
    //#endregion
  }

  /**
   * Closes a Tab
   * @param {int} id 
   */
  closeTab(id) {
    document.getElementById(`tab-${id}`).remove()
    document.getElementById(`container-${id}`).remove()
    delete this['tabs'][id]

    this['focusedTab'] = null
    this['focusedTabContainer'] = null
  }

  /**
   * Set Focuse to a Specific Tab by ID
   * @param {int} id 
   */
  focuseTab(id) {
    var tab = document.getElementById(`tab-${id}`) // get tab
    var tabContent = document.getElementById(`container-${id}`) // get tab container

    // set's current focused tab
    if (this['focusedTab'] != null) {
      this['focusedTab'].classList.remove('active')
      this['focusedTab'] = null
    }
    this['focusedTab'] = tab
    this['focusedTab'].classList.add('active')

    // set's current focused tab container
    if (this['focusedTabContainer'] != null) {
      this['focusedTabContainer'].classList.remove('active')
      this['focusedTabContainer'] = tabContent
      tabContent.classList.add('active')
    } else {
      this['focusedTabContainer'] = tabContent
      tabContent.classList.add('active')
    }

    this['tabFocusChanged'](this['tabs'][id])
  }

  /**
   * Set's tab favicon
   * @param {int} id 
   * @param {URL} url 
   */
  changeTabFavicon(id, url) {
    this['tabs'][id]['favicon'] = url
    var tabIcon = document.getElementById(`favicon-${id}`)
    tabIcon.src = url
  }

  /**
   * Set's tab title
   * @param {int} id 
   * @param {Text} text 
   */
  setTabTitle(id, text) {
    var title = document.getElementById(`title-${id}`)
    title.innerText = text
    this['tabs'][id].title = text
    this['onTitleChange']({ id: id, title: text })
  }

  //#region WebViewe Helper Functions

  /**
   * Set's or changes the URL Location of the Focused WebView
   * @param {String} url 
   * @param {int} id 
   */
  webviewChangeURL(url, id) {
    var webv = document.getElementById(`webview-${id}`)
    var inpURL = document.getElementById(`inpurl-${id}`)
    webv.src = url
    inpURL.value = url
  }

  /**
   * Go back in history
   * @param {int} id 
   */
  webview_goBack(id) {
    var webv = document.getElementById(`webview-${id}`)
    if (webv.canGoBack()) {
      webv.goBack()
    }
  }

  /**
   * Go forward in history
   * @param {int} id 
   */
  webview_goForward(id) {
    var webv = document.getElementById(`webview-${id}`)
    if (webv.canGoForward()) {
      webv.goForward()
    }
  }

  /**
   * Reload webview content
   * @param {int} id 
   */
  webview_reload(id) {
    var webv = document.getElementById(`webview-${id}`)
    if (webv.isLoading()) {
      webv.stop()
    } else {
      webv.reload()
    }
  }

  /**
   * Togge DevTool
   * @param {int} id 
   */
  webview_toggleDevTools(id) {
    var webv = document.getElementById(`webview-${id}`)

    if (webv.isDevToolsOpen()) {
      webv.closeDevTools()
    } else {
      webv.openDevTools()
    }
  }
  //#endregion
}

module.exports.chromeLikeTabs = chromeLikeTabs