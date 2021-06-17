import BalkanCore from "./Balkan/BalkanCore.js";

const Editor = {}

function init () {
    if ( document.querySelector( 'html' ).classList.contains( 'dark' ) ) {
        document.querySelector('#prism-css').href= '/static/lib/prismjs/prism_dark.css'
    } else {
        document.querySelector('#prism-css').href= '/static/lib/prismjs/prism_light.css'
    }

    
}

async function ready () {
    Editor.BalkanRender = new BalkanCore.Render('#balkan')
    Editor.BalkanKeyManager = new BalkanCore.KeyManager('en_us')
    Editor.BalkanSession = new BalkanCore.Session()
    Editor.BalkanSession.registerFile(new BalkanCore.File('app.js', 'javascript'))
    Editor.BalkanSession.files['app.js'].setValue('let str = "Hello, World!"')
    Editor.BalkanSession.files['app.js'].insertLine(1, 'console.log(str)')
    Editor.BalkanSession.files['app.js'].insertLine(2, '')
    
    console.log('Balkan Ready')
}

async function update () {
    Editor.BalkanRender.drawUpdate(Editor.BalkanSession)
}

async function strokeUpdate (keyboardEvent) {
    console.log(keyboardEvent.keyCode)
    Editor.BalkanKeyManager.handleKeyEvent(Editor.BalkanSession, keyboardEvent)
    console.log(Editor.BalkanSession.position)
}


// Event loop
Editor.CONSTANTS = {
    fixedUpdateInterval: 5000,
}
init()
window.addEventListener('load', async () => {
    await ready()
    await update()
    window.setInterval(async () => {
        await update()
    }, Editor.CONSTANTS.fixedUpdateInterval)
    document.addEventListener('keydown', async (event) => {
        await strokeUpdate(event)
        await update()
    })
})
