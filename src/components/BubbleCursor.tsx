import { useEffect, useRef } from "react";

interface Bubble {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
  color: string;
  wobble: number;
  wobbleSpeed: number;
}

export default function BubbleCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let bubbles: Bubble[] = [];
    const maxBubbles = 100;

    // Palette for bubbles that matches indigo/cyan/pink theme
    const colors = [
      "rgba(99, 102, 241, 0.5)",  // indigo
      "rgba(6, 182, 212, 0.5)",  // cyan
      "rgba(236, 72, 153, 0.5)", // pink
      "rgba(139, 92, 246, 0.5)", // purple
      "rgba(16, 185, 129, 0.5)", // emerald
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const createBubble = (clientX: number, clientY: number) => {
      // Don't spawn too many bubbles
      if (bubbles.length >= maxBubbles) {
        bubbles.shift();
      }

      const size = Math.random() * 16 + 6; // bubble size 6px to 22px
      const speedX = (Math.random() - 0.5) * 1.5;
      const speedY = -(Math.random() * 1.5 + 0.8); // float upwards
      const color = colors[Math.floor(Math.random() * colors.length)];
      const wobble = Math.random() * Math.PI * 2;
      const wobbleSpeed = Math.random() * 0.05 + 0.01;

      bubbles.push({
        x: clientX,
        y: clientY,
        size,
        speedX,
        speedY,
        alpha: 1,
        color,
        wobble,
        wobbleSpeed,
      });
    };

    // Tracks mouse move
    const handleMouseMove = (e: MouseEvent) => {
      // Chance of spawning to keep it elegant and not cluttered
      if (Math.random() < 0.4) {
        createBubble(e.clientX, e.clientY);
      }
    };

    // Tracks touch move for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && Math.random() < 0.4) {
        const touch = e.touches[0];
        createBubble(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    const updateAndDrawBubbles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        
        // Update physics
        b.wobble += b.wobbleSpeed;
        b.x += b.speedX + Math.sin(b.wobble) * 0.4;
        b.y += b.speedY;
        b.alpha -= 0.012; // slow fade

        if (b.alpha <= 0) {
          bubbles.splice(i, 1);
          continue;
        }

        // Draw bubble with beautiful gradient for glass/glossy effect
        ctx.save();
        ctx.globalAlpha = b.alpha;
        
        // Outer glow gradient
        const gradient = ctx.createRadialGradient(
          b.x - b.size * 0.3,
          b.y - b.size * 0.3,
          b.size * 0.1,
          b.x,
          b.y,
          b.size
        );

        gradient.addColorStop(0, "rgba(255, 255, 255, 0.85)");
        gradient.addColorStop(0.2, b.color);
        gradient.addColorStop(0.8, b.color.replace("0.5", "0.15"));
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Highlighting glossy reflection crescent
        ctx.beginPath();
        ctx.ellipse(
          b.x - b.size * 0.4,
          b.y - b.size * 0.4,
          b.size * 0.3,
          b.size * 0.15,
          -Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(updateAndDrawBubbles);
    };

    updateAndDrawBubbles();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
