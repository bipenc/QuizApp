/**
 * Created by bipen on 9/21/16.
 */
//variables
var viewedQuestions = [],
    totalAnswerTimeFirst = 60,  //in seconds
    totalAnswerPassTime = 20; //in seconds

//check for localstorage
if (localStorage.getItem('viewedQuestion') !== null) {
    viewedQuestions = JSON.parse(localStorage.getItem('viewedQuestion'));
}

$(function () {

    //Audio Elements
    var audioElementBackground = document.createElement('audio');
    audioElementBackground.setAttribute('src', 'assets/audio/backgroundmusic.mp3');
    
    var audioElementQuestion = document.createElement('audio');
    audioElementQuestion.setAttribute('src', 'assets/audio/question1.mp3');

    var audioElementWronganswer = document.createElement('audio');
    audioElementWronganswer.setAttribute('src', 'assets/audio/wrongAnswer.mp3');

    var audioElementTrueanswer = document.createElement('audio');
    audioElementTrueanswer.setAttribute('src', 'assets/audio/correct.mp3');

    var audioRapidFire = document.createElement('audio');
    audioRapidFire.setAttribute('src', 'assets/audio/rapidFire.mp3');


    var timeoutId = "";

    $(document).keypress(function(e) {
        var timeout = 3000;
        if(e.which == 112) {
            //pass
            // Type p
            passAnswer();
        } else if(e.which == 116){
            //true
            // Type t
            $.jGrowl("Right Answer!!!",{life : 3000});
            audioElementTrueanswer.play();
            window.clearTimeout(timeoutId);
            setTimeout(closeQuestion, 200);

        } else if (e.which == 102){
            //false
            // Type f
            audioElementWronganswer.play();
            window.clearTimeout(timeoutId);
            setTimeout(passAnswer, timeout);
            $.jGrowl("Wrong Answer!!!",{life : 3000});

        } else if (e.which == 99){
            //close
            // Type c
            closeQuestion();

        }  else if (e.which == 114){
            //reset all questions
            // Type r
            clearLocalStorage();

        } else if(e.which === 109) {
            
            // Rapid Fire
            stopMusic(audioElementBackground);
            audioRapidFire.play();
        } else if(e.which === 110) {
            // Rapid Fire
            stopMusic(audioRapidFire);
            audioElementWronganswer.play();
            audioElementBackground.play();

        }
        else if(e.which === 115) {
            // Rapid Fire
            stopMusic(audioRapidFire);
            stopMusic(audioElementWronganswer);
            audioElementBackground.play();
        }
    });

    //countdown function
    function countdown(elementName, minutes, seconds)
    {
        var element, endTime, hours, mins, msLeft, time;

        function twoDigits(n)
        {
            return (n <= 9 ? "0" + n : n);
        }

        function updateTimer()
        {
            msLeft = endTime - (+new Date);
            if (msLeft < 1000) {
                stopMusic(audioElementQuestion);
                audioElementWronganswer.play();
                element.innerHTML = "<span id='countdown-msg'>Countdown's Over!</span>";
            } else {
                time = new Date(msLeft);
                hours = time.getUTCHours();
                mins = time.getUTCMinutes();
                element.innerHTML = (hours ? hours + ':' + twoDigits(mins) : mins) + ':' + twoDigits(time.getUTCSeconds());
                timeoutId = setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
            }
        }

        element = document.getElementById(elementName);
        endTime = (+new Date) + 1000 * (60 * minutes + seconds) + 500;
        updateTimer();
    }

    function stopMusic(ele) {
        ele.pause();
        ele.currentTime = 0;
    }

    var count = 1;
    $.each(question, function (i, v) {

        $.each(v, function( ind , val){
            var divContent = fetchQuestions(i + '-' + ind, ind);
            $('.' +i+'-wrapper').append(divContent);
        });


    });

    function fetchQuestions(i, count) {
        if (localStorage.getItem('viewedQuestion') !== null) {

            var qArray = JSON.parse(localStorage.getItem('viewedQuestion'));
            if ($.inArray(i, qArray) !== -1) {
                var divContainer = $('<span />', {'data-indx': i, 'class': 'strike'}).html(count);
            } else {
                var divContainer = $('<span />', {'data-indx': i}).html(count);
            }
        } else {
            var divContainer = $('<span />', {'data-indx': i}).html(count);
        }
        return divContainer;
    }

    $('#pass').click(function () {
        passAnswer();
    });


    $('.counterwrapper').on('click', 'span:not(".strike")', function () {
        $(this).addClass('strike');
        var indx = $(this).data('indx');
        viewedQuestions.push(indx);
        localStorage.setItem('viewedQuestion', JSON.stringify(viewedQuestions));

        //$('#ques').html(question[indx]);
        $questionArray = indx.split('-');
        $('#ques').html(question[$questionArray[0]][$questionArray[1]]);
        // $('#question_counter').html(indx);

        $('.counterwrapper').fadeOut(function () {
            window.clearTimeout(timeoutId);
            countdown("countdown", 0, totalAnswerTimeFirst);
            $('#quiz-answer').fadeIn(function () {
                stopMusic(audioElementBackground);
                audioElementQuestion.play();
            });
        });

    });

    $('#close').click(function () {
        closeQuestion();
    });

    $('#reset-localstorage').click(function () {
        clearLocalStorage();
    });

    $('#pausebackgroundScore').click(function () {
        audioElementBackground.pause();
    });

    $('#playbackgroundScore').click(function () {
        audioElementBackground.play();
    });


    //stop the background sound
    $('#video1,#video2,#video3,#video4').on('show.bs.modal', function (e) {
        audioElementBackground.pause();
    });
    $('#video1,#video2,#video3,#video4').on('hidden.bs.modal', function () {
        audioElementBackground.play();
    });

    //pass
    function passAnswer(){
        window.clearTimeout(timeoutId);
        countdown("countdown", 0, totalAnswerPassTime);
        stopMusic(audioElementQuestion);
        audioElementQuestion.play();
        $.jGrowl("Pass!!!",{life : 3000});
    }
    //close
    function closeQuestion(){
        window.clearTimeout(timeoutId);
        $('#quiz-answer').fadeOut(function () {
            $('#countdown').html('');
            stopMusic(audioElementQuestion);
            audioElementBackground.play();
            $('.counterwrapper').fadeIn();
        });
    }
    //reset localStorage
    function clearLocalStorage(){
        localStorage.removeItem('viewedQuestion');
        window.location = window.location;
    }

    //PLAY BACKGROUND AUDIO ON LOAD
    audioElementBackground.play();

});