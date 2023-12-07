/**
 * Generates a splash image for the current document.
 * @param logoPath Loaded image element, canvas, or the URL of an image to load.
 * @param options Options for splash generation.
 * @param options.background Background color for the splash image. (defaults to the computed background-color of the `body` tag)
 * @param options.crossOrigin Set crossorigin to anonymous on the loaded image.
 * @param options.scale Scale of the icon relative to the background. (1 is full-width, 3 is 1/3 width)
 */
export default async function generateSplash(
  logoPath: HTMLImageElement | HTMLCanvasElement | string,
  options?: {
    background?: string;
    crossOrigin?: boolean;
    scale?: number;
  }
) {
  const icon =
      typeof logoPath == "string"
        ? await new Promise<HTMLImageElement>((r) => {
            const img = new Image();
            img.onload = () => r(img);
            if (options.crossOrigin) img.crossOrigin = "anonymous";
            img.src = logoPath;
          })
        : logoPath,
    { width, height } = window.screen,
    // optimal logo size based on options
    logoSize = Math.min(icon.width, icon.height) / (options?.scale || 3),
    ratio = window.devicePixelRatio,
    canvas = document.createElement("canvas");
  canvas.width = width * ratio;
  canvas.height = height * ratio;

  const ctx = canvas.getContext("2d")!;
  ctx.scale(ratio, ratio);
  ctx.fillStyle =
    options?.background || window.getComputedStyle(document.body).backgroundColor || "#000000";
  ctx.fillRect(0, 0, width, height);

  // draw image in the center of the splash
  ctx.drawImage(icon, width / 2 - logoSize / 2, height / 2 - logoSize / 2, logoSize, logoSize);

  const link = document.createElement("link");
  link.setAttribute("rel", "apple-touch-startup-image");
  link.setAttribute("href", canvas.toDataURL());
  document.head.appendChild(link);
}
