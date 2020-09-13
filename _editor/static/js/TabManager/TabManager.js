define([
    'TabManager/Tab'
], () => {
    return class TabManager {
        /**
         * Creates a new TabManager instance
         */
        constructor() {
            this.tabs = [];
        }

        /**
         * Sets the Tab at the specified index to the active class and sets all others to inactive
         * @param {Number} index - Index in the array of tabs under the TabManager
         */
        setActive(index) {
            for (let j = 0; j < this.tabs.length; j++) {
                this.tabs[j].setInactive()
            }
            this.tabs[index].setActive()
        }

        /**
         * Creates a new Tab under the Tab Manager Instance
         * @param {Tab} tab - A valid Tab object
         */
        addTab(tab) {
            this.tabs.push(tab)
        }

        /**
         * Returns a Tab under the TabManager instance based on index
         * @param {Number} index
         */
        getTab(index) {
            return this.tabs[index]
        }

        /**
         * Returns the Ace Editor Document of the Tab under the TabManager instance based on index
         * @param {Number} index 
         */
        getDocument(index) {
            return this.tabs[index].getDocument()
        }

        /**
         * Returns the Ace Editor Session of the Tab under the TabManager instance based on the index
         * @param {Number} index 
         */
        getSession(index) {
            return this.tabs[index].getSession()
        }

        /**
         * Returns the Tab under the TabManager instance that matches the file/tab name specified
         * 
         * @param {String} file - A valid string representing a file/tab name
         */
        getTabByFile(file) {
            for (let i = 0; i < this.tabs.length; i++) {
                if (this.tabs[i].filename == file) {
                    return this.tabs[i]
                }
            }
            return undefined
        }

        /**
         * Returns a string representation of the array of Tabs under the TabManager instance
         */
        get toString() {
            return this.tabs.toString()
        }

        /**
         * Returns the number of Tab objects under the TabManager instance
         */
        get length() {
            return this.tabs.length
        }
    }
})