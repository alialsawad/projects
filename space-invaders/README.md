# Domain Analysis of the SpaceInvaders Game

1. Program Scenarios

![initial-state](initial%20state.png)
![tank-and-invaders](tank%20and%20invaders.png)
![tank-invaders-and-missiles](tank%20invaders%20and%20missiles.png)

- **Initial game state**: The game starts with the tank in the middle moving right.
- **Tank with invaders**: Invaders enter the scene at a probabilistic rate and remain within the bounds of the canvas.
- **Tank with invaders and missiles**: The player can fire missiles at the invaders. Missiles keep moving upward until they hit an invader or reach the top of the canvas. When a missile hits an invader, the invader disappears and the missile disappears.
- **Game over**: When an invader reaches the bottom of the canvas, the game ends.

## Constants

- **WIDTH**: The width of the game screen.
- **HEIGHT**: The height of the game screen.
- **INVADER-X-SPEED**: The horizontal speed of an invader.
- **INVADER-Y-SPEED**: The vertical speed of an invader.
- **TANK-SPEED**: The speed of the player's tank.
- **MISSILE-SPEED**: The speed of a missile.
- **HIT-RANGE**: The effective range for a hit between a missile and an invader.
- **INVADE-RATE**: The rate at which invaders are added to the game.
- **BACKGROUND**: The background scene of the game.
- **INVADER**: The image of an invader.
- **INVADER-BOUNDARY-L/R**: The left/right boundary of the invader's movement.
- **TANK**: The image of the player's tank.
- **TANK-Y**: The vertical position of the tank.
- **TANK-BOUNDARY-L/R**: The left/right boundary of the tank's movement.
- **MISSILE**: The image of a missile.

## Changing Information

- **Invader**: Its position (x, y), and horizontal speed direction (dx).
- **Tank**: Its horizontal position (x) and direction (dir) - which can be -1 or 1 to represent left and right respectively.
- **Missile**: Its position (x, y).
- **Game**: The list of current invaders, missiles, and the current tank state.

## Big-Bang Options

- **on-tick**: Updates the game state as time goes by.
- **to-draw**: Renders the current game state.
- **on-key**: Changes the game state in response to key presses.
- **stop-when**: Stops the game when certain conditions are met.
