import {io} from 'socket.io-client';
const socket = io('http://localhost:9000');

socket.on('connect', () => {
  console.log("socket connect: ",socket.id);
});
socket.on('disconnect', () => {
  console.log('Socket is disconnect'); // undefined
});
export default socket;
