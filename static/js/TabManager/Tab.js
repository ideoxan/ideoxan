define([
    'ace/ace',
    'ace/mode/javascript',
    'ace/mode/css',
    'ace/mode/html',
    'ace/edit_session',
    'TabManager/tabElement'
], (ace, JSMode, CSSMode, HTMLMode, EditSession, tabElement) => {
    return class Tab {
        /**
         * Creates a new tab object and the corresponding DOM Element
         * @param {String} filename - The name of the tab
         * @param {String} targetID - The Element ID to append the tab to
         * @param {String} id - The desired ID of the new tab
         * @param {String} [icon=] 
         */
        constructor(filename, targetID, id, icon) {
            this.filename = filename

            tabElement.createTabElement('#' + targetID, id)
            this.id = document.getElementById(id)

            this.session = undefined
            this.modes = {
                'html5': HTMLMode.Mode,
                'css3': CSSMode.Mode,
                'javascript': JSMode.Mode,
            }

            this.ext = filename.split('.').pop() // Gets file extension
            this.language = ''
            
            if (this.ext != this.filename) { // If there is no dot symbol in the name it will return the same as the filename
                switch (this.ext) { // What file extension
                    case 'html': this.language = 'html5'; break;
                    case 'js': this.language = 'javascript'; break;
                    case 'css': this.language = 'css3'; break;
                    default: this.language = null; break;
                }

                this.session = new EditSession.EditSession('', new this.modes[this.language]())
                this.id.getElementsByClassName('ico-12px')[0].classList = `mdi mdi-language-${this.language} ico-12px ico-${this.language}`
            } else {
                this.id.getElementsByClassName('ico-12px')[0].classList = `mdi mdi-${icon} ico-12px ico-white`
                this.language = null
            }
            this.id.getElementsByClassName('editor-tabs-filename')[0].innerHTML = filename
            this.id.getElementsByClassName('box-link')[0].title = 'Switch to ' + filename
        }

        /**
         * Sets the Tab to the active class
         */
        setActive() {
            this.id.classList.add('editor-tabs-t-active')
            this.id.classList.remove('editor-tabs-t-inactive')
        }

        /**
         * Sets the Tab to the inactive class
         */
        setInactive() {
            this.id.classList.add('editor-tabs-t-inactive')
            this.id.classList.remove('editor-tabs-t-active')
        }

        /**
         * Sets the Ace Editor Session
         * @param {EditSession.EditSession} session 
         */
        setSession(session) {
            this.session = session
        }

        /**
         * Gets the Ace Editor Document Object associated with the Tab
         * @return {EditSession.EditSession.Document}
         */
        getDocument() {
            return this.session.getDocument()
        }

        /**
         * Gets the Ace Editor Session associated with the Tab
         * @return {EditSession.EditSession}
         */
        getSession() {
            return this.session
        }

        /**
         * Creates a new event listener that executes the bound callback
         * @param {Function} funct - A function to be executed when the Tab is clicked
         * 
         */
        onClick(funct) {
            this.id.addEventListener('click', funct)
        }
    }
})
