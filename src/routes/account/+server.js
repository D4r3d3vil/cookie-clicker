import { json } from '@sveltejs/kit';
import SimpleJsonDb from 'simple-json-db'
const db = new SimpleJsonDb('./static/Data.json');
export async function POST({ request }) {
    const { username } = await request.json()
    if(db.has(username)) return json({status:400, message:'username already taken'})
    return json({status:200, s:db.set})
}