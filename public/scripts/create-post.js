$(document).ready(function() {
    var x = 0;
    var addButton = $('#i-add');
    var ingredientWrapper = $('#ingredients');    

    $(addButton).click(function() {
        var fieldName = $('#name').val();
        var fieldUnit = $('#unit').val();
        var fieldQuantity = $('#quantity').val(); 

        if (fieldName === '' || fieldUnit === '' || fieldQuantity === '') {
            alert("Cannot add a new field if first field is empty.");
        } else {
            x++;

            var ingFields = '<div class="row" id="new-row' + x + '">' + 
                '<div class="col"><input type="text" name="pfIngredients[' + x + '][name]" class="form-control" id="name" placeholder="Name" rows="1" required></div>' + 
                '<div class="col"><input type="text" name="pfIngredients[' + x + '][name]" class="form-control" id="quantity" placeholder="Quantity" rows="1" required></div>' + 
                '<div class="col"><input type="text" name="pfIngredients[' + x + '][name]" class="form-control" id="unit" placeholder="Unit" rows="1" required></div>' + 
                '<div class="col">' + 
                '<button class="btn ing-delete" type="button"' + 
                'style="background-color: #c0392b;color: #ffffff;letter-spacing: 0.5px;font-size: 15px;font-weight: 600;float: right;padding-left: 15px;padding-right: 20px;cursor: pointer;">Delete</button>' + '</div>' + '</div>';

            $(ingredientWrapper).append(ingFields);
            console.log('AFTER ADDING = ' + x);
        }
    });

    $(ingredientWrapper).on('click', '.ing-delete', function(e){
        e.preventDefault();
        var selectedRow = $(this).parent().parent().attr('id') + '';
        var selectedRowNum = parseInt(selectedRow.substring(7));

        if (selectedRowNum < x) {
            alert("Please delete rows in order of bottom to up.");
        } else {
            $('#' + selectedRow).remove();
            x--;
            console.log('AFTER DELETING = ' + x);
        }
    });

    var y = 0;
    var addDirections = $('#i-dir');
    var directionWrapper = $('#directions');

    $(addDirections).click(function() {
        var fieldDir = $('#instruction').val();

        if (fieldDir === '') {
            alert("Cannot add a new field if first field is empty.");
        } else {
            y++;

            var dirFields = '<div class="row" id="newrow' + y + '">' +
                '<div class="col-9">' + '<textarea type="text" name="pfDirections[' + y + 
                ']" class="form-control" id="instruction" placeholder="Enter recipe steps here." rows="2" required></textarea>' +
                '</div><div class="col">' + 
                
                //Button
                '<button type="button" id="dirButton' + y + '" ' +
                '>Delete</button>' + '</div>' + '</div>';
            
            $(directionWrapper).append(dirFields);

            // Adding Class to Button
            var curID = "dirButton" + y;
            var curButton = document.querySelector('#' + curID)
            curButton.classList.add('btn','dir-delete');

            console.log('AFTER ADDING = ' + y);

            // Deleting the Previous Delete Button
            if(y > 1)
            {
                var num = y-1
                var id = "dirButton" + num
                var deleteButton = document.querySelector("#" + id)

                deleteButton.style.display = "none";
            }
        }
    });

    $(directionWrapper).on('click', '.dir-delete', function(e){
        e.preventDefault();
        var selectedRowD = $(this).parent().parent().attr('id') + '';
        var selectedRowNumD = parseInt(selectedRowD.substring(6));

        if (selectedRowNumD < y) {
            alert("Please delete rows in order of bottom to up.");
        } else {
            $('#' + selectedRowD).remove();
            y--;
            console.log('AFTER DELETING = ' + x);
        }
    });

    $('#image').change(function () {
        var ext = this.value.match(/\.(.+)$/)[1];
        switch (ext) {
            case 'jpg':
            case 'jpeg':
            case 'png':
                $('#image').attr('disabled', false);
                break;
            default:
                alert("Image upload does not allow this file type.");
                this.value = '';
        }
    });
});


// // Prevent Submit on Pressing Enter
// $(document).ready(function() {
//     $(document).on("keydown", "form", function(event) { 
//         return event.key != "Enter";
//     });
// });


// // Function for validating the form.
// function validateForm()
// {
//     // $(document).on("keydown", ":input:not(text)", function(event) {
//     //     if (event.key == "Enter") {
//     //         event.preventDefault();
//     //     }
//     // });
// }

// function checkConsole() {
//     console.log(document.getElementById("title-text").value);
//     console.log(document.getElementById("body-text").value);
// }

// // INGREDIENTS ---------------------------------------------------------
// var inputText = document.getElementById("ingredients");
// var items = document.querySelectorAll("#ing-list li");
// var ings = [];
// var index;

// // Add ingredients to the list.
// function addIng() {
//     var listIng = document.getElementById("ing-list");
//     var textNode = document.createTextNode(inputText.value);
//     const list = document.createElement("li");

//     if (checkIng(textNode, ings)) {
//         ings.push(textNode);
//         list.appendChild(textNode);
//         listIng.appendChild(list);
//         inputText.value = "";
//     }
//     console.log(ings);

//     refreshArray();

//     // Add eventlistener to new ingredeint.
//     list.onclick = function() {
//         index = ings.indexOf(this.innerHTML);

//         //Set slected li's value to input area again.
//         inputText.value = this.innerHTML;
//     };
//     console.log(ings);
// }

// //Check if value already exists.
// function checkIng(text, ingredients) {
//     var notEmpty = false;
//     var notDuplicate = true;

//     if (text.length == 0) {
//         alert("Cannot add an empty value.");
//     } else {
//         notEmpty = true;
//     }

//     if (notEmpty == true && notDuplicate == true) {
//         return true;
//     } else {
//         return false;
//     }
// }

// // Reset list to avoid index -1.
// function refreshArray() {
//     ings.length = 0;
//     items = document.querySelectorAll("#ing-list li");

//     for (var i = 0; i < items.length; i++) {
//         ings.push(items[i].innerHTML);
//     }
// }

// // Edit ingredient in the list.
// function editIng() {   
//     items[index].innerHTML = inputText.value;
//     refreshArray();
//     inputText.value = "";
//     console.log(ings);
// }

// // Delete ingredient in the list.
// function deleteIng() {
//     if (items.length > 0) {
//         items[index].parentNode.removeChild(items[index]);
//         inputText.value = "";
//     }

//     refreshArray();
//     console.log(ings);
// }

// // DIRECTIONS ---------------------------------------------------------
// var inputTextD = document.getElementById("directions");
// var itemsD = document.querySelectorAll("#dir-list li");
// var dirs = [];
// var indexD;

// // Add ingredients to the list.
// function addDir() {
//     var listDir = document.getElementById("dir-list");
//     var textNodeD = document.createTextNode(inputTextD.value);
//     const listD = document.createElement("li");

//     if (checkDir(textNodeD, dirs)) {
//         dirs.push(textNodeD);
//         listD.appendChild(textNodeD);
//         listDir.appendChild(listD);
//         inputTextD.value = "";
//     }

//     refreshArrayD();

//     // Add eventlistener to new ingredeint.
//     listD.onclick = function() {
//         indexD = dirs.indexOf(this.innerHTML);

//         //Set slected li's value to input area again.
//         inputTextD.value = this.innerHTML;
//     };
//     console.log(dirs);
// }

// //Check if value already exists.
// function checkDir(textD, directions) {
//     var notEmptyD = false;
//     var notDuplicateD = true;

//     if (textD.length == 0) {
//         alert("Cannot add an empty value.");
//     } else {
//         notEmptyD = true;
//     }

//     if (notEmptyD == true && notDuplicateD == true) {
//         return true;
//     } else {
//         return false;
//     }
// }

// // Reset list to avoid index -1.
// function refreshArrayD() {
//     dirs.length = 0;
//     itemsD = document.querySelectorAll("#dir-list li");

//     for (var i = 0; i < itemsD.length; i++) {
//         dirs.push(itemsD[i].innerHTML);
//     }
// }

// // Edit ingredient in the list.
// function editDir() {   
//     itemsD[indexD].innerHTML = inputTextD.value;
//     refreshArrayD();
//     inputTextD.value = "";
//     console.log(dirs);
// }

// // Delete ingredient in the list.
// function deleteDir() {
//     if (itemsD.length > 0) {
//         itemsD[indexD].parentNode.removeChild(itemsD[indexD]);
//         inputTextD.value = "";
//     }

//     refreshArrayD();
//     console.log(dirs);
// }

// // TAGS ---------------------------------------------------------
// const tagContainer = document.querySelector('.tag-container');
// const input = document.querySelector('.tag-container input');
// var tags = [];

// function createTag(label) {
//     const div = document.createElement('div');
//     div.setAttribute('class', 'tag')
//     const span = document.createElement('span');
//     span.innerHTML = label;
//     const closeBtn = document.createElement('i');
//     closeBtn.setAttribute('class', 'fas fa-times');
//     closeBtn.setAttribute('data-item', label);

//     div.appendChild(span);
//     div.appendChild(closeBtn);
//     return div;
// }

// // tagContainer.prepend(createTag('javascript'));

// // Function to reset the list of tags.
// function reset() {
//     document.querySelectorAll('.tag').forEach(function(tag) {
//         tag.parentElement.removeChild(tag);
//     });
// }

// // Function for adding tags.
// function addTags() {
//     reset();
//     tags.slice().reverse().forEach(function(tag) {
//         const tagInput = createTag(tag);
//         tagContainer.prepend(tagInput);
//     });
// }

// function toAdd() {
//     tags.push(input.value);
//     addTags();
//     input.value = '';
// }
// // Event listener for enter.
// // input.addEventListener('keyup', function(e) {
// //     if (e.which == 13 || e.keyCode == 13) {
// //         tags.push(input.value);
// //         addTags();
// //         input.value = '';
// //     }
// // });

// // Event listener for deleting the tags.
// document.addEventListener('click', function(e) {
//     if (e.target.tagName === "I") {
//         const value = e.target.getAttribute('data-item');
//         const index = tags.indexOf(value);
//         tags = [... tags.slice(0, index), ...tags.slice(index + 1)];
//         addTags();
//     }
// });

// // IMAGE ---------------------------------------------------------
// function previewImages() {

//     var preview = document.querySelector('#preview');
    
//     if (this.files.length <= 5) {
//         var imageArray = [];
//         imageArray = this.files;

//         if (this.files) {
//             [].forEach.call(this.files, readAndPreview);
//         }
//     } else if (this.files.length > 5) {
//         alert("Maximum of 5 files only.");
//         document.getElementById("file-input").value = "";
//     }
        
//     console.log(imageArray);
  
//     function readAndPreview(file) {
  
//       // Make sure file.name matches allowed extensions.
//       if (!/\.(jpe?g|png)$/i.test(file.name)) {
//         return alert(file.name + " is not alllowed. Only JPEG, JPG, and PNG files are allowed for upload.");
//       }
      
//       var reader = new FileReader();
      
//       reader.addEventListener("load", function() {
//         var image = new Image();
//         image.height = 200;
//         image.title  = file.name;
//         image.src    = this.result;
//         image.style.width = "100%"
//         preview.appendChild(image);
//       });


//       reader.readAsDataURL(file);
//     }  
// }
  
// document.querySelector('#file-input').addEventListener("change", previewImages);

// // const inpFile = document.getElementById("photo");
// // const previewContainer = document.getElementById("upload");
// // const previewImage = previewContainer.querySelector(".image-preview");
// // const previewText = previewContainer.querySelector(".preview-text");

// // var imgArray = [];

// // inpFile.addEventListener("change", function() {
// //     const file = this.files[0];

// //     if (!/\.(jpe?g|png)$/i.test(file.name)) {
// //         return alert(file.name + " has unsupported file type. Only .JPG, .JPEG, and .PNG are accepted.");
// //     } 

// //     if (file) {
// //         const reader = new FileReader(); 

// //         previewText.style.display = "none";
// //         previewImage.style.display = "block";

// //         reader.addEventListener("load", function() {
// //             previewImage.setAttribute("src", this.result);
// //         });

// //         imgArray.push(file);
// //         console.log(imgArray);

// //         reader.readAsDataURL(file);
// //     } else {
// //         previewText.style.display = null;
// //         previewImage.style.display = null;
// //         previewImage.setAttribute("src", "");
// //     }
// // });

// /*
//     References:
//     https://stackoverflow.com/questions/5150532/how-do-i-stop-the-form-from-reloading-using-javascript
//     https://stackoverflow.com/questions/905222/enter-key-press-event-in-javascript
//     https://www.youtube.com/watch?v=ha4xwcJXwow
//     https://www.youtube.com/watch?v=GBDMr24O_rs
//     https://stackoverflow.com/questions/39439760/how-to-preview-multiple-images-before-upload
// */