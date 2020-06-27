window.onscroll = (async () => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        document.getElementById('nav').style.boxShadow = "0px 10px 6px -5px rgba(0, 0, 0, 0.14)"
        document.getElementById('nav').style.backgroundColor = "rgba(18, 18, 18, 1)"
    } else {
        document.getElementById('nav').style.boxShadow = "0px 5px 6px -1px rgba(0, 0, 0, 0)"
        document.getElementById('nav').style.backgroundColor = "rgba(18, 18, 18, 0)"
    }
})