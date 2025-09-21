// ==================== GLOBAL VARIABLES ====================
let resources = [
  { id: 1, title: "HTML Basics", type: "article", skill: "Web Development" },
  { id: 2, title: "CSS Flexbox Video", type: "video", skill: "Web Development" },
  { id: 3, title: "JavaScript Quiz", type: "exercise", skill: "Web Development" },
];

let user = JSON.parse(localStorage.getItem("user")) || null;
let progress = JSON.parse(localStorage.getItem("progress")) || {}; // { resourceId: true }

// ==================== NAVBAR ====================
function renderNavbar() {
  const navRight = document.getElementById("navbar-right");
  if (!navRight) return;

  navRight.innerHTML = ""; // clear previous content

  if (user) {
    // Create profile dropdown HTML
    navRight.innerHTML = `
      <div class="profile-dropdown">
        <button id="profileBtn" class="profile-icon">${user.name[0].toUpperCase()}</button>
        <div id="dropdownMenu" class="dropdown-content">
          <a href="mylearning.html">My Learning</a>
          <a href="settings.html">Settings</a>
          <button id="logoutBtn">Sign Out</button>
        </div>
      </div>
    `;

    const profileBtn = document.getElementById("profileBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const logoutBtn = document.getElementById("logoutBtn");

    // Toggle dropdown on click
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent closing immediately
      dropdownMenu.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        dropdownMenu.classList.remove("show");
      }
    });

    // Logout functionality
    logoutBtn.addEventListener("click", () => {
      logout();
      dropdownMenu.classList.remove("show");
    });

  } else {
    // Show Sign In button
    const btn = document.createElement("button");
    btn.classList.add("signin-btn");
    btn.innerText = "Sign In";
    btn.addEventListener("click", openLogin);
    navRight.appendChild(btn);
  }
}

// ==================== LOGIN FUNCTIONS ====================
function openLogin() {
  const modal = document.getElementById("login-modal");
  if (!modal) {
    console.error("Login modal element not found!");
    return;
  }
  modal.style.display = "flex";
}

function closeLogin() {
  const modal = document.getElementById("login-modal");
  if (modal) modal.style.display = "none";
}

function login() {
  const username = document.getElementById("username").value.trim();
  if (!username) return;

  user = { name: username };
  localStorage.setItem("user", JSON.stringify(user));
  closeLogin();
  renderNavbar();
  renderHome();
  renderResources();
  renderMyLearning();
}

function logout() {
  user = null;
  progress = {};
  localStorage.removeItem("user");
  localStorage.removeItem("progress");
  renderNavbar();
  renderHome();
  renderResources();
  renderMyLearning();
}

// ==================== HOME PAGE ====================
function renderHome() {
  const container = document.getElementById("home-content");
  if (!container) return;

  if (user) {
    container.innerHTML = `
      <h2>Welcome back, ${user.name}!</h2>
      <p>Your current path: Web Development</p>
      <a href="mylearning.html">Continue Learning</a>
    `;
  } else {
    container.innerHTML = `<button onclick="openLogin()">Sign in to track progress</button>`;
  }
}

// ==================== EXPLORE PAGE ====================

function renderResources() {
  const container = document.getElementById("resources");
  if (!container) return;

  const filterTypeEl = document.getElementById("filter-type");
  const filterSkillEl = document.getElementById("filter-skill");

  const filterType = filterTypeEl ? filterTypeEl.value : "all";
  const filterSkill = filterSkillEl ? filterSkillEl.value : "";

  // Filter resources
  let filtered = resources;

  if (filterType !== "all") {
    filtered = filtered.filter(r => r.type === filterType);
  }

 if (filterSkill === "") {
  container.innerHTML = "<p>Please choose a skill to see resources.</p>";
  return; // stop rendering further
} else {
  filtered = filtered.filter(r => r.skill === filterSkill);
}


  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = "<p>No resources found for selected filters.</p>";
    return;
  }

  // Render resource cards
  filtered.forEach(r => {
    const completed = progress[r.id];
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h3>${r.title}</h3>
      <p>Type: ${r.type}</p>
      <p>Skill: ${r.skill}</p>
    `;

    const btn = document.createElement("button");

    if (user) {
      btn.innerText = completed ? "Completed ✅" : "Mark as Complete";
      btn.addEventListener("click", () => toggleProgress(r.id));
    } else {
      btn.innerText = "Sign in to track progress";
      // FIX: attach click listener directly
      btn.addEventListener("click", openLogin);
    }

    card.appendChild(btn);
    container.appendChild(card);
  });
}

// ==================== MY LEARNING PAGE ====================
function renderMyLearning() {
  const container = document.getElementById("my-learning");
  if (!container) return;

  if (!user) {
    container.innerHTML = "<p>Please sign in to see your learning progress.</p>";
    return;
  }

  const learned = resources.filter(r => progress[r.id]);
  if (learned.length === 0) {
    container.innerHTML = "<p>No progress yet. Explore resources to start learning!</p>";
    return;
  }

  container.innerHTML = learned.map(r => `<p>${r.title} ✅</p>`).join("");
}

// ==================== PROGRESS HANDLING ====================
function toggleProgress(id) {
  progress[id] = !progress[id];
  localStorage.setItem("progress", JSON.stringify(progress));
  renderResources();
  renderMyLearning();
}

// ==================== INITIALIZATION ====================
window.onload = () => {
  renderNavbar();
  renderHome();
  renderResources();
  renderMyLearning();
};
