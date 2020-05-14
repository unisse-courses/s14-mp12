$(document).ready(function() {
    $('#proceed-star').on('click', function(e) {
        console.log("Clicked Rate");
        console.log($('input[name="pfStarRating"]:checked').val());

        if ($('input[name="pfStarRating"]:checked').val() == null) {
            console.log('Please give a rating value before clicking the rate button.');
        }
    });
});