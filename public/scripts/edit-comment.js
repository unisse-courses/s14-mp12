$(document).ready(function() {

    $('#edit-comment').on('click', function(e) {
        console.log("Clicked Edit Comment");
        var mainDiv = $(this).parent().parent().parent().parent();
        var mainDivId = '#' + $(this).parent().parent().parent().parent().attr('id');

        console.log(mainDivId);

        var commentDiv = $(mainDivId).find('.comment-details');
        var commentContent = $(mainDivId).find('.comment-details').text();
        commentContent = commentContent.replace(/\s{2,}/g, ' ');
        var fixedComment = $.trim(commentContent);
        console.log(commentDiv);

        var actionDiv = $(mainDivId).find('.comment-actions');

        commentDiv.empty();
        actionDiv.hide();

        var editForm = '<form class="edit-comment" id="edit-c" method="" action="">'
            + '<div class="form-group">' 
            + '<textarea class="form-control" name="comment" rows="2">' + fixedComment + '</textarea>'
            + '</div>'
            + '<button type="submit" class="btn btn-primary">Submit</button>'
            + '</form>';
        
        $(editForm).appendTo(commentDiv);
    });
});