const { remote } = require('electron')

var info = remote.getGlobal('browser').info

document.addEventListener('DOMContentLoaded', async (e) => {
    console.log('yes')
    var body = document.getElementsByTagName('body')

    for (var i = 0; i < body.length; i++) {
        var data = body[i].innerHTML

        data = data.replace('{{OS_FULLNAME}}', info.os.name)
        data = data.replace('{{ARCH}}', info.os.arch)

        data = data.replace('{{OB_VERSION}}', `v${info.versions.dusk}`)
        data = data.replace('{{ELECTRON_VERSION}}', `v${info.versions.electron}`)
        data = data.replace('{{CHROME_VERSION}}', `v${info.versions.chromium}`)
        data = data.replace('{{JS_VERSION}}', `v${info.versions.javascript}`)

        data = data.replace('{{OS_NAME}}', `${info.os.platform.charAt(0).toUpperCase() + info.os.platform.slice(1)}`)
        data = data.replace('{{USER_AGENT}}', `${info.user_agent}`)

        data = data.replaceAll('{{GIT_REPO_URI}}', info.repo.url)

        body[i].innerHTML = data
    }
})