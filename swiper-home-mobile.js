function numberWithZero(num) {
  if (num < 10) {
    return "0" + num;
  } else {
    return num;
  }
}

$(".slider-gallery_component").each(function (index) {
  let totalSlides = numberWithZero(
    $(this).find(".swiper-slide.is-slider-thumbs").length
  );
  $(".swiper-number-total").text(totalSlides);

  const bgSwiper = new Swiper($(this).find(".swiper.is-slider-bg")[0], {
    slidesPerView: 1,
    speed: 400,
    effect: "fade",
    allowTouchMove: false
  });

  const textSwiper = new Swiper($(this).find(".swiper.is-slider-titles")[0], {
    slidesPerView: "auto",
    speed: 600,
    loop: true,
    loopedSlides: 8,
    slideToClickedSlide: true,
    mousewheel: true,
    keyboard: true,
    centeredSlides: true,
    slideActiveClass: "is-active",
    slideDuplicateActiveClass: "is-active",
    thumbs: {
      swiper: bgSwiper
    }
  });

  textSwiper.controller.control = thumbsSwiper;
  thumbsSwiper.controller.control = textSwiper;

  textSwiper.on("slideChange", function (e) {
    let slideNumber = numberWithZero(e.realIndex + 1);
    $(".swiper-number-current").text(slideNumber);
  });
});
