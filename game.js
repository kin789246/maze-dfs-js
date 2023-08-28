/*
    implement maze dfs generation algorithm by ga-kin63 on 2023-8-28
*/
class Game
{
    constructor(canvas_id)
    {
        this.canvas = document.getElementById(canvas_id);
        this.ctx = this.canvas.getContext('2d');
        this.speed = 1000/60;
        this.stop_animate = false;
        this.game_objs = [];
        this.previous_time_stamp = 0;
        this.all_visited;
        this.path_stack = [];
        this.current;
        this.next;

        this.set_canvas();
        this.N = 10;
        this.cell_width = Math.floor(this.canvas.width / this.N);

    }

    set_canvas()
    {
        this.canvas.width = window.innerHeight * 0.8;
        this.canvas.height = window.innerHeight * 0.8;
    }

    create_world()
    {
        for (let r=0; r<this.N; r++)
        {
            for (let c=0; c<this.N; c++)
            {
                this.game_objs.push(new Cell(this.ctx, c, r, this.cell_width));            
            }
        }        
        this.current = this.game_objs[0];
        this.current.highlight = true;
        this.current.visited = true;
    }

    run(time_stamp)
    {
        let elapsed_time = (time_stamp - this.previous_time_stamp);
        if (elapsed_time >= this.speed) 
        {
            this.previous_time_stamp = time_stamp;
            
            this.update(elapsed_time);
            this.draw();
        }
        if (this.stop_animate)
        {
            console.log("animation is stopped.");
            return;
        }
        window.requestAnimationFrame((time_stamp) => this.run(time_stamp));
    }

    clear_canvas()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    convert_index(row, column)
    {
        if (row<0 || row>=this.N || column<0 || column>=this.N)
        {
            return -1;
        }
        return row*(this.N) + column;
    }

    update(elapsed_time)
    {
        this.next = this.toNextStep(this.current);
        if (this.next)
        {
            this.remove_walls(this.current, this.next);
            this.next.visited = true;
            this.next.highlight = true;
            this.current.highlight = false;
            this.path_stack.push(this.current);
            this.current = this.next;
        }
        else if (this.path_stack.length > 0)
        {
            this.current.highlight = false;
            this.current = this.path_stack.pop();
            this.current.highlight = true;
        }
        if (this.path_stack.length == 0)
        {
            this.stop_animate = true;
        }
        this.game_objs.forEach((obj)=>
                obj.update(elapsed_time)
        );  
    }

    draw()
    {
        this.clear_canvas();
        this.game_objs.forEach((obj)=>
            obj.draw()
        );
    }

    toNextStep(current)
    {
        let neighbors = [];
        let x = current.x;
        let y = current.y;
        let top = this.convert_index(y-1, x);
        let right = this.convert_index(y, x+1);
        let bottom = this.convert_index(y+1, x);
        let left = this.convert_index(y, x-1);
        if (top != -1 && !this.game_objs[top].visited)
        {
            neighbors.push(this.game_objs[top]);
        }
        if (right != -1 && !this.game_objs[right].visited)
        {
            neighbors.push(this.game_objs[right]);
        }
        if (bottom != -1 && !this.game_objs[bottom].visited)
        {
            neighbors.push(this.game_objs[bottom]);
        }
        if (left != -1 && !this.game_objs[left].visited)
        {
            neighbors.push(this.game_objs[left]);
        }
        if (neighbors.length > 0)
        {
            let n = getStrongRandom(0, neighbors.length);
            return neighbors[n];
        }
        else
        {
            return null;
        }
    }

    remove_walls(current, next)
    {
        let x = current.x - next.x;
        let y = current.y - next.y;
        if (y === 1) // next is at top side
        {
            current.walls[0] = false;
            next.walls[2] = false;
        }
        if (x === -1) // next is at right side
        {
            current.walls[1] = false;
            next.walls[3] = false;
        }
        if (y === -1) // next is at bottom side
        {
            current.walls[2] = false;
            next.walls[0] = false;
        }
        if (x === 1) // next is at left side
        {
            current.walls[3] = false;
            next.walls[1] = false;
        }
    }

    is_all_visited()
    {
        this.all_visited = true;
        for (let i=0; i<this.game_objs.length; i++)
        {
            if (!this.game_objs[i].visited)
                this.all_visited = false;
        }  
    }
}