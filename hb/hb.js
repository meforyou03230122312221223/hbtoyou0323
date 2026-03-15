
const cDown = document.getElementById("countdown");
const balloonWrap = document.getElementById("balloon-container");

const now = new Date();
let target = new Date(new Date().getFullYear(), 2, 23, 0, 0, 0);

if (now > target) {
    target = new Date(now.getFullYear() + 1, 2, 23);
}

function spawnBalloon() {
    const b = document.createElement("div");
    b.className = "balloon";
    const col = ["#ff4d6d", "#ff8fab", "#ffc2d1", "#ffd166", "#ffb703"];
    b.style.background = col[Math.floor(Math.random() * col.length)];
    b.style.left = Math.random() * 100 + "vw";
    b.style.animationDuration = 12 + Math.random() * 8 + "s";

    balloonWrap.appendChild(b);
    setTimeout(() => b.remove(), 14000);
}

let balloonTimer = setInterval(spawnBalloon, 900);

/* ================= hearts ================= */

const heartWrap = document.getElementById("hearts");

let heartTimer = null;

function spawnHeart() {
    const h = document.createElement("div");
    h.className = "heart";
    h.textContent = "❤";
    h.style.left = Math.random() * 100 + "vw";
    h.style.bottom = "-20px";
    h.style.fontSize = 22 + Math.random() * 28 + "px";
    h.style.animationDuration = 12 + Math.random() * 8 + "s";
    heartWrap.appendChild(h);
    setTimeout(() => h.remove(), 14000);
}

function startHearts() {
    if (heartTimer) return;
    heartTimer = setInterval(spawnHeart, 700);
}

/* ================= tick ================= */

function tick() {

    const d = target - new Date();

    if (d <= 0) {

        cDown.classList.add("hidden");

        clearInterval(timer);
        balloonWrap.innerHTML = "";

        setTimeout(() => {
            document.getElementById("heroScene").classList.add("show");
            fireworks();

            document.body.addEventListener("click", () => {
                const timerMusic = document.getElementById("firstbg");
                timerMusic.volume = 0.9;
                timerMusic.play().catch(() => { });
            }, { once: true });
        }, 600);

        return;
    }

    const days = Math.floor(d / 86400000);
    const h = Math.floor((d / 3600000) % 24);
    const m = Math.floor((d / 60000) % 60);
    const s = Math.floor((d / 1000) % 60);

    cDown.textContent = `${days}d ${h}h ${m}m ${s}s`;
}

const timer = setInterval(tick, 1000);
tick();
startHearts();

/* ================= fireworks ================= */

const fwCanvas = document.getElementById("fireworks");
const ctx = fwCanvas.getContext("2d");

function resize() {
    fwCanvas.width = innerWidth;
    fwCanvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

function fireworks() {

    let parts = [];

    function boom() {

        const x = Math.random() * innerWidth;
        const y = Math.random() * innerHeight * 0.45;

        for (let i = 0; i < 60; i++) {
            parts.push({
                x, y,
                a: Math.random() * Math.PI * 2,
                s: Math.random() * 5 + 2,
                r: Math.random() * 3 + 2,
                o: 1,
                c: `hsl(${330 + Math.random() * 20},100%,65%)`
            });
        }
    }

    setInterval(boom, 700);

    function render() {

        ctx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

        parts.forEach(p => {

            p.x += Math.cos(p.a) * p.s;
            p.y += Math.sin(p.a) * p.s;
            p.s *= .96;
            p.o -= .015;

            ctx.fillStyle = p.c.replace("65%)", `65%,${p.o})`);

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });

        parts = parts.filter(p => p.o > 0);
        requestAnimationFrame(render);
    }

    render();
}

/* ================= candle ================= */

const candle = document.getElementById("candle");
const flame = document.getElementById("flame");

let blown = false;

candle.onclick = () => {

    if (blown) return;
    blown = true;

    candle.classList.add("blowing");
    flame.classList.add("blowing");

    const s = document.createElement("div");
    s.className = "smoke";
    candle.appendChild(s);
    setTimeout(() => s.remove(), 1200);

    for (let i = 0; i < 50; i++) {
        setTimeout(spawnHeart, i * 22);
    }

    setTimeout(showSlice, 900);
};
function showSlice(){

    const slice = document.getElementById("cakeSlice");

    slice.classList.add("show");

    slice.onclick = feedCake;
}

function feedCake(){

    const slice = document.getElementById("cakeSlice");

    slice.classList.add("feed");

    for(let i=0;i<20;i++){
        setTimeout(spawnHeart,i*40);
    }

    setTimeout(showGiftScene,2000);
}
const giftScene = document.getElementById("giftScene");
const giftBox = document.getElementById("giftBox");
const photoRing = document.getElementById("photoRing");
let ringAngle = 180;
let ringAnim = null;
let centerCount = 0;
let lastCentered = -1;


/* put all your photos here */
const giftPhotos = [
    "img/1.jpg",
    "img/2.jpg",
    "img/3.jpg",
    "img/4.jpg",
    "img/5.jpg",
    "img/6.jpg",
    "img/7.jpg",
    "img/8.jpg",
    "img/9.jpg",
    "img/10.jpg",
    "img/11.jpg",
    "CARD"

];

let giftOpened = false;
let ringBuilt = false;

/* show gift scene */

function showGiftScene() {

    const hero = document.getElementById("heroScene");

    hero.style.transition = "opacity .8s";
    hero.style.opacity = 0;

    setTimeout(() => {
        hero.style.display = "none";
        giftScene.classList.add("show");
    }, 800);
}

/* build rotating ring */

function buildPhotoRing() {

    if (ringBuilt) return;
    ringBuilt = true;

    photoRing.innerHTML = "";

    giftPhotos.forEach((src, i) => {

        const p = document.createElement("div");
        p.className = "ringPhoto";

        if (src === "CARD") {
            p.classList.add("openCard");
            p.innerHTML = "<div class='cardText'>OPEN</div>";
        } else {
            p.style.backgroundImage = `url(${src})`;
        }

        p.style.transform = `translateY(120px) scale(.2)`;
        p.style.opacity = 0;

        photoRing.appendChild(p);

        setTimeout(() => {
            p.style.transition = "transform 1.2s cubic-bezier(.2,.8,.2,1), opacity 1s";
            p.style.opacity = 1;
            p.style.transform = `translateY(-180px) scale(1.2)`;
        }, i * 200);
    });

    // 🔥 VERY IMPORTANT — START ROTATION AFTER POP
    setTimeout(() => {
        arrangeRing();
        startRingRotation();
    }, 2000);
}
giftBox.onclick = () => {

    if (giftOpened) return;

    giftOpened = true;
    giftBox.classList.add("open");

    // 🔊 stop first music
    const firstMusic = document.getElementById("firstbg");
    firstMusic.pause();
    firstMusic.currentTime = 0;

    // 🎵 start gift music
    const music = document.getElementById("bgMusic");
    music.volume = 0.6;
    music.play();
    // Sparkle burst
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const rect = giftBox.getBoundingClientRect();
            const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 200;
            const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 200;
            spawnSparkle(x, y);
        }, i * 30);
    }

    buildPhotoRing();
};

let rotationActive = true;
let speed = 0.06;
let cardLocked = false;

function startRingRotation() {

    const photos = Array.from(photoRing.children);
    const count = photos.length;
    const step = 360 / count;
    const radius = 340;

    const cardIndex = photos.findIndex(p =>
        p.classList.contains("openCard")
    );

    function update() {

        if (!rotationActive) return;

        ringAngle += speed;

        photoRing.style.transform =
            `translateX(-50%) rotateY(${ringAngle}deg)`;

        photos.forEach((p, i) => {

            let angle = (i * step + ringAngle) % 360;
            if (angle > 180) angle -= 360;

            const abs = Math.abs(angle);
            if (abs < 3 && lastCentered !== i) {
                lastCentered = i;
                centerCount++;
            }
            const base =
                `rotateY(${i * step}deg) translateZ(${radius}px)`;

            if (abs > 90) {
                p.style.opacity = 0;
            } else {
                // normalized closeness (1 at center → 0 at edge)
                const closeness = 1 - (abs / 90);

                // smooth easing curve
                const smooth = Math.pow(closeness, 2);

                // zoom effect
                const scale = 0.9 + smooth * 0.5;

                // blur fades as it centers
                const blur = (1 - smooth) * 5;

                // brightness boost at center
                const brightness = 0.8 + smooth * 0.4;

                p.style.opacity = 1;
                p.style.transform = base + ` scale(${scale})`;
                p.style.filter = `blur(${blur}px) brightness(${brightness})`;
            }

            // 🔥 Stop ONLY when card reaches center AFTER full cycle
            if (i === cardIndex && abs < 2 && ringAngle > 720 && !cardLocked) {

                cardLocked = true;
                rotationActive = false;

                p.style.pointerEvents = "auto";
                p.onclick = openLetter;
            }
        });

        requestAnimationFrame(update);
    }

    update();
}
function arrangeRing() {

    const photos = Array.from(photoRing.children);
    const count = photos.length;
    const radius = 340;

    photos.forEach((p, i) => {

        const angle = (360 / count) * i;

        p.style.transition = "transform 1s ease, opacity .6s ease";

        p.style.transform =
            `rotateY(${angle}deg) translateZ(${radius}px)`;

        p.style.opacity = 1;
        p.style.filter = "blur(0px)";
    });
}
function openLetter() {
    document.getElementById("letterOverlay")
        .classList.add("show");
    setInterval(spawnLetterHeart, 700);
}

function spawnSparkle(x, y) {

    const s = document.createElement("div");
    s.className = "sparkle";
    s.style.left = x + "px";
    s.style.top = y + "px";

    document.body.appendChild(s);

    setTimeout(() => s.remove(), 1000);
}

function spawnLetterHeart() {

    const container = document.querySelector(".letterHearts");

    if (!container) return;

    const h = document.createElement("div");
    h.className = "letterHeart";
    h.textContent = "❤";

    h.style.left = Math.random() * 100 + "%";
    h.style.bottom = "-20px";   // START FROM BOTTOM
    h.style.fontSize = 20 + Math.random() * 40 + "px";
    h.style.animationDuration = 4 + Math.random() * 4 + "s";

    container.appendChild(h);

    setTimeout(() => {
        h.remove();
    }, 8000);
}
