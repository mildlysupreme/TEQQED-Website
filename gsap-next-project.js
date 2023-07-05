function runCaseGSAP() {
  const wrapper = document.querySelector(".case-projects-list");
  const boxes = gsap.utils.toArray(".case-projects-item");
  console.clear();

  let activeElement;

  const loop = horizontalCaseLoop(boxes, {
    paused: false,
    draggable: true,
    center: false,
    onChange: (element, index) => {
      activeElement && activeElement.classList.remove("-active");
      element.classList.add("-active");
      activeElement = element;
    }
  });

  wrapper.addEventListener("mouseenter", () => {
    loop.pause();
  });

  wrapper.addEventListener("mouseleave", () => {
    loop.play();
  });
}

function horizontalCaseLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};
  let onChange = config.onChange,
    lastIndex = 0,
    tl = gsap.timeline({
      repeat: config.repeat,
      onUpdate:
        onChange &&
        function () {
          let i = tl.closestIndex();
          if (lastIndex !== i) {
            lastIndex = i;
            onChange(items[i], i);
          }
        },
      paused: config.paused,
      defaults: { ease: "none" },
      onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 10)
    }),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    spaceBefore = [],
    xPercents = [],
    curIndex = 0,
    center = config.center,
    pixelsPerSecond = (config.speed || 1) * 40,
    snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1),
    timeOffset = 0,
    container =
      center === true
        ? items[0].parentNode
        : gsap.utils.toArray(center)[0] || items[0].parentNode,
    totalWidth,
    getTotalWidth = () =>
      items[length - 1].offsetLeft +
      (xPercents[length - 1] / 100) * widths[length - 1] -
      startX +
      spaceBefore[0] +
      items[length - 1].offsetWidth *
        gsap.getProperty(items[length - 1], "scaleX") +
      (parseFloat(config.paddingRight) || 0),
    populateWidths = () => {
      let b1 = container.getBoundingClientRect(),
        b2;
      items.forEach((el, i) => {
        widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
        xPercents[i] = snap(
          (parseFloat(gsap.getProperty(el, "x", "px")) / widths[i]) * 100 +
            gsap.getProperty(el, "xPercent")
        );
        b2 = el.getBoundingClientRect();
        spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
        b1 = b2;
      });
      gsap.set(items, {
        xPercent: (i) => xPercents[i]
      });
      totalWidth = getTotalWidth();
    },
    timeWrap,
    populateOffsets = () => {
      timeOffset = center
        ? (tl.duration() * (container.offsetWidth / 2)) / totalWidth
        : 0;
      center &&
        times.forEach((t, i) => {
          times[i] = timeWrap(
            tl.labels["label" + i] +
              (tl.duration() * widths[i]) / 2 / totalWidth -
              timeOffset
          );
        });
    },
    getClosest = (values, value, wrap) => {
      let i = values.length,
        closest = 1e10,
        index = 0,
        d;
      while (i--) {
        d = Math.abs(values[i] - value);
        if (d > wrap / 2) {
          d = wrap - d;
        }
        if (d < closest) {
          closest = d;
          index = i;
        }
      }
      return index;
    },
    populateTimeline = () => {
      let i, item, curX, distanceToStart, distanceToLoop;
      tl.clear();
      for (i = 0; i < length; i++) {
        item = items[i];
        curX = (xPercents[i] / 100) * widths[i];
        distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
        distanceToLoop =
          distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
        tl.to(
          item,
          {
            xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
            duration: distanceToLoop / pixelsPerSecond
          },
          0
        )
          .fromTo(
            item,
            {
              xPercent: snap(
                ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
              )
            },
            {
              xPercent: xPercents[i],
              duration:
                (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
              immediateRender: false
            },
            distanceToLoop / pixelsPerSecond
          )
          .add("label" + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
      }
      timeWrap = gsap.utils.wrap(0, tl.duration());
    },
    refresh = (deep) => {
      let progress = tl.progress();
      tl.progress(0, true);
      populateWidths();
      deep && populateTimeline();
      populateOffsets();
      deep && tl.draggable
        ? tl.time(times[curIndex], true)
        : tl.progress(progress, true);
    },
    proxy;
  gsap.set(items, { x: 0 });
  populateWidths();
  populateTimeline();
  populateOffsets();
  window.addEventListener("resize", () => refresh(true));
  function toIndex(index, vars) {
    vars = vars || {};
    Math.abs(index - curIndex) > length / 2 &&
      (index += index > curIndex ? -length : length);
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    if (time < 0 || time > tl.duration()) {
      vars.modifiers = { time: timeWrap };
    }
    curIndex = newIndex;
    vars.overwrite = true;
    gsap.killTweensOf(proxy);
    return tl.tweenTo(time, vars);
  }
  tl.next = (vars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.closestIndex = (setCurrent) => {
    let index = getClosest(times, tl.time(), tl.duration());
    setCurrent && (curIndex = index);
    return index;
  };
  tl.times = times;
  tl.progress(1, true).progress(0, true);
  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }
  if (config.draggable && typeof Draggable === "function") {
    proxy = document.createElement("div");
    let wrap = gsap.utils.wrap(0, 1),
      ratio,
      startProgress,
      draggable,
      dragSnap,
      align = () =>
        tl.progress(
          wrap(startProgress + (draggable.startX - draggable.x) * ratio)
        ),
      syncIndex = () => tl.closestIndex(true);
    typeof InertiaPlugin === "undefined" &&
      console.warn(
        "InertiaPlugin required for momentum-based scrolling and snapping. https://greensock.com/club"
      );
    draggable = Draggable.create(proxy, {
      trigger: items[0].parentNode,
      type: "x",
      onPressInit() {
        gsap.killTweensOf(tl);
        startProgress = tl.progress();
        refresh();
        ratio = 1 / totalWidth;
        gsap.set(proxy, { x: startProgress / -ratio });
      },
      onDrag: align,
      onThrowUpdate: align,
      inertia: true,
      snap: (value) => {
        let time = -(value * ratio) * tl.duration(),
          wrappedTime = timeWrap(time),
          snapTime = times[getClosest(times, wrappedTime, tl.duration())],
          dif = snapTime - wrappedTime;
        Math.abs(dif) > tl.duration() / 2 &&
          (dif += dif < 0 ? tl.duration() : -tl.duration());
        return (time + dif) / tl.duration() / -ratio;
      },
      onRelease: syncIndex,
      onThrowComplete: syncIndex
    })[0];
    tl.draggable = draggable;
  }
  tl.closestIndex(true);
  onChange && onChange(items[curIndex], curIndex);
  return tl;
}
runCaseGSAP();

function projectNameMarquee() {
  let currentScroll = 0;
  let isScrollingDown = true;
  let tween1 = gsap
    .to(".p-hero-marquee-item", {
      xPercent: -100,
      repeat: -1,
      duration: 30,
      ease: "linear"
    })
    .totalProgress(0.5);
  gsap.set(".p-hero-marquee-item", {
    xPercent: -50
  });
}
projectNameMarquee();

function gallerySwiper() {
  slideSwiper2 = new Swiper(".p-s-list-wrapper", {
    wrapperClass: "p-s-list",
    slideClass: "p-s-item",
    loop: true,
    speed: 500,
    spaceBetween: 20,
    centeredSlides: true,
    slidesPerView: "auto",
    grabCursor: true,
    disableOnInteraction: false,
    autoplay: {
      delay: 4000,
      disableOnInteraction: true
    }
  });
  const slider = document.querySelector(".slider");
  const cursor = document.querySelector(".cursor-move");
  const cursorDot = cursor.querySelector(".cursor-dot");
  function moveCursor(event) {
    cursor.style.transform = `translate3d(calc(${event.clientX}px - 50vw), calc(${event.clientY}px - 50vh), 0)`;
  }
  window.onmousemove = (event) => {
    moveCursor(event);
  };
  window.onpointermove = (event) => {
    moveCursor(event);
  };
  slider.onmouseenter = () => {
    cursorDot.classList.add("show");
  };

  slider.onmouseleave = () => {
    cursorDot.classList.remove("show");
  };
  slider.onpointerdown = () => {
    cursorDot.classList.add("active");
  };
  slider.onpointerup = () => {
    cursorDot.classList.remove("active");
  };
}
gallerySwiper();

function swiperCaseNext() {
  slideSwiper = new Swiper(".swiper", {
    wrapperClass: "swiper-wrapper",
    slideClass: "swiper-slide",
    slidesPerView: "auto",
    speed: 600,
    loop: true,
    loopedSlides: 8,
    slideToClickedSlide: true,
    mousewheel: true,
    keyboard: true,
    centeredSlides: true,
    slideActiveClass: "is-active",
    slideDuplicateActiveClass: "is-active"
  });
}
swiperCaseNext();

function projectNav() {
  const projectSections = document.querySelector(".project-sections");
  const stickyBtnWrapper = document.querySelector(".sticky-btn-wrapper");

  console.log("projectSections:", projectSections); // Debug log
  console.log("stickyBtnWrapper:", stickyBtnWrapper); // Debug log

  function checkViewportExit() {
    const rect = projectSections.getBoundingClientRect();
    const threshold = window.innerHeight * 0.5; // 50% of browser is visible

    if (
      rect.bottom >= threshold &&
      rect.top <= window.innerHeight - threshold
    ) {
      stickyBtnWrapper.style.transform = "translate(0, 0%)";
    } else {
      stickyBtnWrapper.style.transform = "translate(0, 100%)";
    }
  }

  window.addEventListener("scroll", checkViewportExit);
}
projectNav();
