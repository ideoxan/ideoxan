window.onload = () => {
    const clientProp = {
        "screen": {
            "x": window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            "y": window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight
        }
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*                                           NAVIGATION                                           */
    /* ---------------------------------------------------------------------------------------------- */
    /* -------------------------------------- Navigation Links -------------------------------------- */
    if ( document.getElementsByClassName( 'nav-link' ) ) {
        const navLinks = document.getElementsByClassName( 'nav-link' )
        for ( let i = 0; i < navLinks.length - 1; i++ ) {
            const navDropdown = document.querySelectorAll( '#nav-links-container .nav-dropdown' ) || []
            if ( navDropdown[ i ] ) {
                if (clientProp.screen.x > 1200) {
                    navLinks[ i ].addEventListener( 'mouseover', () => {
                        navDropdown[ i ].classList.remove( 'hidden' )
                    } )
                    navLinks[ i ].addEventListener( 'mouseout', () => {
                        navDropdown[ i ].classList.add( 'hidden' )
                    } )
                } else {
                    navLinks[ i ].addEventListener( 'click', () => {
                        if ( navDropdown[ i ].classList.contains( 'hidden' ) ) {
                            for (let j = 0; j < navLinks.length - 1; j++) {
                                if (!navDropdown[j].classList.contains('hidden')) navDropdown[i].classList.add('hidden')
                            }
                            navDropdown[ i ].classList.remove( 'hidden' )
                        } else {
                            navDropdown[ i ].classList.add( 'hidden' )
                        }
                    })
                }
                
            }

        }        
    }

    /* ---------------------------------------- Account Links --------------------------------------- */
    if ( document.getElementById( 'nav-account-container' ) ) {
        const accountButton = document.getElementById( 'nav-account-container' )
        const accountDropdown = document.querySelector( '#nav-account-container .nav-account-dropdown' ) || null
        if ( accountDropdown ) {
            if (clientProp.screen.x > 1200) {
                accountButton.addEventListener( 'mouseover', () => {
                    accountDropdown.classList.remove( 'hidden' )
                } )
                accountButton.addEventListener( 'mouseout', () => {
                    accountDropdown.classList.add( 'hidden' )
                } )
            } else {
                accountButton.addEventListener( 'click', () => {
                    if ( accountDropdown.classList.contains( 'hidden' ) ) {
                        accountDropdown.classList.remove( 'hidden' )
                    } else {
                        accountDropdown.classList.add( 'hidden' )
                    }
                })
            }
        }
    }

    /* ----------------------------------------- Mobile Menu ---------------------------------------- */
    if ( document.getElementById( 'mobile-nav-togglebutton' ) ) {
        const mobileMenuButton = document.getElementById( 'mobile-nav-togglebutton' )
        const mobileMenuDropdown = document.getElementById( 'mobile-nav-menu' ) || null
        if ( mobileMenuDropdown ) {
            mobileMenuButton.addEventListener( 'click', () => {
                if ( mobileMenuDropdown.classList.contains( 'visible' ) ) {
                    mobileMenuDropdown.classList.add( 'invisible' )
                    mobileMenuDropdown.classList.remove( 'visible' )
                } else {
                    mobileMenuDropdown.classList.add( 'visible' )
                    mobileMenuDropdown.classList.remove( 'invisible' )
                }
            } )
        }
    }

    /* ---------------------------------------- Theme Toggle ---------------------------------------- */
    if ( document.getElementById( 'nav-theme-toggle' ) ) {
        const themeToggleButton = document.getElementById( 'nav-theme-toggle' )
        const themeIcon = document.getElementById( 'nav-theme-icon' ).children[ 0 ].attributes[ 'xlink:href' ]
        const navIcon = document.getElementById( 'nav-icon' )
        if ( document.querySelector( 'html' ).classList.contains( 'dark' ) ) {
            themeIcon.nodeValue = '/static/icons/feather-sprite.svg#' + 'sun'
            navIcon.style.filter = 'grayscale(100%) brightness(1000%)'
        } else {
            themeIcon.nodeValue = '/static/icons/feather-sprite.svg#' + 'moon'
            navIcon.style.filter = 'grayscale(0%) brightness(100%)'
        }
        themeToggleButton.addEventListener( 'click', () => {
            if ( document.querySelector( 'html' ).classList.contains( 'dark' ) ) {
                themeIcon.nodeValue = '/static/icons/feather-sprite.svg#' + 'moon'
                localStorage.theme = 'light'
                document.querySelector( 'html' ).classList.remove( 'dark' )
                navIcon.style.filter = 'grayscale(0%) brightness(100%)'
            } else {
                themeIcon.nodeValue = '/static/icons/feather-sprite.svg#' + 'sun'
                localStorage.theme = 'dark'
                document.querySelector( 'html' ).classList.add( 'dark' )
                navIcon.style.filter = 'grayscale(100%) brightness(1000%)'
            }
        } )
    }
}