function getStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function createSeedData() {
  if (!localStorage.getItem("twf_players")) {
    setStorage("twf_players", [
      {
        name: "Aya Kamel",
        age: 21,
        position: "Forward",
        country: "Egypt",
        club: "FC Cairo Women",
        status: "Rising Talent",
        description: "A mobile attacking profile with strong upside and final-third threat."
      },
      {
        name: "Lina Mostafa",
        age: 24,
        position: "Midfielder",
        country: "Egypt",
        club: "Alexandria SC",
        status: "Established Profile",
        description: "A composed midfield presence with leadership and tactical intelligence."
      }
    ]);
  }

  if (!localStorage.getItem("twf_clubs")) {
    setStorage("twf_clubs", [
      {
        name: "FC Cairo Women",
        country: "Egypt",
        level: "Premier Level",
        focus: "Growth Club",
        description: "An ambitious club profile centered around growth and future commercial value."
      },
      {
        name: "Alexandria SC",
        country: "Egypt",
        level: "Competitive Level",
        focus: "Structured Development",
        description: "A club environment with talent depth and increasing market relevance."
      }
    ]);
  }

  if (!localStorage.getItem("twf_leagues")) {
    setStorage("twf_leagues", [
      {
        name: "Egypt Women’s Premier League",
        region: "Egypt",
        level: "Top Division",
        description: "Main launch market for the TWF MVP."
      }
    ]);
  }
}

function renderPlayersList() {
  const container = document.getElementById("playersList");
  if (!container) return;

  const players = getStorage("twf_players");
  container.innerHTML = players.length
    ? players.map((player, index) => `
      <div class="admin-item">
        <div>
          <strong>${player.name}</strong>
          <p>${player.position} • ${player.country} • ${player.age}</p>
          <p>Club: ${player.club}</p>
          <p>Status: ${player.status}</p>
          <p>${player.description}</p>
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
      <div class="admin-item">
        <div>
          <strong>${club.name}</strong>
          <p>${club.country} • ${club.level}</p>
          <p>Focus: ${club.focus}</p>
          <p>${club.description}</p>
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
      <div class="admin-item">
        <div>
          <strong>${league.name}</strong>
          <p>${league.region} • ${league.level}</p>
          <p>${league.description}</p>
        </div>
        <button class="delete-btn" onclick="deleteLeague(${index})">Delete</button>
      </div>
    `).join("")
    : `<p class="empty-text">No leagues added yet.</p>`;
}

function deletePlayer(index) {
  const players = getStorage("twf_players");
  players.splice(index, 1);
  setStorage("twf_players", players);
  renderPlayersList();
}

function deleteClub(index) {
  const clubs = getStorage("twf_clubs");
  clubs.splice(index, 1);
  setStorage("twf_clubs", clubs);
  renderClubsList();
}

function deleteLeague(index) {
  const leagues = getStorage("twf_leagues");
  leagues.splice(index, 1);
  setStorage("twf_leagues", leagues);
  renderLeaguesList();
}

function clearPlayers() {
  setStorage("twf_players", []);
  renderPlayersList();
}

function clearClubs() {
  setStorage("twf_clubs", []);
  renderClubsList();
}

function clearLeagues() {
  setStorage("twf_leagues", []);
  renderLeaguesList();
}

function setupForms() {
  const playerForm = document.getElementById("playerForm");
  if (playerForm) {
    playerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const players = getStorage("twf_players");
      players.push({
        name: document.getElementById("playerName").value,
        age: document.getElementById("playerAge").value,
        position: document.getElementById("playerPosition").value,
        country: document.getElementById("playerCountry").value,
        club: document.getElementById("playerClub").value,
        status: document.getElementById("playerStatus").value,
        description: document.getElementById("playerDescription").value
      });

      setStorage("twf_players", players);
      playerForm.reset();
      renderPlayersList();
    });
  }

  const clubForm = document.getElementById("clubForm");
  if (clubForm) {
    clubForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const clubs = getStorage("twf_clubs");
      clubs.push({
        name: document.getElementById("clubName").value,
        country: document.getElementById("clubCountry").value,
        level: document.getElementById("clubLevel").value,
        focus: document.getElementById("clubFocus").value,
        description: document.getElementById("clubDescription").value
      });

      setStorage("twf_clubs", clubs);
      clubForm.reset();
      renderClubsList();
    });
  }

  const leagueForm = document.getElementById("leagueForm");
  if (leagueForm) {
    leagueForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const leagues = getStorage("twf_leagues");
      leagues.push({
        name: document.getElementById("leagueName").value,
        region: document.getElementById("leagueRegion").value,
        level: document.getElementById("leagueLevel").value,
        description: document.getElementById("leagueDescription").value
      });

      setStorage("twf_leagues", leagues);
      leagueForm.reset();
      renderLeaguesList();
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  createSeedData();
  setupForms();
  renderPlayersList();
  renderClubsList();
  renderLeaguesList();
});
