
$(document).ready(function() {

    document.getElementById('searchIcon').addEventListener('click', search())

    function search() {

        console.log('IN')
        var searchTag = $('#searchTag').val();
        var url = '/search/new?page=1&' + 'search=' + searchTag;
        var xhttp = new XMLHttpRequest();

        xhttp.open('GET', url, true);
        xhttp.send();

    }

});
