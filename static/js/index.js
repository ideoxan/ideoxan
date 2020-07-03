/* ---------------------------------------------------------------------------------------------- */
/*                                              MAIN                                              */
/* ---------------------------------------------------------------------------------------------- */
$(document).ready(async () => {
    scrollNav()
    window.onscroll = scrollNav
    highlightNavCurrent()

    if (document.location.pathname == '/about') {
        createContributorsList()
    }

    $('.nav-user-dropbttn').on('click', async () => {
        if ($('.nav-user-dropdown')[0].style.opacity == 0) {
            $('.nav-user-dropdown')[0].style.opacity = 1
        } else {
            $('.nav-user-dropdown')[0].style.opacity = 0
        }
    })
})



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
        if (document.getElementsByClassName('headershort').length > 0) {
            document.getElementById('nav').style.boxShadow = "0px 10px 6px -5px rgba(0, 0, 0, 0.14)"
            document.getElementById('nav').style.backgroundColor = "rgba(18, 18, 18, 1)"
        } else {
            document.getElementById('nav').style.boxShadow = "0px 5px 6px -1px rgba(0, 0, 0, 0)"
            document.getElementById('nav').style.backgroundColor = "rgba(18, 18, 18, 0)"
        }
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

function createContributorsList() {
    window.fetch('https://api.github.com/repos/ideoxan/ideoxan/contributors').then((res) => {
        res.json().then((data) => {
            for (let i = 0; i < data.length; i++) {
                if (!data[i].login.toLowerCase().includes('bot')) $('#contrib').append(`
                    <div class="contrib-user">
                        <img class="contrib-user-img" src="${data[i].avatar_url}">
                        <p>${data[i].login}</p>
                        <a href="${data[i].html_url}" title="GitHub"><span class="mdi mdi-github ico-18px ico-white"></span></a>
                    </div>
                `)
            }
        })
    })
}