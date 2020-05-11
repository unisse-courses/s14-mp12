// $(document).ready(function() {

//     $(".toggle-password").click(function() {
//         console.log("hello");
    
//         $(this).toggleClass("fa-eye fa-eye-slash");
//         var input = $($(this).attr("toggle"));
//         if (input.attr("type") == "password") {
//           input.attr("type", "text");
//         } else {
//           input.attr("type", "password");
//         }
//     });

// });

function validateFileType() {
  var fileName = document.getElementById("profPic").value;
  var idxDot = fileName.lastIndexOf(".") + 1;
  var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();

  if (!(extFile === "jpg" || extFile === "jpeg" || extFile === "png")) {
    alert("Only JPG/JPEG and PNG files are allowed for upload.");
    document.getElementById("profPic").value = "";
  }   
}