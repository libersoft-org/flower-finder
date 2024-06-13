# Bugs

- Using magnifying glass is not adding harvest to inventory (flowers, magnifiers, stones, clocks)
- If multiple clocks are harvested in one turn (when using magnifier), it should give player more turns than just one
- When using magnifier, it collects items at black spots too (which should not)

# Other

- Revealed and blocked (both together) should appear to other player as light gray - lighter than unrevealed (not black)
- Add sounds
- Shrink fields on mobile low resolutions
- Add rules text at start
- Remove all console logs
- Remake field rendering in startGame (`repeat(${settings.gridSize}, 40px)` ...)
