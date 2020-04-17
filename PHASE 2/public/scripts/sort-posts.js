function checkPagination() {
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
        popP.className = popClassName;
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
    }
}