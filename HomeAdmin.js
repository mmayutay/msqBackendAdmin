$(document).ready(function () {
    // Get the modal
    var modal = document.getElementById('id01');
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.getElementById("regUser").value = "";
            document.getElementById("regPass").value = "";
        }
    }
    //Disable button for Register if input is empty
    $('.signupbtn').attr('disabled', true);
    $('#regUser,#regPass').on('keyup', function () {
        var user = document.getElementById("regUser").value;
        var pass = document.getElementById("regPass").value;
        if (user != '' && pass != '') {
            $('.signupbtn').attr('disabled', false);
        } else {
            $('.signupbtn').attr('disabled', true)
        }
    });

        //Disable button for Login if input is empty
        $('#login').attr('disabled', true);
        $('#username,#userpassword').on('keyup', function () {
            var user = document.getElementById("username").value;
            var pass = document.getElementById("userpassword").value;
            if (user != '' && pass != '') {
                $('#login').attr('disabled', false);
            } else {
                $('#login').attr('disabled', true)
            }
        });

    //Registering an Account!
    $(".signupbtn").click((event) => {
        var user = document.getElementById("regUser").value;
        var pwd = document.getElementById("regPass").value;
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/register',
            cache: false,
            data: JSON.stringify({ username: user, password: pwd }),
            success: function (data) {
                // data is the object that you send form the server by 
                // res.jsonp();
                // here data = {success : true}
                // validate it
                if (data['success']) {
                    alert("Successfully Save!");
                }
                else {
                    alert("User is already Exist!")
                    event.preventDefault();
                }
            },
            error: function () {
                // some error handling part
                alert("Oops! Something went wrong.");
            },
            contentType: "application/json",
            dataType: 'json'
        });
        document.getElementById("regUser").value = "";
        document.getElementById("regPass").value = "";
    })


    //Login an Account!
    $("#login").click((event) => {
        var user = document.getElementById("username").value;
        var pwd = document.getElementById("userpassword").value;
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/login',
            cache: false,
            data: JSON.stringify({ username: user, password: pwd }),
            success: function (data) {
                // data is the object that you send form the server by 
                // res.jsonp();
                // here data = {success : true}
                // validate it
                if (data['success']) {
                    alert("Successfully Save!");
                    location.replace("./admin/Admin.html", "_blank");
                }
                else {
                    alert("Wrong Password or Account!")
                    event.preventDefault();
                }
            },
            error: function () {
                // some error handling part
                alert("Oops! Something went wrong.");
            },
            contentType: "application/json",
            dataType: 'json'
        });
    })

    //Cancel Button
    $(".cancelbtn").click((event) => {
        document.getElementById("regUser").value = "";
        document.getElementById("regPass").value = "";
    })

});