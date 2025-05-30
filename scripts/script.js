gsap.registerPlugin(ScrollTrigger); //tell GSAP we want to use scrollTrigger plugin

/* ===========================================
   NOT TIMELINE RELATED
=========================================== */

/* SCROLL BUTTON APPEAR/DISSAPPEAR */
//top
ScrollTrigger.create({
  trigger: ".scene1",
  start: "top top",
  onEnter: () => document.querySelector(".scroll-button--top").style.display = "block",
  onLeaveBack: () => document.querySelector(".scroll-button--top").style.display = "none"
});

//bottom
const bottomBtn = document.querySelector(".scroll-button--bottom"); //gets scroll to bottom button

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const fullHeight = document.documentElement.scrollHeight;

  if (scrollY + windowHeight >= fullHeight) {
    bottomBtn.style.display = "none"; //hide bottom if at bottom of page
  } else {
    bottomBtn.style.display = "block"; //otherwise show it
  }
});

/* INTRO SECTION */
//stop animations if reduced motion is enabled
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  //cloud 1 animation
  gsap.fromTo(".intro__cloud--1",
    { x: "-45vw" }, //from off screen
    {
      x: "75vw", //to off screen oppiste side
      duration: 22,
      repeat: -1,
      ease: "none"
    }
  );

  //cloud 2 animation
  gsap.fromTo(".intro__cloud--2",
    { x: "-85vw" }, //from off screen
    {
      x: "40vw", //to off screen opposite side
      duration: 26,
      delay: 2, //animation start delay
      repeat: -1,
      ease: "none"
    }
  );

  //text animation
  gsap.from(".intro__title, .intro__text, .intro__info", {
    y: 50,
    opacity: 0,
    duration: 2,
    stagger: 0.2, //delays each element a bit slightly so they animate one after the other
    ease: "power2.out"
  });
}

/* SCENE 3 */
//borrowed this code from ChatGPT, looks for if user has asked for reduced motion, used to stop SMIL animations
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('animateTransform').forEach(anim => anim.remove());
}

/* SCENE 4 */
//animating the brows of our characters scene4
const brows = [
  document.querySelector("#_4-guy-brows"),
  document.querySelector("#_4-gal-brows")
];

//GSAP animation running once when hovered over
const browsAnim = gsap.to(brows, {
  y: -5,
  duration: 0.5,
  yoyo: true,
  repeat: 1,
  ease: "sine.inOut",
  paused: true
});

const guy = document.querySelector("#_4-guy");
guy.addEventListener('mouseenter', () => {
  browsAnim.restart();
});

const gal = document.querySelector("#_4-gal");
gal.addEventListener('mouseenter', () => {
  browsAnim.restart();
});

//making the rubbish disappear when clicked
document.querySelectorAll("#_4-bottle-wave-2, #_4-cup-wave, #_4-bottle-wave-1").forEach(item => {
  item.addEventListener('click', function () {
    item.style.transition = 'opacity 0.5s ease-out';  // Gradient
    item.style.opacity = 0;  // Starts the fade effect
    setTimeout(() => item.style.display = 'none', 500);  // Removes elements after fade effect
  });
});

//showing sparkles when rubbish is clicked away
function showSparkle(trashId, sparkleId) {
  const trash = document.getElementById(trashId);
  const sparkle = document.getElementById(sparkleId);

  if (!trash || !sparkle) return;

  //finding middle of trash group in SVG coordinates
  const bbox = trash.getBBox();
  const centerX = bbox.x + bbox.width / 2;
  const centerY = bbox.y + bbox.height / 2;

  //width and height of sparkles from SVG attributes
  const sparkleWidth = +sparkle.getAttribute("width");
  const sparkleHeight = +sparkle.getAttribute("height");

  //center the sparkles over trash
  sparkle.setAttribute("x", centerX - sparkleWidth / 2);
  sparkle.setAttribute("y", centerY - sparkleHeight / 2);
  sparkle.setAttribute("visibility", "visible");

  //hide again after 800ms
  setTimeout(() => {
    sparkle.setAttribute("visibility", "hidden");
  }, 800);
}

//popup message after all rubbish is removed
const trashItems = document.querySelectorAll('.rubbish');
const totalTrash = trashItems.length;
let trashRemoved = 0;

trashItems.forEach(item => {
  item.addEventListener('click', () => {
    // Remove rubbish
    item.style.transition = 'opacity 0.5s ease';
    item.style.opacity = 0;
    setTimeout(() => {
      item.style.display = 'none';
      trashRemoved++;

      // Check that everything is removed
      if (trashRemoved === totalTrash) {
        document.getElementById('congrats');
        congrats.style.display = 'block';
        congrats.classList.add('spin');
      }
    }, 500);
  });
});

//borrowed this code for .scene4__text to dissappear from ChatGPT
let textRemoved = false;

document.querySelectorAll(".rubbish").forEach(item => {
  item.addEventListener('click', () => {
    if (!textRemoved) {
      document.querySelector('.scene4__text').style.display = 'none';
      textRemoved = true;
    }
  });
});

/* ===========================================
   THE REST OF THE SCRIPT IS TIMELINE RELATED
=========================================== */

/* TIMELINE SCENE 1-2 */
let tl = gsap.timeline({ //create timeline (tl)
  scrollTrigger: {  //connect timeline to scroll
    trigger: ".stage", //the element starting the chain reaction of animations
    start: "top top", //start when it hits top of viewport
    end: "+=8000", //set scroll distance (adjust for slower or faster animations)
    pin: true, //pin the stage
    scrub: true, //scrolling back reverses animations (when scrub is used "duration" becomes scroll based, not time based)
  }
});

tl.to(".scene1__text", { //add animation to the timeline (tl), start from the current value of element (to), targets element being animated
  scale: 0, //shrink the text to nothing
  duration: 0.5, //define scroll distance of animation
  ease: "back.in(2)", //predefined easing type (how an animation accelerates or decelerates) from the GSAP library, number indicates how much it zooms
}, 0.5); //tells GSAP to start animation at the time 0 in the timeline (immediately)


tl.to(["#scene1__guy", "#scene1__gal"], { //elements being animated
  y: "120%", //move down 120% of its own height
  x: "60%", //move right 60% of its own width
  duration: 1, //define scroll distance of animation
}, 1.2); //time in timeline to start animation

tl.to([
  "#scene1__water",
  "#scene1__sand",
  "#scene1__wave1",
  "#scene1__wave2",
  "#scene1__wave3",
  "#scene1__wave4",
  "#scene1__wave5",
  "#scene1__stone",
  "#scene1__tree",
  "#scene1__bush"], { //elements being targeted
  opacity: 1, //fade in the targeted elements making them visible
  duration: 1, //scroll duration
}, 1.2); //start time of the animation in the timeline

tl.to("#scene1__sand", {
  y: "44%", //move down 44% of its own height, making it look like a wave
  duration: 0.8,
  repeat: 1, //repeats the animation
  yoyo: true, //in combination with repeat, makes the animation reverse direction when it repeats, going back to its original position
  ease: "power1.inOut", //https://gsap.com/docs/v3/Eases
}, 2.3);

tl.to("#scene1__shadow", {
  opacity: 0,
  duration: 0.4,
  ease: "power1.out", //https://gsap.com/docs/v3/Eases
}, 2.6);

tl.to("#scene1__bottle", {
  x: 600,
  y: -1000,
  scale: 0, //shrink to simulate distance
  opacity: 0, //fade as bottle drifts further
  duration: 2,
  ease: "power1.out", //https://gsap.com/docs/v3/Eases
}, 3.2);

tl.to(".scene1", {
  opacity: 0,
  y: "10%",
  duration: 2,
  ease: "power2.out",
}, 5);

tl.to(".scene2", {
  opacity: 1,
  duration: 2,
  ease: "power2.out"
}, 6.2);

tl.to(".scene2__text", { //add animation to the timeline (tl), start from the current value of element (to), targets element being animated
  scale: 0, //shrink the text to nothing
  duration: 1, //define scroll distance of animation
  ease: "back.in(2)" //predefined easing type (how an animation accelerates or decelerates) from the GSAP library, number indicates how much it zooms
}, 7.5); //tells GSAP to start animation at the time 0 in the timeline (immediately)

tl.to("#scene2__people", {
  x: -5,
  y: -4,
  scale: 0,
  transformOrigin: "left center",
  duration: 1.5,
}, 8.5);

tl.from(".scene2__facts", {
  scale: 0,
}, 9.5);

tl.to({}, { //no target, just a pause when combined with "duration: 2"
  duration: 1, //add a pause so text stops a bit before scrolling further
}, 10);

/* Timeline scene 3 depth 1-2 */
let tl2 = gsap.timeline({
  scrollTrigger: {
    trigger: "#scene3__depth1",
    start: "top top",
    end: "+=3000",
    pin: true,
    scrub: true,
  }
});

tl2.to(".scene3__bubbles, .scene3__bubbles2, .scene3__bubbles3, .scene3__bubbles4", {
  y: "-150vh",    // move up far out of screen
  duration: 2,    // speed
  ease: "power1.inOut", // fast → slow → fast
}, 0);            // start immediately at time 0

/* Timeline scene 3 depth 3 */
let tl3 = gsap.timeline({
  scrollTrigger: {
    trigger: "#scene3__depth3",
    start: "top top",
    end: "+=8000",
    pin: true,
    scrub: true,
  }
});

tl3.from("#depth3__rock1", {
  x: "-100%",
  duration: 1,
}, 0);

tl3.from("#depth3__rock2", {
  x: "100%",
  duration: 1,
}, 0);

tl3.from("#depth3__sand", {
  y: "100%",
  duration: 2,
}, 0.5);

tl3.from("#depth3__trash", {
  opacity: 0,
  duration: 2,
}, 1.5);

tl3.from("#depth3__algae1", {
  y: "110%",
  duration: 1,
}, 1);

tl3.from("#depth3__algae2", {
  y: "110%",
  duration: 1,
}, 1.5);

tl3.from("#depth3__turtle", {
  x: "-100%",
  y: "-100%",
  duration: 4,
  ease: "power4.out",
}, 2);

tl3.from("#depth3__fish", {
  x: "100%",
  duration: 4,
  ease: "power4.out",
}, 2.5);

tl3.from(".scene3__facts2", {
  scale: 0,
  duration: 4,
}, 3.5);

tl3.to("#depth3__turtle", {
  x: "100%",
  y: "-100%",
  duration: 4,
}, 8.5);

tl3.to("#depth3__fish", {
  x: "-100%",
  y: "-50%",
  duration: 4,
}, 9.8);

tl3.to("#scene3__depth3", {
  scale: 18, // zoom in 2x
  transformOrigin: "center bottom",
  duration: 3,
  ease: "power2.in", // smooth zoom
}, 12.4);

tl3.to("#scene3__depth3", {
  opacity: 0,
  duration: 1,
}, 15);

/* SCENE4 */
/* Timeline scene 4 */
let tl4 = gsap.timeline({
  scrollTrigger: {
    trigger: ".scene4",
    start: "top top",
    end: "+=1000",
    pin: true,
    scrub: true,
  }
});