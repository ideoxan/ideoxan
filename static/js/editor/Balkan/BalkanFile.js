
class File {
    constructor (fileName, fileType) {
        this.data = [""]
        this.fileName = fileName
        this.fileType = fileType
    }

    setValue (value) {
        let splitString = value.split('\n')
        console.log(splitString)
        for (let i = 0; i < splitString.length; i++) {
            this.data[i] = splitString[i]
        }
    }

    getValue () {
        return this.data.join('\n')
    }

    getLine (lineNumber) {
        return this.data[lineNumber]
    }

    setLine (lineNumber, value) {
        this.data[lineNumber] = value
    }

    getCharacter (lineNumber, characterNumber) {
        return this.data[lineNumber].charAt(characterNumber)
    }

    setCharacter (lineNumber, characterNumber, value) {
        let str = this.data[lineNumber]
        this.data[lineNumber] = str.substr(0, characterNumber) + value + str.substr(characterNumber + 1)
    }

    removeCharacter (lineNumber, characterNumber) {
        let str = this.data[lineNumber]
        this.data[lineNumber] = str.substr(0, characterNumber) + str.substr(characterNumber + 1)
    }

    removeLine (lineNumber) {
        for (let i = lineNumber; i < this.data.length-1; i++) {
            this.data[lineNumber] = this.data[lineNumber+1]
        }
        delete this.data[this.data.length - 1]
    }

    insertCharacter (lineNumber, characterNumber, value) {
        let str = this.data[lineNumber]
        this.data[lineNumber] = str.substr(0, characterNumber) + value + str.substr(characterNumber)
    }

    insertLine (lineNumber, value) {
        for (let i = this.data.length; i > lineNumber; i--) {
            this.data[i] = this.data[i-1]
        }
        this.data[lineNumber] = value
    }

    getLineLength (lineNumber) {
        return this.data[lineNumber].length
    }

    toString () {
        return this.data.join('\n')
    }

    toArray () {
        return this.data
    }

    get length () {
        return this.data.length
    }
    
}

export default File