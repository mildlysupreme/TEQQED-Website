function initializeSwiper() {
  if (
    $(".swiper.main").length &&
    $(".swiper.small").length &&
    $(".swiper.link").length &&
    $(".swiper.link-block").length
  ) {
    const bgImageSwiper = new Swiper(".swiper.main", {
      direction: "vertical",
      loop: true,
      autoplay: {
        delay: 10000,
        disableOnInteraction: false
      },
      mousewheel: {
        thresholdDelta: 20
      },
      keyboard: true,
      followFinger: false,
      effect: "slide",
      simulateTouch: false,
      longSwipes: true,
      preventClicks: true,
      speed: 800,
      navigation: {
        nextEl: "#workNext",
        prevEl: "#workPrev"
      },
      parallax: true,
      on: {
        init: function () {
          $(".swiper-progress-bar").removeClass("animate");
          $(".swiper-progress-bar").removeClass("active");
          $(".swiper-progress-bar").eq(0).addClass("animate");
          $(".swiper-progress-bar").eq(0).addClass("active");
        },
        slideChangeTransitionStart: function () {
          $(".swiper-progress-bar").removeClass("animate");
          $(".swiper-progress-bar").removeClass("active");
          $(".swiper-progress-bar").eq(0).addClass("active");
        },
        slideChangeTransitionEnd: function () {
          $(".swiper-progress-bar").eq(0).addClass("animate");
        }
      }
    });

    const fgImageSwiper = new Swiper(".swiper.small", {
      slidesPerView: 1,
      direction: "vertical",
      loop: true,
      simulateTouch: false,
      allowTouchMove: false,
      longSwipes: true,
      preventClicks: true,
      effect: "scroll",
      speed: 800,
      reverseDirection: true,
      parallax: true
    });

    const linkImageSwiper = new Swiper(".swiper.link", {
      direction: "vertical",
      loop: true,
      simulateTouch: false,
      allowTouchMove: false,
      longSwipes: true,
      preventClicks: true,
      effect: "slide",
      speed: 100
    });

    const linkBlockSwiper = new Swiper(".swiper.link-block", {
      direction: "vertical",
      loop: true,
      simulateTouch: false,
      allowTouchMove: false,
      longSwipes: true,
      preventClicks: true,
      effect: "slide",
      speed: 100
    });

    // Link background slider to foreground slider
    bgImageSwiper.controller.control = fgImageSwiper;
    fgImageSwiper.controller.control = linkImageSwiper;
    linkImageSwiper.controller.control = linkBlockSwiper;

    function setText() {
      $(".swiper_text").css("transform", "translateY(100%)");
      $(".swiper_btn").css("transform", "translateY(100%)");
      $(".swiper_sub").css("opacity", "0");
    }

    // When scrolling down
    bgImageSwiper.on("slideNextTransitionStart", function (e) {
      setText();
      // Text leaving
      let outgoingText = $(".text_item").eq(e.previousIndex - 1);
      gsap.fromTo(
        outgoingText.find(".swiper_text"),
        { y: "0%" },
        { y: "-100%", stagger: { amount: 0.1 }, duration: 0.4, delay: 0.1 }
      );
      gsap.fromTo(
        outgoingText.find(".swiper_btn"),
        { y: "0%" },
        { y: "-100%", stagger: { amount: 0.1 }, duration: 0.4, delay: 0.1 }
      );
      gsap.fromTo(
        outgoingText.find(".swiper_sub"),
        { opacity: 1 },
        { opacity: 0, duration: 0.4, delay: 0.2 }
      );
      // Text coming in
      let incomingText = $(".text_item").eq(e.realIndex);
      gsap.fromTo(
        incomingText.find(".swiper_text"),
        { y: "100%" },
        { y: "0%", stagger: { amount: 0.1 }, duration: 0.4, delay: 0.1 }
      );
      gsap.fromTo(
        incomingText.find(".swiper_btn"),
        { y: "100%" },
        { y: "0%", stagger: { amount: 0.1 }, duration: 0.4, delay: 0.1 }
      );
      gsap.fromTo(
        incomingText.find(".swiper_sub"),
        { opacity: 0 },
        { opacity: 1, duration: 0.4, delay: 0.2 }
      );
    });

    // When scrolling up
    bgImageSwiper.on("slidePrevTransitionStart", function (e) {
      setText();
      // Text leaving
      let outgoingText = $(".text_item").eq(e.activeIndex);
      gsap.fromTo(
        outgoingText.find(".swiper_text"),
        { y: "0%" },
        {
          y: "100%",
          stagger: { amount: 0.1, from: "end" },
          duration: 0.4,
          delay: 0
        }
      );
      gsap.fromTo(
        outgoingText.find(".swiper_btn"),
        { y: "0%" },
        {
          y: "100%",
          stagger: { amount: 0.1, from: "end" },
          duration: 0.4,
          delay: 0
        }
      );
      gsap.fromTo(
        outgoingText.find(".swiper_sub"),
        { opacity: 1 },
        { opacity: 0, duration: 0.3, delay: 0.2 }
      );
      // Text coming in
      let incomingText = $(".text_item").eq(e.realIndex);
      gsap.fromTo(
        incomingText.find(".swiper_text"),
        { y: "-100%" },
        {
          y: "0%",
          stagger: { amount: 0.1, from: "end" },
          duration: 0.4,
          delay: 0.1
        }
      );
      gsap.fromTo(
        incomingText.find(".swiper_btn"),
        { y: "-100%" },
        {
          y: "0%",
          stagger: { amount: 0.1, from: "end" },
          duration: 0.4,
          delay: 0.1
        }
      );
      gsap.fromTo(
        incomingText.find(".swiper_sub"),
        { opacity: 0 },
        { opacity: 1, duration: 0.3, delay: 0.2 }
      );
    });

    // Display number for total slide count
    let slideLength = bgImageSwiper.slides.length - 2;
    $(".total").text(("0" + slideLength).slice(-2));

    // Update current slide number to display
    bgImageSwiper.on("transitionStart", function (e) {
      let activeNumer = +e.realIndex + 1;
      $(".current").text(("0" + activeNumer).slice(-2));
    });
  }
}

// Inicjalizacja swiperów na stronie
initializeSwiper();
