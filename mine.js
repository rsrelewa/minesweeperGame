function Cell(row,col){
    const $board = document.querySelector(".container")
    this.$cell = document.createElement('div');
    
    this.$cell.className = 'cell';
    this.$cell.id = `${row}${col}`

    this.bomb = false;
    this.flag = false;
    this.revealed = false;   

    const neighbors = (arr,row,col) => {
        let bombCount = 0;  
        arr.map(([row,col]) => {
            if (Array.isArray(boardArr[row]) && boardArr[row][col] !== undefined){
                if (boardArr[row][col].bomb === true){
                    bombCount++;
                }
            }
      });
      return bombCount
    }
    
    const returnsDirs = (row,col) => {
        return  [
            [row + 1, col - 1],
            [row + 1, col],
            [row + 1, col + 1],
            [row, col - 1],
            [row, col + 1],
            [row - 1, col - 1],
            [row - 1, col],
            [row - 1, col + 1]
        ]
    }

    const search = (row,col) => {  

        const dirs = returnsDirs(row,col)
        const bombCount = neighbors(dirs,row,col) 

        if (bombCount === 0 && boardArr[row][col].bomb === false)  {
            dirs.forEach(([row,col]) => {
                if (Array.isArray(boardArr[row]) && boardArr[row][col] !== undefined){
                    const innerDirs =  returnsDirs(row,col)
                    boardArr[row][col].$cell.style.backgroundColor = 'white';
                   
                    const currentBombCount = neighbors(innerDirs,row,col)
                     
                    if (currentBombCount >0){
                        boardArr[row][col].$cell.innerText = `${currentBombCount}`; 
                        return;
                    } 

                    if (boardArr[row][col].revealed){
                        return;
                    }

                    boardArr[row][col].revealed = true;
                    
                    if (currentBombCount === 0){
                        search(row,col)
                    }
                    
                }     
                 
            });
        }
        
        if (bombCount > 0 && boardArr[row][col].bomb === false){
            boardArr[row][col].$cell.innerText = `${bombCount}`
            boardArr[row][col].$cell.style.backgroundColor = 'white';
            boardArr[row][col].revealed = true;
            return;
        }

    }


    
    const click = (node) => {
        node.addEventListener('click',e=>{
            //If there's a bomb when I click
            if (this.bomb === true){
                node.style.backgroundColor = 'red';
                turnRed()
                const replay = confirm("You lost. Well played, refresh the page to replay.")
                if (replay){
                    location.reload();
                }
            }
            wonGame(boardSize,boardArr)
    
            //If there's no bomb when I click
            if (this.bomb === false){
                node.classList.remove("flagged");
                boardArr[row][col].$cell.style.backgroundColor = 'white';
                search(row,col) 
            }
        })
    }
    
    click(this.$cell)

    //Flagging functionality
    this.$cell.addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
        ev.target.classList.add("flagged")
        return false;
    }, false);

    $board.append(this.$cell);
}

//Sets up the board
const createArray = (num) => {
    let arr = []
    for (let i = 0; i < num; i++){
        arr.push([])
        for (let j=0; j <num; j++){
            arr[i].push(j)
        }
    }
    return arr;
}
const boardSize = 10
const numberedArray = createArray(boardSize)
const boardArr = numberedArray.map((row,rowIndex) => {
    return row.map((col,colIndex) =>{
        return new Cell(rowIndex,colIndex)
    })
});

//sets up the bombs in random places
const bombs = boardSize;
const createBombArray = (num) => {
    let arr = []
    for (let i = 0; i < boardSize; i++){
        arr.push(i)
    }
    return arr;
}
const indexedBombArr = createBombArray(bombs);
const bombArr = indexedBombArr.map((element,index)=>{
    boardArr[Math.floor(Math.random() * bombs)][Math.floor(Math.random() * bombs)].bomb = true
})

//turn all bombs red, used when game is over
const turnRed = () => {
    boardArr.forEach(arr => {
        arr.forEach(element => {
            if (element.bomb === true){
                element.$cell.style.backgroundColor = 'red'
            }
        });
    });
}

//checks to see if game is won
const wonGame = (boardSize,boardArr) => {
    let num = 0;
    
    boardArr.forEach(arr => {
        arr.forEach(element => {

            if (element.bomb === true){
                num++
            }
            if (element.revealed === true){
                num++
            }
            
        });
    });
    
    if (num===99){
        const replay = confirm("You Won!!! Good game! Refresh the page to replay.")
        if (replay){
            location.reload();
        }
    }
}

//cheat codes
const button = document.querySelector(".cheat");
button.addEventListener('click',turnRed)
