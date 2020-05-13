$(function() {
    $('.pop').on('click', function() {
        $('.image-preview').attr('src', $(this).find('img').attr('src'));
        $('#image-modal').modal('show');   
    });	
    
    $('#cancel-star').click(function() {
        console.log('Cancel Rating');

        $('input[type="radio"]').prop('checked', false);
        $('#selected-rating').text('0');
    });

    $('.close').click(function() {
        console.log('Cancel Rating');

        $('input[type="radio"]').prop('checked', false);
        $('#selected-rating').text('0');
    });
    
    $('#rating-form').on('change','[name="pfRating"]',function(){
        $('#selected-rating').text($('[name="pfRating"]:checked').val());
    });
});