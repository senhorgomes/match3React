export function checkForMatchesRowsThree(array, callback) {
  for (let i = 0; i < 62; i++) {
    const threeOfAKind = [i, i + 1, i + 2];
    console.log(threeOfAKind)
    const selectedColor = array[i].color;
    console.log(array[i].color)
    const notValidLocation = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
    if (notValidLocation.includes(i)) continue
    if (array.length > 0 && threeOfAKind.every(color =>
      array[color].color === selectedColor
    )) {
      console.log("Matched")
      return i
    }
  }
  return false
}
