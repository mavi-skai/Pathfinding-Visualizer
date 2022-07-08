
const timer = ms => new Promise(res => setTimeout(res, ms))

export const diagonal_step_maze = async (gridarray, start, end, row, col) => {
    //debugger;
    let currentRow = 0;
    let currentCol = 0;
    let lastRow = 18;
    let lastCol = 52;
    const nodesToAnimate = []
    gridarray[currentRow][currentCol].cell.className = 'WALL';
    gridarray[currentRow][currentCol].type = 'WALL';
    let isgoingUp = true;
    currentRow += 3;

    
    while(true){
        nodesToAnimate.push(gridarray[currentRow][currentCol]);
        if(currentRow === lastRow-1 && currentCol === lastCol){
            await animateNodes(nodesToAnimate,'WALL',4);
            break;
        };
        if(isgoingUp === true){
            if(currentRow===1 && currentCol >=50){
                isgoingUp=false;
                currentCol+=2;
                currentRow+=1;
                continue;
            }
            if(currentRow>1 && currentCol < lastCol){
                currentRow-=1;
                currentCol+=1;
                continue;
            }
            else if(currentCol === lastCol){
                isgoingUp=false;
                currentRow+=3;
                continue;
            }

            if(currentRow===1){
                isgoingUp=false;
                currentCol+=3;
                continue;
            }
        }
        else{
            //going down
            if(currentRow===lastRow){
                currentCol+=3;
                isgoingUp=true;
                continue;
            }
            if(currentCol>0){
                currentRow+=1;
                currentCol-=1;
                continue;
            }
            if(currentCol===0){
                isgoingUp=true;
                currentRow+=3;
                continue;
            }
            
        }
        
    }

    

    return false;
}


async function animateNodes(nodes,cellType,ms){
    for(let x=0;x<nodes.length;x++){
        const current_node = nodes[x];
        if(current_node.type === 'START' || current_node.type === 'END'){continue};
            current_node.cell.className = cellType;
            current_node.type = cellType;
        await timer(ms);
    }
}