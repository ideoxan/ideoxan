languages = {
    'javascript': "JavaScript",
    'css': "CSS",
    'html': "HyperText Markup Language"
}
function handleModeType(mode) {
    return languages[mode.$id.substring(9)] || 'unknown'
}