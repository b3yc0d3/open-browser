const { chromeLikeTabs } = require(__dirname + '/app/js/tabs.js')

const tabHandler = new chromeLikeTabs({
    tabContainer: document.getElementById('tab-container'),
    tabContentContainer: document.getElementById('tab-content'),
    varName: 'tabHandler',
    tabClickEvent: tabOnClick,
    tabAddClickEvent: tabAdd_OnClick,
    tabFocusChanged: tabFocusChanged
})

tabHandler.init()

function tabOnClick(tab) {
    console.log('tabOnClick', tab)
}

function tabAdd_OnClick(id) {
    console.log('tabAdded', id)
}

function tabFocusChanged(details) {
    document.title = `${details.title} - Hypero`
}