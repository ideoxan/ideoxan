define([
    'jquery'
], $ => {
    return {
        /**
         * Creates a new stylized and formatted DOM element that visually represents a tab object. Using the JS DOM API and jQuery, it appends the element to the target element.
         * 
         * @param {String} targetID - A string representing a valid ID of an existing DOM element
         * @param {String} newElementID - A string represented the desired ID of the new DOM element appended
         */
        createTabElement: (targetID, newElementID) => {
            $(targetID).append(`
                <td class="editor-tabs-t editor-tabs-t-inactive" id="${newElementID}">
                    <a href="#" class="box-link" title="">
                        <span class="mdi mdi-file-outline ico-12px"></span>
                        <span class="editor-tabs-filename">unknown memory file</span>
                    </a>
                </td>
            `)
        }
    }
})