define([
    'TabManager/Tab'
], () => {
    return class TabManager {
        constructor() {
            this.tabs = [];
        }

        setActive(index) {
            for (let j = 0; j < this.tabs.length; j++) {
                this.tabs[j].setInactive()
            }
            this.tabs[index].setActive()
        }

        addTab(tab) {
            this.tabs.push(tab)
        }

        getTab(index) {
            return this.tabs[index]
        }

        getDocument(index) {
            return this.tabs[index].getDocument()
        }

        getSession(index) {
            return this.tabs[index].getSession()
        }

        getFile(file) {
            for (let i = 0; i < this.tabs.length; i++) {
                if (this.tabs[i].filename == file) {
                    return this.tabs[i]
                }
            }
            return undefined
        }


        get toString() {
            return this.tabs.toString()
        }

        get length() {
            return this.tabs.length
        }
    }
})