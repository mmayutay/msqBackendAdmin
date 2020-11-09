$(document).ready(function () {
    $("#questions").hide()
    $("#AnswerByOne").hide();
    $(".SaveScore").hide();
    $("#score").hide()
    $("#backHome").hide()
    var dataids = "";
    var persontaker = "";
    var arrayOfValues;
    var arrayScores;
    var update = "";
    var forScores = "View Answers"
    deleted = "";
    questionCheck = 0;
    reload = "";    

    //GETTING THE SCORE OF ALL TEST TAKERS
    $.ajax({
        url: 'http://localhost:8080/getScore',
        type: 'GET',
        success: (scores) => {
            arrayScores = scores
        },
        error: () => {
            console.log("error")
        }
    });

    //GETTING ALL DATA
    $.ajax({
        url: 'http://localhost:8080/allData',
        type: 'GET',
        success: (data) => {
            arrayOfValues = data
            //Append data on the datable
            for (var z = 0; z < arrayOfValues.length; z++) {
                if (arrayScores.length > 0) {
                    forScores = "Update Scores"
                }
                var li = "<tr>" + "<td>" + (z + 1) + "</td>" + "<td>" + arrayOfValues[z].name + "</td>" + "<td>" + "<button class='button'  onclick=$.fn.showdataId(" + z + ")>" + forScores + "</button>" + "</td>" + "<td id='" + arrayOfValues[z]._id + "'>" + "</td >" + "<td>" + "<button class='delbtn'  onclick=$.fn.deleteAnswer(" + z + ")>" + "Delete" + "</button>" + "</td>" + "</tr>";
                $("#customers").append(li)

                //Score for every takers
                if (arrayScores.length > 0) {
                    reload = "true";
                    for (var a = 0; a < arrayScores.length; a++) {
                        $('#' + arrayScores[a].dataid).text(arrayScores[a].score);
                    }
                }
                else {
                    if (reload == "true") {
                        setInterval(window.location.reload(), .01);
                        reload = "false";
                    }

                }

            }

            //DELETE AN ANSWER
            $.fn.deleteAnswer = function (ids) {
                //DELETE DOCUMENT BY ID
                $.ajax({
                    url: 'http://localhost:8080/deleteAnswer/' + arrayOfValues[ids]._id,
                    type: 'DELETE',
                    success: (id) => {
                        console.log(id)
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
                deleted = "deleted";
                //DELETE A SCORE
                if (deleted == "deleted") {
                    $.ajax({
                        url: 'http://localhost:8080/deleteScore/',
                        type: 'DELETE',
                        data: JSON.stringify({ dataid: arrayOfValues[ids]._id }),
                        success: (id) => {
                            console.log(id)
                        },
                        contentType: "application/json",
                        dataType: 'json'
                    });
                }
                setInterval(window.location.reload(),.9);

            }

            //Back To home button
            var tableVal = ""
            $("#backHome").click(() => {
                location.reload();
            }) 
            //SHOW DATA BY ID WHEN CLICKING VIEW SCORE
            $.fn.showdataId = function (y) {
                dataids = arrayOfValues[y]._id;
                persontaker = arrayOfValues[y].name;
                var score = parseInt($('#' + arrayOfValues[y]._id).text().length);
                if (score > 0) {
                    update = "true";
                }
                else {
                    update = "false";
                }
                $("#customers").hide()
                $("#questions").show();
                $("#score").show();
                $(".SaveScore").show();
                $("#backHome").show()
                for (var i = 0; i < arrayOfValues[y].answers.length; i++) {
                    tableVal = "<tr>" + "<td>" + arrayOfValues[y].answers[i].question.question + "</td>" + "<td>" + arrayOfValues[y].answers[i].answer + "</td>" + "<td>" + "<input type='radio' id='correct' name='choice" + i + "' value='radio' class='yes'>" + "</td>" + "<td>"+"<input type='radio' id='incorrect' name='choice" + i + "' value='radio' class='no'>"+"</td >"+ "</tr>";
                    $("#questions").append(tableVal)
                }

                //FUNCTION OF GETTING THE SCORE
                $('input').change(function () {
                    var yes = $('.yes:checked').length
                    var no = $('.no:checked').length
                    $('.yes_results').text(yes)
                    $('.no_results').text(no)
                    questionCheck += parseInt(yes);
                })


            }


        },
        error: () => {
            console.log("error")
        }
    });



    //SAVING THE SCORE
    $(".SaveScore").click((event) => {
        location.reload()
        if (questionCheck > 0) {
            var score = $(".yes_results").text();
            var wrong = $(".no_results").text();
            if (update == "true") {
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/updateScore',
                    data: JSON.stringify({ dataid: dataids, name: persontaker, score: score, mistake: wrong }),
                    success: (data) => {

                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
                window.location.reload()
            }else {
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/addScore',
                    data: JSON.stringify({ dataid: dataids, name: persontaker, score: score, mistake: wrong }),
                    success: (data) => {

                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
                window.location.reload()
            }
        }else {
            event.preventDefault();
        }

    })

});