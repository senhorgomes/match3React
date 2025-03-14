import { randomIntGenerator } from "../../helpers/randomIntGenerator";
import '../Generator/generator.css';
import { useEffect, useState } from 'react';
import { checkForMatchesRowsThree } from "../../helpers/CheckForMatches/CheckForMatchesRows/checkForMatchesRows"
import { checkForMatchesColumnsThree } from "../../helpers/CheckForMatches/CheckForMatchesColumns/checkForMatchesColumns"
import { gemColorArray } from "../../constants/constants";
import { checkGridForMatches } from "../../helpers/CheckForMatches/CheckGridForMatches/checkGridForMatches";
function Generator() {
  const [generatedSeedArray, setGeneratedSeedArray] = useState([]);
  const [selectedGem, setSelectedGem] = useState({});
  const [replacedGem, setReplacedGem] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [draggedGemId, setDraggedGemId] = useState(null);
  // Score needs to put the amount of stats you have
  // use those variables as a bar
  const [score, setScore] = useState(0);
  //Tiles are A B C D E F

  //Generate array with 5 A x 5 As
  // [
  //    [A,A,A,A,A]
  //    [A,A,A,A,A]
  //    [A,A,A,A,A]
  //    [A,A,A,A,A]
  //    [A,A,A,A,A]
  //]
  //[y, x]
  //Target first A would be [0,0]
  // const gemColorArray = ["red", "blue", "yellow", "green", "black", "purple"];
  //Generate a random number 



  const yArray = [];
  // a generated seed can not have any3 matched
  // need to check for repeating values
  // the the previous two x entries are the same, change it
  // check the third element forward

  //how to return divs?
  const generatedSeed = () => {
    // Initialize the 2D array with empty arrays for each row
    const yArray = Array(8).fill().map(() => []);
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        let randomNum = randomIntGenerator(5);
        const horizontalMatch = x >= 2 && 
          yArray[y][x - 1] === gemColorArray[randomNum] && 
          yArray[y][x - 2] === gemColorArray[randomNum];
        
        const verticalMatch = y >= 2 && 
          yArray[y - 1][x] === gemColorArray[randomNum] && 
          yArray[y - 2][x] === gemColorArray[randomNum];
        
        // If we would create a match, choose a different color
        if (horizontalMatch || verticalMatch) {
          // Avoid the current color by picking another one
          let newRandomNum;
          if (randomNum === 0) {
            newRandomNum = randomIntGenerator(4) + 1; // Pick from 1-5 instead of 0
          } else {
            newRandomNum = randomIntGenerator(randomNum); // Pick from 0 to randomNum-1
          }
          yArray[y].push(gemColorArray[newRandomNum]);
        } else {
          yArray[y].push(gemColorArray[randomNum]);
        }
      }
    }
    
    // Flatten the 2D array into a 1D array
    const finalGemArray = yArray.flat();
    setGeneratedSeedArray(finalGemArray);
  }
  // console.log("withing generated seed", generatedSeedArray)

  function dragStart(e) {
    setSelectedGem({ color: e.target.src, id: e.target.id });
    setIsDragging(true);
    setDraggedGemId(e.target.id);
    
    // Add visual feedback for the dragged element
    e.target.classList.add('dragging');
    
    // Set the drag image (this helps with the visual appearance during drag)
    if (e.dataTransfer) {
      const dragIcon = document.createElement('img');
      dragIcon.src = e.target.src;
      dragIcon.style.width = '50px';
      dragIcon.style.height = '50px';
      dragIcon.style.opacity = '0.7';
      document.body.appendChild(dragIcon);
      e.dataTransfer.setDragImage(dragIcon, 25, 25);
      
      // Clean up the temporary element
      setTimeout(() => document.body.removeChild(dragIcon), 0);
    }
  }

  function dragEnd(e) {
    // Remove visual feedback
    const draggedElement = document.getElementById(draggedGemId);
    if (draggedElement) {
      draggedElement.classList.remove('dragging');
    }
    
    setIsDragging(false);
    
    // Only perform the swap if we have both gems selected
    if (Object.keys(replacedGem).length > 0 && Object.keys(selectedGem).length > 0) {
      // Check if the gems are adjacent
      const selectedId = parseInt(selectedGem.id);
      const replacedId = parseInt(replacedGem.id);
      
      const isAdjacent = 
        (Math.abs(selectedId - replacedId) === 1 && Math.floor(selectedId / 8) === Math.floor(replacedId / 8)) || // Same row
        (Math.abs(selectedId - replacedId) === 8); // Same column
      
      if (isAdjacent) {
        copyOfGenerateSeed.splice(replacedGem.id, 1, selectedGem.color);
        copyOfGenerateSeed.splice(selectedGem.id, 1, replacedGem.color);
        setGeneratedSeedArray(copyOfGenerateSeed);
        
        // Add a flash effect to the swapped gems
        const replacedElement = document.getElementById(replacedGem.id);
        const selectedElement = document.getElementById(selectedGem.id);
        
        if (replacedElement && selectedElement) {
          replacedElement.classList.add('gem-swapped');
          selectedElement.classList.add('gem-swapped');
          
          setTimeout(() => {
            replacedElement.classList.remove('gem-swapped');
            selectedElement.classList.remove('gem-swapped');
          }, 300);
        }
      }
    }
    
    // Reset the selected gems
    setDraggedGemId(null);
    setSelectedGem({});
    setReplacedGem({});
  }

  function dragDrop(e) {
    e.preventDefault();
    // Only set the replaced gem if it's not the same as the selected gem
    if (e.target.id !== draggedGemId) {
      setReplacedGem({ color: e.target.src, id: e.target.id });
      
      // Add visual feedback for the drop target
      e.target.classList.add('drop-target');
      setTimeout(() => {
        e.target.classList.remove('drop-target');
        e.target.classList.remove('drag-over');
      }, 100);
    }
  }

  function dragOver(e) {
    e.preventDefault();
    // Add hover effect only if it's a different gem
    if (e.target.classList.contains('gem') && e.target.id !== draggedGemId) {
      e.target.classList.add('drag-over');
    }
  }

  function dragLeave(e) {
    // Remove hover effect
    e.target.classList.remove('drag-over');
  }

  // ... existing code ...

  const copyOfGenerateSeed = [...generatedSeedArray];
  // useEffect(() => {
  //   setGeneratedSeedArray(copyOfGenerateSeed)
  // }, [setSelectedGem])
  function check() {
    let checkedMatchesRows = checkForMatchesRowsThree([...generatedSeedArray])
    let checkedMatchesColumns = checkForMatchesColumnsThree([...generatedSeedArray])
    //Copying one array here
    //The function uses two copies of it?
    //Yes because one needs to remain unchaged so it can grab the previous values.
    //The double arrays allows me to know the positions of previous gems
    const originalCopyOfGeneratedSeed = [...generatedSeedArray]
    if (checkedMatchesColumns !== false) {
      console.log("INSIDE LINE 119", checkedMatchesColumns)
      // Runs it only once if the 
      if (checkedMatchesColumns < 24) {
        console.log("INSIDE LINE 122", checkedMatchesColumns)
        //First replace the three matched ones
        copyOfGenerateSeed.splice(checkedMatchesColumns, 1, gemColorArray[randomIntGenerator(5)])
        copyOfGenerateSeed.splice(checkedMatchesColumns - 8, 1, gemColorArray[randomIntGenerator(5)])
        copyOfGenerateSeed.splice(checkedMatchesColumns - 16, 1, gemColorArray[randomIntGenerator(5)])
        setScore(prev => prev += 3)
        setGeneratedSeedArray(copyOfGenerateSeed)
      } else {
        //Out of the three matched in each column, grab the bottom one and replace it with the color that is three rows above. Do this for every row of the matched column until it reaches the fourth row
        let newStartingIndexForNewColors = 0;
        for (let index = checkedMatchesColumns; index > 23; index -= 8) {
          copyOfGenerateSeed.splice(index, 1, originalCopyOfGeneratedSeed[index - 24])
          newStartingIndexForNewColors = index;
        }
        console.log("LINE 136", newStartingIndexForNewColors)
        // // Generates new colors for the first three of the matched column
        copyOfGenerateSeed.splice(newStartingIndexForNewColors - 8, 1, gemColorArray[randomIntGenerator(5)])
        copyOfGenerateSeed.splice(newStartingIndexForNewColors - 16, 1, gemColorArray[randomIntGenerator(5)])
        copyOfGenerateSeed.splice(newStartingIndexForNewColors - 24, 1, gemColorArray[randomIntGenerator(5)])
        console.log(copyOfGenerateSeed, checkedMatchesRows - 8)
        setScore(prev => prev += 3)
        setGeneratedSeedArray(copyOfGenerateSeed)
      }
    }
    // this now checks for matches of three in rows
    // it modifies the color above, but now the issues is I need to loop and go backwards
    // for (let index = 0; index < array.length; index++) {
    //   const element = array[index];

    // }
    if (checkedMatchesRows !== false) {
      // cant move to the next one because it is negative
      // each loop -8, then condition is if i < 0
      console.log("LINE 144", checkedMatchesRows < 8)
      if (checkedMatchesRows < 8) {
        copyOfGenerateSeed.splice(checkedMatchesRows, 3, gemColorArray[randomIntGenerator(5)], gemColorArray[randomIntGenerator(5)], gemColorArray[randomIntGenerator(5)])
        console.log("inside if", checkedMatchesRows)
        setScore(prev => prev += 3)
        setGeneratedSeedArray(copyOfGenerateSeed)
      } else {
        let newStartingIndexForNewColors = 0;
        for (let index = checkedMatchesRows; index > 7; index -= 8) {
          copyOfGenerateSeed.splice(index, 3, originalCopyOfGeneratedSeed[index - 8], originalCopyOfGeneratedSeed[index - 7], originalCopyOfGeneratedSeed[index - 6])
          newStartingIndexForNewColors = index;
        }
        // Generates new colors
        copyOfGenerateSeed.splice(newStartingIndexForNewColors - 8, 3, gemColorArray[randomIntGenerator(5)], gemColorArray[randomIntGenerator(5)], gemColorArray[randomIntGenerator(5)])
        console.log(copyOfGenerateSeed, checkedMatchesRows - 8)
        setScore(prev => prev += 3)
        setGeneratedSeedArray(copyOfGenerateSeed)
      }
    }
  }
  // test one make it so when he state is updated run the check function
  useEffect(() => {
    generatedSeed()

  }, [])
  // Bug: when a match is made and the new colors that replace the matched ones create a new match, it doesnt replace it but instead creates an infinite loop
  useEffect(() => {
    // Idea is that everytime if it is going to check for matches in the array, regardless if something was dragged or not
    const checkingIntervalForMatches = setInterval(() => {
      console.log(checkForMatchesRowsThree([...generatedSeedArray]));
      checkGridForMatches(generatedSeedArray, setGeneratedSeedArray, gemColorArray, setScore)
      document.getElementById("healthbar").style.setProperty('width',`${score}%`);
    }, 250)
    // check()
    return () => clearInterval(checkingIntervalForMatches)

  }, [copyOfGenerateSeed, gemColorArray, generatedSeedArray])
  const generateDivs = generatedSeedArray.map((letter, index) => {
    return <img
      key={index}
      src={letter}
      draggable="true"
      onDragLeave={dragLeave}
      onDragEnter={(e) => e.preventDefault()}
      onDragOver={dragOver}
      onDragStart={dragStart}
      onDragEnd={dragEnd}
      onDrop={dragDrop}
      id={index}
      className={`gem ${draggedGemId === index.toString() ? 'dragging' : ''}`}
      alt={`gem-${index}`}
    />;
  });
  // checkForMatchesRowsThree(generatedSeedArray)

  return (
    <>
      <div id="head">
        <div id="healthbar"></div>
      </div>
      <h2>Score: {score}</h2>
      <div id="gem">
        {generateDivs}
      </div>
    </>
  );
}

export default Generator;