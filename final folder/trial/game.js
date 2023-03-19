
const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")
const scoreval = document.getElementById("scoreval")
const losing = document.getElementById("losing")
const try_again = document.getElementById("try_again")
const tag = document.getElementById("tag")
const scoretag = document.getElementById("scoretag")
// const HTML=document.querySelector("HTML")

const playerImage = new Image();
playerImage.src = "hawkeye_in_game.png";
const arrow = new Image();
arrow.src = "arrow.png";
const ghostImage = new Image();
ghostImage.src = "thanos2.png";
const ghostScaredImage = new Image();
ghostScaredImage.src = "thanos.png";

canvas.width = innerWidth
canvas.height = innerHeight
losing.style.display = "none"
tag.style.display = "none"
try_again.style.display = "none"

class Boundry {
    static width = 40
    static height = 40
    constructor({ position, image }) {
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }

    draw() {

        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Weapon {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
    }

    draw() {

        c.beginPath()
        c.drawImage(arrow, this.position.x, this.position.y, this.radius, this.radius);
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y


    }
}


class Player {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 30
    }

    draw() {

        c.beginPath()
        c.drawImage(playerImage, this.position.x - 14, this.position.y - 14, this.radius, this.radius);
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y


    }
}

class Ghost {
    static speed = 2
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 30
        this.prevCollisions = []
        this.speed = 2
        this.scared = false
    }

    draw() {
        c.beginPath()
        c.drawImage(ghostImage, this.position.x - 12, this.position.y - 12, this.radius, this.radius);
        c.closePath()
        if (this.scared) {
            c.beginPath()
            c.drawImage(ghostScaredImage, this.position.x - 12, this.position.y - 12, this.radius, this.radius);
            c.closePath()
        }
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Pellet {
    constructor({ position }) {
        this.position = position
        this.radius = 3
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = "white"
        c.fill()
        c.closePath()
    }
}

class PowerUp {
    constructor({ position }) {
        this.position = position
        this.radius = 8
    }

    draw() {
        // const colorScheme = ["#729599", "#BCC5CE", "#E6DFD9", "#BFB3A8", "#7A7067"]
        const colorScheme = ["white", "black"]

        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)

        c.fillStyle = colorScheme[Math.floor(Math.random() * 4)];


        c.fill()
        c.closePath()
    }
}
function gameover() {

    setInterval(function () {
        canvas.style.display = "none"
        // scoreval.style.display="none"
        scoreval.innerHTML = "DOSENT MATTER NOW SINCE THE WORLD IS DOOMED AS YOU LOST"
        losing.style.display = "block"

    }, 1000)


}
function winning() { 


    setInterval(function () {
        canvas.style.display = "none"
        scoreval.style.display = "none"
        try_again.style.display = "block"
        tag.style.display = "inline"
        scoretag.style.display = "none"
       
    }, 2000)

}

// let  weapon1
const pellets = []
const weapons = []
const boundries = []
const powerUps = []
const ghosts = [
    new Ghost({
        position: {
            x: Boundry.width * 6 + Boundry.width / 2,
            y: Boundry.height + Boundry.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        }
    }),
    new Ghost({
        position: {
            x: Boundry.width * 15 + Boundry.width / 2,
            y: Boundry.height + Boundry.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        }
    }),
    new Ghost({
        position: {
            x: Boundry.width * 25 + Boundry.width / 2,
            y: Boundry.height + Boundry.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        }
    }),
    new Ghost({
        position: {
            x: Boundry.width * 30 + Boundry.width / 2,
            y: Boundry.height + Boundry.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        }

    })]

const player = new Player({
    position: {
        x: Boundry.width + Boundry.width / 2,
        y: Boundry.height + Boundry.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
})
const weapon = new Weapon({
    position: { x: player.position.x, y: player.position.y },
    velocity: { x: player.velocity.x + 2, y: player.velocity.y + 2 }
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let lastKey = ""
let score = 0

const map = [
    ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
    ["|", " ", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
    ["|", ".", "b", ".", "b", "b", "b", ".", "b", "b", "b", ".", "b", ".", "b", ".", "b", "p", "b", ".", "b", "b", ".", "b", "b", "b", ".", "b", ".", "b", ".", "b", ".", "b", "b", ".", "|"],
    ["|", ".", ".", ".", ".", ".", ".", ".", ".", "p", "b", ".", "b", ".", "b", ".", "b", ".", "b", ".", "b", "b", ".", "b", ".", ".", ".", "b", ".", "b", ".", "b", ".", "b", "b", ".", "|"],
    ["|", ".", "b", "b", "b", "b", ".", "b", "b", ".", "b", ".", "b", ".", "b", ".", "b", ".", "b", ".", "b", "b", ".", "b", ".", "b", ".", "b", "p", "b", ".", "b", ".", "b", "b", ".", "|"],
    ["|", ".", "b", ".", ".", ".", ".", ".", ".", ".", "b", ".", "b", ".", "b", ".", "b", ".", "b", ".", ".", ".", ".", "b", ".", "b", ".", "b", ".", "b", ".", "b", ".", "b", "b", ".", "|"],
    ["|", ".", "b", ".", "b", ".", "b", ".", "b", ".", "b", ".", ".", ".", ".", ".", "b", ".", "b", ".", "b", "b", ".", "b", ".", "b", ".", "b", ".", "b", ".", "b", ".", "b", "b", ".", "|"],
    ["|", ".", "b", ".", "b", ".", "b", ".", ".", ".", "b", ".", "b", "b", "b", "b", "b", ".", "b", ".", "b", "b", ".", "b", ".", "b", ".", "b", ".", "b", ".", "b", "p", "b", "b", ".", "|"],
    ["|", ".", "b", ".", "b", ".", "b", ".", "b", ".", "b", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "b", ".", "b", ".", "b", ".", "b", ".", "b", ".", "b", "b", "b1", "|"],
    ["|", ".", "b", ".", "b", ".", "b", ".", "b", ".", ".", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", ".", ".", ".", ".", ".", ".", ".", "b", ".", "b", "b", ".", "|"],
    ["|", ".", ".", ".", "b", ".", "b", ".", "b", "b", ".", ".", ".", ".", ".", ".", "p", ".", ".", ".", ".", ".", ".", "b", ".", "b", ".", "b", ".", "b", ".", "b", ".", "b", "b", ".", "|"],
    ["|", ".", "b", ".", ".", ".", ".", ".", "b", "b", ".", "b", "b", "b", "b", "b", "b", ".", "b", "b", "b", "b", ".", "b", ".", "b", ".", "b", ".", "b", ".", "b", ".", "b", "b", ".", "|"],
    ["|", ".", "b", ".", "b", "b", "b", ".", "b", "b", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "b", ".", "b", "p", "b", ".", "b", ".", "b", ".", "b", "b", ".", "|"],
    ["|", ".", ".", ".", ".", ".", ".", ".", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", ".", ".", ".", ".", ".", ".", ".", ".", ".", "b", ".", ".", ".", ".", "|"],
    ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"]
]

function createImage(src) {
    const image = new Image()
    image.src = src
    return image
}

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {

            case "-":
                boundries.push(
                    new Boundry({
                        position: {
                            x: Boundry.width * j,
                            y: Boundry.height * i
                        },
                        image: createImage("./img/pipeHorizontal.png")
                    })
                )
                break

            case "|":
                boundries.push(
                    new Boundry({
                        position: {
                            x: Boundry.width * j,
                            y: Boundry.height * i
                        },
                        image: createImage("./img/pipeVertical.png")
                    })
                )
                break

            case "1":
                boundries.push(
                    new Boundry({
                        position: {
                            x: Boundry.width * j,
                            y: Boundry.height * i
                        },
                        image: createImage("./img/pipeCorner1.png")
                    })
                )
                break

            case "2":
                boundries.push(
                    new Boundry({
                        position: {
                            x: Boundry.width * j,
                            y: Boundry.height * i
                        },
                        image: createImage("./img/pipeCorner2.png")
                    })
                )
                break

            case "3":
                boundries.push(
                    new Boundry({
                        position: {
                            x: Boundry.width * j,
                            y: Boundry.height * i
                        },
                        image: createImage("./img/pipeCorner3.png")
                    })
                )
                break

            case "4":
                boundries.push(
                    new Boundry({
                        position: {
                            x: Boundry.width * j,
                            y: Boundry.height * i
                        },
                        image: createImage("./img/pipeCorner4.png")
                    })
                )
                break

            case "b":
                boundries.push(
                    new Boundry({
                        position: {
                            x: Boundry.width * j,
                            y: Boundry.height * i
                        },
                        image: createImage("./img/block.png")
                    })
                )
                break
            case "b1":
                boundries.push(
                    new Boundry({
                        position: {
                            x: Boundry.width * j,
                            y: Boundry.height * i
                        },
                        image: createImage("./img/block1.png")
                    })
                )
                break
            case "[":
                boundries.push(
                    new Boundry({
                        position: {
                            x: j * Boundry.width,
                            y: i * Boundry.height
                        },
                        image: createImage("./img/capLeft.png")
                    })
                )
                break

            case ".":
                pellets.push(
                    new Pellet({
                        position: {
                            x: j * Boundry.width + Boundry.width / 2,
                            y: i * Boundry.height + Boundry.height / 2
                        }
                    })
                )
                break

            case "p":
                powerUps.push(
                    new PowerUp({
                        position: {
                            x: j * Boundry.width + Boundry.width / 2,
                            y: i * Boundry.height + Boundry.height / 2
                        }
                    })
                )
                break
        }
    })
})

function circleCollidesWithRectangle({ circle, rectangle }) {
    const padding = Boundry.width / 2 - circle.radius - 1
    return (
        (circle.position.y - circle.radius + circle.velocity.y <=
            rectangle.position.y + rectangle.height + padding) &&
        (circle.position.x + circle.radius + circle.velocity.x >=
            rectangle.position.x - padding) &&
        (circle.position.y + circle.radius + circle.velocity.y >=
            rectangle.position.y - padding) &&
        (circle.position.x - circle.radius + circle.velocity.x <=
            rectangle.position.x + rectangle.width + padding)
    )
}

function try_again_func() {

    location = "index.html";


}

let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    // weapon.update()
    if (keys.w.pressed && lastKey === "w") {
        for (let i = 0; i < boundries.length; i++) {
            const boundary = boundries[i]
            if (
                circleCollidesWithRectangle({
                    circle: {
                        ...player,
                        velocity: {
                            x: 0,
                            y: -2
                        }
                    },
                    rectangle: boundary
                })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = -2
            }
        }
    } else if (keys.a.pressed && lastKey === "a") {
        for (let i = 0; i < boundries.length; i++) {
            const boundary = boundries[i]
            if (
                circleCollidesWithRectangle({
                    circle: {
                        ...player,
                        velocity: {
                            x: -2,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = -2
            }
        }
    } else if (keys.s.pressed && lastKey === "s") {
        for (let i = 0; i < boundries.length; i++) {
            const boundary = boundries[i]
            if (
                circleCollidesWithRectangle({
                    circle: {
                        ...player,
                        velocity: {
                            x: 0,
                            y: 2
                        }
                    },
                    rectangle: boundary
                })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = 2
            }
        }
    } else if (keys.d.pressed && lastKey === "d") {
        for (let i = 0; i < boundries.length; i++) {
            const boundary = boundries[i]
            if (
                circleCollidesWithRectangle({
                    circle: {
                        ...player,
                        velocity: {
                            x: 2,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = 2
            }
        }
    }

    for (let i =0;i<ghosts.length;i++) {

        const ghost = ghosts[i]
        // if ((ghost.scared) && ( Math.hypot(ghost.position.x - weapon.position.x, ghost.position.y - weapon.position.y) < ghost.radius + weapon.radius
        //     || Math.hypot(
        //         ghost.position.x - player.position.x,
        //         ghost.position.y - player.position.y
        //     ) <
        //     ghost.radius + player.radius - 20)) {
        //     ghosts.splice(i, 1)
        // }

        if (Math.hypot(
            ghost.position.x - player.position.x,
            ghost.position.y - player.position.y
        ) <
            ghost.radius + player.radius - 20

            //-20 used as size of image was increased at start
        ) {

            if (ghost.scared) {
                ghosts.splice(i, 1)

            }
            else {
                cancelAnimationFrame(animationId)
                console.log("you lose")
                // setInterval(gameover(),3000)

                gameover()
            }



        }
        weapons.forEach((weapon) => {
            if ((ghost.scared) && (Math.hypot(ghost.position.x - weapon.position.x, ghost.position.y - weapon.position.y) < ghost.radius + weapon.radius
                || Math.hypot(
                    ghost.position.x - player.position.x,
                    ghost.position.y - player.position.y
                ) <
                ghost.radius + player.radius - 20)) {
                ghosts.splice(i, 1)
            }
        })
    }


    // pellets.length === 0 && 
    if (pellets.length === 0 && (player.position.x === Boundry.width * 35.5 && player.position.y === Boundry.height * 9.5 || player.position.x === Boundry.width * 35.5 && player.position.y === Boundry.height * 7.5)) {
        console.log("you win")
        cancelAnimationFrame(animationId)
        winning()
    }

    for (let k = powerUps.length - 1; 0 <= k; k--) {
        const powerUp = powerUps[k]
        powerUp.draw()


        if (
            Math.hypot(
                powerUp.position.x - player.position.x,
                powerUp.position.y - player.position.y
            ) <
            powerUp.radius + player.radius
        ) {
            powerUps.splice(k, 1)


            ghosts.forEach((ghost) => {
                ghost.scared = true
                setTimeout(() => {
                    ghost.scared = false
                }, 5000)
            })
            // ghosts.forEach((ghost) => {
            //     while (ghost.scared === true) {
           let timeIDofGame= setInterval(function () {
                for (let j = 2; j <= 10; j += 2) {
                    if (keys.w.pressed && lastKey === "w") {

                        weapons.push(new Weapon({ position: { x: player.position.x, y: player.position.y }, velocity: { x: 0, y: player.velocity.y - j } }))
                    }
                    if (keys.a.pressed && lastKey === "a") {

                        weapons.push(new Weapon({ position: { x: player.position.x, y: player.position.y }, velocity: { x: player.velocity.x - j, y: 0 } }))
                    } if (keys.s.pressed && lastKey === "s") {

                        weapons.push(new Weapon({ position: { x: player.position.x, y: player.position.y }, velocity: { x: 0, y: player.velocity.y + j } }))
                    } if (keys.d.pressed && lastKey === "d") {

                        weapons.push(new Weapon({ position: { x: player.position.x, y: player.position.y }, velocity: { x: player.velocity.x + j, y: 0 } }))
                    }
                    // weapons.push(new Weapon({position:{x:player.position.x,y:player.position.y},velocity:{x:player.velocity.x+2,y:player.velocity.y+2}}))
                    // weapons.push(new Weapon({position:{x:player.position.x,y:player.position.y},velocity:{x:player.velocity.x,y:player.velocity.y}}))
                    // weapons.push(new Weapon({position:{x:player.position.x,y:player.position.y},velocity:{x:player.velocity.x,y:player.velocity.y}}))
                    // weapons.push(new Weapon({position:{x:player.position.x,y:player.position.y},velocity:{x:player.velocity.x,y:player.velocity.y}}))
                    // weapons.push(new Weapon({position:{x:player.position.x,y:player.position.y},velocity:{x:player.velocity.x,y:player.velocity.y}}))


                }
            }, 500)
       setTimeout(function(){
        clearInterval(timeIDofGame);
       },5000)//method to stop after 5 sec
       


        }
    }

    //   setInterval(function () {
    //         for (let j = 2; j <= 10; j += 2) {
    //             if (keys.w.pressed && lastKey === "w") {

    //                 weapons.push(new Weapon({ position: { x: player.position.x, y: player.position.y }, velocity: { x: 0, y: player.velocity.y - j } }))
    //             }
    //             if (keys.a.pressed && lastKey === "a") {

    //                 weapons.push(new Weapon({ position: { x: player.position.x, y: player.position.y }, velocity: { x: player.velocity.x - j, y: 0 } }))
    //             } if (keys.s.pressed && lastKey === "s") {

    //                 weapons.push(new Weapon({ position: { x: player.position.x, y: player.position.y }, velocity: { x: 0, y: player.velocity.y + j } }))
    //             } if (keys.d.pressed && lastKey === "d") {

    //                 weapons.push(new Weapon({ position: { x: player.position.x, y: player.position.y }, velocity: { x: player.velocity.x + j, y: 0 } }))
    //             }
    //             // weapons.push(new Weapon({position:{x:player.position.x,y:player.position.y},velocity:{x:player.velocity.x+2,y:player.velocity.y+2}}))
    //             // weapons.push(new Weapon({position:{x:player.position.x,y:player.position.y},velocity:{x:player.velocity.x,y:player.velocity.y}}))
    //             // weapons.push(new Weapon({position:{x:player.position.x,y:player.position.y},velocity:{x:player.velocity.x,y:player.velocity.y}}))
    //             // weapons.push(new Weapon({position:{x:player.position.x,y:player.position.y},velocity:{x:player.velocity.x,y:player.velocity.y}}))
    //             // weapons.push(new Weapon({position:{x:player.position.x,y:player.position.y},velocity:{x:player.velocity.x,y:player.velocity.y}}))


    //         }
    //     }, 500);
    //     }
    // }

    // console.log(player.position.y)
    // clearTimeout(timeFn);
    weapons.forEach((weapon) => { weapon.update() })
    for (let i = pellets.length - 1; 0 <= i; i--) {
        const pellet = pellets[i]
        pellet.draw()

        if (
            Math.hypot(pellet.position.x - player.position.x, pellet.position.y - player.position.y) < pellet.radius + player.radius) {
            pellets.splice(i, 1)
            score += 10
            scoreval.innerHTML = score

        }
    }
    boundries.forEach((boundary) => {
        weapons.forEach((weapon) => {
            // (weapon) => { setInterval(weapon.update(), 5000); }
            if (
                circleCollidesWithRectangle({
                    circle: weapon,
                    rectangle: boundary
                })
            ) {
                weapons.splice(0, weapons.length)
            }
        })
    })



    boundries.forEach((boundary) => {
        boundary.draw()

        if (
            circleCollidesWithRectangle({
                circle: player,
                rectangle: boundary
            })
        ) {
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })
    player.update()


    ghosts.forEach((ghost) => {
        ghost.update()

        const collisions = []
        boundries.forEach((boundary) => {
            if (
                !collisions.includes("right") && circleCollidesWithRectangle({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: ghost.speed,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push("right")
            }

            if (
                !collisions.includes("left") && circleCollidesWithRectangle({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: -ghost.speed,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push("left")
            }

            if (
                !collisions.includes("up") && circleCollidesWithRectangle({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: 0,
                            y: -ghost.speed
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push("up")
            }

            if (
                !collisions.includes("down") && circleCollidesWithRectangle({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: 0,
                            y: ghost.speed
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push("down")
            }
        })

        if (collisions.length > ghost.prevCollisions.length)
            ghost.prevCollisions = collisions

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {

            if (ghost.velocity.x > 0) { ghost.prevCollisions.push("right") }
            else if (ghost.velocity.x < 0) { ghost.prevCollisions.push("left") }
            else if (ghost.velocity.y < 0) { ghost.prevCollisions.push("up") }
            else if (ghost.velocity.y > 0) { ghost.prevCollisions.push("down") }

            const pathways = ghost.prevCollisions.filter((collision) => { return !collisions.includes(collision) })


            const direction = pathways[Math.floor(Math.random() * pathways.length)]


            switch (direction) {
                case "down":
                    ghost.velocity.y = ghost.speed
                    ghost.velocity.x = 0
                    break

                case "up":
                    ghost.velocity.y = -ghost.speed
                    ghost.velocity.x = 0
                    break

                case "right":
                    ghost.velocity.y = 0
                    ghost.velocity.x = ghost.speed
                    break

                case "left":
                    ghost.velocity.y = 0
                    ghost.velocity.x = -ghost.speed
                    break
            }

            ghost.prevCollisions = []
        }

    })

    for (var i = 0; i <= 2; i++) {
        powerUps[i].draw();
    }

}



animate()
// addEventListener("keypress",({key})=>{  if(key==="Space")weapons.forEach((weapon)=>{weapon.update()})})
addEventListener("keydown", ({ key }) => {
    switch (key) {
        case "w":
            keys.w.pressed = true
            lastKey = "w"
            break
        case "a":
            keys.a.pressed = true
            lastKey = "a"
            break
        case "s":
            keys.s.pressed = true
            lastKey = "s"
            break
        case "d":
            keys.d.pressed = true
            lastKey = "d"
            break
    }
})

addEventListener("keyup", ({ key }) => {
    switch (key) {
        case "w":
            keys.w.pressed = false

            break
        case "a":
            keys.a.pressed = false

            break
        case "s":
            keys.s.pressed = false

            break
        case "d":
            keys.d.pressed = false

            break
    }
})
