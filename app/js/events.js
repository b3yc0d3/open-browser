function webview_didStartLoading(webv, btnReload_icon, btnGoBack, btnGoForward) {
    btnReload_icon.classList.remove('icon-refresh')
    btnReload_icon.classList.add('icon-close')

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
}

function webview_didFinishlLoad(webv, btnReload_icon, btnGoBack, btnGoForward) {
    btnReload_icon.classList.remove('icon-close')
    btnReload_icon.classList.add('icon-refresh')

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
}