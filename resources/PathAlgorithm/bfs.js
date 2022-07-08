import * as structure from "../structure.js"


let queue = new structure.Queue();
const timer = ms => new Promise(res => setTimeout(res, ms))

export const BFSalgorithm = async (gridarray,start,end,row,col,ms) => {
    //debugger;
    let visited = Array.from({ length: row }, () => Array.from({ length: col }, () => false));
    queue.clearArray();
    queue.enqueue(start);
    const nodesToAnimate = [];
    const [goalRow,goalCol] = [end.row,end.column]
    let [currentRow,currentCol] = [start.row,start.column];
    visited[currentRow][currentCol] = true;
    while(!queue.isEmpty()){
        //#region OLDCODES
        // let current_node = queue.dequeue();


        // for(let x=0;x<current_node.neighbors.length;x++){
        //     if(current_node.neighbors[x].type === 'END'){
        //         current_node.neighbors[x].parents = current_node;
        //         return true;
        //     }
        //     if(current_node.neighbors[x].type != NODES[5] && current_node.neighbors[x].type != NODES[0]){
        //         current_node.neighbors[x].type = NODES[7];
        //         current_node.neighbors[x].cell.className = NODES[7]; //currentnode
        //         await timer(ms);
        //         queue.enqueue(current_node.neighbors[x]);
        //         current_node.neighbors[x].type = NODES[5];
        //         current_node.neighbors[x].cell.className = NODES[5]; //visited
        //         //pred[current_node.neighbors[x].row][current_node.neighbors[x].column] = current_node;
        //         current_node.neighbors[x].parents = current_node;
        //         //console.log(current_node.neighbors[x].row,current_node.neighbors[x].column);
        //         await timer(ms);
        //     }
        // }
        //#endregion

        let current_node = queue.dequeue();
        [currentRow,currentCol] = [current_node.row,current_node.column];
        nodesToAnimate.push(current_node);
        if(currentRow===goalRow && currentCol === goalCol){
            //animate now
             await animateNodes(nodesToAnimate,'VISITED',ms);
             let shortestPath = await backtrackPath(end,gridarray);
             start.type = 'START-PATH';
             start.cell.className = 'START-PATH';
             await animateNodes(shortestPath,'SHORTEST-PATH',20);
             end.type = 'END-PATH';
             end.cell.className = 'END-PATH';
             return true;
        }
        for(let x=0;x<gridarray[currentRow][currentCol].neighbors.length;x++){
            const [n_row,n_col] = [gridarray[currentRow][currentCol].neighbors[x].row,gridarray[currentRow][currentCol].neighbors[x].column]
            if(visited[n_row][n_col]){continue};
            visited[n_row][n_col] = true;
            gridarray[n_row][n_col].parents = current_node;
            queue.enqueue(gridarray[currentRow][currentCol].neighbors[x]);
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


async function backtrackPath(end,gridarray){
    let shortestPath = [];
    let [currentRow,currentCol] = [end.row,end.column];
    let current_node = gridarray[currentRow][currentCol];
    while(current_node.type != 'START'){
            shortestPath.push(current_node);
            [currentRow,currentCol] = [current_node.parents.row,current_node.parents.column];
            current_node = gridarray[currentRow][currentCol];
    }
    return shortestPath.reverse();
}




