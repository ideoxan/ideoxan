let theme = window.localStorage.getItem('ixlocaltheme')
let themeButton = $('#theme-change-bttn')
let root = document.documentElement
let ixLogo = $('.ix-logo')
if (theme == 'light') {
    themeButton.addClass('mdi-weather-night')
    window.localStorage.setItem('ixlocaltheme', 'light')
    root.style.setProperty('--dark-1', '#f5f5f5')
    root.style.setProperty('--dark-2', '#e0e0e0')
    root.style.setProperty('--dark-3', '#bdbdbd')
    root.style.setProperty('--light-1', '#121212')
    root.style.setProperty('--light-2', '#212121')
    root.style.setProperty('--light-3', '#424242')
    root.style.setProperty('--black', '#fff')
    root.style.setProperty('--white', '#000')
    for (let img of ixLogo) {img.src = "/static/img/ix_primary_transparent_b.webp"}
} else {
    themeButton.addClass('mdi-white-balance-sunny')
    window.localStorage.setItem('ixlocaltheme', 'dark')
    document.getElementsByTagName('html')[0].dataset.theme = 'dark'
    root.style.setProperty('--dark-1', '#121212')
    root.style.setProperty('--dark-2', '#212121')
    root.style.setProperty('--dark-3', '#424242')
    root.style.setProperty('--light-1', '#f5f5f5')
    root.style.setProperty('--light-2', '#e0e0e0')
    root.style.setProperty('--light-3', '#bdbdbd')
    root.style.setProperty('--black', '#000')
    root.style.setProperty('--white', '#fff')
    for (let img of ixLogo) {img.src = "/static/img/ix_primary_transparent_w.webp"}
}
themeButton.on('click', async () => {
    theme = window.localStorage.getItem('ixlocaltheme')
    if (theme == 'dark') {
        themeButton.removeClass('mdi-white-balance-sunny')
        themeButton.addClass('mdi-weather-night')
        window.localStorage.setItem('ixlocaltheme', 'light')
        root.style.setProperty('--dark-1', '#f5f5f5')
        root.style.setProperty('--dark-2', '#e0e0e0')
        root.style.setProperty('--dark-3', '#bdbdbd')
        root.style.setProperty('--light-1', '#121212')
        root.style.setProperty('--light-2', '#212121')
        root.style.setProperty('--light-3', '#424242')
        root.style.setProperty('--black', '#fff')
        root.style.setProperty('--white', '#000')
        for (let img of ixLogo) {img.src = "/static/img/ix_primary_transparent_b.webp"}
    } else {
        themeButton.removeClass('mdi-weather-night')
        themeButton.addClass('mdi-white-balance-sunny')
        window.localStorage.setItem('ixlocaltheme', 'dark')
        root.style.setProperty('--dark-1', '#121212')
        root.style.setProperty('--dark-2', '#212121')
        root.style.setProperty('--dark-3', '#424242')
        root.style.setProperty('--light-1', '#f5f5f5')
        root.style.setProperty('--light-2', '#e0e0e0')
        root.style.setProperty('--light-3', '#bdbdbd')
        root.style.setProperty('--black', '#000')
        root.style.setProperty('--white', '#fff')
        for (let img of ixLogo) {img.src = "/static/img/ix_primary_transparent_w.webp"}
    }
    scrollNav()
})
