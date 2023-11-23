<script>
let leaderboard;
async function getLeaderboard(){
const res = await fetch('/leaderboard', {method:"POST", body:JSON.stringify({username:localStorage.getItem('username'), cookies:localStorage.getItem('cookies')})})
leaderboard = await res.json()
}
getLeaderboard()
</script>
{#if leaderboard}
{#each leaderboard as contestant}
    <p>{contestant.name}: {contestant.cookies}</p>    
{/each}
{/if}