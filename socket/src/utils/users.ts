export type User = { 
    id:string;
    room:string;
    username: string;
 }
const users:User[] = [];

// Join user to chat
export function userJoin(id: any, username: any, room: any) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user
export function getCurrentUser(id: any) {
  return users.find(user => user.id === id);
}

// User leaves chat
export function userLeave(id: any) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
export function getRoomUsers(room: any) {
  return users.filter(user => user.room === room);
}


