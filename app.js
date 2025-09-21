// ==================== GLOBAL VARIABLES ====================
let resources = [
  { id: 1, title: "HTML Basics", type: "article", skill: "Web Development", url: "https://www.w3schools.com/html/" },
  { id: 2, title: "CSS Flexbox Video", type: "video", skill: "Web Development", url: "https://www.youtube.com/watch?v=JJSoEo8JSnc" },
  { id: 3, title: "JavaScript Quiz", type: "exercise", skill: "Web Development", url: "https://www.w3schools.com/js/js_quiz.asp" },
  // Python
  { id: 4, title: "Python Basics", type: "article", skill: "Python", url: "https://www.w3schools.com/python/" },
  { id: 5, title: "Python Functions Video", type: "video", skill: "Python", url: "https://www.youtube.com/watch?v=9Os0o3wzS_I" },
  { id: 6, title: "Python Quiz", type: "exercise", skill: "Python", url: "https://www.w3schools.com/python/python_quiz.asp" },

  // Data Science
  { id: 7, title: "Intro to Data Science", type: "article", skill: "Data Science", url: "https://www.datasciencecentral.com/" },
  { id: 8, title: "Data Science Project Video", type: "video", skill: "Data Science", url: "https://www.youtube.com/watch?v=ua-CiDNNj30" },
  { id: 9, title: "Data Science Quiz", type: "exercise", skill: "Data Science", url: "https://www.proprofs.com/quiz-school/story.php?title=data-science-quiz" },
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
    <h3><a href="${r.url}" target="_blank">${r.title}</a></h3>
    <p>Type: ${r.type}</p>
    <p>Skill: ${r.skill}</p>
  `;

  const btn = document.createElement("button");

  if (user) {
    btn.innerText = completed ? "Completed ✅" : "Mark as Complete";
    btn.addEventListener("click", () => toggleProgress(r.id));
  } else {
    btn.innerText = "Sign in to track progress";
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

  // Group progress by skill
  const skillMap = {};
  resources.forEach(r => {
    if (progress[r.id]) {
      if (!skillMap[r.skill]) skillMap[r.skill] = { completed: 0, total: 0 };
      skillMap[r.skill].completed++;
    }
    if (!skillMap[r.skill]) skillMap[r.skill] = { completed: 0, total: 0 };
    skillMap[r.skill].total++;
  });

  const skillsStarted = Object.keys(skillMap).filter(skill => skillMap[skill].completed > 0);

  if (skillsStarted.length === 0) {
    container.innerHTML = "<p>No progress yet. Explore resources to start learning!</p>";
    return;
  }

  container.innerHTML = ""; // clear

  skillsStarted.forEach(skill => {
    const card = document.createElement("div");
    card.classList.add("skill-card");
    card.innerHTML = `
      <h3>${skill}</h3>
      <p>Progress: ${skillMap[skill].completed} / ${skillMap[skill].total} resources completed</p>
    `;
    container.appendChild(card);
  });
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
