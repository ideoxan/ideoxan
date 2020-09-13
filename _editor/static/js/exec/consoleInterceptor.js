console.__on = {}
console.addEventListener = (name, cb) => {
    console.__on[name] = (console.__on[name] || []).concat(cb)
    return console
}
console.dispatchEvent = (name, value) => {
    console.__on[name] = (console.__on[name] || [])
    for (let i = 0; i < console.__on[name].length; i++) {
        console.__on[name][i].call(console, value)
    }
    return console
}
console.log = (...args) => {
    let argsArray = []
    for (let i = 0; i < args.length; i++) {
        argsArray.push(args[i])
    }
    console.dispatchEvent('log', argsArray)
}
console.error = (...args) => {
    let argsArray = []
    for (let i = 0; i < args.length; i++) {
        argsArray.push(args[i])
    }
    console.dispatchEvent('error', argsArray)
}
console.warn = (...args) => {
    let argsArray = []
    for (let i = 0; i < args.length; i++) {
        argsArray.push(args[i])
    }
    console.dispatchEvent('warn', argsArray)
}
console.info = (...args) => {
    let argsArray = []
    for (let i = 0; i < args.length; i++) {
        argsArray.push(args[i])
    }
    console.dispatchEvent('info', argsArray)
}