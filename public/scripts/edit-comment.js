$(document).ready(function() {

    var currCommentDiv;
    var currActionDiv;
    var currEditDiv;

    $('#edit-comment').on('click', function(e) {
        console.log("Clicked Edit Comment");
        var mainDiv = $(this).parent().parent().parent().parent();
        var mainDivId = '#' + $(this).parent().parent().parent().parent().attr('id');

        console.log(mainDivId);

        var commentDiv = $(mainDivId).find('.comment-details');
        var editDiv = $(mainDivId).find('.edit-comment-details');
        var actionDiv = $(mainDivId).find('.comment-actions');

        currCommentDiv = commentDiv;
        currActionDiv = actionDiv;
        currEditDiv = editDiv;

        var commentContent = $(mainDivId).find('.comment-details').text();
        commentContent = commentContent.replace(/\s{2,}/g, ' ');
        var fixedComment = $.trim(commentContent);

        commentDiv.hide();
        actionDiv.hide();
        editDiv.show();
    });

    var cancelEdit = $('#cancel-comment');

    $(document).on( 'click', '.cancel', function () {
        currEditDiv.hide();
        currCommentDiv.show();
        currActionDiv.show();
    });
}); });
});