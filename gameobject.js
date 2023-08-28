class GameObject
{
    constructor(ctx, x, y, vx, vy)
    {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }
}

class Cell extends GameObject
{
    constructor(ctx, x, y, width)
    {
        super(ctx, x, y, 0, 0);
        this.width = width;
        this.highlight = false;
        this.visited = false;
        this.wall_color = 'floralwhite';
        this.fill_color = 'darkcyan';
        this.walls = [true, true, true, true] // [top, right, bottom, left]
    }

    update(elapsed_time)
    {
        if (this.highlight)
        {
            this.fill_color = 'black';
        }
        else if (this.visited)
        {
            this.fill_color = 'darkslateblue';
        }
        else
        {
            this.fill_color = 'darkcyan';
        }
    }

    draw()
    {
        let x = this.x * this.width;
        let y = this.y * this.width;
        this.ctx.fillStyle = this.fill_color;
        this.ctx.fillRect(x, y, this.width, this.width);

        if (this.walls[0])
        {
            this.drawLine(x, y, x+this.width, y, this.wall_color);
        }
        if (this.walls[1])
        {
            this.drawLine(x+this.width, y, x+this.width, y+this.width, this.wall_color);
        } 
        if (this.walls[2])
        {
            this.drawLine(x, y+this.width, x+this.width, y+this.width, this.wall_color);
        }
        if (this.walls[3])
        {
            this.drawLine(x, y, x, y+this.width, this.wall_color);
        }  
    }

    drawLine(x, y, dx, dy, color)
    {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(dx, dy);
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }
}