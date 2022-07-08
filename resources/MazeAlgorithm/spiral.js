
const timer = ms => new Promise(res => setTimeout(res, ms))


export const spiral_maze = async (gridarray, start, end, row, col)=>{
    const nodesToAnimate = [];

    let firstRow =0
    let lastRow = 17;
    let firstCol = 0;
    let lastCol = 53;

    while (lastRow-firstRow>2&& lastCol-firstRow>2){
        for(let col=firstCol;col<lastCol;col++){
            nodesToAnimate.push(gridarray[firstRow][col])
        }
        for(let row=firstRow;row<lastRow;row++){
            nodesToAnimate.push(gridarray[row][lastCol])
        }
        for(let col=lastCol;col>firstCol;col--){
            nodesToAnimate.push(gridarray[lastRow][col])
        }
        for(let row=lastRow;row>firstRow+1;row--){
            nodesToAnimate.push(gridarray[row][firstCol+1])
        }

        nodesToAnimate.push(gridarray[firstRow+2][firstCol+2])
        nodesToAnimate.push(gridarray[firstRow+2][firstCol+2])
        firstRow += 2
        lastRow -= 2
        firstCol += 2
        lastCol -= 2
    }

   await animateNodes(nodesToAnimate,'WALL', 0,10)
   return false
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