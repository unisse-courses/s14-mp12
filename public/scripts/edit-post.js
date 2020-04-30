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
                // Button
                '<button type="button" id="ingButton' + x + '">Delete</button>' + '</div>' + '</div>';
            
            $(ingredientWrapper).append(ingFields);

            // Adding Class to Button
            var curID = "ingButton" + x;
            var curButton = document.querySelector('#' + curID);
            curButton.classList.add('btn','ing-delete');
            
            console.log('AFTER ADDING = ' + x);

            // Deleting the Previous Delete Button
            if(x > 1)
            {
                var num = x - 1;
                var id = "ingButton" + num;
                var deleteButton = document.querySelector("#" + id);

                deleteButton.style.display = "none";
            }
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

            if (x > 0) {
                var id = "ingButton" + x;
                var prevButton = document.querySelector("#" + id);

                prevButton.style.display = "block";
            }
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
                // Button
                '<button type="button" id="dirButton' + y + '">Delete</button>' + '</div>' + '</div>';
            
            $(directionWrapper).append(dirFields);

            // Adding Class to Button
            var curID = "dirButton" + y;
            var curButton = document.querySelector('#' + curID);
            curButton.classList.add('btn','dir-delete');

            console.log('AFTER ADDING = ' + y);

            // Deleting the Previous Delete Button
            if(y > 1)
            {
                var num = y - 1;
                var id = "dirButton" + num;
                var deleteButton = document.querySelector("#" + id);

                deleteButton.style.display = "none";
            }
        }
    });

    $(directionWrapper).on('click', '.dir-delete', function(e) {
        e.preventDefault();
        var selectedRowD = $(this).parent().parent().attr('id') + '';
        var selectedRowNumD = parseInt(selectedRowD.substring(6));

        if (selectedRowNumD < y) {
            alert("Please delete rows in order of bottom to up.");
        } else {
            $('#' + selectedRowD).remove();
            y--;

            console.log('AFTER DELETING = ' + y);

            if (y > 0) {
                var id = "dirButton" + y;
                var prevButton = document.querySelector("#" + id);

                prevButton.style.display = "block";
            }
        }
    });

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