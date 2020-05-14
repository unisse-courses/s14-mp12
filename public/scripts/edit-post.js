$(document).ready(function() {
    // BUTTON HANDLING
    var x = $("[id^=new-row]").length;
    var y = $("[id^=newrow]").length;

    console.log('x=' + x + ' ' + 'y=' + y);

    var xx = x - 1;
    var yy = y - 1;

    console.log('xx=' + xx + ' ' + 'yy=' + yy);

    // Hide pre existing delete buttons.
    var ingId = "#ingButton";
    var dirId = "#dirButton";

    for (var z = 1; z < xx; z++) {
        document.querySelector(ingId + z).style.display = "none";
    }

    for (var z = 1; z < yy; z++) {
        document.querySelector(dirId + z).style.display = "none";
    }

    // Add new row to ingredients.
    var addButton = $('#i-add');
    var ingredientWrapper = $('#ingredients');    
    
    $(addButton).click(function() {
        var fieldName = $('#name').val();
        var fieldUnit = $('#unit').val();
        var fieldQuantity = $('#quantity').val(); 

        if (fieldName === '' || fieldUnit === '' || fieldQuantity === '') {
            alert("Cannot add a new field if first field is empty.");
        } else {
            var ingFields = '<div class="row" id="new-row' + x + '">' + 
                '<div class="col"><input type="text" name="pfIngredients[' + x + '][quantity]" class="form-control" id="quantity" placeholder="Quantity" rows="1" required></div>' + 
                '<div class="col"><input type="text" name="pfIngredients[' + x + '][unit]" class="form-control" id="unit" placeholder="Unit" rows="1" required></div>' + 
                '<div class="col"><input type="text" name="pfIngredients[' + x + '][name]" class="form-control" id="name" placeholder="Name" rows="1" required></div>' + 
                '<div class="col">' + 
                '<button type="button" id="ingButton' + x + '">Delete</button>' + '</div>' + '</div>';
            
            $(ingredientWrapper).append(ingFields);

            var curID = ingId + x;
            var curButton = document.querySelector(curID);
            curButton.classList.add('btn','ing-delete');

            if(xx >= 1)
            {
                var num = xx;
                var id = ingId + num;
                var deleteButton = document.querySelector(id);

                deleteButton.style.display = "none";
            }

            x++;
            xx++;

            console.log('I - AFTER ADDING x=' + x + ' ' + 'xx=' + xx);
        }
    });

    // Delete existing row in ingredients.
    $(ingredientWrapper).on('click', '.ing-delete', function(e){
        console.log('Clicked Delete Ingredient');

        var selectedRow = $(this).parent().parent().attr('id') + '';
        var selectedRowNum = parseInt(selectedRow.substring(7));

        if (selectedRowNum == xx) {
            $('#' + selectedRow).remove();
            x--;
            xx--;

            console.log('I - AFTER DELETING x=' + x + ' ' + 'xx=' + xx);

            if (xx > 0) {
                var id = ingId + xx;
                var prevButton = document.querySelector(id);
                prevButton.style.display = "block";
            }
        }
    });

    // Add new row to directions.
    var addDirections = $('#d-add');
    var directionWrapper = $('#directions');

    $(addDirections).click(function() {
        var fieldDir = $('#instruction').val();

        if (fieldDir === '') {
            alert("Cannot add a new field if first field is empty.");
        } else {
            var dirFields = '<div class="row" id="newrow' + y + '">' +
                '<div class="col-9">' + '<textarea type="text" name="pfDirections[' + y + 
                ']" class="form-control" id="instruction" placeholder="Enter recipe steps here." rows="2" required></textarea>' +
                '</div><div class="col">' + 
                '<button type="button" id="dirButton' + y + '">Delete</button>' + '</div>' + '</div>';
            
            $(directionWrapper).append(dirFields);

            var curID = dirId + y;
            var curButton = document.querySelector(curID);
            curButton.classList.add('btn','dir-delete');

            if(yy >= 1)
            {
                var num = yy;
                var id = dirId+ num;
                var deleteButton = document.querySelector(id);

                deleteButton.style.display = "none";
            }

            y++;
            yy++;

            console.log('D - AFTER ADDING y=' + y + ' ' + 'yy=' + yy);
        }
    });

    // Delete existing row in ingredients.
    $(directionWrapper).on('click', '.dir-delete', function(e) {
        console.log('Clicked Delete Direction');

        var selectedRow = $(this).parent().parent().attr('id') + '';
        var selectedRowNum = parseInt(selectedRow.substring(6));

        if (selectedRowNum == yy) {
            $('#' + selectedRow).remove();
            y--;
            yy--;

            console.log('D - AFTER DELETING y=' + y + ' ' + 'yy=' + yy);

            if (yy > 0) {
                var id = dirId + yy;
                var prevButton = document.querySelector(id);
                prevButton.style.display = "block";
            }
        }
    });

    // IMAGE HANDLING
    $('.img').change(function (e) {
        if (this.files && this.files[0]) {
            console.log('File Uploaded');
    
            var inputID = $(this).attr('id');
            console.log(inputID);

            if (readExt(this, inputID)) {
                readURL(this, inputID);
            }
        } else {
            console.log('File Not Upload');
            this.files == null;
            console.log(this.files);

            var inputID = $(this).attr('id');
            console.log(inputID);

            clearPreview(inputID);
        }
    });

    // Check for file type.
    function readExt (input, id) {
        var ext = input.value.match(/\.(.+)$/)[1];
        var isValid = 1;

        switch (ext) {
            case 'jpg':
            case 'jpeg':
            case 'png':
                $(id).attr('disabled', false);
                break;
            default:
                alert("Image upload does not allow this file type.");
                input.value = '';
                isValid = 0;
                clearPreview(id);
                break;
        }

        console.log('isValid = ' + isValid)
        return isValid;
    }

    // Upload image preview.
    function readURL (input, id) {
        var reader = new FileReader();
        var currID = '#' + id;
        var filename = $(currID).val();

        filename = filename.substring(filename.lastIndexOf('\\') + 1);
        console.log(filename);

        var idNum = id.substring(5);
        console.log(idNum);

        reader.onload = function(e) {
            $('#preview' + idNum).attr('src', e.target.result);
            $('#preview' + idNum).hide();
            $('#preview' + idNum).fadeIn(100);      
            $('.custom-file-label').text(filename);
        };

        reader.readAsDataURL(input.files[0]);
    }

    // Clear image preview.
    function clearPreview (id) {
        var idNum = id.substring(5);
        var previewID = '#preview' + idNum;

        console.log('Remove');

        var parentDiv = $('#p' + idNum);
        var childElement = '<img id="preview' + idNum + '" src="/img/image-preview.png" alt="your image" title=""/>';

        $(previewID).remove();

        $(parentDiv).append(childElement);
    }
});