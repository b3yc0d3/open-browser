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

function tabOnClick(tab) {
    console.log('tabOnClick', tab)
}

function tabAdd_OnClick(id) {
    console.log('tabAdded', id)
}

function tabFocusChanged(details) {

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

})