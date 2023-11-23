import { json } from '@sveltejs/kit';
import SimpleJsonDb from 'simple-json-db'
const db = new SimpleJsonDb('db.json');
export function GET() {
    return json(db.get("leaderboard"));
}
export async function POST({ request }) {
    const { username, cookies } = await request.json()
    let leaderboard = db.get("leaderboard")
    leaderboard = leaderboard.filter(i => i.name != username)
    for (var i = 0; i < leaderboard.length; i++) {
        if (cookies > leaderboard[i].cookies) {
            leaderboard.splice(i, 0, { "name": username, "cookies": cookies });
            break;
        }
    }
    if (i == leaderboard.length && leaderboard.length < 10) {
        leaderboard.push({ "name": username, "cookies": cookies });
    }
    db.set("leaderboard", leaderboard)
    return json(leaderboard)
}