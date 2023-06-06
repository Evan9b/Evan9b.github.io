
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

const scoreEl = document.querySelector('#scoreEl')


class Boundary{
    static width = 40
    static height = 40
    constructor({position, image}){
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }
    draw(){
       /* c.fillStyle ='blue'
        c.fillRect(this.position.x, 
            this.position.y, 
            this.width, 
            this.height
            )*/
       c.drawImage(this.image, this.position.x, this.position.y)
        }

}

class Player{
    constructor({ position, velocity}){
        this.position = position 
        this.velocity = velocity 
        this.radius = 15
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x, 
            this.position.y, 
            this.radius, 0, 
            Math.PI * 2)
            c.fillStyle = 'yellow'
            c.fill()
            c.closePath()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Ghost{
    static speed = 2
    constructor({ position, velocity, color = 'red'}){
        this.position = position 
        this.velocity = velocity 
        this.radius = 15
        this.color = color
        this.prevCollisions = []
        this.speed = 2
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x, 
            this.position.y, 
            this.radius, 0, 
            Math.PI * 2)
            c.fillStyle = this.color
            c.fill()
            c.closePath()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Pellet{
    constructor({ position }){
        this.position = position  
        this.radius = 3
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x, 
            this.position.y, 
            this.radius, 0, 
            Math.PI * 2)
            c.fillStyle = 'white'
            c.fill()
            c.closePath()
    }
}

class PowerUp{
    constructor({ position }){
        this.position = position  
        this.radius = 8
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x, 
            this.position.y, 
            this.radius, 0, 
            Math.PI * 2)
            c.fillStyle = 'white'
            c.fill()
            c.closePath()
    }
}


const pellets = []

const boundaries = []

const powerUps = []


const ghosts = [
    new Ghost ({
        position:{
            x: Boundary.width * 20 + Boundary.width / 2,
            y:Boundary.height + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y:0
        }
    }),
    new Ghost ({
        position:{
            x: Boundary.width * 6 + Boundary.width / 2,
            y:Boundary.height * 16 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y:0
        },
        color: 'pink'
    }),
    new Ghost ({
        position:{
            x: Boundary.width * 20 + Boundary.width / 2,
            y:Boundary.height * 10+ Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y:0
        },
        color: 'orange'
    }),
    new Ghost ({
        position:{
            x: Boundary.width * 6 + Boundary.width / 2,
            y:Boundary.height * 5+ Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y:0
        },
        color: 'blue'
    })

]

const keys = {
    w:{
        pressed: false
    },
    a:{
        pressed: false
    },
    s:{
        pressed: false
    },
    d:{
        pressed: false
    }
}

let lastKey = ''

let score = 0

const map = [
    ['1','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','2'],
    ['|',' ','.','.','.','.','.','.','.','.','.','.','.','.','.','.','>','<','.','.','.','.','.','.','.','.','|'],
    ['|','.','l','-','r','.','l','-','-','-','r','.','l','-','r','.','4','3','.','l','-','-','r','.','x','.','|'],
    ['|','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','|'],
    ['|','.','t','.','1','2','.','l','-','r','.','l','r','.','l','-','?','2','.','1','2','.','1','-','r','.','|'],
    ['|','.','|','.','>','<','.','.','.','.','.','.','.','.','.','.','>','3','.','4','3','.','|','.','.','.','|'],
    ['|','.','b','.','4','<','.','1','2','.','1','-','r','.','x','.','|','.','.','.','.','.','b','.','x','.','|'],
    ['|','.','.','.','.','|','.','4','3','.','|','.','.','.','.','.','|','.','1','-','r','.','.','.','.','.','|'],
    ['|','?','?','2','.','|','.','.','.','.','|','.','1','?','2','.','|','.','|','.','.','.','t','.','t','.','|'],
    ['|','^','^','3','.','b','.','l','r','.','b','.','4','^','3','.','b','.','b','.','x','.','b','.','b','.','|'],
    ['|','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','|'],
    ['|','.','l','-','?','-','r','.','t','.','t','.','t','.','1','r','.','l','2','.','t','.','l','-','r','.','|'],
    ['|','.','.','.','|','.','.','.','|','.','|','.','b','.','|','.','.','.','|','.','b','.','.','.','.','.','|'],
    ['|','.','t','.','|','.','t','.','b','.','|','.','.','.','|','.','t','.','|','.','.','.','t','.','t','.','|'],
    ['|','.','|','.','|','.','|','.','.','.','|','.','t','.','|','.','|','.','>','-','r','.','b','.','|','.','|'],
    ['|','.','b','.','b','.','b','.','l','-','3','.','b','.','b','.','b','.','b','.','.','.','.','.','b','.','|'],
    ['|','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1','?','2','.','.','p','|'],
    ['4','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','3']
]

const boundary = new Boundary({
    position: {
        x:0,
        y:0
    }
})

const player = new Player({
    position:{
        x: boundary.width + boundary.width/2,
        y:boundary.height + boundary.height/2
        },
    velocity:{
        x:0,
        y:0
    }
})
function createImage (src) {
const image = new Image()
image.src = src
return image
}
map.forEach((row,i) =>
    {row.forEach((symbol,j)=> {
    switch (symbol) {
    case '-':
        boundaries.push(
            new Boundary({
                position:{ 
                    x: boundary.width *j,
                    y: boundary.height *i
                    },
                    image : createImage('./img/PipeHorizontal.png')
                })
            )
                    break
                    case '|':
        boundaries.push(
            new Boundary({
                position:{ 
                    x: boundary.width *j,
                    y: boundary.height *i
                    },
                    image : createImage('./img/PipeVertical.png')
                })
            )
                    break
                    case '1':
        boundaries.push(
            new Boundary({
                position:{ 
                    x: boundary.width *j,
                    y: boundary.height *i
                    },
                    image : createImage('./img/PipeCorner1.png')
                })
            )
                    break
                    case '2':
        boundaries.push(
            new Boundary({
                position:{ 
                    x: boundary.width *j,
                    y: boundary.height *i
                    },
                    image : createImage('./img/PipeCorner2.png')
                })
            )
                    break
                    case '3':
        boundaries.push(
            new Boundary({
                position:{ 
                    x: boundary.width *j,
                    y: boundary.height *i
                    },
                    image : createImage('./img/PipeCorner3.png')
                })
            )
                    break
                    case '4':
        boundaries.push(
            new Boundary({
                position:{ 
                    x: boundary.width *j,
                    y: boundary.height *i
                    },
                    image : createImage('./img/PipeCorner4.png')
                })
            )
                    break
                    case 'x':
        boundaries.push(
            new Boundary({
                position:{ 
                    x: boundary.width *j,
                    y: boundary.height *i
                    },
                    image : createImage('./img/PipeBlock1.png')
                })
            )
                    break
                    case 't':
        boundaries.push(
            new Boundary({
                position:{ 
                    x: boundary.width *j,
                    y: boundary.height *i
                    },
                    image : createImage('./img/PipeTop.png')
                })
            )
                    break
                    case 'b':
        boundaries.push(
            new Boundary({
                position:{ 
                    x: boundary.width *j,
                    y: boundary.height *i
                    },
                    image : createImage('./img/PipeBottom.png')
                })
            )
                    break
                    case 'l':
        boundaries.push(
            new Boundary({
                position:{ 
                    x: boundary.width *j,
                    y: boundary.height *i
                    },
                    image : createImage('./img/PipeLeft.png')
                })
            )
                    break
                    case 'r':
        boundaries.push(
            new Boundary({
                position:{ 
                    x: boundary.width *j,
                    y: boundary.height *i
                    },
                    image : createImage('./img/PipeRight.png')
                })
            )
                    break
                    case '>':
        boundaries.push(
            new Boundary({
                position:{ 
                    x: boundary.width *j,
                    y: boundary.height *i
                    },
                    image : createImage('./img/PipeSmall1.png')
                })
            )
                    break
                    case '?':
        boundaries.push(
            new Boundary({
                position:{ 
                    x: boundary.width *j,
                    y: boundary.height *i
                    },
                    image : createImage('./img/PipeSmall2.png')
                })
            )
                    break
                    case '<':
        boundaries.push(
            new Boundary({
                position:{ 
                    x: boundary.width *j,
                    y: boundary.height *i
                    },
                    image : createImage('./img/PipeSmall3.png')
                })
            )
                    break
                    case '^':
        boundaries.push(
            new Boundary({
                position:{ 
                    x: boundary.width *j,
                    y: boundary.height *i
                    },
                    image : createImage('./img/PipeSmall4.png')
                })
            )
                    break
                    case '.':
        pellets.push(
            new Pellet({
                position:{ 
                    x: j * boundary.width + boundary.width /2,
                    y: i * boundary.height  + boundary.height /2
                    },
                    image : createImage('./img/PipeSmall4.png')
                })
            )
                    break
                    case 'p':
        powerUps.push(
            new PowerUp({
                position:{ 
                    x: j * boundary.width + boundary.width /2,
                    y: i * boundary.height  + boundary.height /2
                    }
                    
                })
            )
                    break
                    
        }
    })
})

function circlecollideswithrectangle({ circle, rectangle }){
const padding = Boundary.width / 2 - circle.radius - 1
    return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding
        && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding
        && circle.position.y  + circle.radius + circle.velocity.y >= rectangle.position.y - padding
        && circle.position.x - circle.radius  + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
        )
}

let animationId 

function animate(){
 animationId = requestAnimationFrame(animate)
c.clearRect(0, 0, canvas.width, canvas.height)
if (keys.w.pressed && lastKey ==='w') {
    for ( let i = 0; i< boundaries.length; i++){
        const boundary = boundaries[i]
    if (
        circlecollideswithrectangle({
        circle: {...player, velocity:{
            x:0,
            y: -5
        }},
        rectangle:boundary
        })
    ) {
    player.velocity.y = 0
    break
    }else {
        player.velocity.y = -5
    }
} 
}
else if (keys.a.pressed && lastKey ==='a'){
    for ( let i = 0; i< boundaries.length; i++){
        const boundary = boundaries[i]
    if (
        circlecollideswithrectangle({
        circle: {...player, velocity:{
            x:-5,
            y: 0
        }},
        rectangle:boundary
        })
    ) {
    player.velocity.x = 0
    break
    }else {
        player.velocity.x = -5
    }
} 
}
else if (keys.s.pressed && lastKey ==='s'){
    for ( let i = 0; i< boundaries.length; i++){
        const boundary = boundaries[i]
    if (
        circlecollideswithrectangle({
        circle: {...player, velocity:{
            x:0,
            y: 5
        }},
        rectangle:boundary
        })
    ) {
    player.velocity.y = 0
    break
    }else {
        player.velocity.y = 5
    }
} 
}
else if (keys.d.pressed && lastKey ==='d'){
    for ( let i = 0; i< boundaries.length; i++){
        const boundary = boundaries[i]
    if (
        circlecollideswithrectangle({
        circle: {...player, velocity:{
            x:5,
            y: 0
        }},
        rectangle:boundary
        })
    ) {
    player.velocity.x = 0
    break
    }else {
        player.velocity.x = 5
        }
    }
}

for (let i = powerUps.length - 1; 0<=i ; i--) {
    const powerUp = powerUps[i]
    powerUp.draw()
}

pellets.forEach((pellet, i) => {
    pellet.draw()

    if (Math.hypot(pellet.position.x - player.position.x, 
        pellet.position.y - player.position.y
        )< pellet.radius + player.radius)
        {pellets.splice(i,1)
        score += 10
        scoreEl.innerHTML = score
        }

})
boundaries.forEach((boundary) => {
    boundary.draw()

    if (circlecollideswithrectangle({
        circle: player,
        rectangle:boundary
    })
        ){
            console.log("COLLIDING!")
            player.velocity.y = 0 
            player.velocity.x = 0
        }
    })
    player.update() 

    ghosts.forEach(ghost =>{
        ghost.update()

        if (Math.hypot(
            ghost.position.x - player.position.x, 
            ghost.position.y - player.position.y
            )< ghost.radius + player.radius) {
                cancelAnimationFrame(animationId)
                window.alert("You Lost \n(Refresh to try again)")
            }

        const collisions = []
        boundaries.forEach((boundary) => {
            if (
                !collisions.includes('right') &&
                circlecollideswithrectangle({
                circle: {...ghost, velocity:{
                    x: ghost.speed,
                    y:0
                }},
                rectangle:boundary
                })
            ){
                collisions.push('right')
            }
            if (
                !collisions.includes('left') &&
                circlecollideswithrectangle({
                circle: {...ghost, velocity:{
                    x: -ghost.speed,
                    y:0
                }},
                rectangle:boundary
                })
            ){
                collisions.push('left')
            }
            if (
                !collisions.includes('up') &&
                circlecollideswithrectangle({
                circle: {...ghost, velocity:{
                    x:0,
                    y:-ghost.speed
                }},
                rectangle:boundary
                })
            ){
                collisions.push('up')
            }
            if (
                !collisions.includes('down') &&
                circlecollideswithrectangle({
                circle: {...ghost, velocity:{
                    x:0,
                    y:ghost.speed
                }},
                rectangle:boundary
                })
            ){
                collisions.push('down')
            }

        })
        if(collisions.length > ghost.prevCollisions.length)
        ghost.prevCollisions = collisions

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
        if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
        else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
        else if (ghost.velocity.y > 0) ghost.prevCollisions.push('up')
        else if (ghost.velocity.y < 0) ghost.prevCollisions.push('down')

        const pathways = ghost.prevCollisions.filter((collision)=>{
    return !collisions.includes(collision)
})
const direction = pathways [Math.floor(Math.random() * pathways.length)]
switch (direction) {
    case 'down' :
        ghost.velocity.y = ghost.speed
        ghost.velocity.x = 0
        break

        case 'up' :
        ghost.velocity.y = -ghost.speed
        ghost.velocity.x = 0
        break

        case 'right' :
        ghost.velocity.y = 0
        ghost.velocity.x = ghost.speed
        break

        case 'left' :
        ghost.velocity.y = 0
        ghost.velocity.x = -ghost.speed
        break
}     
ghost.prevCollisions = []
}
    })
   
}

animate()

window.addEventListener('keydown', ({key}) =>{
switch (key){
    case 'w':
    keys.w.pressed = true
    lastKey = 'w'
    break
    case 'a':
     keys.a.pressed = true
     lastKey = 'a'
    break
    case 's':
     keys.s.pressed = true
     lastKey = 's'
    break
    case 'd':
    keys.d.pressed = true
    lastKey = 'd'
    break
}
})

window.addEventListener('keyup', ({key}) =>{
    switch (key){
        case 'w':
        keys.w.pressed = false
        break
        case 'a':
            keys.a.pressed = false
        break
        case 's':
            keys.s.pressed = false
        break
        case 'd':
            keys.d.pressed = false
        break
    }
    })