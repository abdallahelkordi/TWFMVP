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

function renderPlayersList() {
  const container = document.getElementById("playersList");
  if (!container) return;

  const players = getStorage("twf_players");

  container.innerHTML = players.length
    ? players.map((player, index) => `
      <div class="admin-simple-item">
        ${player.image ? `<img src="${player.image}" alt="${player.name}" class="admin-thumb" />` : `<div class="admin-thumb admin-thumb-placeholder">P</div>`}
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
        ${club.logo ? `<img src="${club.logo}" alt="${club.name}" class="admin-thumb" />` : `<div class="admin-thumb admin-thumb-placeholder">C</div>`}
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
        ${league.logo ? `<img src="${league.logo}" alt="${league.name}" class="admin-thumb" />` : `<div class="admin-thumb admin-thumb-placeholder">L</div>`}
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
        showAdminMessage("League added successfully.");
      } catch (error) {
        console.error("League form error:", error);
        showAdminMessage("Failed to add league.", true);
      }
    });
  }
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
    console.log("TWF admin loaded successfully");
  } catch (error) {
    console.error("Init error:", error);
    showAdminMessage("There is a setup error in the admin panel.", true);
  }
});
