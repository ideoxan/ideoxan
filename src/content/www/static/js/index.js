window.onload = () => {
    /* ---------------------------------------------------------------------------------------------- */
    /*                                           NAVIGATION                                           */
    /* ---------------------------------------------------------------------------------------------- */
    /* -------------------------------------- Navigation Links -------------------------------------- */
    const navLinks = document.getElementsByClassName( 'nav-link' )
    for ( let i = 0; i < navLinks.length - 1; i++ ) {
        const navDropdown = document.querySelectorAll( '#nav-links-container .nav-dropdown' ) || []
        if ( navDropdown[ i ] ) {
            navLinks[ i ].addEventListener( 'mouseover', () => {
                navDropdown[ i ].classList.remove( 'hidden' )
            } )
            navLinks[ i ].addEventListener( 'mouseout', () => {
                navDropdown[ i ].classList.add( 'hidden' )
            } )
        }

    }

    /* ---------------------------------------- Account Links --------------------------------------- */
    const accountButton = document.getElementById('nav-account-container')
    const accountDropdown = document.querySelector('#nav-account-container .nav-account-dropdown') || null
    if (accountDropdown) {
        accountButton.addEventListener( 'mouseover', () => {
            accountDropdown.classList.remove( 'hidden' )
        } )
        accountButton.addEventListener( 'mouseout', () => {
            accountDropdown.classList.add( 'hidden' )
        } )
    }

    /* ----------------------------------------- Mobile Menu ---------------------------------------- */
    const mobileMenuButton = document.getElementById('mobile-nav-togglebutton')
    const mobileMenuDropdown = document.getElementById('mobile-nav-menu') || null
    if (mobileMenuDropdown) {
        mobileMenuButton.addEventListener('click', () => {
            if (mobileMenuDropdown.classList.contains('visible')) {
                mobileMenuDropdown.classList.add('invisible')
                mobileMenuDropdown.classList.remove('visible')
            } else {
                mobileMenuDropdown.classList.add('visible')
                mobileMenuDropdown.classList.remove('invisible')
            }
        })
    }

    /* ---------------------------------------- Theme Toggle ---------------------------------------- */
    const themeToggleButton = document.getElementById('nav-theme-toggle')
    const themeIcon = document.getElementById('nav-theme-icon').children[0].attributes['xlink:href']
    if (document.querySelector('html').classList.contains('dark')) {
        themeIcon.nodeValue = '/static/icons/feather-sprite.svg#' + 'sun'
    } else {
        themeIcon.nodeValue = '/static/icons/feather-sprite.svg#' + 'moon'
    }
    themeToggleButton.addEventListener('click', () => {
        if (document.querySelector('html').classList.contains('dark')) {
            themeIcon.nodeValue = '/static/icons/feather-sprite.svg#' + 'moon'
            localStorage.theme = 'light'
            document.querySelector('html').classList.remove('dark')
        } else {
            themeIcon.nodeValue = '/static/icons/feather-sprite.svg#' + 'sun'
            localStorage.theme = 'dark'
            document.querySelector('html').classList.add('dark')
        }
    })
}