$(document).ready(function() {

    $('.page-item').on('click', function(e) {

        if (this.classList.contains("active") == false) {
            console.log('Clicked');

            var idName = '#' + $(this).attr('id');
            console.log(idName);

            // if (idName === '#popular-link') {
            //     $(idName).addClass('active');
            //     $('#new-link').removeClass('active');

            //     $(".star-area").css("display", "block");
            // } else if (idName === '#new-link') {
            //     $(idName).addClass('active');
            //     $('#popular-link').removeClass('active');

            //     $(".star-area").css("display", "none");
            // }
        }
    });
});