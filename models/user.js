import fs from 'fs'

export function SaveUser(userlist) {
  fs.writeFileSync('user.txt', JSON.stringify(userlist ,null,2))
}

export function ReadUserFile() {

  if (fs.existsSync('user.txt')) {
    const UserReader = fs.readFileSync('user.txt', {encoding: 'UTF-8'});
    return JSON.parse(UserReader)
  }
  return []
}
