// ==================== GLOBAL VARIABLES ====================

let resources = [
  // Web Development
  { id: 1, title: "HTML Basics", type: "article", skill: "Web Development", level: "Basic", url: "https://www.w3schools.com/html/" },
  { id: 1, title: "HTML Basics", type: "article", skill: "Web Development", level: "Basic", url: "https://www.w3schools.com/html/" },
  { id: 2, title: "CSS Flexbox Video", type: "video", skill: "Web Development", level: "Intermediate", url: "https://www.youtube.com/watch?v=JJSoEo8JSnc" },
  { id: 3, title: "JavaScript Quiz", type: "exercise", skill: "Web Development", level: "Advanced", url: "https://www.w3schools.com/js/js_quiz.asp" },

  // Python
  { id: 4, title: "Python Basics", type: "article", skill: "Python", level: "Basic", url: "https://www.w3schools.com/python/" },
  { id: 5, title: "Python Functions Video", type: "video", skill: "Python", level: "Intermediate", url: "https://www.youtube.com/watch?v=9Os0o3wzS_I" },
  { id: 6, title: "Python Quiz", type: "exercise", skill: "Python", level: "Advanced", url: "https://www.w3schools.com/python/python_quiz.asp" },

  // Data Science
  { id: 7, title: "Intro to Data Science", type: "article", skill: "Data Science", level: "Basic", url: "https://www.datasciencecentral.com/" },
  { id: 8, title: "Data Science Project Video", type: "video", skill: "Data Science", level: "Intermediate", url: "https://www.youtube.com/watch?v=ua-CiDNNj30" },
  { id: 9, title: "Data Science Quiz", type: "exercise", skill: "Data Science", level: "Advanced", url: "https://www.proprofs.com/quiz-school/story.php?title=data-science-quiz" },
];

let user = JSON.parse(localStorage.getItem("user")) || null;
let progress = JSON.parse(localStorage.getItem("progress")) || {}; // { resourceId: true }

// ==================== NAVBAR ====================
function renderNavbar() {
  const navRight = document.getElementById("navbar-right");
  if (!navRight) return;
  navRight.innerHTML = "";

  if (user) {
    // Logged-in: show profile and sign out
    navRight.innerHTML = `
      <div class="profile-dropdown">
        <button id="profileBtn" class="profile-icon">${user.email[0].toUpperCase()}</button>
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

    profileBtn.addEventListener("click", e => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", e => {
      if (!e.target.closest(".profile-dropdown")) dropdownMenu.classList.remove("show");
    });

    logoutBtn.addEventListener("click", () => {
      logout();
      dropdownMenu.classList.remove("show");
    });
  } else {
    // Guest: show Sign In button
    const btn = document.createElement("button");
    btn.classList.add("signin-btn");
    btn.innerText = "Sign In";
    btn.addEventListener("click", openLogin);
    navRight.appendChild(btn);
  }
}

// ==================== LOGIN FUNCTIONS ====================
function openLogin() {
  document.getElementById("login-modal").style.display = "flex";
}

function closeLogin() {
  document.getElementById("login-modal").style.display = "none";
}

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  user = { email };
  localStorage.setItem("user", JSON.stringify(user));

  closeLogin();
  renderNavbar();
  document.getElementById("guest-content").style.display = "none";
  document.getElementById("user-content").style.display = "block";

  document.getElementById("username").textContent = email.split("@")[0];
  document.getElementById("login-form").reset();
}

function logout() {
  user = null;
  localStorage.removeItem("user");

  renderNavbar();
  document.getElementById("guest-content").style.display = "block";
  document.getElementById("user-content").style.display = "none";
}
// ==================== HOME PAGE ====================
function renderHome() {
  const container = document.getElementById("home-content");
  if (!container) return;
  container.innerHTML = "";

  const totalResources = resources.length;
  const completedResources = Object.values(progress).filter(Boolean).length;
  const progressPercent = totalResources === 0 ? 0 : Math.round((completedResources / totalResources) * 100);

  if (user) {
    container.innerHTML = `
      <section class="hero">
        <h1>Welcome back, ${user.name} 👋</h1>
        <p>Pick up where you left off and continue your journey!</p>
        <button class="cta-btn" onclick="window.location.href='mylearning.html'">Go to Dashboard</button>
      </section>

      <section class="progress">
        <h2>Your Overall Progress</h2>
        <div class="progress-container">
          <div class="progress-bar" style="width: ${progressPercent}%"></div>
        </div>
        <p class="progress-text">${completedResources} of ${totalResources} resources completed (${progressPercent}%)</p>
      </section>
    `;

    // Learning path cards
    const skills = ["Web Development", "Python", "Data Science"];
    const pathContainer = document.createElement("div");
    pathContainer.classList.add("learning-path");

    skills.forEach(skill => {
      const skillResources = resources.filter(r => r.skill === skill);
      const completedCount = skillResources.filter(r => progress[r.id]).length;
      const totalCount = skillResources.length;

      const card = document.createElement("div");
      card.classList.add("path-card");
      card.innerHTML = `
        <h3>${skill}</h3>
        <p>Progress: ${completedCount} / ${totalCount}</p>
        <button onclick="window.location.href='explore.html'">Explore ${skill}</button>
      `;
      pathContainer.appendChild(card);
    });

    container.appendChild(pathContainer);

    // Dynamic Recommendations
    const recSection = document.createElement("section");
    recSection.classList.add("recommend");
    const unfinished = resources.filter(r => !progress[r.id]);
    recSection.innerHTML = `
      <h2>Recommended for You</h2>
      <div class="course-grid">
        ${unfinished.slice(0,3).map(r => `<div class="course-card">${r.title}</div>`).join('')}
      </div>
    `;
    container.appendChild(recSection);
  } else {
    container.innerHTML = `
      <section class="hero">
        <h1>Learn Tech Skills Faster</h1>
        <p>Interactive courses & hands-on practice for real-world growth.</p>
        <button class="cta-btn" onclick="openLogin()">Get Started Free</button>
      </section>

      <section class="featured">
        <h2>Featured Courses</h2>
        <div class="course-grid">
          <div class="course-card">Java Basics</div>
          <div class="course-card">Web Development</div>
          <div class="course-card">Data Science</div>
        </div>
      </section>

      <section class="categories">
        <h2>Explore Categories</h2>
        <div class="cat-grid">
          <div class="cat">Programming</div>
          <div class="cat">Cloud</div>
          <div class="cat">Cybersecurity</div>
          <div class="cat">Design</div>
        </div>
      </section>

      <section class="why-us">
        <h2>Why Choose Us?</h2>
        <ul>
          <li>Hands-on Projects</li>
          <li>Expert Instructors</li>
          <li>Track Your Progress</li>
          <li>Learn at Your Own Pace</li>
        </ul>
      </section>
    `;
  }
}

// ==================== EXPLORE PAGE ====================
function renderExplore() {
  const skillDropdown = document.getElementById("filter-skill");
  if (!skillDropdown) return;

  skillDropdown.value = "";
  document.getElementById("level-cards").innerHTML = "";
  document.getElementById("level-resources").innerHTML = "";
}

function showLevelCards() {
  const skill = document.getElementById("filter-skill").value;
  const levelContainer = document.getElementById("level-cards");
  const resourceContainer = document.getElementById("level-resources");
  levelContainer.innerHTML = "";
  resourceContainer.innerHTML = "";
  if (!skill) return;

  const levels = ["Basic", "Intermediate", "Advanced"];
  levels.forEach(level => {
    const levelResources = resources.filter(r => r.skill === skill && r.level === level);
    const completedCount = levelResources.filter(r => progress[r.id]).length;

    const levelCard = document.createElement("div");
    levelCard.classList.add("level-card");
    levelCard.innerHTML = `
      <h3>${level}</h3>
      <p>Progress: ${completedCount} / ${levelResources.length}</p>
    `;
    levelCard.addEventListener("click", () => showResources(skill, level));
    levelContainer.appendChild(levelCard);
  });
}

function showResources(skill, level) {
  const container = document.getElementById("level-resources");
  container.innerHTML = `<h3>${skill} - ${level} Resources</h3>`;
  const filtered = resources.filter(r => r.skill === skill && r.level === level);
  if (filtered.length === 0) {
    container.innerHTML += "<p>No resources available for this level.</p>";
    return;
  }

  filtered.forEach(r => {
    const completed = progress[r.id];
    const card = document.createElement("div");
    card.classList.add("resource-card");
    card.innerHTML = `
      <a href="${r.url}" target="_blank" rel="noopener noreferrer">${r.title}</a>
      <p>Type: ${r.type}</p>
    `;

    const btn = document.createElement("button");
    if (user) {
      btn.innerText = completed ? "Completed ✅" : "Mark as Complete";
      btn.addEventListener("click", () => {
        toggleProgress(r.id);
        // Only update button and progress snapshot
        btn.innerText = progress[r.id] ? "Completed ✅" : "Mark as Complete";
        if (document.getElementById("home-content")) renderHome();
      });
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

  const skillMap = {};
  resources.forEach(r => {
    if (!skillMap[r.skill]) skillMap[r.skill] = { completed: 0, total: 0 };
    if (progress[r.id]) skillMap[r.skill].completed++;
    skillMap[r.skill].total++;
  });

  const skillsStarted = Object.keys(skillMap).filter(skill => skillMap[skill].completed > 0);
  if (skillsStarted.length === 0) {
    container.innerHTML = "<p>No progress yet. Explore resources to start learning!</p>";
    return;
  }

  container.innerHTML = "";
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
  renderMyLearning();
}

// ==================== INITIALIZATION ====================
window.onload = () => {
  renderNavbar();
  if (document.getElementById("home-content")) renderHome();
  if (document.getElementById("filter-skill")) renderExplore();
  if (document.getElementById("my-learning")) renderMyLearning();
   if (user) {
    document.getElementById("guest-content").style.display = "none";
    document.getElementById("user-content").style.display = "block";
    document.getElementById("username").textContent = user.email.split("@")[0];
  }
};
