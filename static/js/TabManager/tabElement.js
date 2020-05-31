define([
    'jquery'
], ($) => {
    return {
        createTabElement: (targetID, newElementID) => {
            $(targetID).append(`
                <td class="editor-tabs-t editor-tabs-t-inactive" id="${newElementID}">
                    <a href="#" class="box-link">
                        <span class="mdi ico-12px"></span>
                        <span class="editor-tabs-filename">unknown memory file</span>
                    </a>
                </td>
            `)
        }
    }
})