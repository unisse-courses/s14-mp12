$(document).ready(function() {
    var messageText = $('.body-text').text();
    console.log('TEXT = ' + messageText);
    var messageLength = messageText.length;
    console.log('LENGTH = ' + messageLength);

    console.log(messageText === 'Commenting is for logged in users. Please login first.');
    console.log(messageText === 'Rating is for logged in users. Please login first.');
    console.log(messageText === 'You need to log in first.');

    if ((messageText === 'Commenting is for logged in users. Please login first.') || 
        (messageText === 'Rating is for logged in users. Please login first.') || 
        (messageText === 'You need to log in first.')) {
        $('#login-not-success').modal('show');
    }
});