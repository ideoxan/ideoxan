function getTimeSince(dateObject) {
    let ms = Date.now() - dateObject
    if (ms / 31536000000 > 1) return Math.floor(ms/31536000000) + ' years ago'
    else if (ms / 2592000000 > 1) return Math.floor(ms/2592000000) + ' months ago'
    else if (ms / 604800000 > 1) return Math.floor(ms/604800000) + ' weeks ago'
    else if (ms / 86400000 > 1) return Math.floor(ms/86400000) + ' days ago'
    else if (ms / 3600000 > 1) return Math.floor(ms/3600000) + ' hours ago'
    else if (ms / 60000 > 1) return Math.floor(ms/60000) + ' minutes ago'
    else if (ms / 1000 > 1) return Math.floor(ms/1000) + ' seconds ago'
    else return 'just now'
}