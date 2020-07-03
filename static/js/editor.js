define([ // Yes, I know Jvakut, an error is thrown but it works. Don't mess with it.
    'jquery',
    'TabManager/Tab',
    'TabManager/TabManager',
    'TabManager/tabElement',
    'prism'
], ($, Tab, TabManager, tabElement, prism) => {
    /* ---------------------------------------- Class/ID Vars --------------------------------------- */
    //Preload
    const preload = document.getElementById('preload')
    // Top CBar
    const cbarTitle = document.getElementById('top-cbar-title')
    // Statusbar
    const statusBarPos = document.getElementById('statusbar-pos')
    const statusBarLang = document.getElementById('statusbar-lang')
    //Viewport
    const viewport = document.getElementById('viewport')
    const viewportIFrame = document.getElementById('viewport-iframe-content')
    //Console
    const terminal = document.getElementById('terminal')
    //Status
    const connectedIcon = document.getElementById('connected-icon')
    const connectedStatus = document.getElementById('connected-status')
    //Lesson Guide
    const lgTitle = document.getElementById('lesson-guide-title')
    const lgNum = document.getElementById('lesson-guide-number')
    const lgChpt = document.getElementById('lesson-guide-chapter')
    const lgback = document.getElementById('button-lesson-back')
    const lgnext = document.getElementById('button-lesson-next')
    

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

    window.onerror = async ( msg, url, lineNum, columnNum, err ) => {
        if (err) {
            $('body').append(`<div class="toast toast-error">Error. See Console for Details</div>`)
            document.getElementsByClassName('toast')[0].style.animation = "toastIn 1200ms ease-in-out"
            document.getElementsByClassName('toast')[0].style.top = "90vh"
            document.getElementsByClassName('toast')[0].style.opacity = "1"
            setTimeout(() => {
                document.getElementsByClassName('toast')[0].style.animation = "toastOut 1200ms ease-in-out"
                document.getElementsByClassName('toast')[0].style.top = "120vh"
                document.getElementsByClassName('toast')[0].style.opacity = "0"
                window.location.reload()
            }, 6000);
        }
    } 

    $(document).ready(async () => {
        /* ---------------------------------------------------------------------------------------------- */
        /*                                 IDEOXAN INTEGRATED CODE EDITOR                                 */
        /* ---------------------------------------------------------------------------------------------- */
        let editor = ace.edit("code-editor-container") // Creates Ace Editor

        /* -------------------------------------- Lesson Data Setup ------------------------------------- */
        let ClientAppData = CAppData //ClientAppData/CAppData is a global kept by EJS rendering
        const course = ClientAppData.ideoxan.lessonData.course
        const chapter = ClientAppData.ideoxan.lessonData.chapter
        const lesson = ClientAppData.ideoxan.lessonData.lesson
        const lessonMeta = ClientAppData.ideoxan.lessonData.meta

        document.title = lessonMeta.name + ' | Ideoxan Editor'

        cbarTitle.innerHTML = lessonMeta.name // Sets the CBar title to the course title

        lgTitle.innerHTML = lessonMeta.chapters[Number.parseInt(chapter)].lessons[Number.parseInt(lesson)].name //Sets the Lesson Guide header to the lesson name
        lgChpt.innerHTML = lessonMeta.chapters[Number.parseInt(chapter)].name // Sets the Lesson guide subtitle to the chapter name
        lgNum.innerHTML = `Lesson ${Number.parseInt(lesson) + 1}` // Sets the lesson guide subtitle to the lesson number

        if (Number.parseInt(lesson) < 0) {
            lgback.children[0].href = '/editor/' + course + '/' + (Number.parseInt(chapter)).toString().padStart(3, '0') + '/' + (Number.parseInt(lesson)-1).toString().padStart(3, '0')
            lgback.children[0].innerHTML = '<p class="subheading"><span class="mdi mdi-chevron-left ico-18px ico-dark"></span>Previous Lesson</p>'
        } else {
            lgback.children[0].href = '/catalogue'
            lgback.children[0].innerHTML = '<p class="subheading"><span class="mdi mdi-chevron-left ico-18px ico-dark"></span>Catalogue</p>'
        }

        if (Number.parseInt(lesson) < lessonMeta.chapters[Number.parseInt(chapter)].lessons.length - 1) {
            lgnext.children[0].href = '/editor/' + course + '/' + (Number.parseInt(chapter)).toString().padStart(3, '0') + '/' + (Number.parseInt(lesson)+1).toString().padStart(3, '0')
            lgnext.children[0].innerHTML = '<p class="subheading">Next Lesson <span class="mdi mdi-chevron-right ico-18px ico-white"></span></p>'
        } else {
            lgnext.children[0].href = '/lessonfinish/' + course
            lgnext.children[0].innerHTML = '<p class="subheading">Finish <span class="mdi mdi-chevron-right ico-18px ico-white"></span></p>'
        }

        

        /* -------------------------------------------- Tabs -------------------------------------------- */
        let codeTabs = new TabManager() // Creates a new TabManger instance to manage the tabs pertaining to the code editor
        for (let i = 0; i < lessonMeta.chapters[Number.parseInt(chapter)].lessons[Number.parseInt(lesson)].arbitraryFiles.length; i++) {
            const arbitraryFile = lessonMeta.chapters[Number.parseInt(chapter)].lessons[Number.parseInt(lesson)].arbitraryFiles[i] // Gets the arbitrary file name
            let starterContent

            if (lessonMeta.chapters[Number.parseInt(chapter)].lessons[Number.parseInt(lesson)].starterFiles.includes(arbitraryFile)) { // Checks to see if the file is a starter file
                const starter = await window.fetch(`/static/curriculum/curriculum-${course}/content/chapter-${chapter}/${lesson}/starter/${arbitraryFile}`, {
                    mode: 'no-cors'
                })
                starterContent = await starter.text() // Sets contents to text
                delete starter // Deletes request
            } else {
                starterContent = '' // Contents don't exist, moving on...
            }

            codeTabs.addTab(new Tab(arbitraryFile, 'code-editor-tabs-container', 'editor-tabs-t-' + i))
            codeTabs.getSession(i).setValue(starterContent)
        }
        codeTabs.setActive(0)
        editor.setSession(codeTabs.getSession(0))
        updateViewport('website')
        updateStatusBar()

        let rightTabs = new TabManager()
        rightTabs.addTab(new Tab('Viewport', 'right-tabs-container', 'right-tabs-t-0', 'monitor'))
        rightTabs.addTab(new Tab('Terminal', 'right-tabs-container', 'right-tabs-t-1', 'console'))
        rightTabs.setActive(0)
        terminal.hidden = true
        viewport.hidden = false

        /* ------------------------------------------- Config ------------------------------------------- */
        editor.setTheme("ace/theme/monokai") // sets the theme (MUST LINK IN HTML AS WELL)
        editor.setShowPrintMargin(false);

        /* ------------------------------------------- Status ------------------------------------------- */
        if (await checkConnection()) {
            connectedIcon.classList = 'mdi mdi-check ico-12px'
            connectedStatus.innerHTML = 'Connected'
        } else {
            connectedIcon.classList = 'mdi mdi-close ico-12px'
            connectedStatus.innerHTML = 'Disconnected'
        }
        // TODO: Use keepalive connection to monitor (bc more stability) 
        window.addEventListener('offline', async () => {
            if (await checkConnection()) {
                connectedIcon.classList = 'mdi mdi-check ico-12px'
                connectedStatus.innerHTML = 'Connected'
            } else {
                connectedIcon.classList = 'mdi mdi-close ico-12px'
                connectedStatus.innerHTML = 'Disconnected'
            }
        })
        window.addEventListener('online', async () => {
            if (await checkConnection()) {
                connectedIcon.classList = 'mdi mdi-check ico-12px'
                connectedStatus.innerHTML = 'Connected'
            } else {
                connectedIcon.classList = 'mdi mdi-close ico-12px'
                connectedStatus.innerHTML = 'Disconnected'
            }
        })
        /* ---------------------------------------------------------------------------------------------- */
        /*                                         EVENT LISTENER                                         */
        /* ---------------------------------------------------------------------------------------------- */

        /* ------------------------------------------- Editor ------------------------------------------- */
        editor.on('change', (e) => {
            updateStatusBar()
            updateViewport('website')
        })

        editor.on('changeSession', (e) => {
            updateStatusBar()
            editor.session.setUseSoftTabs(true)
            editor.session.$worker.send('changeOptions', [{ asi: true }]) // Gets rid of semicolons error in JS
            editor.session.setUseWrapMode(true);
        })

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
                } else {
                    terminal.hidden = false
                    viewport.hidden = true
                }
            })
        }


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

        function updateViewport(type) {
            switch (type) {
                case 'website':

                    // TODO: (PRIORITY) This is only a temorary fix for the iframe. This is VERY insecure and should be worked on immidately. This is a replacement for the WebVM environment. Please work on the WebVM before this is exploited
                    let htmlStr = codeTabs.getDocument(0).getValue().trim()

                    if (!htmlStr.includes('<head>')|| !htmlStr.includes('</head>')
                        || !htmlStr.includes('<body>') || !htmlStr.includes('</body>'))
                            return viewportIFrame.srcdoc = htmlStr


                    let htmlHead = htmlStr.split('<head>').pop().split('</head>')[0].trim().split('\n')
                    for (let i = 0; i < htmlHead.length; i++) {
                        htmlHead[i] = htmlHead[i].trim()

                        if (htmlHead[i].startsWith('<link')) {
                            let refStr = 'href="'
                            let refStrPos = htmlHead[i].indexOf(refStr)

                            let href = htmlHead[i].substring(refStrPos + refStr.length, htmlHead[i].indexOf('"', refStrPos + refStr.length))

                            let style = codeTabs.getTabByFile(href)
                            if (style != undefined) {
                                htmlHead[i] = `<style> ${style.getDocument().getValue()} </style>`
                            }
                        }
                    }
                    htmlHead = htmlHead.join('\n')

                    let htmlBody = htmlStr.split('<body>').pop().split('</body>')[0].trim().split('\n')
                    for (let i = 0; i < htmlBody.length; i++) {
                        htmlBody[i] = htmlBody[i].trim()

                        if (htmlBody[i].startsWith('<script')) {
                            let refStr = 'src="'
                            let refStrPos = htmlBody[i].indexOf(refStr)

                            let src = htmlBody[i].substring(refStrPos + refStr.length, htmlBody[i].indexOf('"', refStrPos + refStr.length))

                            let style = codeTabs.getTabByFile(src)
                            if (style != undefined) {
                                htmlBody[i] = `<script> ${style.getDocument().getValue()} </script>`
                            }
                        }
                    }
                    htmlBody = htmlBody.join('\n')

                    viewportIFrame.srcdoc = `<!DOCTYPE html>
                        <html>
                            <head>
                                ${htmlHead}
                            </head>
                            <body>
                                ${htmlBody}
                                <script>
                                    // This is injected by the editor
                                    
                                    // Logging Viewport
                                    console.logs = []
                                    console._log = console.log
                                    console.log = function(){
                                        console.logs.push(Array.from(arguments)) // Replaces standard console.log so it can be rebinded for iframe
                                        // console._log.apply(console, arguments)
                                        parent.document.getElementById('terminal-container').insertAdjacentHTML('beforeend', '<p class="terminal-out"><span class="terminal-out-time info">' + new Date().toISOString() + '</span> [CONSOLE] ' + console.logs[console.logs.length-1] + '</p>')
                                    }                                    
                                </script>
                            </body>
                        </html>`

                    break
            }
        }
    })

})

