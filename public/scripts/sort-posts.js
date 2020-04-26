$('document').ready(function(){
    var sortBlock = document.querySelector('.sort-dd');
    sortBlock.style.display = "none";
})

function checkPagination() {
    // Declaring the SortBlock
    var sortBlock = document.querySelector('.sort-dd');
    
    if (document.getElementById("new").classList.contains("active") == false) {
        var newP = document.getElementById("new");
        newP.className += " active";

        var popP = document.getElementById("popular");
        var popSplit = popP.className.split(" ");
        var popClassName = "";
        for (var i = 0; i < popSplit.length; i++) {
            if (popSplit[i] !== "active") {
                popClassName += popSplit[i] + " ";
            }
        }
        console.log("In New=False");
        popP.className = popClassName;

        // Let the Sort hidden
        if(sortBlock.style.display == 'inline-block')
            sortBlock.style.display = "none";

    } else if (document.getElementById("popular").classList.contains("active") == false) {
        var popP = document.getElementById("popular");
        popP.className += " active";

        var newP = document.getElementById("new");
        var newSplit = newP.className.split(" ");
        var newClassName = "";
        for (var i = 0; i < newSplit.length; i++) {
            if (newSplit[i] !== "active") {
                newClassName += newSplit[i] + " ";
            }
        }
        newP.className = newClassName;

        // Let The Sort Button Visible
        sortBlock.style.display = 'inline-block';
    }
}
