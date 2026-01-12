export interface MatrixRainController {
  stop(): void;
}

export interface MatrixRainOptions {
  fontSize?: number;
  interval?: number;
  opacity?: number;
  charset?: string;
  colors?: readonly string[];
  headColor?: string;
}

const DEFAULTS = {
  fontSize: 16,
  interval: 70,
  opacity: 0.05,
  charset: "PROGRAMACAOWEB0123456789",
  colors: ["#00ff9c", "#00cc7a", "#00aaff", "#ffffff", "#e4021a"] as const,
  headColor: "#eafff5",
};

export function startMatrixRain(
  canvas: HTMLCanvasElement,
  options: MatrixRainOptions = {}
): MatrixRainController {
  const ctx = canvas.getContext("2d");
  if (ctx === null) {
    throw new Error("Canvas 2D not supported");
  }

  const {
    fontSize,
    interval,
    opacity,
    charset,
    colors,
    headColor,
  } = { ...DEFAULTS, ...options };

  let width = 0;
  let height = 0;
  let columns = 0;
  let drops: number[] = [];
  let chars: string[] = [];
  let timer: number | null = null;

  function resize(): void {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    columns = Math.floor(width / fontSize);
    drops = [];
    chars = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * (height / fontSize));
      chars[i] = randomChar();
    }
  }

  function randomChar(): string {
    return charset[Math.floor(Math.random() * charset.length)];
  }

  function randomColor(): string {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function draw(): void {
    ctx.fillStyle = `rgba(0,0,0,${opacity})`;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < columns; i++) {
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillStyle = headColor;
      ctx.fillText(chars[i], x, y);

      ctx.fillStyle = randomColor();
      ctx.fillText(chars[i], x, y - fontSize);

      drops[i]++;

      if (y > height) {
        drops[i] = 0;
        chars[i] = randomChar();
      }
    }
  }

  resize();
  window.addEventListener("resize", resize);
  timer = window.setInterval(draw, interval);

  return {
    stop(): void {
      if (timer !== null) clearInterval(timer);
      window.removeEventListener("resize", resize);
    },
  };
}
