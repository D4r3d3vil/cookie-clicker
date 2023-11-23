<script>
let leaderboard;
async function getLeaderboard(){
const res = await fetch('/leaderboard', {method:"POST", body:JSON.stringify({username:localStorage.getItem('username'), cookies:localStorage.getItem('cookies')})})
leaderboard = await res.json()
}
getLeaderboard()
</script>
{#if leaderboard}
<table>
    <tr>
      <th>Rank</th>
      <th>Name</th>
      <th>Score</th>
    </tr>
{#each leaderboard as contestant}
<tr>
    <td>{leaderboard.findIndex(function(dict) {return dict.name == contestant.name})+1}</td>
    <td>{contestant.name}</td>
    <td>{contestant.cookies}</td>
  </tr>
  {/each}
  </table>
  {/if}
