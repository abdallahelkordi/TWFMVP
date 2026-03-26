function getStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
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
  return new Promise((resolve) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });
}

function createSeedData() {
  if (!localStorage.getItem("twf_leagues")) {
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

  if (!localStorage.getItem("twf_clubs")) {
    setStorage("twf_clubs", [
      {
        name: "FC Cairo Women",
        logo: "",
        league: "Egypt Women’s Premier League",
        country: "Egypt",
        area: "Cairo",
        founded: 2018,
        kitColors: "Green and White"
      },
      {
        name: "Alexandria SC",
        logo: "",
        league: "Egypt Women’s Premier League",
        country: "Egypt",
        area: "Alexandria",
        founded: 2015,
        kitColors: "Blue and White"
      }
    ]);
  }

  if (!localStorage.getItem("twf_players")) {
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

function renderPlayersList() {
  const container = document.getElementById("playersList");
  if (!container) return;

  const players = getStorage("twf_players");
  container.innerHTML = players.length
    ? players.map((player, index) => `
      <div class="admin-item">
        <div class="admin-item-main">
          ${player.image ? `<img src="${player.image}" alt="${player.name}" class="admin-thumb">` : ""}
          <div>
            <strong>${player.name}</strong>
            <p>DOB: ${player.dob} • Age: ${player.age}</p>
            <p>Club: ${player.club}</p>
            <p>Position: ${player.position} • No. ${player.shirtNumber}</p>
            <p>Apps: ${player.appearances} • Goals: ${player.goals} • Assists: ${player.assists}</p>
            <p>TWF Value: ${player.value}</p>
          </div>
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
        <div class="admin-item-main">
          ${club.logo ? `<img src="${club.logo}" alt="${club.name}" class="admin-thumb">` : ""}
          <div>
            <strong>${club.name}</strong>
            <p>League: ${club.league || "Not assigned"}</p>
            <p>${club.country} • ${club.area}</p>
            <p>Founded: ${club.founded}</p>
            <p>Kit Colours: ${club.kitColors}</p>
          </div>
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
        <div class="admin-item-main">
          ${league.logo ? `<img src="${league.logo}" alt="${league.name}" class="admin-thumb">` : ""}
          <div>
            <strong>${league.name}</strong>
            <p>Level: ${league.level}</p>
            <p>Founded: ${league.founded}</p>
            <p>Country: ${league.country}</p>
          </div>
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
  populateClubOptions();
}

function deleteLeague(index) {
  const leagues = getStorage("twf_leagues");
  leagues.splice(index, 1);
  setStorage("twf_leagues", leagues);
  renderLeaguesList();
  populateLeagueOptions();
}

function clearPlayers() {
  setStorage("twf_players", []);
  renderPlayersList();
}

function clearClubs() {
  setStorage("twf_clubs", []);
  renderClubsList();
  populateClubOptions();
}

function clearLeagues() {
  setStorage("twf_leagues", []);
  renderLeaguesList();
  populateLeagueOptions();
}

function setupAgeCalculation() {
  const dobInput = document.getElementById("playerDob");
  const ageInput = document.getElementById("playerAge");

  if (!dobInput || !ageInput) return;

  dobInput.addEventListener("change", function () {
    ageInput.value = calculateAge(dobInput.value);
  });
}

function setupForms() {
  const playerForm = document.getElementById("playerForm");
  if (playerForm) {
    playerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const imageFile = document.getElementById("playerImage").files[0];
      const imageData = await readFileAsDataURL(imageFile);

      const players = getStorage("twf_players");
      players.push({
        name: document.getElementById("playerName").value,
        dob: document.getElementById("playerDob").value,
        age: document.getElementById("playerAge").value,
        club: document.getElementById("playerClub").value,
        position: document.getElementById("playerPosition").value,
        shirtNumber: document.getElementById("playerNumber").value,
        appearances: document.getElementById("playerAppearances").value,
        goals: document.getElementById("playerGoals").value,
        assists: document.getElementById("playerAssists").value,
        value: document.getElementById("playerValue").value,
        image: imageData
      });

      setStorage("twf_players", players);
      playerForm.reset();
      document.getElementById("playerAge").value = "";
      renderPlayersList();
    });
  }

  const clubForm = document.getElementById("clubForm");
  if (clubForm) {
    clubForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const logoFile = document.getElementById("clubLogo").files[0];
      const logoData = await readFileAsDataURL(logoFile);

      const clubs = getStorage("twf_clubs");
      clubs.push({
        name: document.getElementById("clubName").value,
        logo: logoData,
        league: document.getElementById("clubLeague").value,
        country: document.getElementById("clubCountry").value,
        area: document.getElementById("clubArea").value,
        founded: document.getElementById("clubFounded").value,
        kitColors: document.getElementById("clubKitColors").value
      });

      setStorage("twf_clubs", clubs);
      clubForm.reset();
      renderClubsList();
      populateClubOptions();
    });
  }

  const leagueForm = document.getElementById("leagueForm");
  if (leagueForm) {
    leagueForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const logoFile = document.getElementById("leagueLogo").files[0];
      const logoData = await readFileAsDataURL(logoFile);

      const leagues = getStorage("twf_leagues");
      leagues.push({
        name: document.getElementById("leagueName").value,
        logo: logoData,
        level: document.getElementById("leagueLevel").value,
        founded: document.getElementById("leagueFounded").value,
        country: document.getElementById("leagueCountry").value
      });

      setStorage("twf_leagues", leagues);
      leagueForm.reset();
      renderLeaguesList();
      populateLeagueOptions();
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  createSeedData();
  setupAgeCalculation();
  populateClubOptions();
  populateLeagueOptions();
  setupForms();
  renderPlayersList();
  renderClubsList();
  renderLeaguesList();
});
