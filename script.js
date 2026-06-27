const STORAGE_KEY = "ai_health_platform_login_state_v2";

const ROLES = {
    guest: "訪客",
    user: "一般使用者",
    coach: "健身教練",
    nutritionist: "營養師",
    admin: "系統管理員"
};

const roleHomeSection = {
    user: "user-dashboard-section",
    coach: "coach-dashboard-section",
    nutritionist: "nutrition-dashboard-section",
    admin: "admin-dashboard-section"
};

const rolePermissions = {
    guest: [
        "home-section",
        "account-login-section",
        "account-register-section"
    ],
    user: [
        "home-section",
        "user-dashboard-section",
        "health-input-section",
        "health-trend-section",
        "ai-health-section",
        "fhir-viewer-section",
        "share-section",
        "registration-section",
        "my-registration-section",
        "notification-section"
    ],
    coach: [
        "home-section",
        "coach-dashboard-section",
        "student-list-section",
        "student-exercise-section",
        "student-heart-rate-section",
        "training-advice-section",
        "training-record-section",
        "notification-section"
    ],
    nutritionist: [
        "home-section",
        "nutrition-dashboard-section",
        "case-list-section",
        "bmi-analysis-section",
        "weight-trend-section",
        "blood-pressure-section",
        "diet-advice-section",
        "nutrition-record-section",
        "notification-section"
    ],
    admin: [
        "home-section",
        "admin-dashboard-section",
        "account-management-section",
        "user-management-section",
        "fhir-record-section",
        "observation-record-section",
        "authorization-record-section",
        "blockchain-section",
        "registration-list-section",
        "registration-review-section",
        "notification-section",
        "system-setting-section"
    ]
};

const NAV_ITEMS = {
    guest: [
        ["home-section", "首頁"],
        ["account-login-section", "帳號登入"],
        ["account-register-section", "帳號註冊"]
    ],
    user: [
        ["home-section", "首頁"],
        ["user-dashboard-section", "一般使用者首頁"],
        ["health-input-section", "新增健康資料"],
        ["health-trend-section", "健康趨勢"],
        ["ai-health-section", "AI 健康建議"],
        ["fhir-viewer-section", "FHIR JSON"],
        ["share-section", "授權分享"],
        ["registration-section", "競賽報名"],
        ["my-registration-section", "我的報名"],
        ["notification-section", "通知中心"]
    ],
    coach: [
        ["home-section", "首頁"],
        ["coach-dashboard-section", "健身教練首頁"],
        ["student-list-section", "學員列表"],
        ["student-exercise-section", "運動紀錄"],
        ["student-heart-rate-section", "心率趨勢"],
        ["training-advice-section", "AI 訓練建議"],
        ["training-record-section", "訓練紀錄"],
        ["notification-section", "通知中心"]
    ],
    nutritionist: [
        ["home-section", "首頁"],
        ["nutrition-dashboard-section", "營養師首頁"],
        ["case-list-section", "個案列表"],
        ["bmi-analysis-section", "BMI 分析"],
        ["weight-trend-section", "體重趨勢"],
        ["blood-pressure-section", "血壓提醒"],
        ["diet-advice-section", "AI 飲食建議"],
        ["nutrition-record-section", "營養紀錄"],
        ["notification-section", "通知中心"]
    ],
    admin: [
        ["home-section", "首頁"],
        ["admin-dashboard-section", "系統管理員首頁"],
        ["account-management-section", "帳號管理"],
        ["user-management-section", "使用者管理"],
        ["fhir-record-section", "FHIR Resource"],
        ["observation-record-section", "Observation"],
        ["authorization-record-section", "授權紀錄"],
        ["blockchain-section", "區塊鏈紀錄"],
        ["registration-list-section", "報名列表"],
        ["registration-review-section", "報名審核"],
        ["notification-section", "通知中心"],
        ["system-setting-section", "系統設定"]
    ]
};

let state = loadState();
let currentSection = "home-section";
let trendRange = 7;
const chartPoints = {};

function createDefaultState() {
    return {
        currentAccount: null,
        role: "guest",
        demoMode: false,
        accounts: [],
        healthRecords: [
            { id: "HR-001", accountId: "ACC-USER-DEMO", date: "2026-06-20", systolic: 118, diastolic: 76, weight: 71.8, height: 170, heartRate: 72, steps: 7800, exercise: 30, bmi: 24.8 },
            { id: "HR-002", accountId: "ACC-USER-DEMO", date: "2026-06-22", systolic: 124, diastolic: 80, weight: 71.2, height: 170, heartRate: 76, steps: 9200, exercise: 45, bmi: 24.6 },
            { id: "HR-003", accountId: "ACC-USER-DEMO", date: "2026-06-26", systolic: 126, diastolic: 82, weight: 70.8, height: 170, heartRate: 74, steps: 10400, exercise: 55, bmi: 24.5 }
        ],
        authorizations: [
            {
                id: "AUTH-20260628-001",
                patientId: "ACC-USER-DEMO",
                patientName: "王小明",
                targetRole: "coach",
                targetName: "Coach Mike",
                dataScopes: ["運動紀錄", "心率", "步數"],
                duration: "永久授權",
                status: "有效",
                hash: "0xA7F391BC8E44",
                createdAt: "2026-06-28 10:30",
                expiredAt: "永久授權"
            },
            {
                id: "AUTH-20260628-002",
                patientId: "ACC-USER-DEMO",
                patientName: "王小明",
                targetRole: "nutritionist",
                targetName: "陳營養師",
                dataScopes: ["BMI", "體重", "血壓"],
                duration: "永久授權",
                status: "有效",
                hash: "0x4B21E0889F02",
                createdAt: "2026-06-28 10:35",
                expiredAt: "永久授權"
            }
        ],
        registrations: [
            {
                id: "REG-20260623-001",
                accountId: "ACC-USER-DEMO",
                teamName: "FHIR 健康隊",
                projectName: "AI 健康追蹤與運動管理平台",
                category: "運動健康",
                leaderName: "王小明",
                email: "test@example.com",
                phone: "0912345678",
                organization: "XX大學",
                members: ["陳小華", "林小美"],
                description: "以 FHIR 串接健康紀錄，並提供 AI 建議與角色權限管理。",
                roles: "user, coach, nutritionist, admin",
                fhirResources: "Patient, Observation, Practitioner",
                githubUrl: "https://github.com/example/ai-health",
                demoUrl: "",
                note: "",
                status: "待審核",
                reviewComment: "",
                createdAt: "2026-06-23 10:30"
            }
        ],
        trainingRecords: [
            { id: "TR-001", coachId: "ACC-COACH-DEMO", studentName: "王小明", title: "本週訓練建議", content: "維持每週 150 分鐘中等強度有氧，加入 2 次肌力訓練。", createdAt: "2026-06-24 14:00" }
        ],
        nutritionRecords: [
            { id: "NR-001", nutritionistId: "ACC-NUTRITION-DEMO", caseName: "王小明", title: "飲食調整", content: "增加蔬菜與優質蛋白質，晚餐減少精緻澱粉。", createdAt: "2026-06-24 15:00" }
        ],
        blockchainLogs: [
            { id: "BC-001", hash: "0xA7F391BC8E44", source: "王小明", event: "授權 coach exercise", createdAt: "2026-06-24 10:00" },
            { id: "BC-002", hash: "0x4B21E0889F02", source: "王小明", event: "授權 nutritionist nutrition", createdAt: "2026-06-24 10:15" }
        ],
        notifications: [
            { id: "NT-001", accountId: "all", title: "系統已啟用正式登入", message: "請使用帳號密碼登入，或使用 Demo 快速登入體驗角色權限。", createdAt: "2026-06-26 09:00" },
            { id: "NT-002", accountId: "ACC-USER-DEMO", title: "報名資料已建立", message: "你的競賽報名目前為待審核。", createdAt: "2026-06-23 10:30" }
        ]
    };
}

function initDefaultAccounts() {
    const defaults = [
        { id: "ACC-USER-DEMO", name: "王小明", email: "user01@example.com", username: "user01", password: "123456", phone: "0912345678", organization: "XX大學", role: "user", status: "active", createdAt: "2026-06-23 10:30" },
        { id: "ACC-COACH-DEMO", name: "李教練", email: "coach01@example.com", username: "coach01", password: "123456", phone: "0922333444", organization: "健康運動中心", role: "coach", status: "active", createdAt: "2026-06-23 10:35" },
        { id: "ACC-NUTRITION-DEMO", name: "陳營養師", email: "nutrition01@example.com", username: "nutrition01", password: "123456", phone: "0933555666", organization: "營養照護中心", role: "nutritionist", status: "active", createdAt: "2026-06-23 10:40" },
        { id: "ACC-ADMIN-DEMO", name: "系統管理員", email: "admin01@example.com", username: "admin01", password: "123456", phone: "0944777888", organization: "平台管理部", role: "admin", status: "active", createdAt: "2026-06-23 10:45" }
    ];

    defaults.forEach((account) => {
        const exists = state.accounts.some((item) => item.username === account.username);
        if (!exists) state.accounts.push(account);
    });
}

function loadState() {
    const base = createDefaultState();
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return base;
        const loaded = JSON.parse(raw);
        return {
            ...base,
            ...loaded,
            accounts: Array.isArray(loaded.accounts) ? loaded.accounts : base.accounts,
            healthRecords: Array.isArray(loaded.healthRecords) ? loaded.healthRecords : base.healthRecords,
            authorizations: Array.isArray(loaded.authorizations) ? loaded.authorizations : base.authorizations,
            registrations: Array.isArray(loaded.registrations) ? loaded.registrations : base.registrations,
            trainingRecords: Array.isArray(loaded.trainingRecords) ? loaded.trainingRecords : base.trainingRecords,
            nutritionRecords: Array.isArray(loaded.nutritionRecords) ? loaded.nutritionRecords : base.nutritionRecords,
            blockchainLogs: Array.isArray(loaded.blockchainLogs) ? loaded.blockchainLogs : base.blockchainLogs,
            notifications: Array.isArray(loaded.notifications) ? loaded.notifications : base.notifications
        };
    } catch (error) {
        console.warn("loadState failed", error);
        return base;
    }
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCurrentRole() {
    return state.role || "guest";
}

function currentAccount() {
    if (!state.currentAccount) return null;
    return state.accounts.find((account) => account.id === state.currentAccount?.id || account.username === state.currentAccount?.username) || state.currentAccount;
}

function isLoggedIn() {
    return Boolean(state.demoMode || state.currentAccount);
}

function registerAccount(event) {
    event.preventDefault();
    const account = {
        id: nextAccountId(),
        name: valueOf("register-name"),
        email: valueOf("register-email"),
        username: valueOf("register-username"),
        password: valueOf("register-password"),
        phone: valueOf("register-phone"),
        organization: valueOf("register-organization"),
        role: valueOf("register-role"),
        status: "active",
        createdAt: nowText()
    };
    const confirmPassword = valueOf("register-password-confirm");

    if (Object.values(account).some((value) => String(value).trim() === "")) {
        showToast("所有欄位皆為必填");
        return;
    }
    if (account.password.length < 6) {
        showToast("密碼至少 6 碼");
        return;
    }
    if (account.password !== confirmPassword) {
        showToast("密碼與確認密碼不一致");
        return;
    }
    if (state.accounts.some((item) => item.username.toLowerCase() === account.username.toLowerCase())) {
        showToast("帳號不可重複");
        return;
    }
    if (state.accounts.some((item) => item.email.toLowerCase() === account.email.toLowerCase())) {
        showToast("Email 不可重複");
        return;
    }

    state.accounts.push(account);
    addNotification(account.id, "帳號註冊成功", `已建立 ${ROLES[account.role]} 帳號。`);
    saveState();
    event.target.reset();
    showToast("註冊成功，請登入");
    showSection("account-login-section");
}

function loginAccount(event) {
    event.preventDefault();
    const username = valueOf("login-username");
    const password = valueOf("login-password");
    const account = state.accounts.find((item) => item.username === username && item.password === password);

    if (!account) {
        showToast("帳號或密碼錯誤");
        return;
    }
    if (account.status !== "active") {
        showToast("此帳號已停用");
        return;
    }

    state.currentAccount = account;
    state.role = account.role;
    state.demoMode = false;
    saveState();
    updateUserDisplay();
    applyRolePermissions();
    showToast(`登入成功：${account.name}`);
    goToRoleHome();
}

function demoLogin(role) {
    if (!roleHomeSection[role]) return;
    state.currentAccount = null;
    state.role = role;
    state.demoMode = true;
    saveState();
    updateUserDisplay();
    applyRolePermissions();
    showToast(`${ROLES[role]} Demo 模式`);
    goToRoleHome();
}

function logoutAccount() {
    state.currentAccount = null;
    state.demoMode = false;
    state.role = "guest";
    saveState();
    applyRolePermissions();
    showToast("已登出");
    showSection("account-login-section");
}

function applyRolePermissions() {
    const role = getCurrentRole();
    document.querySelectorAll(".content-section").forEach((section) => {
        const allowed = rolePermissions[role]?.includes(section.id);
        section.dataset.allowed = allowed ? "true" : "false";
    });
    updateSidebar();
    updateUserDisplay();
    if (!rolePermissions[role]?.includes(currentSection)) {
        currentSection = role === "guest" ? "account-login-section" : roleHomeSection[role];
    }
}

function showSection(sectionId) {
    currentSection = sectionId;
    document.querySelectorAll(".content-section").forEach((section) => {
        section.classList.remove("active");
    });

    const section = document.getElementById(sectionId);
    if (section) section.classList.add("active");

    document.querySelectorAll(".nav-item").forEach((item) => {
        item.classList.remove("active");
        if (item.getAttribute("data-target") === sectionId) {
            item.classList.add("active");
        }
    });
    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function navigateTo(sectionId) {
    const allowed = rolePermissions[getCurrentRole()] || rolePermissions.guest;

    if (!allowed.includes(sectionId)) {
        alert("您目前的角色沒有權限使用此功能。");
        return;
    }

    showSection(sectionId);
}

function startExperience() {
    if (!isLoggedIn()) {
        showSection("account-login-section");
        return;
    }
    goToRoleHome();
}

function goHealthInputFromHome() {
    if (getCurrentRole() !== "user") {
        alert("此功能僅一般使用者可使用");
        return;
    }
    navigateTo("health-input-section");
}

function viewFHIRDemo() {
    const role = getCurrentRole();
    if (role === "user") {
        navigateTo("fhir-viewer-section");
        return;
    }
    if (role === "admin") {
        navigateTo("fhir-record-section");
        return;
    }
    alert("您目前的角色沒有權限使用此功能。");
}

function showAIShowcase() {
    const target = {
        user: "ai-health-section",
        coach: "training-advice-section",
        nutritionist: "diet-advice-section",
        admin: "admin-dashboard-section"
    }[getCurrentRole()];
    if (!target) {
        showSection("account-login-section");
        return;
    }
    navigateTo(target);
}

function scrollToHomeFlow() {
    showSection("home-section");
    setTimeout(() => {
        document.getElementById("home-flow-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
}

function goToRoleHome() {
    const target = roleHomeSection[state.role] || "user-dashboard-section";
    showSection(target);
}

function updateUserDisplay() {
    const account = currentAccount();
    const role = getCurrentRole();
    setText("account-name", account ? account.name : (state.demoMode ? `${ROLES[role]} Demo` : "尚未登入"));
    setText("account-role", ROLES[role] || "Guest");
    setText("account-mode", state.demoMode ? "Demo 模式" : (account ? "正式帳號" : ""));
    setText("account-avatar", account ? account.name.slice(0, 1).toUpperCase() : (state.demoMode ? ROLES[role].slice(0, 1) : "G"));
}

function updateSidebar() {
    const role = getCurrentRole();
    const items = NAV_ITEMS[role] || NAV_ITEMS.guest;
    setHTML("sidebar-nav", items.map(([id, label]) => `
        <button class="nav-item ${id === currentSection ? "active" : ""}" data-target="${id}" onclick="navigateTo('${id}')">
            <span class="nav-icon">${navIcon(label)}</span>
            <span class="nav-label">${label}</span>
        </button>
    `).join(""));
    const loggedIn = isLoggedIn();
    const logoutButton = document.getElementById("logout-button");
    const resetButton = document.getElementById("reset-button");
    if (logoutButton) logoutButton.style.display = loggedIn ? "inline-flex" : "none";
    if (resetButton) resetButton.style.display = role === "admin" ? "inline-flex" : "none";
}

function renderAll() {
    updateSidebar();
    updateUserDisplay();
    renderHomeStats();
    renderUserDashboard();
    renderCoachDashboard();
    renderNutritionDashboard();
    renderAdminDashboard();
    renderFHIRViewer();
    renderAIHealth();
    renderTables();
    renderCoachViews();
    renderNutritionViews();
    renderAdminViews();
    renderRegistrations();
    renderNotifications();
    renderCharts();
}

function renderHomeStats() {
    setText("hero-account-count", state.accounts.length);
    setText("hero-fhir-count", state.healthRecords.length * 6);
    setText("hero-current-role", ROLES[getCurrentRole()]);
    setText("hero-auth-count", state.authorizations.length);
    setText("home-fhir-resources", state.healthRecords.length * 7);
    setText("home-auth-count", state.authorizations.length);
}

function renderUserDashboard() {
    const record = latestRecord(activeUserId());
    const analysis = runAIAnalysis(activeUserId());
    setHTML("user-dashboard-cards", [
        kpi("今日血壓", record ? `${record.systolic}/${record.diastolic}` : "--", "mmHg"),
        kpi("今日心率", record?.heartRate ?? "--", "bpm"),
        kpi("今日體重", record?.weight ?? "--", "kg"),
        kpi("BMI", record?.bmi ?? "--", record ? bmiCategory(record.bmi) : ""),
        kpi("今日步數", record?.steps?.toLocaleString() ?? "--", "steps"),
        kpi("本週運動時間", `${analysis.weeklyExercise}`, "分鐘")
    ].join(""));
    setHTML("user-ai-summary", `<p>${escapeHTML(analysis.healthAdvice)}</p>`);
    setHTML("user-notification-summary", notificationList(3));
}

function renderCoachDashboard() {
    updateCoachDashboard();
}

function renderNutritionDashboard() {
    updateNutritionDashboard();
}

function renderAdminDashboard() {
    setHTML("admin-dashboard-cards", [
        kpi("使用者總數", state.accounts.length, "帳號"),
        kpi("FHIR Resource 數量", state.healthRecords.length * 7, "筆"),
        kpi("Observation 數量", state.healthRecords.length * 6, "筆"),
        kpi("授權紀錄數", state.authorizations.length, "筆"),
        kpi("區塊鏈紀錄數", state.blockchainLogs.length, "筆"),
        kpi("報名總數", state.registrations.length, "筆"),
        kpi("待審核報名", state.registrations.filter((item) => item.status === "待審核").length, "筆"),
        kpi("系統通知數", state.notifications.length, "則")
    ].join(""));
    setHTML("admin-system-summary", `
        <p>目前系統保留 localStorage Demo 資料，包含 FHIR、Observation、授權、區塊鏈紀錄、通知中心與競賽報名審核資料。</p>
    `);
}

function renderFHIRViewer() {
    setText("fhir-json-output", JSON.stringify(generateFHIRBundle(activeUserId()), null, 2));
}

function renderAIHealth() {
    const analysis = runAIAnalysis(activeUserId());
    setHTML("ai-health-panel", `
        <div class="ai-panel">
            <div class="score-ring"><div><span>健康分數</span><strong>${analysis.score}</strong><small>${escapeHTML(analysis.risk)}</small></div></div>
            <div class="advice-list">
                <div class="advice-item"><strong>健康建議</strong><p>${escapeHTML(analysis.healthAdvice)}</p></div>
                <div class="advice-item"><strong>飲食建議</strong><p>${escapeHTML(analysis.dietAdvice)}</p></div>
                <div class="advice-item"><strong>運動建議</strong><p>${escapeHTML(analysis.exerciseAdvice)}</p></div>
                <div class="advice-item"><strong>追蹤提醒</strong><p>${escapeHTML(analysis.medicalAdvice)}</p></div>
            </div>
        </div>
    `);
}

function renderTables() {
    const accountId = activeUserId();
    setHTML("my-registration-body", state.registrations.filter((item) => item.accountId === accountId).map((item) => `
        <tr><td>${item.id}</td><td>${escapeHTML(item.teamName)}</td><td>${escapeHTML(item.projectName)}</td><td>${statusPill(item.status)}</td><td>${escapeHTML(item.reviewComment || "尚無")}</td><td>${item.createdAt}</td></tr>
    `).join("") || emptyRow(6));
}

function renderCoachViews() {
    renderAuthorizedStudents();
    renderStudentExerciseData();
    const validAuths = getAuthorizationsByRole("coach").filter(isAuthorizationValid).filter(hasCoachDataScope);
    setHTML("training-advice-panel", validAuths.map((auth) => {
        const analysis = runAIAnalysis(authPatientId(auth));
        return `<div class="card auth-data-card"><h3>${escapeHTML(auth.patientName || patientName(auth))}</h3><p>${escapeHTML(analysis.exerciseAdvice)}</p></div>`;
    }).join("") || `<div class="card empty">尚未取得學員授權資料。</div>`);
    setHTML("training-record-list", state.trainingRecords.map((item) => `<div class="record-card"><strong>${escapeHTML(item.studentName)}：${escapeHTML(item.title)}</strong><p>${escapeHTML(item.content)}</p><small class="muted">${item.createdAt}</small></div>`).join(""));
}

function renderNutritionViews() {
    renderAuthorizedCases();
    renderCaseNutritionData();
    setHTML("nutrition-record-list", state.nutritionRecords.map((item) => `<div class="record-card"><strong>${escapeHTML(item.caseName)}：${escapeHTML(item.title)}</strong><p>${escapeHTML(item.content)}</p><small class="muted">${item.createdAt}</small></div>`).join(""));
}

function renderAdminViews() {
    setHTML("account-management-body", state.accounts.map((account) => `
        <tr>
            <td>${escapeHTML(account.name)}</td><td>${escapeHTML(account.username)}</td><td>${escapeHTML(account.email)}</td><td>${ROLES[account.role]}</td><td>${statusPill(account.status === "active" ? "啟用" : "停用", account.status === "active" ? "active" : "disabled")}</td>
            <td><button class="mini-button" onclick="toggleAccount('${account.id}')">${account.status === "active" ? "停用" : "啟用"}</button></td>
        </tr>
    `).join(""));
    setHTML("user-management-body", state.accounts.map((account) => `<tr><td>${escapeHTML(account.name)}</td><td>${escapeHTML(account.email)}</td><td>${ROLES[account.role]}</td><td>${escapeHTML(account.organization)}</td><td>${escapeHTML(account.phone)}</td></tr>`).join(""));
    setHTML("fhir-record-list", state.accounts.filter((account) => account.role === "user").map((account) => `<div class="card"><h3>${escapeHTML(account.name)}</h3><pre class="code-block">${escapeHTML(JSON.stringify(generateFHIRBundle(account.id), null, 2))}</pre></div>`).join(""));
    setHTML("observation-record-panel", `<div class="kpi-grid">${kpi("健康紀錄", state.healthRecords.length, "筆")}${kpi("Observation", state.healthRecords.length * 6, "筆")}${kpi("使用者", state.accounts.filter((item) => item.role === "user").length, "人")}</div>`);
    setHTML("authorization-record-body", state.authorizations.map((auth) => {
        const normalized = normalizeAuthorization(auth);
        return `<tr><td>${escapeHTML(normalized.patientName)}</td><td>${escapeHTML(normalized.targetName || ROLES[normalized.targetRole] || normalized.targetRole)}</td><td>${scopeBadges(normalized.dataScopes)}</td><td><code>${escapeHTML(normalized.hash)}</code><br>${authorizationStatusBadge(normalized)}</td><td>${normalized.createdAt}</td></tr>`;
    }).join("") || emptyRow(5));
    setHTML("blockchain-body", state.blockchainLogs.map((log) => `<tr><td><code>${escapeHTML(log.hash)}</code></td><td>${escapeHTML(log.source)}</td><td>${escapeHTML(log.event)}</td><td>${log.createdAt}</td></tr>`).join("") || emptyRow(4));
}

function renderRegistrations() {
    setHTML("registration-list-body", state.registrations.map((item) => `
        <tr><td>${item.id}</td><td>${escapeHTML(item.teamName)}</td><td>${escapeHTML(item.projectName)}</td><td>${escapeHTML(item.category)}</td><td>${escapeHTML(item.leaderName)}</td><td>${escapeHTML(item.email)}</td><td>${statusPill(item.status)}</td><td>${item.createdAt}</td></tr>
    `).join("") || emptyRow(8));
    setHTML("registration-review-panel", state.registrations.map((item) => `
        <div class="card">
            <h3>${escapeHTML(item.projectName)}</h3>
            <p>團隊：${escapeHTML(item.teamName)}｜負責人：${escapeHTML(item.leaderName)}｜狀態：${item.status}</p>
            <div class="dashboard-actions">
                <button class="primary-button" onclick="updateRegistrationStatus('${item.id}', '審核通過')">審核通過</button>
                <button class="secondary-button" onclick="updateRegistrationStatus('${item.id}', '需補件')">需補件</button>
                <button class="danger-button" onclick="updateRegistrationStatus('${item.id}', '退件')">退件</button>
            </div>
        </div>
    `).join("") || `<div class="card empty">目前沒有報名資料。</div>`);
}

function renderNotifications() {
    const account = currentAccount();
    const notifications = state.notifications.filter((item) => item.accountId === "all" || item.accountId === account?.id || getCurrentRole() === "admin");
    const html = notifications.map((item) => `<div class="timeline-item"><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(item.message)}</p><small class="muted">${item.createdAt}</small></div>`).join("") || `<div class="card empty">目前沒有通知。</div>`;
    setHTML("notification-list", html);
    setHTML("system-notification-list", html);
}

function submitHealthData(event) {
    event.preventDefault();
    const weight = Number(valueOf("health-weight"));
    const height = Number(valueOf("health-height"));
    const record = {
        id: uid("HR"),
        accountId: activeUserId(),
        date: valueOf("health-date"),
        systolic: Number(valueOf("health-systolic")),
        diastolic: Number(valueOf("health-diastolic")),
        weight,
        height,
        heartRate: Number(valueOf("health-heart-rate")),
        steps: Number(valueOf("health-steps")),
        exercise: Number(valueOf("health-exercise")),
        bmi: calculateBMI(weight, height)
    };
    state.healthRecords.push(record);
    addNotification(activeUserId(), "健康資料已新增", `BMI ${record.bmi}，FHIR JSON 已更新。`);
    saveState();
    showToast("健康資料已儲存");
    renderAll();
}

function submitRegistration(event) {
    event.preventDefault();
    const registration = {
        id: nextRegistrationId(),
        accountId: activeUserId(),
        teamName: valueOf("reg-team-name"),
        projectName: valueOf("reg-project-name"),
        category: valueOf("reg-category"),
        leaderName: valueOf("reg-leader-name"),
        email: valueOf("reg-email"),
        phone: valueOf("reg-phone"),
        organization: valueOf("reg-organization"),
        members: [valueOf("reg-member-1"), valueOf("reg-member-2"), valueOf("reg-member-3")].filter(Boolean),
        description: valueOf("reg-description"),
        roles: valueOf("reg-roles"),
        fhirResources: valueOf("reg-fhir-resources"),
        githubUrl: valueOf("reg-github-url"),
        demoUrl: valueOf("reg-demo-url"),
        note: valueOf("reg-note"),
        status: "待審核",
        reviewComment: "",
        createdAt: nowText()
    };
    state.registrations.unshift(registration);
    addNotification(activeUserId(), "報名資料已送出", `報名編號：${registration.id}`);
    saveState();
    event.target.reset();
    showToast("報名已送出");
    showSection("my-registration-section");
}

function generateQRCode(event) {
    event.preventDefault();
    const auth = createAuthorization();
    if (!auth) return;
    const qrToken = `${auth.id}|${auth.hash}`;
    drawQRCode(qrToken);
    setText("qr-target", ROLES[auth.targetRole] || auth.targetRole);
    setText("qr-scope", auth.dataScopes.join("、"));
    setText("qr-expire", auth.expiredAt);
    setText("qr-token", auth.hash);
    showToast("授權 QR Code 已產生");
    renderAll();
}

function createAuthorization() {
    const targetRole = valueOf("share-target-role");
    const dataScopes = Array.from(document.querySelectorAll('input[name="share-data-scope"]:checked')).map((input) => input.value);
    const duration = valueOf("share-duration") || "7天";
    const patient = currentAccount()?.role === "user" ? currentAccount() : state.accounts.find((account) => account.id === activeUserId());
    const target = state.accounts.find((account) => account.role === targetRole);

    if (!targetRole) {
        showToast("請選擇授權對象");
        return null;
    }
    if (dataScopes.length === 0) {
        showToast("請至少勾選一項授權資料範圍");
        return null;
    }

    const createdAt = nowText();
    const expiredAt = authorizationExpiredAt(duration);
    const token = `${patient?.id || activeUserId()}-${targetRole}-${dataScopes.join(",")}-${createdAt}`;
    const hash = `0x${hashText(token).toUpperCase()}`;
    const auth = {
        id: nextAuthorizationId(),
        patientId: patient?.id || activeUserId(),
        patientName: patient?.name || "王小明",
        targetRole,
        targetName: target?.name || (targetRole === "coach" ? "Coach Mike" : ROLES[targetRole] || targetRole),
        dataScopes,
        duration,
        status: "有效",
        hash,
        createdAt,
        expiredAt
    };

    state.authorizations.push(auth);
    addBlockchainLog(auth.patientName, `授權 ${auth.targetName} 查看 ${auth.dataScopes.join("、")}`, hash);
    addNotification(auth.patientId, "授權分享已建立", `已授權 ${auth.targetName} 查看 ${auth.dataScopes.join("、")}，期限：${auth.duration}。`);
    addNotification("all", "新增授權紀錄", `${auth.patientName} 已授權 ${auth.targetName} 查看 ${auth.dataScopes.join("、")}。`);
    saveState();
    return auth;
}

function renderAuthorizedStudents() {
    const auths = getAuthorizationsByRole("coach");
    setHTML("student-list-body", auths.map((auth) => {
        const valid = isAuthorizationValid(auth);
        return `
            <tr>
                <td>${escapeHTML(auth.patientName || patientName(auth))}</td>
                <td>${scopeBadges(auth.dataScopes)}</td>
                <td>${escapeHTML(auth.duration || "--")}<br><small class="muted">${escapeHTML(auth.expiredAt || "--")}</small></td>
                <td>${authorizationStatusBadge(auth)}</td>
                <td><button class="mini-button" ${valid && hasCoachDataScope(auth) ? "" : "disabled"} onclick="showSection('student-exercise-section')">查看運動資料</button></td>
            </tr>
        `;
    }).join("") || emptyRow(5));
}

function renderStudentExerciseData() {
    const auths = getAuthorizationsByRole("coach").filter(isAuthorizationValid).filter(hasCoachDataScope);
    setHTML("student-exercise-panel", auths.map((auth) => {
        const patientId = authPatientId(auth);
        const latest = latestRecord(patientId);
        const analysis = runAIAnalysis(patientId);
        if (!latest) return `<div class="card empty">尚未取得學員授權資料。</div>`;
        const achievement = Math.min(100, Math.round((analysis.weeklyExercise / 150) * 100));
        return `
            <div class="card auth-data-card">
                <h3>${escapeHTML(auth.patientName || patientName(auth))}</h3>
                <div class="auth-metric-grid">
                    ${authAllows(auth, "步數") ? authMetric("步數", latest.steps?.toLocaleString() || "--", "steps") : ""}
                    ${authAllows(auth, "運動紀錄") ? authMetric("運動時間", `${latest.exercise ?? "--"}`, "分鐘") : ""}
                    ${authAllows(auth, "運動紀錄") ? authMetric("消耗熱量", `${estimateCalories(latest)}`, "kcal") : ""}
                    ${authAllows(auth, "心率") ? authMetric("心率", `${latest.heartRate ?? "--"}`, "bpm") : ""}
                    ${authAllows(auth, "運動紀錄") ? authMetric("運動達成率", `${achievement}%`, "每週 150 分鐘") : ""}
                </div>
                <div class="advice-item"><strong>AI 訓練建議</strong><p>${escapeHTML(analysis.exerciseAdvice)}</p></div>
            </div>
        `;
    }).join("") || `<div class="card empty">尚未取得學員授權資料。</div>`);
}

function renderAuthorizedCases() {
    const auths = getAuthorizationsByRole("nutritionist");
    setHTML("case-list-body", auths.map((auth) => {
        const valid = isAuthorizationValid(auth);
        return `
            <tr>
                <td>${escapeHTML(auth.patientName || patientName(auth))}</td>
                <td>${scopeBadges(auth.dataScopes)}</td>
                <td>${escapeHTML(auth.duration || "--")}<br><small class="muted">${escapeHTML(auth.expiredAt || "--")}</small></td>
                <td>${authorizationStatusBadge(auth)}</td>
                <td><button class="mini-button" ${valid && hasNutritionDataScope(auth) ? "" : "disabled"} onclick="showSection('bmi-analysis-section')">查看營養資料</button></td>
            </tr>
        `;
    }).join("") || emptyRow(5));
}

function renderCaseNutritionData() {
    const auths = getAuthorizationsByRole("nutritionist").filter(isAuthorizationValid).filter(hasNutritionDataScope);
    const nutritionHtml = auths.map((auth) => {
        const patientId = authPatientId(auth);
        const latest = latestRecord(patientId);
        const analysis = runAIAnalysis(patientId);
        if (!latest) return `<div class="card empty">尚未取得個案授權資料。</div>`;
        const bpHigh = latest.systolic >= 130 || latest.diastolic >= 80;
        const bmiRisk = latest.bmi >= 27 || latest.bmi < 18.5 ? "高" : latest.bmi >= 24 || bpHigh ? "中" : "低";
        return `
            <div class="card auth-data-card">
                <h3>${escapeHTML(auth.patientName || patientName(auth))}</h3>
                <div class="auth-metric-grid">
                    ${authAllows(auth, "體重") ? authMetric("體重", `${latest.weight ?? "--"}`, "kg") : ""}
                    ${authAllows(auth, "BMI") ? authMetric("BMI", `${latest.bmi ?? "--"}`, bmiCategory(latest.bmi)) : ""}
                    ${authAllows(auth, "血壓") ? authMetric("血壓", `${latest.systolic}/${latest.diastolic}`, bpHigh ? "偏高" : "正常") : ""}
                    ${authMetric("營養風險等級", bmiRisk, "依 BMI 與血壓")}
                </div>
                <div class="advice-item"><strong>AI 飲食建議</strong><p>${escapeHTML(analysis.dietAdvice)}</p></div>
            </div>
        `;
    }).join("") || `<div class="card empty">尚未取得個案授權資料。</div>`;

    setHTML("bmi-analysis-panel", nutritionHtml);
    setHTML("diet-advice-panel", nutritionHtml);
    setHTML("blood-pressure-panel", nutritionHtml);
}

function isAuthorizationValid(auth) {
    if (!auth || auth.status !== "有效") return false;
    const expiredAt = auth.expiredAt || auth.expiresAt;
    if (!expiredAt || expiredAt === "永久授權") return true;
    return new Date(expiredAt.replace(" ", "T")).getTime() >= Date.now();
}

function getAuthorizationsByRole(role) {
    return state.authorizations
        .filter((auth) => auth.targetRole === role)
        .map(normalizeAuthorization)
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

function updateCoachDashboard() {
    const auths = getAuthorizationsByRole("coach");
    const validAuths = auths.filter(isAuthorizationValid).filter(hasCoachDataScope);
    const patientIds = unique(validAuths.map(authPatientId));
    const records = patientIds.map((id) => latestRecord(id)).filter(Boolean);
    const activeToday = records.filter((record) => Number(record.steps) >= 6000).length;
    const abnormal = records.filter((record) => Number(record.heartRate) > 100).length;
    const averageAchievement = patientIds.length
        ? Math.round(patientIds.reduce((sum, id) => sum + Math.min(100, (runAIAnalysis(id).weeklyExercise / 150) * 100), 0) / patientIds.length)
        : 0;
    setHTML("coach-dashboard-cards", [
        kpi("被授權學員數", unique(auths.map(authPatientId)).length, "人"),
        kpi("有效授權數", validAuths.length, "筆"),
        kpi("今日活躍學員", activeToday, "人"),
        kpi("心率異常提醒", abnormal, "筆"),
        kpi("平均運動達成率", `${averageAchievement}%`, "每週 150 分鐘")
    ].join(""));
    setHTML("coach-trend-summary", `<p>${validAuths.length ? `目前有 ${validAuths.length} 筆有效運動授權，平均運動達成率 ${averageAchievement}%。` : "尚未取得學員授權資料。"}</p>`);
    setHTML("coach-ai-summary", `<p>${validAuths.length ? "建議優先追蹤心率偏高、步數偏低或運動達成率不足的學員。" : "取得運動紀錄、心率或步數授權後，將顯示 AI 訓練建議。"}</p>`);
}

function updateNutritionDashboard() {
    const auths = getAuthorizationsByRole("nutritionist");
    const validAuths = auths.filter(isAuthorizationValid).filter(hasNutritionDataScope);
    const patientIds = unique(validAuths.map(authPatientId));
    const records = patientIds.map((id) => latestRecord(id)).filter(Boolean);
    const bmiAbnormal = records.filter((record) => record.bmi >= 24 || record.bmi < 18.5).length;
    const bpHigh = records.filter((record) => record.systolic >= 130 || record.diastolic >= 80).length;
    setHTML("nutrition-dashboard-cards", [
        kpi("被授權個案數", unique(auths.map(authPatientId)).length, "人"),
        kpi("有效授權數", validAuths.length, "筆"),
        kpi("BMI 異常個案", bmiAbnormal, "人"),
        kpi("血壓偏高個案", bpHigh, "人"),
        kpi("AI 飲食建議數", validAuths.length, "則")
    ].join(""));
    setHTML("nutrition-risk-summary", `<p>${validAuths.length ? `目前 ${patientIds.length} 位有效授權個案中，${bmiAbnormal} 位 BMI 異常，${bpHigh} 位血壓偏高。` : "尚未取得個案授權資料。"}</p>`);
    setHTML("nutrition-ai-summary", `<p>${validAuths.length ? "建議針對 BMI 異常或血壓偏高個案，降低鈉攝取並追蹤體重與 BMI 變化。" : "取得 BMI、體重或血壓授權後，將顯示 AI 飲食建議。"}</p>`);
}

function addTrainingRecord(event) {
    event.preventDefault();
    state.trainingRecords.unshift({ id: uid("TR"), coachId: currentAccount()?.id || "DEMO-COACH", studentName: valueOf("training-student"), title: valueOf("training-title"), content: valueOf("training-content"), createdAt: nowText() });
    saveState();
    event.target.reset();
    showToast("訓練紀錄已新增");
    renderAll();
}

function addNutritionRecord(event) {
    event.preventDefault();
    state.nutritionRecords.unshift({ id: uid("NR"), nutritionistId: currentAccount()?.id || "DEMO-NUTRITION", caseName: valueOf("nutrition-case"), title: valueOf("nutrition-title"), content: valueOf("nutrition-content"), createdAt: nowText() });
    saveState();
    event.target.reset();
    showToast("營養紀錄已新增");
    renderAll();
}

function updateRegistrationStatus(id, status) {
    const item = state.registrations.find((registration) => registration.id === id);
    if (!item) return;
    item.status = status;
    item.reviewComment = status === "審核通過" ? "資料完整，審核通過。" : status === "需補件" ? "請補充作品 Demo 或 FHIR 說明。" : "未符合本次徵件條件。";
    addNotification(item.accountId, "報名審核狀態更新", `${item.id}：${status}`);
    saveState();
    showToast("審核狀態已更新");
    renderAll();
}

function toggleAccount(id) {
    const account = state.accounts.find((item) => item.id === id);
    if (!account) return;
    account.status = account.status === "active" ? "disabled" : "active";
    saveState();
    showToast("帳號狀態已更新");
    renderAll();
}

function resetDemoData() {
    if (!confirm("確定要重置 Demo 資料與登入狀態？")) return;
    localStorage.removeItem(STORAGE_KEY);
    state = loadState();
    initDefaultAccounts();
    saveState();
    currentSection = "account-login-section";
    applyRolePermissions();
    showSection("account-login-section");
    showToast("Demo 資料已重置");
}

function generateFHIRBundle(accountId = activeUserId()) {
    const account = state.accounts.find((item) => item.id === accountId) || state.accounts.find((item) => item.role === "user");
    const latest = latestRecord(account?.id);
    if (!account || !latest) return { resourceType: "Bundle", type: "collection", entry: [] };
    const observations = [
        observation("Blood Pressure", "85354-9", `${latest.systolic}/${latest.diastolic}`, "mmHg", latest.date, account.id),
        observation("Body Weight", "29463-7", latest.weight, "kg", latest.date, account.id),
        observation("Heart Rate", "8867-4", latest.heartRate, "beats/min", latest.date, account.id),
        observation("BMI", "39156-5", latest.bmi, "kg/m2", latest.date, account.id),
        observation("Steps", "41950-7", latest.steps, "steps", latest.date, account.id),
        observation("Exercise", "55411-3", latest.exercise, "min", latest.date, account.id)
    ];
    return {
        resourceType: "Bundle",
        type: "collection",
        timestamp: new Date().toISOString(),
        entry: [
            { resource: { resourceType: "Patient", id: account.id, name: [{ text: account.name }], telecom: [{ system: "email", value: account.email }, { system: "phone", value: account.phone }], managingOrganization: { display: account.organization } } },
            { resource: { resourceType: "Practitioner", id: "practitioner-demo-001", name: [{ text: "AI Health Platform" }] } },
            ...observations.map((resource) => ({ resource }))
        ]
    };
}

function observation(display, code, value, unit, date, accountId) {
    return {
        resourceType: "Observation",
        status: "final",
        code: { coding: [{ system: "http://loinc.org", code, display }] },
        subject: { reference: `Patient/${accountId}` },
        effectiveDateTime: date,
        valueQuantity: { value, unit }
    };
}

function runAIAnalysis(accountId = activeUserId()) {
    const records = recordsByAccount(accountId);
    const latest = records[records.length - 1];
    const weeklyExercise = records.slice(-7).reduce((sum, item) => sum + Number(item.exercise || 0), 0);
    if (!latest) {
        return {
            score: "--",
            risk: "無資料",
            weeklyExercise: 0,
            healthAdvice: "請先新增健康資料，系統會依血壓、BMI、心率與運動量提供建議。",
            dietAdvice: "尚無飲食建議。",
            exerciseAdvice: "尚無訓練建議。",
            medicalAdvice: "尚無追蹤提醒。"
        };
    }
    let score = 92;
    if (latest.systolic >= 130 || latest.diastolic >= 80) score -= 12;
    if (latest.bmi >= 24 || latest.bmi < 18.5) score -= 10;
    if (latest.heartRate > 100) score -= 10;
    if (weeklyExercise < 150) score -= 8;
    score = Math.max(55, score);
    const risk = score >= 85 ? "低風險" : score >= 70 ? "需追蹤" : "高風險";
    return {
        score,
        risk,
        weeklyExercise,
        healthAdvice: latest.systolic >= 130 || latest.diastolic >= 80 ? "血壓偏高，建議減少鈉攝取、規律量測並留意睡眠壓力。" : "血壓落在可接受範圍，請維持規律量測。",
        dietAdvice: latest.bmi >= 24 ? "BMI 偏高，建議提高蔬菜、蛋白質與全穀比例，減少含糖飲料與宵夜。" : "目前 BMI 狀態尚可，維持均衡飲食與足量飲水。",
        exerciseAdvice: weeklyExercise < 150 ? "本週運動量不足，建議每週累積至少 150 分鐘中等強度有氧。" : "本週運動量達標，可加入肌力訓練提升代謝與肌耐力。",
        medicalAdvice: score < 70 ? "若異常數值連續出現，建議諮詢醫療專業人員。" : "維持每週追蹤，觀察趨勢變化。"
    };
}

function setTrendRange(range) {
    trendRange = range;
    document.querySelectorAll(".range-button").forEach((button) => {
        button.classList.toggle("active", String(button.dataset.range) === String(range));
    });
    renderCharts();
}

function renderCharts() {
    const records = filteredTrendRecords();
    renderTrendSummary(records);
    drawLineChart("bp-chart", records, [
        { label: "收縮壓", value: (r) => r.systolic, unit: "mmHg", color: "#dc2626", status: bloodPressureStatus },
        { label: "舒張壓", value: (r) => r.diastolic, unit: "mmHg", color: "#2563eb", status: bloodPressureStatus }
    ]);
    drawLineChart("weight-chart", records, [
        { label: "體重", value: (r) => r.weight, unit: "kg", color: "#0f766e", status: () => "趨勢追蹤" },
        { label: "BMI", value: (r) => r.bmi, unit: "kg/m2", color: "#f59e0b", status: bmiCategory }
    ]);
    drawRangeChart("heart-chart", records);
    drawBarChart("steps-chart", records, { label: "步數", value: (r) => r.steps, unit: "steps", color: "#2563eb", status: stepsStatus });
    drawLineChart("exercise-chart", records, [
        { label: "運動時間", value: (r) => r.exercise, unit: "分鐘", color: "#16a34a", status: exerciseStatus },
        { label: "熱量消耗", value: (r) => estimateCalories(r), unit: "kcal", color: "#db2777", status: () => "估算" }
    ]);

    const allRecords = recordsByAccount(activeUserId());
    drawLineChart("student-heart-chart", allRecords, [{ label: "心率", value: (r) => r.heartRate, unit: "bpm", color: "#db2777", status: heartRateStatus }]);
    drawLineChart("nutrition-weight-chart", allRecords, [{ label: "體重", value: (r) => r.weight, unit: "kg", color: "#0f766e", status: () => "趨勢追蹤" }]);
}

function drawLineChart(canvasId, records, seriesConfig) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.clientWidth || 640;
    const height = canvas.height = Number(canvas.getAttribute("height")) || 220;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    if (!records.length) {
        ctx.fillStyle = "#64748b";
        ctx.fillText("尚無資料", 24, 32);
        return;
    }
    const padding = 32;
    const values = seriesConfig.flatMap((series) => records.map(series.value));
    const min = Math.min(...values) * 0.95;
    const max = Math.max(...values) * 1.05;
    ctx.strokeStyle = "#dbe4ee";
    for (let i = 0; i < 4; i += 1) {
        const y = padding + ((height - padding * 2) / 3) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    chartPoints[canvasId] = [];
    seriesConfig.forEach((series) => {
        ctx.strokeStyle = series.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        records.forEach((record, i) => {
            const x = padding + ((width - padding * 2) / Math.max(1, records.length - 1)) * i;
            const value = series.value(record);
            const y = height - padding - ((value - min) / Math.max(1, max - min)) * (height - padding * 2);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            chartPoints[canvasId].push({ x, y, date: record.date, label: series.label, value, unit: series.unit, status: series.status(value, record) });
        });
        ctx.stroke();
        records.forEach((record, i) => {
            const x = padding + ((width - padding * 2) / Math.max(1, records.length - 1)) * i;
            const value = series.value(record);
            const y = height - padding - ((value - min) / Math.max(1, max - min)) * (height - padding * 2);
            ctx.fillStyle = series.color;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    });
    attachChartTooltip(canvas);
}

function drawBarChart(canvasId, records, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.clientWidth || 640;
    const height = canvas.height = Number(canvas.getAttribute("height")) || 220;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    if (!records.length) {
        ctx.fillStyle = "#64748b";
        ctx.fillText("尚無資料", 24, 32);
        return;
    }
    const padding = 32;
    const max = Math.max(...records.map(config.value)) * 1.1;
    const barWidth = Math.max(12, (width - padding * 2) / records.length * 0.58);
    chartPoints[canvasId] = [];
    records.forEach((record, i) => {
        const value = config.value(record);
        const x = padding + ((width - padding * 2) / records.length) * i + barWidth * 0.35;
        const barHeight = ((height - padding * 2) * value) / Math.max(1, max);
        const y = height - padding - barHeight;
        ctx.fillStyle = config.color;
        ctx.fillRect(x, y, barWidth, barHeight);
        chartPoints[canvasId].push({ x: x + barWidth / 2, y, date: record.date, label: config.label, value, unit: config.unit, status: config.status(value, record) });
    });
    attachChartTooltip(canvas);
}

function drawRangeChart(canvasId, records) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    drawLineChart(canvasId, records, [{ label: "心率", value: (r) => r.heartRate, unit: "bpm", color: "#db2777", status: heartRateStatus }]);
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    ctx.fillStyle = "rgba(22, 163, 74, 0.1)";
    ctx.fillRect(32, 72, width - 64, 78);
    ctx.fillStyle = "#166534";
    ctx.fillText("建議區間 60-100 bpm", 42, 92);
}

function renderTrendSummary(records) {
    const avg = (getter) => records.length ? (records.reduce((sum, item) => sum + Number(getter(item) || 0), 0) / records.length) : 0;
    const totalExercise = records.reduce((sum, item) => sum + Number(item.exercise || 0), 0);
    setHTML("trend-summary-cards", [
        kpi("平均收縮壓", records.length ? avg((r) => r.systolic).toFixed(1) : "--", "mmHg"),
        kpi("平均舒張壓", records.length ? avg((r) => r.diastolic).toFixed(1) : "--", "mmHg"),
        kpi("平均心率", records.length ? avg((r) => r.heartRate).toFixed(1) : "--", "bpm"),
        kpi("平均 BMI", records.length ? avg((r) => r.bmi).toFixed(1) : "--", "kg/m2"),
        kpi("平均步數", records.length ? Math.round(avg((r) => r.steps)).toLocaleString() : "--", "steps"),
        kpi("總運動時間", totalExercise, "分鐘")
    ].join(""));
    const highBp = records.filter((r) => r.systolic >= 130 || r.diastolic >= 80).length;
    const avgBmi = records.length ? avg((r) => r.bmi).toFixed(1) : "--";
    setText("trend-data-hint", records.length < 3 ? "目前資料較少，建議新增更多健康紀錄以獲得更準確趨勢。" : "");
    setHTML("trend-ai-summary", `<h3>AI 趨勢摘要</h3><p>近 ${records.length} 筆資料中，血壓有 ${highBp} 次偏高，平均 BMI 為 ${avgBmi}，總運動時間 ${totalExercise} 分鐘，建議維持每週 150 分鐘運動。</p>`);
}

function filteredTrendRecords() {
    const records = recordsByAccount(activeUserId());
    if (trendRange === "all") return records;
    if (!records.length) return records;
    const anchor = new Date(records[records.length - 1].date);
    const cutoff = new Date(anchor);
    cutoff.setDate(anchor.getDate() - Number(trendRange) + 1);
    return records.filter((record) => new Date(record.date) >= cutoff);
}

function attachChartTooltip(canvas) {
    canvas.onmousemove = (event) => {
        const points = chartPoints[canvas.id] || [];
        if (!points.length) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        const nearest = points.reduce((best, point) => {
            const distance = Math.hypot(point.x - x, point.y - y);
            return !best || distance < best.distance ? { ...point, distance } : best;
        }, null);
        if (!nearest || nearest.distance > 32) {
            hideChartTooltip();
            return;
        }
        showChartTooltip(event.clientX, event.clientY, nearest);
    };
    canvas.onmouseleave = hideChartTooltip;
}

function showChartTooltip(clientX, clientY, point) {
    const tooltip = document.getElementById("chart-tooltip");
    if (!tooltip) return;
    tooltip.innerHTML = `
        <strong>${escapeHTML(point.label)}</strong><br>
        日期：${escapeHTML(point.date)}<br>
        數值：${escapeHTML(point.value)} ${escapeHTML(point.unit)}<br>
        狀態：${escapeHTML(point.status)}
    `;
    tooltip.style.left = `${clientX + 12}px`;
    tooltip.style.top = `${clientY + 12}px`;
    tooltip.classList.add("show");
}

function hideChartTooltip() {
    document.getElementById("chart-tooltip")?.classList.remove("show");
}

function bloodPressureStatus(value, record) {
    const systolic = record?.systolic ?? value;
    const diastolic = record?.diastolic ?? value;
    return systolic >= 130 || diastolic >= 80 ? "偏高" : "正常";
}

function heartRateStatus(value) {
    if (value < 60) return "偏低";
    if (value > 100) return "偏高";
    return "正常";
}

function stepsStatus(value) {
    if (value >= 10000) return "達標";
    if (value >= 6000) return "普通";
    return "偏少";
}

function exerciseStatus(value) {
    if (value >= 30) return "達標";
    return "偏少";
}

function estimateCalories(record) {
    return Math.round(Number(record.exercise || 0) * 6.5);
}

function shareScopeLabel(scope) {
    return {
        exercise: "運動資料",
        nutrition: "營養與體重資料",
        summary: "健康摘要"
    }[scope] || scope;
}

function authorizationExpiredAt(duration) {
    if (duration === "永久授權") return "永久授權";
    const date = new Date();
    if (duration === "24小時") date.setHours(date.getHours() + 24);
    if (duration === "7天") date.setDate(date.getDate() + 7);
    if (duration === "30天") date.setDate(date.getDate() + 30);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function drawQRCode(token) {
    const canvas = document.getElementById("qr-canvas");
    if (!canvas) return;
    canvas.width = 180;
    canvas.height = 180;
    canvas.style.width = "180px";
    canvas.style.height = "180px";
    const ctx = canvas.getContext("2d");
    const size = 180;
    const cells = 21;
    const cell = size / cells;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    let seed = 0;
    for (const char of token) seed = (seed + char.charCodeAt(0) * 17) % 9973;
    for (let y = 0; y < cells; y += 1) {
        for (let x = 0; x < cells; x += 1) {
            const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
            const on = finder ? (x === 0 || y === 0 || x === 6 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4)) : ((x * 31 + y * 17 + seed) % 5 < 2);
            if (on) {
                ctx.fillStyle = "#0f172a";
                ctx.fillRect(Math.floor(x * cell), Math.floor(y * cell), Math.ceil(cell), Math.ceil(cell));
            }
        }
    }
}

function recordsByAccount(accountId) {
    return state.healthRecords.filter((record) => record.accountId === accountId).sort((a, b) => a.date.localeCompare(b.date));
}

function latestRecord(accountId = activeUserId()) {
    const records = recordsByAccount(accountId);
    return records[records.length - 1] || null;
}

function activeUserId() {
    const account = currentAccount();
    if (account?.role === "user") return account.id;
    return "ACC-USER-DEMO";
}

function displayUserName() {
    const account = currentAccount();
    if (account) return account.name;
    return state.demoMode ? `${ROLES[getCurrentRole()]} Demo` : "訪客";
}

function authorizedUsers(targetRole) {
    const ids = getAuthorizationsByRole(targetRole).filter(isAuthorizationValid).map(authPatientId);
    return state.accounts.filter((account) => ids.includes(account.id));
}

function latestAuthorization(userId, targetRole) {
    return getAuthorizationsByRole(targetRole).filter((auth) => authPatientId(auth) === userId).slice(-1)[0];
}

function normalizeAuthorization(auth) {
    const patientId = auth.patientId || auth.userId || "ACC-USER-DEMO";
    return {
        ...auth,
        patientId,
        patientName: auth.patientName || patientName({ patientId }),
        dataScopes: Array.isArray(auth.dataScopes) ? auth.dataScopes : legacyScopes(auth.scope),
        duration: auth.duration || durationFromExpiredAt(auth.expiredAt || auth.expiresAt),
        status: auth.status || "有效",
        hash: auth.hash || auth.authHash || auth.token || "--",
        expiredAt: auth.expiredAt || auth.expiresAt || "永久授權"
    };
}

function legacyScopes(scope) {
    if (scope === "exercise") return ["運動紀錄", "心率", "步數"];
    if (scope === "nutrition") return ["BMI", "體重", "血壓"];
    if (scope === "summary") return ["血壓", "體重", "BMI", "心率", "步數"];
    return scope ? [scope] : [];
}

function durationFromExpiredAt(expiredAt) {
    if (!expiredAt || expiredAt === "永久授權") return "永久授權";
    return "自訂期限";
}

function authPatientId(auth) {
    return auth.patientId || auth.userId || "ACC-USER-DEMO";
}

function patientName(auth) {
    return state.accounts.find((account) => account.id === authPatientId(auth))?.name || auth.patientName || "王小明";
}

function authAllows(auth, scope) {
    return Array.isArray(auth.dataScopes) && auth.dataScopes.includes(scope);
}

function hasCoachDataScope(auth) {
    return ["運動紀錄", "心率", "步數"].some((scope) => authAllows(auth, scope));
}

function hasNutritionDataScope(auth) {
    return ["體重", "BMI", "血壓"].some((scope) => authAllows(auth, scope));
}

function scopeBadges(scopes) {
    return (scopes || []).map((scope) => `<span class="scope-badge">${escapeHTML(scope)}</span>`).join("") || `<span class="muted">未指定</span>`;
}

function authorizationStatusBadge(auth) {
    const valid = isAuthorizationValid(auth);
    return `<span class="auth-badge ${valid ? "valid" : "expired"}">${valid ? "有效" : "已過期"}</span>`;
}

function authMetric(label, value, unit) {
    return `<div class="auth-metric"><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong><small>${escapeHTML(unit || "")}</small></div>`;
}

function unique(items) {
    return Array.from(new Set(items.filter(Boolean)));
}

function nextAuthorizationId() {
    const date = new Date();
    const ymd = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
    const count = state.authorizations.filter((item) => String(item.id).includes(`AUTH-${ymd}`)).length + 1;
    return `AUTH-${ymd}-${String(count).padStart(3, "0")}`;
}

function calculateBMI(weight, height) {
    const heightM = Number(height) / 100;
    return Number((Number(weight) / (heightM * heightM)).toFixed(1));
}

function bmiCategory(bmi) {
    if (bmi < 18.5) return "過輕";
    if (bmi < 24) return "正常";
    if (bmi < 27) return "過重";
    return "肥胖";
}

function copyFHIR() {
    const text = document.getElementById("fhir-json-output")?.textContent || "";
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    showToast("FHIR JSON 已複製");
}

function addBlockchainLog(source, event, token) {
    state.blockchainLogs.unshift({ id: uid("BC"), hash: `0x${hashText(`${source}-${event}-${token}`).toUpperCase()}`, source, event, createdAt: nowText() });
}

function addNotification(accountId, title, message) {
    state.notifications.unshift({ id: uid("NT"), accountId, title, message, createdAt: nowText() });
}

function nextAccountId() {
    const date = new Date();
    const ymd = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
    const count = state.accounts.filter((account) => account.id.includes(`ACC-${ymd}`)).length + 1;
    return `ACC-${ymd}-${String(count).padStart(3, "0")}`;
}

function nextRegistrationId() {
    const date = new Date();
    const ymd = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
    const count = state.registrations.filter((item) => item.id.includes(`REG-${ymd}`)).length + 1;
    return `REG-${ymd}-${String(count).padStart(3, "0")}`;
}

function uid(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
}

function nowText() {
    const date = new Date();
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function futureDateText(days) {
    const date = new Date();
    date.setDate(date.getDate() + Number(days));
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} 23:59`;
}

function pad(value) {
    return String(value).padStart(2, "0");
}

function hashText(text) {
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
        hash ^= text.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(16).padStart(8, "0") + Math.random().toString(16).slice(2, 8);
}

function valueOf(id) {
    return document.getElementById(id)?.value.trim() || "";
}

function kpi(title, value, caption) {
    return `
        <div class="kpi-card">
            <div class="kpi-card-icon">${escapeHTML(kpiIcon(title))}</div>
            <span>${escapeHTML(title)}</span>
            <strong>${escapeHTML(value)}</strong>
            <small>${escapeHTML(caption || "")}</small>
        </div>
    `;
}

function kpiIcon(title) {
    if (title.includes("血壓")) return "BP";
    if (title.includes("心率")) return "HR";
    if (title.includes("體重")) return "KG";
    if (title.includes("BMI")) return "BMI";
    if (title.includes("步數")) return "步";
    if (title.includes("運動")) return "動";
    if (title.includes("學員")) return "員";
    if (title.includes("個案")) return "案";
    if (title.includes("FHIR")) return "{}";
    if (title.includes("Observation")) return "OB";
    if (title.includes("授權")) return "QR";
    if (title.includes("區塊鏈")) return "BC";
    if (title.includes("報名")) return "報";
    if (title.includes("通知")) return "訊";
    return title.slice(0, 1);
}

function statusPill(label, className) {
    const cls = className || ({ "待審核": "pending", "審核通過": "approved", "需補件": "revision", "退件": "rejected" }[label] || "pending");
    return `<span class="status ${cls}">${escapeHTML(label)}</span>`;
}

function emptyRow(cols) {
    return `<tr><td colspan="${cols}" class="empty">目前沒有資料</td></tr>`;
}

function notificationList(limit) {
    const account = currentAccount();
    const items = state.notifications.filter((item) => item.accountId === "all" || item.accountId === account?.id).slice(0, limit);
    return items.map((item) => `<p><strong>${escapeHTML(item.title)}</strong><br><span class="muted">${escapeHTML(item.message)}</span></p>`).join("") || `<p class="muted">目前沒有通知。</p>`;
}

function navIcon(label) {
    if (label.includes("首頁")) return "H";
    if (label.includes("FHIR")) return "{}";
    if (label.includes("AI")) return "AI";
    if (label.includes("登入")) return "IN";
    if (label.includes("註冊")) return "+";
    if (label.includes("管理")) return "M";
    if (label.includes("通知")) return "N";
    return label.slice(0, 1);
}

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function setHTML(id, html) {
    const element = document.getElementById(id);
    if (element) element.innerHTML = html;
}

function setText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
}

window.initDefaultAccounts = initDefaultAccounts;
window.registerAccount = registerAccount;
window.loginAccount = loginAccount;
window.demoLogin = demoLogin;
window.logoutAccount = logoutAccount;
window.getCurrentRole = getCurrentRole;
window.applyRolePermissions = applyRolePermissions;
window.showSection = showSection;
window.navigateTo = navigateTo;
window.startExperience = startExperience;
window.goHealthInputFromHome = goHealthInputFromHome;
window.viewFHIRDemo = viewFHIRDemo;
window.showAIShowcase = showAIShowcase;
window.scrollToHomeFlow = scrollToHomeFlow;
window.setTrendRange = setTrendRange;
window.goToRoleHome = goToRoleHome;
window.updateUserDisplay = updateUserDisplay;
window.saveState = saveState;
window.loadState = loadState;
window.submitHealthData = submitHealthData;
window.submitRegistration = submitRegistration;
window.generateQRCode = generateQRCode;
window.createAuthorization = createAuthorization;
window.renderAuthorizedStudents = renderAuthorizedStudents;
window.renderStudentExerciseData = renderStudentExerciseData;
window.renderAuthorizedCases = renderAuthorizedCases;
window.renderCaseNutritionData = renderCaseNutritionData;
window.isAuthorizationValid = isAuthorizationValid;
window.getAuthorizationsByRole = getAuthorizationsByRole;
window.updateCoachDashboard = updateCoachDashboard;
window.updateNutritionDashboard = updateNutritionDashboard;
window.addTrainingRecord = addTrainingRecord;
window.addNutritionRecord = addNutritionRecord;
window.updateRegistrationStatus = updateRegistrationStatus;
window.toggleAccount = toggleAccount;
window.copyFHIR = copyFHIR;
window.resetDemoData = resetDemoData;

window.addEventListener("load", () => {
    initDefaultAccounts();
    saveState();
    const todayInput = document.getElementById("health-date");
    if (todayInput) todayInput.value = new Date().toISOString().slice(0, 10);
    drawQRCode("AI-HEALTH-DEMO");
    currentSection = "home-section";
    applyRolePermissions();
    showSection("home-section");
});
