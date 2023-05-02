export function checkForMatchesRowsThree(array, callback) {
  for (let i = 0; i < 64; i++) {
    const threeOfAKind = [i, i + 1, i + 2];
    const selectedColor = array[i].color;
    const notValidLocation = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
    if (notValidLocation.includes(i)) continue
    if (array.length > 0 && threeOfAKind.every(color =>
      array[color].color === selectedColor
    )) {
      // if we have three of a kind, then replace the elements in the array
      // replace it with the colors above
      // colors from above are
      // array[i + 9]
      // array[i + 10]
      // array[i + 11]
      // 
      // array[i] = callback
      // array[i + 1] = callback
      // array[i + 2] = callback
      // console.log("ITS A MATCH DING DING DING", i)
      return i
    }
  }
  return false
}
