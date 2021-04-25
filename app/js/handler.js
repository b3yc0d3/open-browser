const packJS = require(__dirname + '/package.json')
const { Tabs } = require(__dirname + '/app/js/Tabs.js')
const textHelper = require(__dirname + '/app/js/text_helper.js')

const tabHandler = new Tabs({
    tabContainer: document.getElementById('tab-container'),
    tabContentContainer: document.getElementById('tab-content'),
    varName: 'tabHandler',
    tabClickEvent: tabOnClick,
    tabAddClickEvent: tabAdd_OnClick,
    tabFocusChanged: tabFocusChanged,
    onTitleChange: titleChange
})

var currentTab = null

function tabOnClick(tab) {

}

function tabAdd_OnClick(id) {

}

function tabFocusChanged(details) {
    currentTab = details.tabId
}

function titleChange(details) {
    document.title = `${details.title} - ${textHelper.titleCase(packJS.name.replace('-', ' '))}`
}

// init
document.addEventListener('DOMContentLoaded', (e) => {
    tabHandler.init()

    tabHandler.addTab({
        title: 'New Tab',
        favicon: null
    })

    tabHandler.getWebView(currentTab).addEventListener('ipc-message', onIpcMessage)

})

function onIpcMessage(event) {
    const { args, channel } = event

    switch (channel) {
        case 'reload':
            tabHandler.webview_reload(currentTab)
            break;

        case 'toggleDevTools':
            tabHandler.webview_toggleDevTools(currentTab)
            break;
    }
}