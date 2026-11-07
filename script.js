(() => {
  const openButton = document.querySelector(".open-button");
  const greetingCard = document.querySelector("#greeting-card");
  const particleCanvas = document.querySelector(".particle-canvas");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (openButton && greetingCard) {
    openButton.addEventListener("click", () => {
      const isOpen =
        openButton.getAttribute("aria-expanded") === "true";

      const nextState = !isOpen;

      openButton.setAttribute(
        "aria-expanded",
        String(nextState)
      );

      greetingCard.setAttribute(
        "aria-hidden",
        String(!nextState)
      );

      if (nextState) {
        window.setTimeout(() => {
          greetingCard.focus({
            preventScroll: true,
          });
        }, 260);

        window.setTimeout(() => {
          greetingCard.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
          });
        }, 100);
      }
    });
  }

  if (!particleCanvas) {
    return;
  }

  const context = particleCanvas.getContext("2d");

  if (!context) {
    return;
  }

  const particleColors = [
    "#ff70b6",
    "#c68bff",
    "#ffe0a1",
    "#ffffff",
  ];

  const particleCount = () => {
    return Math.min(
      88,
      Math.max(34, Math.floor(window.innerWidth / 15))
    );
  };

  let particles = [];
  let width = 0;
  let height = 0;
  let animationFrame;

  const createParticle = (initial = false) => {
    const size = Math.random() * 2.4 + 0.8;

    return {
      x: Math.random() * width,
      y: initial ? Math.random() * height : -size * 4,
      size,
      speed: Math.random() * 0.45 + 0.18,
      drift: (Math.random() - 0.5) * 0.22,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.025,
      alpha: Math.random() * 0.55 + 0.2,
      color:
        particleColors[
          Math.floor(Math.random() * particleColors.length)
        ],
      shape: Math.random() > 0.5 ? "dot" : "diamond",
    };
  };

  const resize = () => {
    const devicePixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    width = window.innerWidth;
    height = window.innerHeight;

    particleCanvas.width = width * devicePixelRatio;
    particleCanvas.height = height * devicePixelRatio;

    particleCanvas.style.width = `${width}px`;
    particleCanvas.style.height = `${height}px`;

    context.setTransform(
      devicePixelRatio,
      0,
      0,
      devicePixelRatio,
      0,
      0
    );

    particles = Array.from(
      {
        length: particleCount(),
      },
      () => createParticle(true)
    );
  };

  const drawParticle = (particle) => {
    context.save();

    context.globalAlpha = particle.alpha;
    context.fillStyle = particle.color;

    context.translate(particle.x, particle.y);
    context.rotate(particle.rotation);

    if (particle.shape === "dot") {
      context.beginPath();
      context.arc(
        0,
        0,
        particle.size,
        0,
        Math.PI * 2
      );
      context.fill();
    } else {
      context.beginPath();
      context.moveTo(0, -particle.size * 1.45);
      context.lineTo(particle.size * 0.75, 0);
      context.lineTo(0, particle.size * 1.45);
      context.lineTo(-particle.size * 0.75, 0);
      context.closePath();
      context.fill();
    }

    context.restore();
  };

  const render = () => {
    context.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      if (!prefersReducedMotion) {
        particle.y += particle.speed;
        particle.x += particle.drift;
        particle.rotation += particle.rotationSpeed;

        if (particle.y > height + particle.size * 3) {
          Object.assign(particle, createParticle(false));
        }

        if (particle.x < -10) {
          particle.x = width + 10;
        }

        if (particle.x > width + 10) {
          particle.x = -10;
        }
      }

      drawParticle(particle);
    });

    if (!prefersReducedMotion) {
      animationFrame = window.requestAnimationFrame(render);
    }
  };

  resize();
  render();

  window.addEventListener("resize", resize, {
    passive: true,
  });

  window.addEventListener(
    "pagehide",
    () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    },
    {
      once: true,
    }
  );
})();
