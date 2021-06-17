window.Editor = {}

function init () {
    if ( document.querySelector( 'html' ).classList.contains( 'dark' ) ) {
        document.querySelector('#prism-css').href= '/static/lib/prismjs/prism_dark.css'
    } else {
        document.querySelector('#prism-css').href= '/static/lib/prismjs/prism_light.css'
    }

    
}

async function ready () {

}

async function update () {

}

async function strokeUpdate (keyboardEvent) {

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
        await update()
    })
})
