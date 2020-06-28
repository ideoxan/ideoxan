/* ---------------------------------------------------------------------------------------------- */
/*                                              MAIN                                              */
/* ---------------------------------------------------------------------------------------------- */

(async () => {
    scrollNav()
    window.onscroll = scrollNav
    console.log(document.getElementsByClassName('headershort'))
    highlightNavCurrent()
})()



/* ---------------------------------------------------------------------------------------------- */
/*                                             METHODS                                            */
/* ---------------------------------------------------------------------------------------------- */

function scrollNav() {
    if (document.getElementsByClassName('headertall').length > 0) {
        if (document.body.scrollTop > 95 || document.documentElement.scrollTop > 95) {
            document.getElementById('nav').style.boxShadow = "0px 10px 6px -5px rgba(0, 0, 0, 0.14)"
            document.getElementById('nav').style.backgroundColor = "rgba(18, 18, 18, 1)"
        } else {
            document.getElementById('nav').style.boxShadow = "0px 5px 6px -1px rgba(0, 0, 0, 0)"
            document.getElementById('nav').style.backgroundColor = "rgba(18, 18, 18, 0)"
        }
    } else {
        document.getElementById('nav').style.boxShadow = "0px 10px 6px -5px rgba(0, 0, 0, 0.14)"
        document.getElementById('nav').style.backgroundColor = "rgba(18, 18, 18, 1)"
    }
    
}

function showIXEFeatureSlide(n) {
    for (let i = 0; i<document.getElementsByClassName('ixefeature').length; i++) {
        if (i != n) {
            document.getElementById('ixefeature-dot-' + i).classList.remove('ixefeature-dot-active')
            document.getElementById('ixefeature-' + i).style.display = 'none'
        } 
    }
    document.getElementById('ixefeature-' + n).style.display = 'flex'
    document.getElementById('ixefeature-dot-' + n).classList.add('ixefeature-dot-active')
}

function highlightNavCurrent() {
    let elements = document.getElementById('nav').getElementsByClassName('nav-element')
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].href == window.location.href) {
            elements[i].classList.add('nav-element-active')
        } else {
            elements[i].classList.add('nav-element-inactive')
        }
    }
}