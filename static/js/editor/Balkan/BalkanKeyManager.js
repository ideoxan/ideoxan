
export default class KeyManager {
    constructor (lang) {
        this.lang = lang
    }

    handleKeyEvent (session, keyEvent) {
        if (this.isArrowKey(keyEvent.keyCode)) {
            return this.changePosition(session, keyEvent)
        }
        return this.modifyFile(session, keyEvent)
    }

    changePosition (session, keyEvent) {
        console.log(session)
        switch (keyEvent.keyCode) {
            case 37: // Left
                session.moveCursorTo(session.position.line, session.position.col - 1)
                break
            case 38: // Up
                session.moveCursorTo(session.position.line - 1, session.position.col)
                break
            case 39: // Right
                session.moveCursorTo(session.position.line, session.position.col + 1)
                break
            case 40: // Down
                session.moveCursorTo(session.position.line + 1, session.position.col)
                break
        }
        
    }

    modifyFile (session, keyEvent) {
        switch (keyEvent.keyCode) {
            case 8:
                session.currentFile.removeCharacter(session.position.line, session.position.col-1)
                session.moveCursorTo(session.position.line, session.position.col - 1)
                break
        
            default:
                session.currentFile.insertCharacter(session.position.line, session.position.col, keyEvent.key)
                session.moveCursorTo(session.position.line, session.position.col + 1)
                break
        }
    }

    isArrowKey (keyCode) {
        return [37,38,39,40].includes(keyCode)
    }
}