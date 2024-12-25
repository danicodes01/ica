export const drawMoon = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  isUnlocked: boolean,
  isHovered: boolean,
  accentColor: string
) => {
  ctx.save();
  
  if (isUnlocked || isHovered) {
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 20;
  }

  // Base moon circle with darker color
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#2A2A2A';  // Much darker base
  ctx.fill();

  // Draw ominous craters
  const craters = [
    { cx: -0.3, cy: -0.2, size: 0.25 },
    { cx: 0.2, cy: 0.3, size: 0.3 },
    { cx: -0.1, cy: 0.2, size: 0.2 },
    { cx: 0.3, cy: -0.3, size: 0.22 },
    { cx: 0, cy: 0, size: 0.35 }  // Large central crater
  ];

  ctx.shadowBlur = 0;
  craters.forEach(crater => {
    const craterX = x + (crater.cx * radius);
    const craterY = y + (crater.cy * radius);
    const craterRadius = crater.size * radius;

    // Add dark rim to craters
    ctx.beginPath();
    ctx.arc(craterX, craterY, craterRadius * 1.1, 0, Math.PI * 2);
    ctx.fillStyle = '#1A1A1A';  // Darker rim
    ctx.fill();

    // Inner crater
    ctx.beginPath();
    ctx.arc(craterX, craterY, craterRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0A0A0A';  // Almost black inside
    ctx.fill();

    // Add reddish glow to crater depths
    const craterGlow = ctx.createRadialGradient(
      craterX - craterRadius * 0.2,
      craterY - craterRadius * 0.2,
      0,
      craterX,
      craterY,
      craterRadius
    );
    craterGlow.addColorStop(0, 'rgba(139, 0, 0, 0.15)');  // Dark red glow
    craterGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = craterGlow;
    ctx.fill();
  });

  // Add sinister surface texture
  const gradient = ctx.createRadialGradient(
    x - radius * 0.5, 
    y - radius * 0.5, 
    0,
    x, 
    y, 
    radius
  );
  gradient.addColorStop(0, 'rgba(47, 47, 47, 0.4)');  // Darker highlight
  gradient.addColorStop(0.5, 'rgba(30, 30, 30, 0.2)');
  gradient.addColorStop(1, 'rgba(10, 10, 10, 0.3)');  // Almost black shadow
  
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Add subtle red undertone
  const evilGlow = ctx.createRadialGradient(
    x, 
    y, 
    radius * 0.2,
    x, 
    y, 
    radius
  );
  evilGlow.addColorStop(0, 'rgba(139, 0, 0, 0.05)');  // Very subtle dark red
  evilGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = evilGlow;
  ctx.fill();

  drawHoverEffect(ctx, x, y, radius, isHovered, accentColor);
  ctx.restore();
};
  
  export const drawSaturn = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    isUnlocked: boolean,
    isHovered: boolean,
    accentColor: string
  ) => {
    ctx.save();
  
    if (isUnlocked || isHovered) {
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 20;
    }
  
    // body
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.8, 0, Math.PI * 2);
    const planetGradient = ctx.createLinearGradient(
      x - radius, 
      y - radius, 
      x + radius, 
      y + radius
    );
    planetGradient.addColorStop(0, '#5E00FF');  // Deep purple
    planetGradient.addColorStop(0.5, '#8A2BE2');  // Mix
    planetGradient.addColorStop(1, '#FF00C8');  // Bright pink
    ctx.fillStyle = planetGradient;
    ctx.fill();
  
    // Add some glow effect to the planet body
    const glowGradient = ctx.createRadialGradient(
      x - radius * 0.3,
      y - radius * 0.3,
      0,
      x,
      y,
      radius
    );
    glowGradient.addColorStop(0, 'rgba(255, 0, 200, 0.2)');
    glowGradient.addColorStop(1, 'rgba(94, 0, 255, 0)');
    ctx.fillStyle = glowGradient;
    ctx.fill();
  
    // rings with alien energy effect
    ctx.beginPath();
    ctx.ellipse(x, y, radius * 1.5, radius * 0.3, Math.PI / 8, 0, Math.PI * 2);
    const ringGradient = ctx.createLinearGradient(
      x - radius * 1.5,
      y,
      x + radius * 1.5,
      y
    );
    ringGradient.addColorStop(0, 'rgba(94, 0, 255, 0.1)');
    ringGradient.addColorStop(0.3, 'rgba(255, 0, 200, 0.6)');
    ringGradient.addColorStop(0.5, 'rgba(138, 43, 226, 0.8)');
    ringGradient.addColorStop(0.7, 'rgba(255, 0, 200, 0.6)');
    ringGradient.addColorStop(1, 'rgba(94, 0, 255, 0.1)');
    ctx.strokeStyle = ringGradient;
    ctx.lineWidth = radius * 0.2;
    ctx.stroke();
  
    // Add pulsing energy rings
    ctx.beginPath();
    ctx.ellipse(x, y, radius * 1.6, radius * 0.35, Math.PI / 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 0, 200, 0.1)';
    ctx.lineWidth = radius * 0.05;
    ctx.stroke();
  
    ctx.beginPath();
    ctx.ellipse(x, y, radius * 1.4, radius * 0.25, Math.PI / 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(94, 0, 255, 0.1)';
    ctx.lineWidth = radius * 0.05;
    ctx.stroke();
  
    drawHoverEffect(ctx, x, y, radius * 1.5, isHovered, accentColor);
    ctx.restore();
  };
  
  export const drawVenus = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    isUnlocked: boolean,
    isHovered: boolean,
    accentColor: string
  ) => {
    ctx.save();
  
    if (isUnlocked || isHovered) {
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 20;
    }
  
    // Draw base planet with gradient
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    const planetGradient = ctx.createRadialGradient(
      x,
      y,
      radius / 2,
      x,
      y,
      radius
    );
    planetGradient.addColorStop(0, '#5E00FF'); // Inner color
    planetGradient.addColorStop(1, '#FF00C8'); // Outer color
    ctx.fillStyle = planetGradient;
    ctx.fill();
  
    // Draw craters
    ctx.shadowBlur = 0;
    // const craterCount = 5;
    // for (let i = 0; i < craterCount; i++) {
    //   const craterX = x + (Math.random() - 0.5) * radius * 1.5;
    //   const craterY = y + (Math.random() - 0.5) * radius * 1.5;
    //   const craterRadius = Math.random() * (radius * 0.2) + (radius * 0.1);
  
    //   ctx.beginPath();
    //   ctx.arc(craterX, craterY, craterRadius, 0, Math.PI * 2);
    //   ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    //   ctx.fill();
    // }
  
    // Draw the hover effect using the shared function
    drawHoverEffect(ctx, x, y, radius, isHovered, accentColor);
    ctx.restore();
  };
  
  // Shared hover effect function (included for completeness)
  const drawHoverEffect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    isHovered: boolean,
    accentColor: string
  ) => {
    if (isHovered) {
      ctx.beginPath();
      ctx.arc(x, y, radius + 10, 0, Math.PI * 2);
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };