import {chooseMove} from './engine.js';
self.onmessage=e=>{try{const {id,fen,depth}=e.data;self.postMessage({id,fen,move:chooseMove(fen,depth,depth===8?5000:depth===5?2200:650)})}catch(error){self.postMessage({id:e.data.id,error:String(error)})}};
