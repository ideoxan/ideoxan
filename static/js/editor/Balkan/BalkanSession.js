
export default class Session {
    constructor () {
        this.position = {
            line: 0,
            col: 0,
        }
        this.files = {}
        this.currentFileRef = null

    }

    registerFile (file) {
        this.files[file.fileName] = file
        if (!this.currentFileRef) {
            this.currentFile = file.fileName
        } 
    }

    deregisterFile (fileName) {
        delete this.files[session.currentFile.fileName]
    }

    set currentFile (fileName) {
        this.currentFileRef = fileName
    }

    get currentFile () {
        return this.files[this.currentFileRef]
    }

    moveCursorTo (line, col) {
        this.position.line = line
        this.position.col = col
    }
}