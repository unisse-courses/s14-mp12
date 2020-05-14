$(function() {
    $('.pop').on('click', function() {
        $('.image-preview').attr('src', $(this).find('img').attr('src'));
        $('#image-modal').modal('show');   
    });	
    
    $('#cancel-star').click(function() {
        console.log('Cancel Rating');

        $('input[type="radio"]').prop('checked', false);
        for (var y = 1; y <= 5; y++) {
            $("#star" + y).css("color", "#777777");
        }
        $('#selected-rating').text('0');
    });

    $('.close').click(function() {
        console.log('Cancel Rating');

        $('input[type="radio"]').prop('checked', false);
        for (var y = 1; y <= 5; y++) {
            $("#star" + y).css("color", "#777777");
        }
        $('#selected-rating').text('0');
    });
    
    $('#rating-form').on('change','[name="pfRating"]',function(){
        for (var y = 1; y <= 5; y++) {
            $("#star" + y).css("color", "#777777");
        }

        var checkedVal = $('[name="pfRating"]:checked').val();

        $('#selected-rating').text(checkedVal);
        for (var x = 1; x <= checkedVal; x++) {
            $("#star" + x).css("color", "#ffd100");
        }
    });
});