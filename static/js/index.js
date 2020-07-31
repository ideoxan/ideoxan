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

    /* let expireDate = Date.now()-100000
    window.setInterval(() => {
        let now = Date.now()
        let msLeft = expireDate-now

        let seconds = Math.floor((msLeft % 60000) / 1000)
        let minutes = Math.floor((msLeft % 3600000) / 60000)
        let hours = Math.floor((msLeft % 86400000) / 3600000)
        let days = Math.floor(msLeft / 86400000)
        
        if (msLeft < 0) {
            document.getElementById('cd').innerHTML = 'Welcome to Ideoxan!'  
        } else {
            document.getElementById('cd-nums-days').innerHTML = `${days} <span class="subheading">days</span>` 
            document.getElementById('cd-nums-hours').innerHTML = `${hours} <span class="subheading">hours</span>` 
            document.getElementById('cd-nums-minutes').innerHTML = `${minutes} <span class="subheading">minutes</span>` 
            document.getElementById('cd-nums-seconds').innerHTML = `${seconds} <span class="subheading">seconds</span>` 
        }
    }, 1000) */
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
    window.fetch('https://api.github.com/repos/ideoxan/ideoxan/contributors').then(res =>  res.json())
    .then(data => {
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
}

function verifyLogin() {
    document.getElementById('upwdsu').classList.add('button-primary')
    document.getElementById('upwdsu').classList.remove('button-disabled')
    document.getElementById('upwdsu').setAttribute('type', 'submit')
    document.getElementsByClassName('loginform')[0].setAttribute('action', '/api/v1/user/create')
}