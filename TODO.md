# Bugs

- Game over alert is shown multiple times for some reason
- When using magnifier, it collects items at black spots too (which should not)
- When the game is over, it doesn't show the last revealed flower, because setTimeout will remove it after 1 second

# Other

- Revealed and blocked (both together) should appear to other player as light gray - lighter than unrevealed (not black)
- Add sounds
- Shrink fields on mobile low resolutions
- Add rules text at start
- Add game screenshot (screenshot.webp) for README
- Remake field rendering in startGame (`repeat(${settings.gridSize}, 40px)` ...)