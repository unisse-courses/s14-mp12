$(document).ready(function() {
    var messageText = $('.body-text').text();
    console.log('TEXT = ' + messageText);
    var messageLength = messageText.length;
    console.log('LENGTH = ' + messageLength);

    console.log(messageText === 'Commenting is for logged in users. Please login first.');
    console.log(messageText === 'Rating is for logged in users. Please login first.');
    console.log(messageText === 'You need to log in first.');
    console.log(messageText === 'Registered successfully!');

    if (((messageText === 'Commenting is for logged in users. Please login first.') || 
        (messageText === 'Rating is for logged in users. Please login first.') || 
        (messageText === 'You need to log in first.')) && (messageLength > 0)) {
        $('.modal-title').text('Action is for Logged In Users');
        $('#login-not-success').modal('show');
    } else if ((messageText === 'Registered successfully!') && (messageLength > 0)) {
        $('.modal-title').text('Registration Successful');
        $('.body-text').text('Please login to access your account.');
        $('#login-not-success').modal('show');
    }
});