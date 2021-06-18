const packJS = require(__dirname + '/package.json')
const helper = require(__dirname + '/app/js/helper.js')

var focusedTab = null
var lastFocusedTabID = null
var counter = 0     // current tab count
var tabs = {}       // List of all currently created Tabs

var tabList = document.getElementById('tabs')
var tabContentContainer = document.getElementById('tab-content')
var newTabURL = "ob://new_tab"

document.addEventListener('DOMContentLoaded', (e) => {
    addTab({
        title: null,
        url: null
    })
})

function tabFocusChanged(tab) {
    console.log(tab)
}

function tabClosed(tab) {

}

function onTitleChange(details) {
    document.title = `${details.title} - ${helper.titleCase(packJS.name.replace('-', ' '))}`
}

function webViewBlur() {

}

function webViewFocused() {
    hideMainMenu()
}