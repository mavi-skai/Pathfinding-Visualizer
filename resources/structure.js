export class Queue{
    constructor(){
        this.nodes = [];
    }

    enqueue(cur_node){
        this.nodes.push(cur_node);
    }

    enqueue_unshift(cur_node){
        this.nodes.unshift(cur_node);
    }

    get_randomNodes(){
        if(this.nodes.length === 0){return};
        
        const randomIndex = Math.floor(Math.random() * this.nodes.length);
        return this.nodes.splice(randomIndex,1);
    }

    astar_priorityenqueue(cur_node){
        let add = false;
        for(let x=0;x<this.nodes.length;x++){
            if(cur_node.fScore === this.nodes[x].fScore && cur_node.count > this.nodes[x].count){
                this.nodes.splice(x,0,cur_node);
                add = true;
                break;
            }
            else if(cur_node.fScore < this.nodes[x].fScore){
                this.nodes.splice(x,0,cur_node);
                add = true;
                break;
            }
        }
        if(add===false){
            this.nodes.push(cur_node);
        }
        
    }

    gbfs_priorityenqueue(cur_node){
        let add = false;
        for(let x=0;x<this.nodes.length;x++){
            if(cur_node.fScore < this.nodes[x].fScore){
                this.nodes.splice(x,0,cur_node);
                add = true;
                break;
            }
        }
        if(add===false){
            this.nodes.push(cur_node);
        }
        
    }

    dijkstra_priorityenqueue(cur_node){
        let add = false;
        for(let x=0;x<this.nodes.length;x++){
            if(cur_node.distance < this.nodes[x].distance){
                this.nodes.splice(x,0,cur_node);
                add = true;
                break;
            }
        }
        if(add===false){
            this.nodes.push(cur_node);
        }
    }

    dequeue(){
        return this.nodes.shift();
    }

    pop(){
        if (this.nodes.length == 0) {
            return "Underflow";
        }
        return this.nodes.pop();
    }

    peek(){
        if(this.nodes.length!=0)
            return this.nodes[0];
    }

    getSize(){
        return this.nodes.length;
    }

    isEmpty(){
        return this.getSize() === 0;
    }

    clearArray(){
        this.nodes = []
    }
    


}

export class Stack{

}