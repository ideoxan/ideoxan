window.Prism = window.Prism || {}
Prism.manual = true

export default class Renderer {
    constructor (DOMElement) {
        this.DOMElement = document.querySelector(DOMElement)
    }

    drawUpdate (session) {
        let parent = this
        function fillLineNumbers() {
            let lineNumbers = ''
            for (let i=0; i < session.currentFile.length; i++) {
                lineNumbers += `<div>${i + 1}</div>`
            }
            if (session.currentFile.length < 1) lineNumbers = `<div>${1}</div>`
            return lineNumbers
        }

        function fillLines() {
            let fileData = ''
            for (let i=0; i < session.currentFile.length; i++) {
                fileData += `<code id="balkan-code-line-${i}" contenteditable="true" class="w-full">${parent.highlight(session.currentFile.getLine(i), session.currentFile.fileType)}</code>`
            }
            return fileData
        }

        this.DOMElement.innerHTML = `<div id="balkan-gutter" class="ts flex flex-col spacing-y-1 w-12 pt-2 pr-1 mr-2 font-mono font-normal text-sm text-right bg-purple-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">${fillLineNumbers()}</div><pre id="balkan-text" class="ts flex flex-col spacing-y-1 w-full pt-2 font-mono font-normal text-sm text-left text-gray-600 dark:text-gray-400">${this.drawCursor(session.position)}${fillLines()}</pre>`
        
    }

    drawLine (file, line) {
        this.DOMElement.querySelector(`#balkan-code-line-${line}`).outerHTML = `<code id="balkan-code-line-${i}">${this.highlight(file.getLine(i), file.fileType)}</code>`
    }

    drawCursor (sessionPosition) {
        return `<div id="balkan-cursor" class="ts absolute z-40 opacity-50 h-5 w-0.5 bg-gray-500" style="margin-left: ${0.5*sessionPosition.col}rem"></div>`
    }

    highlight (data, language) {
        return Prism.highlight(data, Prism.languages[language], language)
    }
}