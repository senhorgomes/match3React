export function checkForMatchesRowsThree (array, callback) {
  for(let i = 0; i < 64; i++) {
    const threeOfAKind = [i, i + 1, i + 2];
    const selectedColor = array[i];
    const notValidLocation = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
    if (notValidLocation.includes(i)) continue
    if (array.length > 0 && threeOfAKind.every(color => 
      array[color] === selectedColor
    )) {
      array[i] = callback
      array[i + 1] = callback
      array[i + 2] = callback
      // console.log("ITS A MATCH DING DING DING", i)
      return array
    }
  }
}
