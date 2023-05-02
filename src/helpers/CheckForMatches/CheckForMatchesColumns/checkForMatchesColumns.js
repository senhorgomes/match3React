export function checkForMatchesColumnsThree(array, callback) {
  console.log(array)
  for (let i = 0; i < 48; i++) {
    const threeOfAKind = [i, i + 8, i + 16];
    const selectedColor = array[i].color;
    // anything greater than 48 is invalid
    const notValidLocation = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
    // if (notValidLocation.includes(i)) continue
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
      console.log(selectedColor)
      return i + 16
    }
  }
  return false
}
