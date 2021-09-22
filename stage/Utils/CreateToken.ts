const JWT = require("jsonwebtoken")

export interface Token {
    id: string,
    username: string
}

export default function CreateToken({ id, username }: Token) {
    if (!id || !username) {
        return false
    }
    return  JWT.sign({ id, username }, process.env.JWT_SECRET)
}