define([
    'jquery',
    'TabManager/Tab',
    'TabManager/TabManager',
    'TabManager/tabElement',
    'highlight',
    'beautify/beautify',
    'beautify/beautify-css',
    'beautify/beautify-html',
    'marked'
], ($, Tab, TabManager, tabElement, hljs, beautifyJS, beautifyCSS, beautifyHTML, marked) => {
    /* ---------------------------------------- Class/ID Vars --------------------------------------- */
    //Preload
    const preload = document.getElementById('preload')
    // Statusbar
    const statusBarPos = document.getElementById('statusbar-pos')
    const statusBarLang = document.getElementById('statusbar-lang')
    //Viewport
    const viewport = document.getElementById('viewport')
    const viewportIFrame = document.getElementById('viewport-iframe-content')
    //Console
    const terminal = document.getElementById('terminal')
    //Lesson Guide
    const lgTitle = document.getElementById('lesson-guide-title')
    const lgNum = document.getElementById('lesson-guide-number')
    const lgChpt = document.getElementById('lesson-guide-chapter')
    const lgback = document.getElementById('button-lesson-back')
    const lgnext = document.getElementById('button-lesson-next')
    // Parser
    const parser = new DOMParser()
    let loc = window.location.href.split('/')
    loc.pop()
    loc = loc.join('/') + '/'
    // Automated testing
    /* const seleniumViewport = document.getElementById('selenium-viewport')
    const seleniumIframe = document.getElementById('selenium-iframe-content') */
    window.dragging = false
    /* ------------------------------------------- Preload ------------------------------------------ */
    setTimeout(() => {
        setInterval(() => {
            if (document.readyState == 'complete') {
                preload.style.animation = "preloadFadeOut 1.5s ease-in-out"
                setTimeout(() => {
                    preload.style.opacity = 0
                    preload.remove()
                }, 1500);
            }
        }, 500);
    }, 7500);

    window.onerror = async (msg, url, lineNum, columnNum, err) => {
        if (err) {
            $('body').append(`<div class="toast toast-error">Error. See Console for Details</div>`)
            document.getElementsByClassName('toast')[0].style.animation = "toastIn 1200ms ease-in-out"
            document.getElementsByClassName('toast')[0].style.top = "90vh"
            document.getElementsByClassName('toast')[0].style.opacity = "1"
            setTimeout(() => {
                document.getElementsByClassName('toast')[0].style.animation = "toastOut 1200ms ease-in-out"
                document.getElementsByClassName('toast')[0].style.top = "120vh"
                document.getElementsByClassName('toast')[0].style.opacity = "0"
                //window.location.reload()
            }, 6000);
        }
    }

    /* let theme = window.localStorage.getItem('ixlocaltheme')
    let themeButton = $('#theme-change-bttn')
    if (theme == 'light') {
        themeButton.addClass('mdi-weather-night')
        window.localStorage.setItem('ixlocaltheme', 'light')
        document.getElementsByTagName('html')[0].dataset.theme = 'light'
    } else {
        themeButton.addClass('mdi-white-balance-sunny')
        window.localStorage.setItem('ixlocaltheme', 'dark')
        document.getElementsByTagName('html')[0].dataset.theme = 'dark'
    }
    themeButton.on('click', async () => {
        theme = window.localStorage.getItem('ixlocaltheme')
        if (theme == 'dark') {
            themeButton.removeClass('mdi-white-balance-sunny')
            themeButton.addClass('mdi-weather-night')
            window.localStorage.setItem('ixlocaltheme', 'light')
            document.getElementsByTagName('html')[0].dataset.theme = 'light'
        } else {
            themeButton.removeClass('mdi-weather-night')
            themeButton.addClass('mdi-white-balance-sunny')
            window.localStorage.setItem('ixlocaltheme', 'dark')
            document.getElementsByTagName('html')[0].dataset.theme = 'dark'
        }
    }) */

    $(document).ready(async () => {
        config = JSON.parse(atob(config.toString().trim()))
        console.log(config, typeof config)
        /* ---------------------------------------------------------------------------------------------- */
        /*                                 IDEOXAN INTEGRATED CODE EDITOR                                 */
        /* ---------------------------------------------------------------------------------------------- */
        let editor = ace.edit("code-editor-container") // Creates Ace Editor

        /* -------------------------------------- Lesson Data Setup ------------------------------------- */
        const chapterNum = Number.parseInt(chapter)
        const lessonNum = Number.parseInt(lesson)

        document.title = meta.name + ' | Ideoxan Editor'

        lgTitle.innerHTML = meta.chapters[chapterNum].lessons[lessonNum].name //Sets the Lesson Guide header to the lesson name
        lgChpt.innerHTML = meta.chapters[chapterNum].name // Sets the Lesson guide subtitle to the chapter name
        lgNum.innerHTML = `Lesson ${lessonNum + 1}` // Sets the lesson guide subtitle to the lesson number

        if (lessonNum > 0) {
            lgback.children[0].href = '/editor/' + course + '/' + chapter + '/' + subtractThreePlaceFormat(lesson, 1)
            lgback.children[0].innerHTML = '<p class="subheading"><span class="mdi mdi-chevron-left ico-18px ico-dark"></span>Previous Lesson</p>'
        } else {
            if (chapterNum > 0) {
                lgback.children[0].href = '/editor/' + course + '/' + subtractThreePlaceFormat(chapter, 1) + '/' + toThreePlaceFormat(meta.chapters[chapterNum - 1].lessons[meta.chapters[chapterNum - 1].lessons.length - 1])
                lgback.children[0].innerHTML = '<p class="subheading"><span class="mdi mdi-chevron-left ico-18px ico-dark"></span>Previous Chapter</p>'
            } else {
                lgback.children[0].href = '/catalogue'
                lgback.children[0].innerHTML = '<p class="subheading"><span class="mdi mdi-chevron-left ico-18px ico-dark"></span>Catalogue</p>'
            }
        }

        lgnext.children[0].href = '#'
        if (lessonNum < meta.chapters[chapterNum].lessons.length - 1) {
            lgnext.children[0].innerHTML = '<p class="subheading">Next Lesson <span class="mdi mdi-chevron-right ico-18px ico-white"></span></p>'
        } else {
            if (chapterNum < meta.chapters.length - 1) {
                lgnext.children[0].innerHTML = '<p class="subheading">Next Chapter <span class="mdi mdi-chevron-right ico-18px ico-white"></span></p>'
            } else {
                lgnext.children[0].innerHTML = '<p class="subheading">Finish <span class="mdi mdi-chevron-right ico-18px ico-white"></span></p>'
            }
        }

        /* ---------------------------------------- Lesson Guide ---------------------------------------- */
        let lessonGuideContentBody = await window.fetch("/static/curriculum/curriculum-" + course + "/chapter-" + chapter + "/" + lesson + "/" + lesson + ".md")
        marked.setOptions({
            highlight: function (code, lang, cb) {
                return hljs.highlight(lang, code).value
            }
        })
        document.getElementById('lesson-guide-content-body').innerHTML = marked(await lessonGuideContentBody.text())

        for (let i = 0; i < config.tasks.length; i++) {
            let task = config.tasks[i]
            let instructions = ''
            for (let instruction in task.instructions) {
                instructions += marked(task.instructions[instruction].toString())
            }

            $('#lesson-guide-content-body').append(`
                <div class="lesson-guide-completion">
                    <span class="lesson-guide-completion-checkbox not-completed mdi mdi-checkbox-blank-outline ico-18px" id="lesson-guide-completion-checkbox-${i}"></span><span class="lesson-guide-completion-step">Step ${i + 1}: </span>${instructions}
                </div>
            `)
        }

        /* ----------------------------------------- Completion ----------------------------------------- */
        let numCompletedTasks = 0

        /* -------------------------------------------- Tabs -------------------------------------------- */
        let codeTabs = new TabManager() // Creates a new TabManger instance to manage the tabs pertaining to the code editor
        for (let i = 0; i < config.arbitraryFiles.length; i++) {
            const arbitraryFile = config.arbitraryFiles[i] // Gets the arbitrary file name
            let starterContent

            if (config.starterFiles.includes(arbitraryFile)) { // Checks to see if the file is a starter file
                starterContent = config.starterContent[i] // Sets contents to text
            } else {
                starterContent = '' // Contents don't exist, moving on...
            }

            codeTabs.addTab(new Tab(arbitraryFile, 'code-editor-tabs-container', 'editor-tabs-t-' + i))
            codeTabs.getSession(i).setValue(starterContent)
        }
        codeTabs.setActive(0)
        editor.setSession(codeTabs.getSession(0))

        let rightTabs = new TabManager()
        rightTabs.addTab(new Tab('Viewport', 'right-tabs-container', 'right-tabs-t-0', 'monitor'))
        rightTabs.addTab(new Tab('Terminal', 'right-tabs-container', 'right-tabs-t-1', 'console'))
        //rightTabs.addTab(new Tab('Automated', 'right-tabs-container', 'right-tabs-t-2', 'robot'))
        rightTabs.setActive(0)
        terminal.hidden = true
        viewport.hidden = false
        //seleniumViewport.hidden = true

        /* ------------------------------------------- Config ------------------------------------------- */
        editor.setTheme("ace/theme/monokai") // sets the theme (MUST LINK IN HTML AS WELL)
        editor.setShowPrintMargin(false);

        /* ------------------------------------------- Status ------------------------------------------- */

        updateViewport('website')
        updateStatusBar()
        if (auth) {
            let progress = await getProgress()
            if (progress != null) {
                for (let i = 0; i < config.arbitraryFiles.length; i++) {
                    if (typeof progress[i] != 'undefined') codeTabs.getSession(i).setValue(progress[i])
                }
            }
        }

        /* ---------------------------------------------------------------------------------------------- */
        /*                                         EVENT LISTENER                                         */
        /* ---------------------------------------------------------------------------------------------- */

        /* ------------------------------------------- Editor ------------------------------------------- */
        let updateInterval = 1500
        let updateProcess = async () => {
            updateViewport('website')
            checkCompletion()
            if (auth) {
                saveProgress()
            }
        }
        let viewportUpdateTimer = window.setTimeout(updateProcess, updateInterval)

        editor.on('change', e => {
            updateStatusBar()
            window.clearTimeout(viewportUpdateTimer)
            viewportUpdateTimer = window.setTimeout(updateProcess, updateInterval)
        })

        editor.on('click', updateStatusBar)

        editor.on('changeSession', e => {
            updateStatusBar()
            editor.session.setUseSoftTabs(true)
            editor.session.$worker.send('changeOptions', [{ asi: true }]) // Gets rid of semicolons error in JS
            editor.session.setUseWrapMode(true);
            editor.session.setNewLineMode('windows')
        })

        let terminalCount = 0
        viewportIFrame.addEventListener('load', () => {
            viewportIFrame.contentWindow.console.addEventListener('log', value => {
                addToTerminal(value)
            })
            viewportIFrame.contentWindow.console.addEventListener('error', value => {
                addToTerminal(value).classList.add('terminal-out-error')
            })
            viewportIFrame.contentWindow.console.addEventListener('warn', value => {
                addToTerminal(value).classList.add('terminal-out-warn')
            })
            viewportIFrame.contentWindow.console.addEventListener('info', value => {
                addToTerminal(value)
            })
            viewportIFrame.contentWindow.onerror = async (msg, url, lineNum, columnNum, err) => {
                addToTerminal(err).classList.add('terminal-out-error')
            }
        })

        window.onmessage = msg => {
            let tasks = config.tasks
            let num = msg.data.taskNum
            if (msg.data.messageFrom == "checker" && tasks[num].nonce == msg.data.nonce && tasks[num].comparativeFunction == 'inject')  {
                completeTask(num)
            }
        }


        /* -------------------------------------------- Tabs -------------------------------------------- */
        // Code
        for (let i = 0; i < codeTabs.length; i++) {
            codeTabs.getTab(i).onClick(evt => {
                evt.preventDefault()
                codeTabs.setActive(i)
                editor.setSession(codeTabs.getSession(i))
            })
        }

        for (let i = 0; i < rightTabs.length; i++) {
            rightTabs.getTab(i).onClick(evt => {
                evt.preventDefault()
                rightTabs.setActive(i)
                if (i == 0) {
                    terminal.hidden = true
                    viewport.hidden = false
                    //seleniumViewport.hidden = true
                } else if (i == 1) {
                    terminal.hidden = false
                    viewport.hidden = true
                    //seleniumViewport.hidden = true
                } /* else if (i == 2) {
                    terminal.hidden = true
                    viewport.hidden = true
                    seleniumViewport.hidden = false
                } */
                updateStatusBar()
                updateViewport('website')
                checkCompletion()
            })
        }
        /* -------------------------------------------- Drags ------------------------------------------- */
        window.addEventListener('mousemove', e => {
            if (window.dragging) {
                var percentage = (e.pageX / window.innerWidth) * 100;
                if (percentage > 25 && percentage < 70) {
                    document.querySelector('#editor-container').style.gridTemplateColumns = `1fr 6px ${100 - percentage}%`
                }
                editor.resize()
            }
        })
        window.addEventListener('mouseup', e => {
            window.dragging = false
            $('#viewport iframe, #selenium-viewport iframe').css('pointer-events', 'auto');
        })
        document.getElementById('editor-resize-drag').addEventListener('mousedown', e => {
            window.dragging = true
            $('#viewport iframe, #selenium-viewport iframe').css('pointer-events', 'none');
        })
        /* ---------------------------------------------------------------------------------------------- */
        /*                                             METHODS                                            */
        /* ---------------------------------------------------------------------------------------------- */

        async function checkConnection() {
            res = await fetch('/ping', { method: 'GET', cache: 'no-store' })
            return res.ok
        }

        function updateStatusBar() {
            statusBarPos.innerHTML = `Line ${editor.getCursorPosition().row + 1}, Col ${editor.getCursorPosition().column + 1}`
            statusBarLang.innerHTML = handleModeType(editor.session.$mode)
        }

        function checkCompletion() {
            let tasks = config.tasks

            for (let i = 0; i < tasks.length; i++) {
                if (!document.getElementById(`lesson-guide-completion-checkbox-${i}`).classList.contains('completed')) {
                    if (tasks[i].completed) {
                        completeTask(i)
                    } else {
                        if (tasks[i].comparativeType == 'input') {
                            let inputValue = codeTabs.getTab(tasks[i].inputBase).getDocument().getValue().replace(/\\r?\\n/gim, '\\n')
                            let beautifiers = {
                                'html': beautifyHTML.html_beautify,
                                'css': beautifyCSS.css_beautify,
                                'js': beautifyJS.js_beautify,
                            }

                            let ext = codeTabs.getTab(tasks[i].inputBase).ext
                            let b = beautifiers[ext]

                            if (tasks[i].comparativeFunction == 'equals') {
                                // MAKE SURE ALL FILES ARE CRLF FORMATTED FOR EOL OR THIS WON'T WORK!!!!
                                if (JSON.stringify(b(inputValue.toString())).replace(/\\r?\\n/gim, '\\n') == JSON.stringify(b(tasks[i].comparativeBase.toString())).replace(/\\r?\\n/gim, '\\n')) {
                                    completeTask(i)
                                }
                            }
                        } else if (tasks[i].comparativeType == 'tab') {
                            let tabGroup = tasks[i].tabBase.split(' ')[0]
                            let tabName = tasks[i].tabBase.split(' ')[1]
                            let tab

                            if (tabGroup == 'rightTabs') {
                                tab = rightTabs.getTabByFile(tabName)
                            } else if (tabGroup == 'codeTabs') {
                                tab = codeTabs.getTabByFile(tabName)
                            }
                            if (typeof tab !== 'undefined' && tab.id.classList.contains('editor-tabs-t-active')) completeTask(i)
                        }
                    }
                }
            }

            if (numCompletedTasks == tasks.length) {
                completeLesson()
                if (lessonNum < meta.chapters[chapterNum].lessons.length - 1) {
                    lgnext.children[0].href = '/editor/' + course + '/' + chapter + '/' + addThreePlaceFormat(lesson, 1)
                } else {
                    if (chapterNum < meta.chapters.length - 1) {
                        lgnext.children[0].href = '/editor/' + course + '/' + addThreePlaceFormat(chapter, 1) + '/000'
                    } else {
                        lgnext.children[0].href = '/finish/' + course
                    }
                }
            }
        }

        function completeTask(id) {
            id = `lesson-guide-completion-checkbox-${id}`
            document.getElementById(id).classList.add('completed')
            document.getElementById(id).classList.remove('not-completed')
            document.getElementById(id).classList.remove('mdi-checkbox-blank-outline')
            document.getElementById(id).classList.add('mdi-checkbox-marked')
            numCompletedTasks++
        }

        function addToTerminal(value) {
            document.getElementById('terminal-container').insertAdjacentHTML('beforeend', `<p class="terminal-out" id="terminal-out-${terminalCount}"><span class="terminal-out-time info">${new Date().toISOString()}</span> [CONSOLE] ${value}</p>`)
            terminalCount++
            return document.getElementById(`terminal-out-${terminalCount - 1}`)
        }

        function toThreePlaceFormat(s) {
            return (Number.parseInt(s)).toString().padStart(3, '0')
        }

        function subtractThreePlaceFormat(s, n) {
            return (Number.parseInt(s) - n).toString().padStart(3, '0')
        }

        function addThreePlaceFormat(s, n) {
            return (Number.parseInt(s) + n).toString().padStart(3, '0')
        }

        function saveProgress() {
            let docArray = []
            for (let i = 0; i < config.arbitraryFiles.length; i++) {
                docArray.push(codeTabs.getTab(i).getDocument().getValue())
            }
            window.fetch(`/api/v1/save/editor/${course}/${chapter}/${lesson}`, {
                method: 'POST',
                mode: 'same-origin',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                cache: 'no-cache',
                body: JSON.stringify({ documentArray: docArray })
            })
        }

        async function getProgress() {
            let res = await window.fetch(`/api/v1/save/editor/${course}/${chapter}/${lesson}`, {
                method: 'GET',
                mode: 'same-origin',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                cache: 'no-cache'
            })

            if (res.status == 204 || res.status == 404 || res.status == 500 || res.body == '') {
                return null
            }
            let body = await res.json()

            return body.documentArray
        }

        function completeLesson() {
            window.fetch(`/api/v1/complete/${course}/${chapter}/${lesson}`, {
                method: 'POST',
                mode: 'same-origin',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                cache: 'no-cache'
            })
        }

        function updateViewport(type) {
            switch (type) {
                case 'website':
                    // TODO: (PRIORITY) This is only a temporary fix for the iframe. This is insecure and should be worked on immediately. This is a replacement for the WebVM environment. Please work on the WebVM before this is exploited
                    let htmlStr = codeTabs.getDocument(0).getValue().trim()
                    let parsed = parser.parseFromString(htmlStr, 'text/html')
                    parsed.querySelectorAll('script').forEach(elem => {
                        let src = elem.src.replace(loc, "");
                        let style = codeTabs.getTabByFile(src)
                        if (style != undefined) {
                            let scriptNode = parsed.createElement(`script`)
                            let inline = parsed.createTextNode(style.getDocument().getValue())
                            scriptNode.appendChild(inline)
                            elem.replaceWith(scriptNode)
                        }
                    })

                    parsed.querySelectorAll('link[rel="stylesheet"]').forEach(elem => {
                        let src = elem.href.replace(loc, "");
                        let style = codeTabs.getTabByFile(src)
                        if (style != undefined) {
                            let scriptNode = parsed.createElement(`style`)
                            let inline = parsed.createTextNode(style.getDocument().getValue())
                            scriptNode.appendChild(inline)
                            elem.replaceWith(scriptNode)
                        }
                    })

                    let toTest = parsed.cloneNode(true)

                    let scriptNode = parsed.createElement('script')
                    scriptNode.src = '/editor/static/js/exec/consoleInterceptor.js'
                    parsed.querySelector('head').prepend(scriptNode)
                    let tasks = config.tasks
                    for (var i = 0; i < tasks.length; i++) {
                        if (!document.getElementById(`lesson-guide-completion-checkbox-${i}`).classList.contains('completed')) {
                            if (tasks[i].comparativeType == 'exec' && tasks[i].comparativeFunction == 'inject') {
                                let scriptNode = parsed.createElement(`script`)
                                let nonce = 'nullnonce'
                                tasks[i].nonce = nonce
                                let inline = parsed.createTextNode(`(${tasks[i].comparativeBase})('${nonce}')`)
                                scriptNode.appendChild(inline)
                                if (tasks[i].defer) scriptNode.defer = true
                                if (tasks[i].async) scriptNode.async = true
                                if (tasks[i].in == 'body') {
                                    toTest.body.appendChild(scriptNode)
                                } else if (tasks[i].in == 'headstart') {
                                    toTest.head.prepend(scriptNode)
                                } else if (tasks[i].in == 'headend') {
                                    toTest.head.append(scriptNode)
                                }
                            }
                        }
                    }

                    var doc = viewportIFrame.contentWindow.document
                    doc.open()
                    doc.write('<!DOCTYPE html>' + parsed.documentElement.outerHTML)
                    doc.close()
                    /* doc = seleniumIframe.contentWindow.document
                    doc.open()
                    doc.write('<!DOCTYPE html>' + toTest.documentElement.outerHTML)
                    doc.close() */
                    break
            }
        }
    })
})

