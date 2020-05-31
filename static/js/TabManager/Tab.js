define([
    'ace/ace',
    'ace/mode/javascript',
    'ace/mode/css',
    'ace/mode/html',
    'ace/edit_session',
    'TabManager/tabElement'
], (ace, JSMode, CSSMode, HTMLMode, EditSession, tabElement) => {
    return class Tab {
        constructor(language, filename, targetID, id, icon) {
            this.language = language
            this.filename = filename

            tabElement.createTabElement('#' + targetID, id)
            this.id = document.getElementById(id)

            this.session = undefined
            this.modes = {
                'html5': HTMLMode.Mode,
                'css3': CSSMode.Mode,
                'javascript': JSMode.Mode,
            }
            if (this.language != null) {
                this.session = new EditSession.EditSession('', new this.modes[this.language]())
                this.id.getElementsByClassName('ico-12px')[0].classList = `mdi mdi-language-${this.language} ico-12px ico-${this.language}`
            } else {
                this.id.getElementsByClassName('ico-12px')[0].classList = `mdi mdi-${icon} ico-12px ico-white`
            }
            this.id.getElementsByClassName('editor-tabs-filename')[0].innerHTML = filename
        }

        setActive() {
            this.id.classList.add('editor-tabs-t-active')
            this.id.classList.remove('editor-tabs-t-inactive')
        }

        setInactive() {
            this.id.classList.add('editor-tabs-t-inactive')
            this.id.classList.remove('editor-tabs-t-active')
        }

        setSession(session) {
            this.session = session
        }

        getDocument() {
            return this.session.getDocument()
        }

        getSession() {
            return this.session
        }

        onClick(funct) {
            this.id.addEventListener('click', funct)
        }
    }
})
