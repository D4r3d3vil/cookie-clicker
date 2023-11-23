import { json } from '@sveltejs/kit';
let userLeaderboard = []
export function GET() {
    return json(userLeaderboard);
}
export async function POST({ request }) {
    const { username, cookies } = await request.json()
    let leaderboard = userLeaderboard.filter(i => i.name != username)
    for (var i = 0; i < leaderboard.length; i++) {
        if (cookies > leaderboard[i].cookies) {
            leaderboard.splice(i, 0, { "name": username, "cookies": cookies });
            break;
        }
    }
    if (i == leaderboard.length && leaderboard.length < 10) {
        leaderboard.push({ "name": username, "cookies": cookies });
    }
    userLeaderboard = leaderboard
    return json(leaderboard)
}