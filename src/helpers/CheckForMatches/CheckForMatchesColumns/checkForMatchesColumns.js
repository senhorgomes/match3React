export function checkForMatchesColumnsThree(array, callback) {
  for (let i = 0; i < 48; i++) {
    const threeOfAKind = [i, i + 8, i + 16];
    const selectedColor = array[i].color;
    // anything greater than 48 is invalid
    // if (notValidLocation.includes(i)) continue
    if (array.length > 0 && threeOfAKind.every(color =>
      array[color].color === selectedColor
    )) {
      return i + 16
    }
  }
  return false
}
