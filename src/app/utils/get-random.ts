export class GetRandom {
    constructor(){
    } 
   randomPicks(quantityWanted :number,list: any[]){
    let array = [];
    while(array.length < quantityWanted){
    array.push(Math.floor(Math.random()*list.length));
    }
    return array.map(nr => list[nr]);  
   } 
}
