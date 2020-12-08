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
}