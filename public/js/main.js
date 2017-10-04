(function($) {
    $(document).ready(function(){
        $(window).scroll(function(){
          if ($(this).width() > 1200) {
            if ($(this).scrollTop() > 800) {
                $('#menu').fadeIn(500);
            } else {
                $('#menu').fadeOut(500);
            }
          } else {
              if ($(this).scrollTop() > 550) {
                  $('#menu').fadeIn(500);
              } else {
                  $('#menu').fadeOut(500);
            }
          }

        });
    });
})(jQuery);
