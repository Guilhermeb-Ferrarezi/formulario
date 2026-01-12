export interface MatrixRainController {
  stop(): void;
}

export interface MatrixRainOptions {
  fontSize?: number;
  opacity?: number;
  speed?: number;
  colors?: readonly string[];
}

const DEFAULT_FONT_SIZE = 16;
const DEFAULT_OPACITY = 0.08;
const DEFAULT_SPEED = 1;

const DEFAULT_COLORS: readonly string[] = [
  "#ffffff",
  "#e4021a",
  "#9bbcff",
];

const MATRIX_CHARS =
  "アァカサタナハマヤャラワガザダバパ" +
  "イィキシチニヒミリヰギジヂビピ" +
  "ウゥクスツヌフムユュルグズヅブプ" +
  "エェケセテネヘメレヱゲゼデベペ" +
  "オォコソトノホモヨョロヲゴゾドボポヴン" +
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function startMatrixRain(
  canvas: HTMLCanvasElement,
  options: MatrixRainOptions = {}
): MatrixRainController {
  const ctxNullable = canvas.getContext("2d");
  if (ctxNullable === null) {
    return { stop: () => {} };
  }

  const ctx: CanvasRenderingContext2D = ctxNullable;

  const fontSize = options.fontSize ?? DEFAULT_FONT_SIZE;
  const fadeOpacity = options.opacity ?? DEFAULT_OPACITY;
  const speed = options.speed ?? DEFAULT_SPEED;
  const colors = options.colors ?? DEFAULT_COLORS;

  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));

  let width = 0;
  let height = 0;
  let columns = 0;
  let drops: number[] = [];
  let animationId: number | null = null;
  let running = true;

  function randomChar(): string {
    return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
  }

  function randomColor(): string {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function resize(): void {
    const rect = canvas.getBoundingClientRect();

    width = Math.floor(rect.width);
    height = Math.floor(rect.height);

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    columns = Math.floor(width / fontSize);
    drops = Array.from({ length: columns }, () =>
      Math.floor(Math.random() * height)
    );
  }

  function drawFrame(): void {
    if (!running) return;

    ctx.fillStyle = `rgba(0,0,0,${fadeOpacity})`;
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < columns; i++) {
      const char = randomChar();
      const x = i * fontSize;
      const y = drops[i];

      ctx.fillStyle = randomColor();
      ctx.fillText(char, x, y);

      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      } else {
        drops[i] += fontSize * speed;
      }
    }

    animationId = requestAnimationFrame(drawFrame);
  }

  resize();

  const handleResize = () => resize();
  window.addEventListener("resize", handleResize);

  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.fillRect(0, 0, width, height);

  animationId = requestAnimationFrame(drawFrame);

  return {
    stop(): void {
      running = false;
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener("resize", handleResize);
    },
  };
}
