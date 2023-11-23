<script>
	// variables
	let cookies,
		multiplier = 1.0,
		inventory = {
			cursor: parseInt(localStorage.getItem('cursor')) || 0,
			grandma: parseInt(localStorage.getItem('grandma')) || 0
		},
		buildings = {
			cursor: { base: 15, owned: inventory.cursor, multiplier: 1, production: 0.1, tooltipIcon:0, id: 0, description: 'Autoclicks every ten seconds' },
			grandma: { base: 100, owned: inventory.grandma, multiplier: 1, production: 1, tooltipIcon:2, id: 1, description: 'Bakes a cookie every second.' }
		},
		upgrades = [
			{ name: 'Reinforced index finger', multiplier: 2, for: 0, id: 0, cost: 100, description: 'The mouse and cursors are <strong>twice</strong> as efficient.', footer: 'click click click...'},
			{ name: 'Carpal tunnel prevention cream', multiplier: 2, for: 0, id: 1, cost: 500, description: 'The mouse and cursors are <strong>twice</strong> as efficient.', footer: 'it... it hurts to click' },
			{ name: 'Forwards from grandma', multiplier: 2, for: 1, id: 2, cost: 1000, description: 'Grandmas are <strong>twice</strong> as efficient.', footer: "thought you'd get a kick out of this ;)" }
		],
		upgradesOwned = parseInt(localStorage.getItem('upgradesOwned')) || 0,
		cps,
		username = localStorage.getItem('username'),
		newUsername = '',
		message = '',
		description = {},
		mouseY=0,
		game = {};
	//game

	cookies = parseFloat(localStorage.getItem('cookies')) || 0;
	function saveCookies() {
		localStorage.setItem('cookies', (Math.round(cookies * 1000) / 1000).toString());
	}
	function saveUpgrades() {
		localStorage.setItem('upgradesOwned', upgradesOwned);
	}
	function getBuildingById(id) {
		return Object.keys(buildings)[id];
	}
	function buyUpgrade(upgradearg) {
		let upgrade = upgrades[upgradesOwned];
		if(upgrade!=upgradearg) return
		if (cookies >= upgrade.cost) {
			cookies -= upgrade.cost;
			upgradesOwned++;
			saveUpgrades();
			calculateCPS();
		}
	}
	function applyMultipliers() {
		Object.keys(buildings).forEach((building) => (buildings[building].multiplier = 1));
		for (let i = 0; i < upgradesOwned; i++) {
			buildings[getBuildingById(upgrades[i].for)].multiplier *= upgrades[i].multiplier;
		}
	}
	function calculateCPS() {
		cps = 0;
		applyMultipliers();
		Object.keys(inventory).forEach((key) => {
			let count = inventory[key];
			if (count > 0) {
				let building = buildings[key];
				cps += building.production * building.multiplier * building.owned;
			}
		});
		if (cps < 1000000) {
			cps = Math.round(cps * 10) / 10;
		} else {
			cps = Math.round(cps * 1000) / 1000;
		}
	}
	calculateCPS();
	setInterval(tick, 1000);
	function tick() {
		updateCookies(cps);
	}
	function updateCookies(number) {
		cookies = cookies + number;
		saveCookies();
	}
	function getPrice(basePrice, amount, priceIncrease) {
		return Math.ceil(basePrice * Math.pow(priceIncrease, amount));
	}
	function buyItem(item) {
		let price = getPrice(buildings[item].base, inventory[item], 1.15);
		if (cookies >= price) {
			updateCookies(-price);
			inventory[item]++;
			buildings[item].owned = inventory[item];
			calculateCPS();
			localStorage.setItem(item, inventory[item]);
		}
	}
	function clickAnimation(e) {
		updateCookies(multiplier);
	}
	//utils
	function cookiesToWords(cookies) {
		if (cookies < 1000000) {
			return Math.trunc(cookies).toString();
		} else {
			let words = [
				'',
				'',
				'million',
				'billion',
				'trillion',
				'quadrillion',
				'quintillion',
				'sextillion',
				'septillion',
				'octillion',
				'nonillion',
				'decillion',
				'undecillion',
				'duodecillion',
				'tredecillion',
				'quattuordecillion',
				'quindecillion',
				'sexdecillion',
				'septendecillion',
				'octodecillion',
				'novemdecillion',
				'vigintillion',
				'unvigintillion',
				'duovigintillion',
				'trevigintillion',
				'quattuorvigintillion',
				'quinvigintillion',
				'sexvigintillion',
				'septenvigintillion',
				'octovigintillion',
				'novemvigintillion',
				'trigintillion',
				'untrigintillion',
				'duotrigintillion',
				'tretrigintillion',
				'quattuortrigintillion',
				'quintrigintillion',
				'sextrigintillion',
				'septentrigintillion',
				'octotrigintillion',
				'novemtrigintillion',
				'quadragintillion',
				'unquadragintillion',
				'duoquadragintillion',
				'trequadragintillion',
				'quattuorquadragintillion'
			];
			let index = Math.floor(Math.log10(cookies) / 3);
			let power = Math.pow(1000, index);
			let value = (cookies / power).toString();
			value = value.split('.');
			value = `${value[0]}${
				value[1]
					? `.${value[1][0] ? value[1][0] : ''}${value[1][1] ? value[1][1] : ''}${
							value[1][2] ? value[1][2] : ''
					  }`
					: ''
			}`;
			return value.toString() + ' ' + words[index];
		}
	}
	async function createAccount() {
		const res = await fetch('/account', {
			method: 'POST',
			body: JSON.stringify({ username: newUsername })
		});
		const data = await res.json();
		if (data.status == 200) {
			localStorage.setItem('username', newUsername);
			username = newUsername;
		} else {
			message = data.message;
		}
	}
	document.addEventListener("mousemove", function(e) {
  var y = e.clientY;
  document.getElementById('description').style.top = (y) + "px";
});
function round(num){
	return Math.round(num*10) / 10
}
</script>
<div class="description" id="description" style="display: none;"><div id="tooltipAnchor"><div id="tooltip"><div style=""></div><div style=""><div class="icon" style="float:left;"><img src="{description.imageName}.webp" alt=""></div><div style="float:right;text-align:right;"><span class="price">{description.price}</span></div><div class="name">{description.name}</div><small><div class="tag">{#if description.owned}owned: {description.owned}{:else}upgrade{/if}</div></small>{#if description.owned}<div class="descriptionText" style="float: right;"><q style="color: gray;">{description.text}</q></div>{:else} <span style="font-weight: 300;">{@html description.text}</span> {/if}{#if description.owned}<br><div class="descriptionBlock">each {description.name} produces <b>{description.production} cookies</b> per second</div><div class="descriptionBlock">{description.owned} cursors producing <b>{round(description.owned*description.production)} cookies</b> per second (<b>{round(description.owned*description.production/cps)*100}%</b> of total CpS)</div>{:else} <br> <div class="footerText" style="float: right;"><q style="color: gray;">{description.footer}</q></div> {/if}</div></div></div>
</div>
{#if username}
	<a href="/leaderboard">leaderboard</a>
	<div style="display: flex;">
		<div class="outerCookie">
			<img src="result.png" class="cookie" on:click={clickAnimation} />
			<p><span id="cookies">{cookiesToWords(cookies)}</span> cookies</p>
			<p>per second: {cps}</p>
		</div>
		<div class="separatorLeft"></div>
		<div class="buildings"></div>
		<div class="separatorLeft"></div>
		<div class="store">
			<h2 style="text-align: center; color: white;">Store</h2>
			<div class="upgrades storeSection">
				{#each upgrades.filter((i) => i.id >= upgradesOwned) as upgrade}
					<div
					on:mouseout={function () {
						document.querySelector('.description').style.display = 'none';
					}}
						on:mouseover={function (e) {
							description = {name: upgrade.name, imageName: upgrade.name, price: upgrade.cost, text:upgrade.description, footer: upgrade.footer}
							document.querySelector('.description').style.display = '';
						}}
						class="upgrade {cookies >= upgrade.cost && upgrade.id == upgradesOwned ? 'enabled' : 'disabled'}"
						on:click={()=>buyUpgrade(upgrade)}
					>
						<img src="{upgrade.name}.webp" />
					</div>
				{/each}
			</div>
			<div class="buildings storeSection">
				{#each Object.entries(buildings) as building}
					<button
					on:mouseout={function () {
						document.querySelector('.description').style.display = 'none';
					}}
						on:mouseover={function (e) {
							description = {name: building[0], imageName: upgrades[building[1].tooltipIcon].name, price: getPrice(building[1].base, inventory[building[0]], 1.15), owned: inventory[building[0]], text:building[1].description, production:building[1].production*building[1].multiplier}
							document.querySelector('.description').style.display = '';
						}}
						class="product {cookies >= getPrice(building[1].base, inventory[building[0]], 1.15)
							? 'enabled'
							: 'disabled'}"
						on:click={() => buyItem(building[0])}
						><img class="cursor icon" src="{building[0]}.webp" alt="" />
						<div class="content">
							<div class="productName title">{building[0]}</div>
							<span class="productPrice price">
								{cookiesToWords(getPrice(building[1].base, inventory[building[0]], 1.15))}
							</span>
							<div class="title owned">{inventory[building[0]]}</div>
						</div></button
					>
					<br />
				{/each}
			</div>
		</div>
	</div>
{:else}
	<p>Enter username:</p>
	<input type="text" bind:value={newUsername} /><button on:click={createAccount}>submit</button>
{/if}
<p>{message}</p>

<style>
	.description{
		position: absolute;
		left: calc(80% - 350px);
		width: 350px;
		border: solid 1px bisque;
			background-color: #000;
			color: white;
	}
	.outerCookie {
		height: 100%;
		width: 25vw;
	}
	q{
		font-style: italic;
	}
	.separatorLeft {
		width: 16px;
		height: 100vh;
		background: url(https://orteil.dashnet.org/cookieclicker/img/panelVertical.png?v=2) repeat-y;
		z-index: 100;
	}
	.store {
		width: 300px;
		height: 100%;
	}
	.buildings {
		width: 100%;
		height: 100%;
	}
	.upgrade:before {
		content: '';
		position: absolute;
		left: -6px;
		top: -6px;
		width: 60px;
		height: 60px;
		display: block;
		background: url(https://orteil.dashnet.org/cookieclicker/img/upgradeFrame.png?v=2);
		background-position: 0px 0px;
		z-index: 10;
	}
	.upgrade {
		width: 48px;
		height: 48px;
		margin: 6px;
		display: inline-block;
		cursor: pointer;
		/* opacity: 0.6; */
		position: relative;
		/* background: #000; */
		background: rgba(0, 0, 0, 0.25);
		float: left;
		border: none;
	}
	.upgrade img {
		width: 100%;
	}
	.disabled {
		opacity: 0.6;
		background: black;
	}
	.storeSection {
		height: 100%;
		width: 300px;
		position: relative;
		overflow-y: hidden;
		background: url(https://orteil.dashnet.org/cookieclicker/img/panelHorizontal.png?v=2) repeat-x
			top;
		padding-top: 16px;
	}
	.upgrades {
		height: 60px;
	}
	.upgrades:hover {
		height: fit-content;
	}
	.cookie {
		width: 200px;
	}
	.cursor {
		margin: 0;
		padding: 0;
		height: 40px;
	}
	.product {
		width: 300px;
		height: 64px;
		cursor: pointer;
		background: url(https://orteil.dashnet.org/cookieclicker/img/storeTile.jpg);
		position: relative;
		-webkit-transition:
			opacity 0.25s ease-out,
			margin-bottom 0.1s ease-out;
		-moz-transition:
			opacity 0.25s ease-out,
			margin-bottom 0.1s ease-out;
		-ms-transition:
			opacity 0.25s ease-out,
			margin-bottom 0.1s ease-out;
		-o-transition:
			opacity 0.25s ease-out,
			margin-bottom 0.1s ease-out;
		transition:
			opacity 0.25s ease-out,
			margin-bottom 0.1s ease-out;
		border: none;
		text-align: left;
		line-height: inherit;
	}
	.product .content {
		display: inline-block;
		position: absolute;
		left: 64px;
		top: 6px;
		right: 0px;
		bottom: 6px;
		padding: 4px;
		text-shadow:
			0px 2px 6px #000,
			0px 1px 1px #000;
	}
	.product .icon {
		width: 64px;
		height: 64px;
		position: absolute;
		left: 0px;
		top: 0px;
		background-repeat: no-repeat;
		margin: 0px;
	}
	.productName {
		font-weight: bold;
		letter-spacing: -1px;
		font-size: 28px;
	}
	.price {
		font-weight: bold;
		color: #6f6;
		padding-left: 18px;
		position: relative;
	}
	.price:before {
		content: '';
		display: block;
		position: absolute;
		left: 0px;
		top: 0px;
		background: url(https://orteil.dashnet.org/cookieclicker/img/money.png);
		width: 16px;
		height: 16px;
	}
	.product .content .owned {
		position: absolute;
		right: 8px;
		bottom: 5px;
		font-size: 40px;
		opacity: 0.2;
		color: #000;
		text-shadow: 0px 0px 8px #fff;
		letter-spacing: -2.5px;
	}
	.title {
		font-size: 28px;
		text-shadow: 0px 1px 4px #000;
		color: #fff;
	}
	.product:after {
		content: '';
		display: block;
		position: absolute;
		left: 0px;
		top: 0px;
		right: 0px;
		bottom: 0px;
		z-index: 100;
	}
</style>
