(function($) {
  console.log($.fn);

  // ВЫКЛЮЧАЕМ ЛОАДЕР ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
  setTimeout(function() {
    $('.answer-me-section__loader-block').fadeOut();
  }, 1000);



  let question_length = $('.test-question .question').length;
  let active_type_answer = $('.test-answer-option-block.active').data('answer-type');


  let question_arr = [];

  let isCheckboxStart = true;
  let step_count = 1;


  $('#count_question').text(question_length);
  $('#step_count').text(step_count);






  $('.inp-answer').on('click', function() {
    let active_answer_num = $('.test-answer-option-block.active').data('answer-number');
    let active_answer = $('.test-answer-option-block.active');
    let all_answer = $('.test-answer-option-block');

    let active_question_num = $('.test-question .question.active').data('question-number');
    let active_question = $('.test-question .question.active');
    let all_question = $('.test-question .question');

    let active_type_answer = $('.test-answer-option-block.active').data('answer-type');
    let text_question = $('.test-question .question.active').data('question');

    const THIS = $(this);


    // start logic
    if (active_type_answer === 'radio') {
      radioLogic();
      setTimeout(toggleNextBtn(), 0);
    } else {
      isSelected();
      logicCheckbox();
    }



    /*
      LOGIC RADIO
    */
    function radioLogic() {
      $('.answer-me-section__loader-block').fadeIn();

      let answer = {
        question: text_question,
        answer: THIS.data('answer')
      }

      question_arr.push(answer);

      step_count++;
      $('#step_count').text(step_count);

      setTimeout(function() {
        $('#next_question').css('display', 'none');
      }, 0);

      nextQuestion();

      console.log(question_arr);
    }


    /*
      LOGIC CHECKBOX
    */
    function logicCheckbox() {
      let answer_miltipl = {
        question: null,
        answer_miltipl: []
      };

      let selected_checkbox = $(".test-answer-option-block.active input.checkbox:checkbox:checked");
      let inp = $('.test-answer-option-block.active .checkbox');

      let isChecked = function() {
        if (inp[0].checked || inp[1].checked || inp[2].checked) {
          return true;
        } else {
          return false;
        }
      };


      if (isChecked()) {
        $('#next_question').css('display', 'inline-block');

        if (isCheckboxStart) {
          let answer = {};
          question_arr.push(answer_miltipl);
          createAnswer(selected_checkbox, text_question);
          isCheckboxStart = false;
        } else {
          question_arr.pop();
          question_arr.push(answer_miltipl);
          createAnswer(selected_checkbox, text_question);
          let answer = {};
        }

      } else {
        if (isCheckboxStart) {
          $('#next_question').css('display', 'none');
        } else {
          createAnswer(selected_checkbox);
        }
      }


      console.log(question_arr);

      $('.checkbox').on('click', function() {
        isSelected($(this));
      });
    }

    /**
      --------------------------------------------------------
      // ПЕРЕБИРАЕТ ВСЕ АКТИВНЫЕ ЧЕКБОКСЫ И ЗАПИСЫВАЕТ НОВЫЙ ОТВЕТ
      // ПРИ СНЯТИИ ИЛИ ВЫБОРЕ ЧЕКБОКСА ПЕРЕПИСЫВАЕТ МАССИВ ЗАПОЛНЯЯ ВЫБРАННЫМИ ЧЕКБОКСАМИ
      //ТУТ ЖЕ ПРОИСХОДИТ УДАЛЕНИЕ ЕСЛИ ПОЛЬЗОВАТЕЛЬ ОТМЕНИЛ ВЫБРАНЫЙ ЧЕКБОКС
      --------------------------------------------------------
    **/
    function createAnswer(checkedInp, text_question) {
      if (checkedInp.length == 0) {
        question_arr.splice(-1, 1);
        isCheckboxStart = true;
        $('#next_question').css('display', 'none');
        return;
      }
      for (var i = 0; i < checkedInp.length; i++) {
        for (var j = 0; j < checkedInp[i].attributes.length; j++) {
          if (checkedInp[i].hasAttribute('data-answer')) {
            answer = {
              answer: checkedInp[i].getAttribute('data-answer') || null
            }
          }
        }


        if (question_arr.length != 0) {
          question_arr[question_arr.length - 1].question = text_question;
          question_arr[question_arr.length - 1].answer_miltipl.push(answer);
        } else {
          question_arr[0].question = text_question;
          question_arr[0].answer_miltipl.push(answer);
        }
      }
    }



    // ПРОВЕРЯЕМ ВЫБРАЛ ЛИ ХОТЬ ОДИН ЧЕКБОКС ПРИ СТАРТЕ ЧТО БЫ ПОКРАСИТЬ ВЫБРАННЫЙ
    function isSelected(e) {
      if (e) {
        if ($(e).is(':checked')) {
          $(e).parent('label').addClass('selected');
        } else {
          $(e).parent('label').removeClass('selected');
        }
      } else {
        $('.checkbox').each(function() {
          if ($(this).is(':checked')) {
            $(this).parent('label').addClass('selected');
          } else {
            $(this).parent('label').removeClass('selected');
          }
        });
      }
    }



    // КЛИК ПО КНОПКЕ ПЕРЕКЛЮЧЕНИЯ НА СЛЕДУЮЩИЙ ВОПРОС
    $('#next_question').on('click', function() {
      let inp = $('.test-answer-option-block.active .checkbox');
      if (inp.is(':checked')) {
        nextQuestion();
        setTimeout(toggleNextBtn(), 0);
      }
    });


    /*
     TOGGLE NEXT BUTTON
    */
    function toggleNextBtn() {
      isCheckboxStart = true;
      let active_type_answer = $('.test-answer-option-block.active').data('answer-type');
      if (active_type_answer == 'checkbox') {
        $('#next_question').css('display', 'inline-block');
      } else {
        $('#next_question').css('display', 'none');
      }
    }



    /*
     NEXT QUESTION
    */
    function nextQuestion() {
      $('.answer-me-section__loader-block').fadeIn();


      setTimeout(function() {
        $('#next_question').css('display', 'none');
        $('.answer-me-section__loader-block').fadeOut();
        all_question.each(function() {
          let num_q = active_question_num;
          let num_a = active_answer_num;
          num_q++;
          num_a++;

          if ($(this).data('question-number') === num_q && num_q <= question_length) {
            active_question.removeClass('active');
            active_answer.removeClass('active');

            all_answer.each(function() {
              if ($(this).data('answer-number') === num_a) {
                $(this).addClass('active');
              }
            });
            $(this).addClass('active');
          } else if (num_q > question_length) {
            // END
            // СРАБАТЫВАЕТ ПОСЛЕ ОТВЕТА НА ПОСЛЕДНИЙ ВОПРОС
            $('#bgr_modal').fadeIn();
            $('.child-data-box').fadeIn();
            $('#finally_block_test').fadeIn();
            $('body').addClass('overflow');
            // $('.finally-hiden').hide();
            isCheckboxStart = true;
          }
        });
      }, 800);

    }

  });

  $('#next_question').on('click', function() {
    step_count++;
    $('#step_count').text(step_count);
  });

})(jQuery);
