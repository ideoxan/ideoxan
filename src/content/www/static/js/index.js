window.onload = () => {
    console.log( 'Hi' )
    /* -------------------------------------- Navigation Links -------------------------------------- */
    const navLinks = document.getElementsByClassName( 'nav-link' )
    for ( let i = 0; i < navLinks.length - 1; i++ ) {
        const dropdown = document.querySelectorAll( '#nav-links-container .nav-dropdown' ) || null
        console.log( dropdown )
        if ( dropdown[ i ] ) {
            navLinks[ i ].addEventListener( 'mouseover', () => {
                dropdown[ i ].classList.remove( 'hidden' )
            } )
            navLinks[ i ].addEventListener( 'mouseout', () => {
                dropdown[ i ].classList.add( 'hidden' )
            } )
        }

    }
}