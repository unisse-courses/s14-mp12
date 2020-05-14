$(document).ready(function() {
    var messageText = $('.body-text').text();
    console.log('TEXT = ' + messageText);
    var messageLength = messageText.length;
    console.log('LENGTH = ' + messageLength);

    console.log(messageText === 'Username already exists.');
    console.log(messageText === 'Email addressed used already exists.');

    if ((messageText === 'Username already exists.') && (messageLength > 0)) {
        $('.modal-title').text('Registration Unsuccessful');
        $('.body-text').text('Username chosen is already in use. Please choose another one.');
        $('#register-not-success').modal('show');
    } else if ((messageText === 'Email addressed used already exists.') && (messageLength > 0)) {
        $('.modal-title').text('Registration Unsuccessful');
        $('.body-text').text('Email address chosen is already in use. Please use another one.');
        $('#register-not-success').modal('show');
    }
});