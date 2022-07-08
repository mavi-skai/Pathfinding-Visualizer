

const timer = ms => new Promise(res => setTimeout(res, ms))





export const prim_maze_algorithm = async (gridarray, start, end, row, col) => {
    //debugger;
    for(let x=0;x<row;x++){
        for(let y=0;y<col;y++){
                if(gridarray[x][y].type === 'START' || gridarray[x][y].type === 'END'){continue};
                gridarray[x][y].cell.className = 'WALL';
                gridarray[x][y].type = 'WALL';
        }
    }
    await timer(700);
    const visited = Array.from({ length: 19 }, () => Array.from({ length: 54 }, () => false));
    const isWall = Array.from({ length: 19 }, () => Array.from({ length: 54 }, () => true));
    let currentRow = getRndInteger(0, row - 1);
    let currentCol = getRndInteger(0, col - 1);
    let frontiersList = [];
    let nodesToRemoveWall = [];
    nodesToRemoveWall.push(gridarray[currentRow][currentCol]);
    isWall[currentRow][currentCol] = false;

    let frontiers = getFrontiers(gridarray,currentRow,currentCol,isWall,visited,row,col);
    for(let x=0;x<frontiers.length;x++){
        let [row,col] = frontiers[x];
        visited[row][col] = true;
        frontiersList.push(frontiers[x]);
        //gridarray[row][col].cell.className = 'FRONTIER';
    }

    while(frontiersList.length>0){
        //get random from frontier
        let selectedIdx = Math.floor(Math.random()*frontiersList.length);
        let [currentRow,currentCol] = frontiersList[selectedIdx];
        //get random neighbors from current frontier
        let neighbors = getNeighborsPrime(gridarray,currentRow,currentCol,isWall,row,col);
        //get random neighbors
        let randomNeighborIdx = Math.floor(Math.random()*neighbors.length);
        let neighbor = neighbors[randomNeighborIdx];
        let [neighborRow,neighborCol] = neighbor;
        //get between cell of current frontier and current node
        let wall = getCellBeetween(neighborRow,neighborCol,currentRow,currentCol,gridarray);
        nodesToRemoveWall.push(wall);
        nodesToRemoveWall.push(gridarray[currentRow][currentCol]);
        isWall[currentRow][currentCol] =false;
        isWall[neighborRow][neighborCol] = false;


        frontiers = getFrontiers(gridarray,currentRow,currentCol,isWall,visited,row,col);

        for(let i=0; i<frontiers.length;i++){
            let [row,col] = frontiers[i]
            visited[row][col] = true;
            frontiersList.push(frontiers[i]);
        }
        frontiersList.splice(selectedIdx,1)
    }
    //NODE TO REMOVE WALL
    for(let i=0;i<nodesToRemoveWall.length;i++){
        if(nodesToRemoveWall[i].type === 'START' || nodesToRemoveWall[i].type === 'END'){
            continue;
        }
        nodesToRemoveWall[i].cell.className = 'UNVISITED';
        nodesToRemoveWall[i].type = 'UNVISITED';
        await timer(4)
    }

    return false;

}

function getFrontiers(gridarray,currentRow,currentCol,isWall,visited,row,col){
    let possibleNeighbors = [
        [currentRow,currentCol-2],
        [currentRow, currentCol+2],
        [currentRow-2, currentCol],
        [currentRow+2,currentCol]
    ]

    let frontiers=[]
    for(let i=0; i<possibleNeighbors.length; i++){
        let [x,y] = possibleNeighbors[i];
        if(x>=0 && x<row && y>=0 && y<col){
            if (isWall[x][y] && !visited[x][y]){
                frontiers.push([x,y]);
            }
        }
    }
    return frontiers;
}

//get node with iswall === false;
function getNeighborsPrime(gridarray,currentRow,currentCol,isWall,row,col){
    let possibleNeighbors = [
        [currentRow,currentCol-2],
        [currentRow, currentCol+2],
        [currentRow-2, currentCol],
        [currentRow+2,currentCol]
    ]

    let neighbors=[]
    for(let i=0; i<possibleNeighbors.length; i++){
        let [x,y] = possibleNeighbors[i];
        if(x>=0 && x<row && y>=0 && y<col){
            if (isWall[x][y]){
                continue
            }
            else{
                neighbors.push([x,y]);
            }
        }
    }
    return neighbors;
}

function getCellBeetween(row1,col1,row2,col2,grid){
    if(row1==row2){
        if(col1>col2){
            return grid[row1][col2+1]
        }else{
            return grid[row1][col1+1]
        }
        
    }else if(col1===col2){
        if(row2>row1){
            return grid[row1+1][col1]
        }else{
            return grid[row2+1][col1]
        }
    }
}


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

