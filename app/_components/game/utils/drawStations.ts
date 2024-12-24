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
  
    // Base moon circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#CFCFCF';
    ctx.fill();
  
    // Draw craters
    const craters = [
      { cx: -0.3, cy: -0.2, size: 0.2 },
      { cx: 0.2, cy: 0.3, size: 0.25 },
      { cx: -0.1, cy: 0.2, size: 0.15 },
      { cx: 0.3, cy: -0.3, size: 0.18 }
    ];
  
    ctx.shadowBlur = 0;
    craters.forEach(crater => {
      const craterX = x + (crater.cx * radius);
      const craterY = y + (crater.cy * radius);
      const craterRadius = crater.size * radius;
  
      ctx.beginPath();
      ctx.arc(craterX, craterY, craterRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#AFAFAF';
      ctx.fill();
    });
  
    // Add surface texture
    const gradient = ctx.createRadialGradient(
      x - radius * 0.5, 
      y - radius * 0.5, 
      0,
      x, 
      y, 
      radius
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
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
    planetGradient.addColorStop(0, '#DAA520');  
    planetGradient.addColorStop(1, '#CD853F');  
    ctx.fillStyle = planetGradient;
    ctx.fill();
  
    // rings
    ctx.beginPath();
    ctx.ellipse(x, y, radius * 1.5, radius * 0.3, Math.PI / 8, 0, Math.PI * 2);
    const ringGradient = ctx.createLinearGradient(
      x - radius * 1.5,
      y,
      x + radius * 1.5,
      y
    );
    ringGradient.addColorStop(0, 'rgba(210, 180, 140, 0.2)');
    ringGradient.addColorStop(0.5, 'rgba(210, 180, 140, 0.6)');
    ringGradient.addColorStop(1, 'rgba(210, 180, 140, 0.2)');
    ctx.strokeStyle = ringGradient;
    ctx.lineWidth = radius * 0.2;
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
  
    // Draw base planet
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    const venusGradient = ctx.createRadialGradient(
      x - radius * 0.3,
      y - radius * 0.3,
      0,
      x,
      y,
      radius
    );
    venusGradient.addColorStop(0, '#FFE5B4');  // Peach
    venusGradient.addColorStop(1, '#FFA07A');  // Light salmon
    ctx.fillStyle = venusGradient;
    ctx.fill();
  
    // Draw atmospheric swirls
    ctx.shadowBlur = 0;
    for (let i = 0; i < 3; i++) {
      const swirl = new Path2D();
      const startAngle = (i * Math.PI) / 2;
      swirl.arc(x, y, radius * 0.7, startAngle, startAngle + Math.PI * 1.2);
      ctx.strokeStyle = 'rgba(255, 228, 196, 0.3)';
      ctx.lineWidth = radius * 0.1;
      ctx.stroke(swirl);
    }
  
    drawHoverEffect(ctx, x, y, radius, isHovered, accentColor);
    ctx.restore();
  };
  
  // Shared hover effect function
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