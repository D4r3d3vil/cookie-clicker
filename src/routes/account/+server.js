import { json } from '@sveltejs/kit';
let accounts = []
export async function POST({ request }) {
    const { username } = await request.json()
    if(accounts.includes(username)) return json({status:400, message:'username already taken'})
    accounts.push(username)
    return json({status:200})
}