function getStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Storage read error:", key, error);
    return [];
  }
}

function setStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function calculateAge(dob) {
  if (!dob) return "";
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      resolve(event.target.result);
    };

    reader.onerror = function () {
      reject(new Error("File reading failed"));
    };

    reader.readAsDataURL(file);
  });
}

function createSeedData() {
  const leagues = getStorage("twf_leagues");
  if (!Array.isArray(leagues) || leagues.length === 0) {
    setStorage("twf_leagues", [
      {
        name: "Egypt Women’s Premier League",
        logo: "",
        level: "Top Division",
        founded: 1998,
        country: "Egypt"
      }
    ]);
  }

  const clubs = getStorage("twf_clubs");
  if (!Array.isArray(clubs) || clubs.length === 0) {
    setStorage("twf_clubs", [
      {
        name: "FC Cairo Women",
        logo: "",
        league: "Egypt Women’s Premier League",
        country: "Egypt",
        area: "Cairo",
        founded: 2018,
        kitColors: "Green and White"
      }
    ]);
  }

  const players = getStorage("twf_players");
  if (!Array.isArray(players) || players.length === 0) {
    setStorage("twf_players", [
      {
        name: "Aya Kamel",
        dob: "2004-05-14",
        age: calculateAge("2004-05-14"),
        club: "FC Cairo Women",
        position: "Forward",
        shirtNumber: 9,
        appearances: 18,
        goals: 11,
        assists: 4,
        value: 500000,
        image: ""
      }
    ]);
  }
}

function populateClubOptions() {
  const playerClubSelect = document.getElementById("playerClub");
  if (!playerClubSelect) return;

  const clubs = getStorage("twf_clubs");
  playerClubSelect.innerHTML = `<option value="">Select a club</option>`;

  clubs.forEach((club) => {
    const option = document.createElement("option");
    option.value = club.name;
    option.textContent = club.name;
    playerClubSelect.appendChild(option);
  });
}

function populateLeagueOptions() {
  const clubLeagueSelect = document.getElementById("clubLeague");
  if (!clubLeagueSelect) return;

  const leagues = getStorage("twf_leagues");
  clubLeagueSelect.innerHTML = `<option value="">No league selected</option>`;

  leagues.forEach((league) => {
    const option = document.createElement("option");
    option.value = league.name;
    option.textContent = league.name;
    clubLeagueSelect.appendChild(option);
  });
}

function showAdminMessage(message, isError = false) {
  const box = document.getElementById("adminMessage");
  if (!box) return;

  box.textContent = message;
  box.className = isError ? "admin-message error" : "admin-message success";
}

function setupAgeCalculation() {
  const dobInput = document.getElementById("playerDob");
  const ageInput = document.getElementById("playerAge");

  if (!dobInput || !ageInput) return;

  dobInput.addEventListener("change", function () {
    ageInput.value = calculateAge(dobInput.value);
  });
}

function deletePlayer(index) {
  const players = getStorage("twf_players");
  players.splice(index, 1);
  setStorage("twf_players", players);
  renderPlayersList();
  renderPublicPlayers();
}

function deleteClub(index) {
  const clubs = getStorage("twf_clubs");
  clubs.splice(index, 1);
  setStorage("twf_clubs", clubs);
  renderClubsList();
  populateClubOptions();
  renderPublicClubs();
}

function deleteLeague(index) {
  const leagues = getStorage("twf_leagues");
  leagues.splice(index, 1);
  setStorage("twf_leagues", leagues);
  renderLeaguesList();
  populateLeagueOptions();
  renderPublicLeagues();
}

function clearPlayers() {
  setStorage("twf_players", []);
  renderPlayersList();
  renderPublicPlayers();
}

function clearClubs() {
  setStorage("twf_clubs", []);
  renderClubsList();
  populateClubOptions();
  renderPublicClubs();
}

function clearLeagues() {
  setStorage("twf_leagues", []);
  renderLeaguesList();
  populateLeagueOptions();
  renderPublicLeagues();
}

function setupForms() {
  const playerForm = document.getElementById("playerForm");
  if (playerForm) {
    playerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      try {
        const imageFile = document.getElementById("playerImage").files[0];
        const imageData = await readFileAsDataURL(imageFile);

        const name = document.getElementById("playerName").value.trim();
        const dob = document.getElementById("playerDob").value;
        const age = document.getElementById("playerAge").value;
        const club = document.getElementById("playerClub").value;
        const position = document.getElementById("playerPosition").value;
        const shirtNumber = document.getElementById("playerNumber").value;
        const appearances = document.getElementById("playerAppearances").value;
        const goals = document.getElementById("playerGoals").value;
        const assists = document.getElementById("playerAssists").value;
        const value = document.getElementById("playerValue").value;

        if (!name || !dob || !age || !club || !position) {
          showAdminMessage("Please fill all required player fields.", true);
          return;
        }

        const players = getStorage("twf_players");
        players.push({
          name,
          dob,
          age,
          club,
          position,
          shirtNumber,
          appearances,
          goals,
          assists,
          value,
          image: imageData
        });

        setStorage("twf_players", players);
        playerForm.reset();
        document.getElementById("playerAge").value = "";
        renderPlayersList();
        renderPublicPlayers();
        showAdminMessage("Player added successfully.");
      } catch (error) {
        console.error("Player form error:", error);
        showAdminMessage("Failed to add player.", true);
      }
    });
  }

  const clubForm = document.getElementById("clubForm");
  if (clubForm) {
    clubForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      try {
        const logoFile = document.getElementById("clubLogo").files[0];
        const logoData = await readFileAsDataURL(logoFile);

        const name = document.getElementById("clubName").value.trim();
        const league = document.getElementById("clubLeague").value;
        const country = document.getElementById("clubCountry").value.trim();
        const area = document.getElementById("clubArea").value.trim();
        const founded = document.getElementById("clubFounded").value;
        const kitColors = document.getElementById("clubKitColors").value.trim();

        if (!name || !country || !area || !founded || !kitColors) {
          showAdminMessage("Please fill all required club fields.", true);
          return;
        }

        const clubs = getStorage("twf_clubs");
        clubs.push({
          name,
          logo: logoData,
          league,
          country,
          area,
          founded,
          kitColors
        });

        setStorage("twf_clubs", clubs);
        clubForm.reset();
        renderClubsList();
        populateClubOptions();
        renderPublicClubs();
        showAdminMessage("Club added successfully.");
      } catch (error) {
        console.error("Club form error:", error);
        showAdminMessage("Failed to add club.", true);
      }
    });
  }

  const leagueForm = document.getElementById("leagueForm");
  if (leagueForm) {
    leagueForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      try {
        const logoFile = document.getElementById("leagueLogo").files[0];
        const logoData = await readFileAsDataURL(logoFile);

        const name = document.getElementById("leagueName").value.trim();
        const level = document.getElementById("leagueLevel").value.trim();
        const founded = document.getElementById("leagueFounded").value;
        const country = document.getElementById("leagueCountry").value.trim();

        if (!name || !level || !founded || !country) {
          showAdminMessage("Please fill all required league fields.", true);
          return;
        }

        const leagues = getStorage("twf_leagues");
        leagues.push({
          name,
          logo: logoData,
          level,
          founded,
          country
        });

        setStorage("twf_leagues", leagues);
        leagueForm.reset();
        renderLeaguesList();
        populateLeagueOptions();
        renderPublicLeagues();
        showAdminMessage("League added successfully.");
      } catch (error) {
        console.error("League form error:", error);
        showAdminMessage("Failed to add league.", true);
      }
    });
  }
}

/* ADMIN LISTS */

function renderPlayersList() {
  const container = document.getElementById("playersList");
  if (!container) return;

  const players = getStorage("twf_players");

  container.innerHTML = players.length
    ? players.map((player, index) => `
      <div class="admin-simple-item">
        <div class="admin-thumb-box admin-thumb-placeholder">P</div>
        <div class="admin-simple-content">
          <strong>${player.name || "-"}</strong>
          <p>${player.position || "-"} • ${player.club || "-"} • No. ${player.shirtNumber || "-"}</p>
          <p>DOB: ${player.dob || "-"} • Age: ${player.age || "-"}</p>
          <p>Apps: ${player.appearances || 0} • Goals: ${player.goals || 0} • Assists: ${player.assists || 0}</p>
          <p>TWF Value: ${player.value || 0}</p>
        </div>
        <button class="delete-btn" onclick="deletePlayer(${index})">Delete</button>
      </div>
    `).join("")
    : `<p class="empty-text">No players added yet.</p>`;
}

function renderClubsList() {
  const container = document.getElementById("clubsList");
  if (!container) return;

  const clubs = getStorage("twf_clubs");

  container.innerHTML = clubs.length
    ? clubs.map((club, index) => `
      <div class="admin-simple-item">
        <div class="admin-thumb-box admin-thumb-placeholder">C</div>
        <div class="admin-simple-content">
          <strong>${club.name || "-"}</strong>
          <p>League: ${club.league || "Not assigned"}</p>
          <p>${club.country || "-"} • ${club.area || "-"}</p>
          <p>Founded: ${club.founded || "-"}</p>
          <p>Kit Colours: ${club.kitColors || "-"}</p>
        </div>
        <button class="delete-btn" onclick="deleteClub(${index})">Delete</button>
      </div>
    `).join("")
    : `<p class="empty-text">No clubs added yet.</p>`;
}

function renderLeaguesList() {
  const container = document.getElementById("leaguesList");
  if (!container) return;

  const leagues = getStorage("twf_leagues");

  container.innerHTML = leagues.length
    ? leagues.map((league, index) => `
      <div class="admin-simple-item">
        <div class="admin-thumb-box admin-thumb-placeholder">L</div>
        <div class="admin-simple-content">
          <strong>${league.name || "-"}</strong>
          <p>Level: ${league.level || "-"}</p>
          <p>Founded: ${league.founded || "-"}</p>
          <p>Country: ${league.country || "-"}</p>
        </div>
        <button class="delete-btn" onclick="deleteLeague(${index})">Delete</button>
      </div>
    `).join("")
    : `<p class="empty-text">No leagues added yet.</p>`;
}

/* PUBLIC CARDS */

function getImageBackground(image) {
  if (!image) return "";
  return `style='background-image: url("${image}");'`;
}

function renderPublicPlayers() {
  const grid = document.getElementById("playersGrid");
  const homeGrid = document.getElementById("homePlayersGrid");
  const players = getStorage("twf_players");

  const card = (player, index) => `
    <article class="data-card" onclick="openPlayer(${index})" style="cursor:pointer;">
      <div class="data-card-media" ${player.image ? `style='background-image:url("${player.image}")'` : ""}></div>
      <div class="data-card-body">
        <h3 class="data-card-title">${player.name || "-"}</h3>
        <p class="data-card-subtitle">${player.position || "-"} • ${player.club || "-"}</p>
        <div class="data-card-stats">
          <p>Age: ${player.age || "-"}</p>
          <p>No. ${player.shirtNumber || "-"}</p>
          <p>Apps: ${player.appearances || 0} • Goals: ${player.goals || 0} • Assists: ${player.assists || 0}</p>
        </div>
        <span class="data-card-value">TWF Value: ${player.value || 0}</span>
      </div>
    </article>
  `;

  if (grid) {
    grid.innerHTML = players.length
      ? players.map((player, index) => card(player, index)).join("")
      : `<div class="data-card-empty">No players added yet.</div>`;
  }

  if (homeGrid) {
    homeGrid.innerHTML = players.length
      ? players.slice(0, 3).map((player, index) => card(player, index)).join("")
      : `<div class="data-card-empty">No players added yet.</div>`;
  }
}

function renderPublicClubs() {
  const grid = document.getElementById("clubsGrid");
  const homeGrid = document.getElementById("homeClubsGrid");
  const clubs = getStorage("twf_clubs");

  const card = (club) => `
    <article class="data-card" onclick="openClub(${index})" style="cursor:pointer;">
      <div class="data-card-media logo" ${club.logo ? `style='background-image:url("${club.logo}")'` : ""}></div>
      <div class="data-card-body">
        <h3 class="data-card-title">${club.name || "-"}</h3>
        <p class="data-card-subtitle">${club.country || "-"} • ${club.area || "-"}</p>
        <div class="data-card-stats">
          <p>League: ${club.league || "Not assigned"}</p>
          <p>Founded: ${club.founded || "-"}</p>
          <p>Kit Colours: ${club.kitColors || "-"}</p>
        </div>
      </div>
    </article>
  `;

  if (grid) {
    grid.innerHTML = clubs.length
      ? clubs.map((club) => card(club)).join("")
      : `<div class="data-card-empty">No clubs added yet.</div>`;
  }

  if (homeGrid) {
    homeGrid.innerHTML = clubs.length
      ? clubs.slice(0, 3).map((club) => card(club)).join("")
      : `<div class="data-card-empty">No clubs added yet.</div>`;
  }
}

function renderPublicLeagues() {
  const grid = document.getElementById("leaguesGrid");
  const homeGrid = document.getElementById("homeLeaguesGrid");
  const leagues = getStorage("twf_leagues");

  const card = (league) => `
    <article class="data-card">
      <div class="data-card-media logo" ${league.logo ? `style='background-image:url("${league.logo}")'` : ""}></div>
      <div class="data-card-body">
        <h3 class="data-card-title">${league.name || "-"}</h3>
        <p class="data-card-subtitle">${league.country || "-"}</p>
        <div class="data-card-stats">
          <p>Level: ${league.level || "-"}</p>
          <p>Founded: ${league.founded || "-"}</p>
        </div>
      </div>
    </article>
  `;

  if (grid) {
    grid.innerHTML = leagues.length
      ? leagues.map((league) => card(league)).join("")
      : `<div class="data-card-empty">No leagues added yet.</div>`;
  }

  if (homeGrid) {
    homeGrid.innerHTML = leagues.length
      ? leagues.slice(0, 3).map((league) => card(league)).join("")
      : `<div class="data-card-empty">No leagues added yet.</div>`;
  }
}
function renderPlayerProfile() {
  const container = document.getElementById("playerProfile");
  if (!container) return;

  const player = JSON.parse(localStorage.getItem("twf_selected_player"));

  if (!player) {
    container.innerHTML = `<p class="data-card-empty">Player not found.</p>`;
    return;
  }

  container.innerHTML = `
    <div class="player-profile">
      
      <div class="player-profile-header">
        <div class="player-profile-image" 
          style="${player.image ? `background-image: url('${player.image}');` : ''}">
        </div>

        <div class="player-profile-main">
          <h1>${player.name}</h1>
          <p>${player.position} • ${player.club}</p>

          <div class="player-profile-meta">
            <span>Age: ${player.age}</span>
            <span>No. ${player.shirtNumber}</span>
          </div>

          <div class="player-profile-value">
            TWF Value: ${player.value}
          </div>
        </div>
      </div>

      <div class="player-profile-stats">
        <div class="stat-box">
          <p>Appearances</p>
          <strong>${player.appearances}</strong>
        </div>

        <div class="stat-box">
          <p>Goals</p>
          <strong>${player.goals}</strong>
        </div>

        <div class="stat-box">
          <p>Assists</p>
          <strong>${player.assists}</strong>
        </div>
      </div>

      <div class="player-profile-info">
        <p><strong>Date of Birth:</strong> ${player.dob}</p>
        <p><strong>Club:</strong> ${player.club}</p>
        <p><strong>Position:</strong> ${player.position}</p>
      </div>

    </div>
  `;
}
function openPlayer(index) {
  const players = getStorage("twf_players");
  const player = players[index];

  localStorage.setItem("twf_selected_player", JSON.stringify(player));
  window.location.href = "player.html";
}
function openClub(index) {
  const clubs = getStorage("twf_clubs");
  const club = clubs[index];

  localStorage.setItem("twf_selected_club", JSON.stringify(club));

  window.location.href = "club.html";
}
function renderClubProfile() {
  const container = document.getElementById("clubProfile");
  if (!container) return;

  const club = JSON.parse(localStorage.getItem("twf_selected_club"));

  if (!club) {
    container.innerHTML = `<p class="data-card-empty">Club not found.</p>`;
    return;
  }

  container.innerHTML = `
    <div class="player-profile">

      <div class="player-profile-header">
        <div class="player-profile-image"
          style="${club.logo ? `background-image:url('${club.logo}')` : ''}">
        </div>

        <div class="player-profile-main">
          <h1>${club.name}</h1>
          <p>${club.country} • ${club.area}</p>

          <div class="player-profile-meta">
            <span>Founded: ${club.founded}</span>
            <span>${club.league || "No league"}</span>
          </div>
        </div>
      </div>

      <div class="player-profile-info">
        <p><strong>Country:</strong> ${club.country}</p>
        <p><strong>Area:</strong> ${club.area}</p>
        <p><strong>League:</strong> ${club.league || "Not assigned"}</p>
        <p><strong>Kit Colours:</strong> ${club.kitColors}</p>
      </div>

    </div>
  `;
}
document.addEventListener("DOMContentLoaded", function () {
  try {
    createSeedData();
    setupAgeCalculation();
    populateClubOptions();
    populateLeagueOptions();
    setupForms();

    renderPlayersList();
    renderClubsList();
    renderLeaguesList();

    renderPublicPlayers();
    renderPublicClubs();
    renderPublicLeagues();
    
    renderPlayerProfile();
    renderClubProfile();

    console.log("TWF loaded successfully");
  } catch (error) {
    console.error("Init error:", error);
    showAdminMessage("There is a setup error in the admin panel.", true);
  }
});
