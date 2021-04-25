class Tabs {

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
    this['lastFocusedTabID'] = null
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
      var favicon = (tabObject.favicon == null ? 'app/images/favicon_404.svg' : tabObject.favicon)
      var id = this['counter']
      var url = tabObject.url || "ob://new_tab"

      var tab_obj = {
        title: title,
        favicon: favicon,
        tabId: id,
        url: url
      }

      //#region TabItem
      var tab_item = new TabItem(tab_obj, {
        tabOnClick: () => {
          this['tabOnClick'](tab_obj)
          this.focuseTab(id)
        },
        tabcCosed: () => {
          this['closed'] = true
          this.closeTab(id)
        }
      })
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
      //inp_url.setAttribute('value', url)

      div_inputb.classList.add('inputURL')
      div_inputb.appendChild(inp_url)

      div_ctrls.appendChild(div_inputb)
      div_ctrls.classList.add('controls')
      div_ctrls.innerHTML += `<div id="custom-btns-${id}" style="display: flex; margin: 0 2.5px;"><button class="disabled"><i class="icon icon-download"></i></button><button class="disabled"><i class="icon icon-extension"></i></button><button class="disabled"><i style="color: var(--background-accent) !important; opacity: .5;" class="icon icon-agent"></i></button></div>`
      div_ctrls.innerHTML += `<button onclick=""><i class="icon icon-more_vert"></i></button>`

      webv.id = `webview-${id}`
      webv.setAttribute('src', url)
      webv.setAttribute('nodeintegration', '')
      webv.setAttribute('preload', 'app/js/webview.js')

      div_0.appendChild(div_ctrls)
      div_0.appendChild(webv)
      //#endregion

      this['tabList'].insertBefore(tab_item.getHTML(), document.getElementById('buttonAddNewTab'))
      this['tabContentContainer'].appendChild(div_0)
      this['tabs'][id] = tab_obj
      this['counter']++

      this.addEventListeners(id)

      this.focuseTab(id)
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
        var url = inp_url.value

        // Internal URL matching like "chrome://<page>"
        /* MOVED TO ./scripts/protocols.js */

        if (url.startsWith('ob') || url.startsWith('file')) {
          return this.webviewChangeURL(url, id)
        }


        if (/(https?:\/\/|file:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/gm.test(url)) {
          if (url.startsWith('https://') || url.startsWith('http://' || url.startsWith('file://'))) {
            return this.webviewChangeURL(url, id)
          } else {
            return this.webviewChangeURL(`https://${url}`, id)
          }
        } else {
          return this.webviewChangeURL(`https://duckduckgo.com/?q=${url.replace(' ', '+')}`, id)
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
      if (!e.url.includes('ob://new_tab')) {
        inp_url.value = e.url
      }
    })

    webv.addEventListener('page-title-updated', (e) => {
      this.setTabTitle(id, e.title)
    })

    webv.addEventListener('new-window', (e) => {
      this.addTab({
        title: '',
        favicon: null,
        url: e.url
      })
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

    if (this['lastFocusedTabID'] != null && this['focusedTab'].id == id) {
      this.focuseTab(this['lastFocusedTabID'])
    }
  }

  /**
   * Set Focuse to a Specific Tab by ID
   * @param {int} id 
   */
  focuseTab(id) {
    var _id = id

    /* Check if given ID is valid */
    if (document.getElementById(`tab-${_id}`) == undefined) {
      _id = this['lastFocusedTabID']
    }

    var tab = document.getElementById(`tab-${_id}`) // get tab
    var tabContent = document.getElementById(`container-${_id}`) // get tab container

    /* Try to remove "acvtive" from current focused Tab */
    try {
      document.getElementById(`tab-${this['focusedTab']}`).classList.remove('active')
      document.getElementById(`container-${this['focusedTab']}`).classList.remove('active')
    } catch (err) {
      // i dont care if here is a error tbh
    }

    this['lastFocusedTabID'] = this['focusedTab']
    this['focusedTab'] = _id
    tab.classList.add('active')
    tabContent.classList.add('active')

    /* Trigger Event for user */
    this['tabFocusChanged'](this['tabs'][_id])
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
    title.setAttribute('title', text)
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

    if (webv.isDevToolsOpened()) {
      webv.closeDevTools()
    } else {
      webv.openDevTools()
    }
  }
  //#endregion

  getWebView(id) {
    return document.getElementById(`webview-${id}`)
  }

}

class TabItem {
  constructor(tab_object, events) {
    this['title'] = tab_object.title
    this['favicon'] = (tab_object.favicon == null ? 'app/images/favicon_404.svg' : tab_object.favicon)
    this['id'] = tab_object.tabId
    this['url'] = tab_object.url || "ob://new_tab"

    this['evnt_func'] = events
  }

  getHTML() {
    var tab_li = document.createElement('li')   // 1
    var line_div = document.createElement('div') // 2
    var img_favicon = document.createElement('img') // 3
    var a_title = document.createElement('a')     // 4

    var button_close = document.createElement('button') // 5
    var i_tag = document.createElement('i')       // 5.1

    tab_li.setAttribute('tabID', this['id'])
    tab_li.id = `tab-${this['id']}`
    tab_li.addEventListener('click', (e) => {
      this['evnt_func']['tabOnClick']()
    })

    line_div.classList.add('top')
    img_favicon.src = this['favicon']
    img_favicon.id = `favicon-${this['id']}`
    img_favicon.setAttribute('onerror', 'this.src="app/images/favicon_404.svg"')

    a_title.innerText = this['title']
    a_title.id = `title-${this['id']}`

    button_close.classList.add('btnCloseTab')
    button_close.addEventListener('click', (e) => {
      this['evnt_func']['tabcCosed']()
    })
    i_tag.classList.add('symbol')
    i_tag.classList.add('icon-close')

    button_close.appendChild(i_tag)
    tab_li.appendChild(line_div)
    tab_li.appendChild(img_favicon)
    tab_li.appendChild(a_title)
    tab_li.appendChild(button_close)

    return tab_li
  }
}

module.exports.Tabs = Tabs