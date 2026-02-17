// public/app.js
const $ = (id) => document.getElementById(id);

// Views
const loginView = $("loginView");
const appView = $("appView");

// Login
const loginName = $("loginName");
const loginPass = $("loginPass");
const loginBtn = $("loginBtn");
const loginError = $("loginError");

// Header
const meLine = $("meLine");
const roleChip = $("roleChip");
const refreshBtn = $("refreshBtn");
const logoutBtn = $("logoutBtn");

// Controls
const note = $("note");
const joinBtn = $("joinBtn");
const leaveBtn = $("leaveBtn");
const takeBtn = $("takeBtn");
const finishBtn = $("finishBtn");

// Request take (sales)
const requestTakeBtn = $("requestTakeBtn");

// Print (manager)
const printBtn = $("printBtn");

// Queue
const queueList = $("queueList");
const queueEmpty = $("queueEmpty");
const queueCount = $("queueCount");

// Finish inputs
const finishModelEl = $("finishModel");
const finishStockEl = $("finishStock");

// Current
const currentName = $("currentName");
const currentMeta = $("currentMeta");
const liveChip = $("liveChip");
const ruleHint = $("ruleHint");

// Totals + History
const totals = $("totals");
const historyList = $("historyList");
const historyEmpty = $("historyEmpty");
const historyCount = $("historyCount");

// Toast
const toastEl = $("toast");

// Manager UI
const managerBox = $("managerBox");
const resetBtn = $("resetBtn");
const refreshUsersBtn = $("refreshUsersBtn");
const usersList = $("usersList");
const newUserName = $("newUserName");
const newUserPin = $("newUserPin");
const newUserRole = $("newUserRole");
const createUserBtn = $("createUserBtn");

// Manager manual
const manualUser = $("manualUser");
const manualType = $("manualType");
const manualTime = $("manualTime");
const manualModel = $("manualModel");
const manualStock = $("manualStock");
const manualNote = $("manualNote");
const manualAddBtn = $("manualAddBtn");

// Manager Take Requests box
const takeRequestsCount = $("takeRequestsCount");
const takeRequestsEmpty = $("takeRequestsEmpty");
const takeRequestsList = $("takeRequestsList");

let me = null;
let state = null;

// Live updates
const socket = io();
socket.on("state", (s) => {
  state = s;
  if (me) render();
});

// -------------------- AUTH --------------------
loginBtn?.addEventListener("click", async () => {
  if (loginError) loginError.textContent = "";

  const name = (loginName?.value || "").trim();
  const password = (loginPass?.value || "").trim();

  if (!name || !password) {
    if (loginError) loginError.textContent = "Enter name and password.";
    return;
  }

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, password })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (loginError) loginError.textContent = data?.error || "Login failed.";
    return;
  }

  me = data.user;
  showApp();
  toast(`Welcome ${me.name}`);
  setManualTimeNow();
  await loadState();
  if (me.role === "manager") await loadUsers();
});

logoutBtn?.addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST", credentials: "include" });
  me = null;
  state = null;
  showLogin();
});

refreshBtn?.addEventListener("click", async () => {
  await loadState();
  if (me?.role === "manager") await loadUsers();
  setManualTimeNow();
});

// -------------------- QUEUE ACTIONS --------------------
joinBtn?.addEventListener("click", async () => {
  const res = await fetch("/api/queue/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ note: (note?.value || "").trim() })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) return toast(data?.error || "Join failed");
  if (note) note.value = "";
  toast("Joined queue");
});

leaveBtn?.addEventListener("click", async () => {
  const res = await fetch("/api/queue/leave", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({})
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) return toast(data?.error || "Leave failed");
  toast("Left queue");
});

takeBtn?.addEventListener("click", async () => {
  const res = await fetch("/api/queue/take", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({})
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) return toast(data?.error || "Take failed");
  toast("Taken");
});

finishBtn?.addEventListener("click", async () => {
  const model = String(finishModelEl?.value || "").trim();
  const stock = String(finishStockEl?.value || "").trim();

  const res = await fetch("/api/current/finish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ model, stock })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) return toast(data?.error || "Finish failed");

  if (finishModelEl) finishModelEl.value = "";
  if (finishStockEl) finishStockEl.value = "";
  toast("Finished");
});

// -------------------- REQUEST TAKE NEXT UP (SALES) --------------------
requestTakeBtn?.addEventListener("click", async () => {
  const reason = prompt("Reason for request (optional):") ?? "";
  const res = await fetch("/api/queue/take-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ note: String(reason).trim() })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) return toast(data?.error || "Request failed");
  toast("Request sent to manager");
});

// -------------------- MANAGER: PRINT SUMMARY --------------------
printBtn?.addEventListener("click", () => {
  if (!me || me.role !== "manager") return;

  const totalsRows = (state?.totals || [])
    .map((t) => {
      const n = escapeHtml(t.name);
      const c = escapeHtml(String(t.ups_today ?? 0));
      return `<tr><td>${n}</td><td style="text-align:right;">${c}</td></tr>`;
    })
    .join("");

  const hArr = (state?.history || []).slice(0, 300);
  const rows = hArr
    .map((h) => {
      const when = h.event_time || h.finished_at || h.taken_at || h.added_at;
      const time = escapeHtml(fmtTime(when));
      const type = escapeHtml(String(h.client_type || "up").toUpperCase());
      const name = escapeHtml(h.name || "");
      const model = escapeHtml(h.model || "");
      const stock = escapeHtml(h.stock || "");
      const noteTxt = escapeHtml(h.note || "");
      return `
        <tr>
          <td>${time}</td>
          <td>${type}</td>
          <td>${name}</td>
          <td>${model}</td>
          <td>${stock}</td>
          <td>${noteTxt}</td>
        </tr>
      `;
    })
    .join("");

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>UPS Summary</title>
  <style>
    body{font-family:Arial, sans-serif; padding:16px; color:#111;}
    h1{margin:0 0 6px;}
    .muted{color:#555; font-size:12px;}
    table{width:100%; border-collapse:collapse; margin-top:10px;}
    th,td{border:1px solid #ddd; padding:8px; font-size:12px; vertical-align:top;}
    th{background:#f4f4f4; text-align:left;}
    .actions{margin-top:10px;}
    button{padding:10px 12px; font-weight:700; cursor:pointer;}
    @media print{ .actions{display:none;} body{padding:0;} }
  </style>
</head>
<body>
  <h1>UPS Summary</h1>
  <div class="muted">${escapeHtml(new Date().toLocaleString())}</div>

  <h3 style="margin:10px 0 6px;">Totals</h3>
  <table>
    <thead><tr><th>Salesperson</th><th style="text-align:right;">Ups</th></tr></thead>
    <tbody>${totalsRows || "<tr><td colspan='2'>No totals</td></tr>"}</tbody>
  </table>

  <div class="actions">
    <button onclick="window.print()">Print</button>
  </div>

  <h3 style="margin:10px 0 6px;">History (latest)</h3>
  <table>
    <thead>
      <tr>
        <th>Time</th>
        <th>Type</th>
        <th>Salesperson</th>
        <th>Model</th>
        <th>Stock</th>
        <th>Note</th>
      </tr>
    </thead>
    <tbody>${rows || "<tr><td colspan='6'>No entries</td></tr>"}</tbody>
  </table>
</body>
</html>`;

  const w = window.open("", "_blank");
  if (!w) return toast("Popup blocked. Allow popups for this site.");

  w.document.open();
  w.document.write(html);
  w.document.close();
  setTimeout(() => { try { w.focus(); } catch {} }, 50);
});

// -------------------- MANAGER: MOVE QUEUE USER --------------------
async function moveQueueUser(userId, dir) {
  const res = await fetch("/api/admin/queue/move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ user_id: userId, dir })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return toast(data?.error || "Move failed");
  toast("Queue updated");
}

// -------------------- MANAGER: ADD/REMOVE TO QUEUE (Totals Buttons) --------------------
async function adminAddToQueue(userId) {
  const noteTxt = prompt("Optional note for queue entry:") ?? "";
  const res = await fetch("/api/admin/queue/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ user_id: Number(userId), note: String(noteTxt).trim() })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return toast(data?.error || "Add to queue failed");
  toast("Added to queue");
}

async function adminRemoveFromQueue(userId) {
  if (!confirm("Remove this user from the queue?")) return;
  const res = await fetch("/api/admin/queue/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ user_id: Number(userId) })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return toast(data?.error || "Remove failed");
  toast("Removed from queue");
}

// -------------------- MANAGER: DELETE HISTORY ENTRY --------------------
async function deleteHistoryItem(historyId) {
  if (!confirm("Delete this history entry?")) return;

  const res = await fetch(`/api/admin/history/${encodeURIComponent(historyId)}`, {
    method: "DELETE",
    credentials: "include"
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) return toast(data?.error || "Delete failed");
  toast("Deleted");
}

// -------------------- MANAGER: DELETE USER ACCOUNT --------------------
async function deleteUserAccount(userId, userName) {
  if (!confirm(`Delete user "${userName}"? This removes their history too.`)) return;

  const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
    credentials: "include"
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) return toast(data?.error || "Delete failed");

  toast("User deleted");
  await loadUsers();
  await loadState();
}

// -------------------- MANAGER: RESET USER PIN --------------------
async function resetUserPin(userId, userName) {
  const pin = prompt(`Enter NEW PIN for ${userName} (4-8 digits):`);
  if (pin === null) return;

  const newPin = String(pin).trim();
  if (!/^\d{4,8}$/.test(newPin)) return toast("PIN must be 4-8 digits");

  const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/pin`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ pin: newPin })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) return toast(data?.error || "Reset PIN failed");

  toast("PIN updated");
}

// -------------------- MANAGER: APPROVE/DENY REQUESTS --------------------
async function approveTakeRequest(id) {
  const res = await fetch(`/api/admin/take-requests/${encodeURIComponent(id)}/approve`, {
    method: "POST",
    credentials: "include"
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return toast(data?.error || "Approve failed");
  toast("Approved (auto-taken)");
}

async function denyTakeRequest(id) {
  const res = await fetch(`/api/admin/take-requests/${encodeURIComponent(id)}/deny`, {
    method: "POST",
    credentials: "include"
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return toast(data?.error || "Deny failed");
  toast("Denied");
}

// -------------------- MANAGER: MANUAL ENTRY --------------------
manualAddBtn?.addEventListener("click", async () => {
  const user_id = Number(manualUser?.value);
  const client_type = String(manualType?.value || "rdv");
  const time_hhmm = String(manualTime?.value || "");
  const model = String(manualModel?.value || "");
  const stock = String(manualStock?.value || "");
  const noteText = String(manualNote?.value || "");

  if (!Number.isFinite(user_id)) return toast("Pick a salesperson");
  if (!time_hhmm) return toast("Pick a time");

  const res = await fetch("/api/admin/manual", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      user_id,
      client_type,
      time_hhmm,
      model,
      stock,
      note: noteText
    })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) return toast(data?.error || "Manual add failed");

  if (manualModel) manualModel.value = "";
  if (manualStock) manualStock.value = "";
  if (manualNote) manualNote.value = "";

  toast("Added");
});

// -------------------- MANAGER: USERS --------------------
refreshUsersBtn?.addEventListener("click", loadUsers);

createUserBtn?.addEventListener("click", async () => {
  const name = String(newUserName?.value || "").trim();
  const password = String(newUserPin?.value || "").trim();
  const role = String(newUserRole?.value || "sales").trim();

  if (!name || !password) return toast("Name and PIN required");

  const res = await fetch("/api/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, password, role })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) return toast(data?.error || "Create user failed");

  if (newUserName) newUserName.value = "";
  if (newUserPin) newUserPin.value = "";

  toast("User created");
  await loadUsers();
});

resetBtn?.addEventListener("click", async () => {
  if (!confirm("Reset day? This clears queue + current + history + totals.")) return;

  const res = await fetch("/api/admin/reset", { method: "POST", credentials: "include" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return toast(data?.error || "Reset failed");
  toast("Reset done");
});

// -------------------- LOADERS --------------------
async function loadMe() {
  const res = await fetch("/api/me", { credentials: "include" });
  if (!res.ok) return null;
  const data = await res.json().catch(() => ({}));
  return data?.user || null;
}

async function loadState() {
  const res = await fetch("/api/state", { credentials: "include" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return toast(data?.error || "Failed to load state");
  state = data;
  render();
}

async function loadUsers() {
  const res = await fetch("/api/admin/users", { credentials: "include" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return toast(data?.error || "Failed to load users");

  if (manualUser) manualUser.innerHTML = "";
  (data.users || []).forEach((u) => {
    if (u.role !== "sales") return;
    const opt = document.createElement("option");
    opt.value = String(u.id);
    opt.textContent = u.name;
    manualUser.appendChild(opt);
  });

  if (usersList) usersList.innerHTML = "";
  (data.users || []).forEach((u) => {
    const row = document.createElement("div");
    row.className = "totalRow";
    row.innerHTML = `
      <div class="name">${escapeHtml(u.name)} <span class="chip muted" style="margin-left:8px;">${escapeHtml(u.role)}</span></div>
      <div style="display:flex; gap:8px; align-items:center;">
        <div class="count">${u.ups_today ?? 0}</div>
        <button class="btn" data-reset-pin="${u.id}" data-reset-name="${escapeHtml(u.name)}">Reset PIN</button>
        ${u.id !== me.id ? `<button class="btn danger" data-del-user="${u.id}" data-del-name="${escapeHtml(u.name)}">Delete</button>` : ""}
      </div>
    `;
    usersList.appendChild(row);
  });

  usersList?.querySelectorAll("button[data-del-user]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.getAttribute("data-del-user"));
      const name = btn.getAttribute("data-del-name") || "user";
      await deleteUserAccount(id, name);
    });
  });

  usersList?.querySelectorAll("button[data-reset-pin]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.getAttribute("data-reset-pin"));
      const name = btn.getAttribute("data-reset-name") || "user";
      if (!Number.isFinite(id)) return;
      await resetUserPin(id, name);
    });
  });
}

// -------------------- RENDER --------------------
function render() {
  if (!me || !state) return;

  // Header
  if (meLine) meLine.textContent = `Logged in as ${me.name}`;
  if (roleChip) roleChip.textContent = me.role;

  // Manager panel show/hide
  if (managerBox) managerBox.hidden = me.role !== "manager";
  if (printBtn) printBtn.style.display = me.role === "manager" ? "inline-flex" : "none";

  const qArr = state.queue || [];
  if (queueCount) queueCount.textContent = String(qArr.length);

  // Compute next available (server provides it)
  const nextAvail = state.next_available || null;

  // Busy list (server provides current_ups)
  const currentUps = state.current_ups || [];
  const myCurrent = currentUps.find((c) => Number(c.user_id) === Number(me.id)) || null;

  // Queue list
  if (queueList) queueList.innerHTML = "";
  if (queueEmpty) queueEmpty.style.display = qArr.length ? "none" : "block";

  qArr.forEach((q, idx) => {
    const li = document.createElement("li");
    li.className = "item";

    const shiftTag = q.shift ? ` • ${escapeHtml(String(q.shift).toUpperCase())}` : "";
    const isNext = nextAvail && Number(nextAvail.user_id) === Number(q.user_id);
    const badgeText = isNext ? "NEXT" : "#" + (idx + 1);

    const managerControls =
      me.role === "manager"
        ? `
          <div style="display:flex; gap:6px; align-items:center;">
            <button class="btn" data-move="up" data-user="${escapeHtml(q.user_id)}" ${idx === 0 ? "disabled" : ""}>▲</button>
            <button class="btn" data-move="down" data-user="${escapeHtml(q.user_id)}" ${idx === qArr.length - 1 ? "disabled" : ""}>▼</button>
          </div>
        `
        : "";

    li.innerHTML = `
      <div>
        <div class="name">${escapeHtml(q.name)}${shiftTag}</div>
        <div class="meta">Added ${fmtTime(q.added_at)}${q.note ? " • " + escapeHtml(q.note) : ""}</div>
      </div>
      <div style="display:flex; gap:8px; align-items:center;">
        <div class="badge ${isNext ? "next" : ""}">${badgeText}</div>
        ${managerControls}
      </div>
    `;
    queueList.appendChild(li);
  });

  // Move handlers
  if (me.role === "manager") {
    queueList?.querySelectorAll("button[data-move]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const dir = btn.getAttribute("data-move");
        const userId = Number(btn.getAttribute("data-user"));
        if (!Number.isFinite(userId)) return;
        await moveQueueUser(userId, dir);
      });
    });
  }

  // Current display: show your own if you have one, else show the latest
  if (!currentUps.length) {
    if (liveChip) liveChip.textContent = "Idle";
    if (currentName) currentName.textContent = "None";
    if (currentMeta) currentMeta.textContent = "No up in progress";
  } else {
    const show = myCurrent || currentUps[0];
    if (liveChip) liveChip.textContent = `Live (${currentUps.length})`;
    if (currentName) currentName.textContent = show.name;
    const parts = [];
    parts.push(`Started ${fmtTime(show.taken_at)}`);
    if (show.client_type) parts.push(String(show.client_type).toUpperCase());
    if (show.note) parts.push(show.note);
    if (currentMeta) currentMeta.textContent = parts.join(" • ");
  }

  const isInQueue = qArr.some((x) => Number(x.user_id) === Number(me.id));
  const isNextAvailMe = nextAvail && Number(nextAvail.user_id) === Number(me.id);

  if (leaveBtn) leaveBtn.disabled = !isInQueue;

  // Take button: enabled only if in queue, not busy, and (you are nextAvailable or manager)
  if (takeBtn) {
    const canTake =
      isInQueue &&
      !myCurrent &&
      qArr.length > 0 &&
      (me.role === "manager" || !!isNextAvailMe);
    takeBtn.disabled = !canTake;
  }

  // Finish button: enabled if you have a current (manager can finish their own too)
  if (finishBtn) finishBtn.disabled = !myCurrent;

  // Request button: sales only, enabled if in queue, not busy, not next available, queue not empty
  if (requestTakeBtn) {
    requestTakeBtn.style.display = me.role === "sales" ? "inline-flex" : "none";
    requestTakeBtn.disabled = !(isInQueue && !myCurrent && !isNextAvailMe && qArr.length > 0);
  }

  // Totals
  if (totals) totals.innerHTML = "";
  const inQueueSet = new Set(qArr.map((q) => Number(q.user_id)));

  (state.totals || []).forEach((t) => {
    const uid = Number(t.id);
    const isIn = inQueueSet.has(uid);

    const managerBtns =
      me.role === "manager" && Number.isFinite(uid) && t.role === "sales"
        ? `
          <div style="display:flex; gap:8px; align-items:center;">
            ${
              isIn
                ? `<button class="btn danger" data-q-remove="${uid}">Remove</button>`
                : `<button class="btn" data-q-add="${uid}">Add to queue</button>`
            }
          </div>
        `
        : "";

    const row = document.createElement("div");
    row.className = "totalRow";
    row.innerHTML = `
      <div class="name">${escapeHtml(t.name)}</div>
      <div style="display:flex; gap:10px; align-items:center;">
        <div class="count">${t.ups_today ?? 0}</div>
        ${managerBtns}
      </div>
    `;
    totals.appendChild(row);
  });

  if (me.role === "manager" && totals) {
    totals.querySelectorAll("button[data-q-add]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const userId = Number(btn.getAttribute("data-q-add"));
        if (!Number.isFinite(userId)) return;
        await adminAddToQueue(userId);
      });
    });

    totals.querySelectorAll("button[data-q-remove]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const userId = Number(btn.getAttribute("data-q-remove"));
        if (!Number.isFinite(userId)) return;
        await adminRemoveFromQueue(userId);
      });
    });
  }

  // History
  const hArr = state.history || [];
  if (historyCount) historyCount.textContent = String(hArr.length);
  if (historyList) historyList.innerHTML = "";
  if (historyEmpty) historyEmpty.style.display = hArr.length ? "none" : "block";

  hArr.forEach((h) => {
    const li = document.createElement("li");
    li.className = "item";

    const when = h.event_time || h.finished_at || h.taken_at || h.added_at;
    const typeTag = h.client_type ? ` • ${escapeHtml(String(h.client_type).toUpperCase())}` : "";
    const modelTag = h.model ? ` • ${escapeHtml(h.model)}` : "";
    const stockTag = h.stock ? ` • ${escapeHtml(h.stock)}` : "";

    const delBtn =
      me.role === "manager" && h.id
        ? `<button class="btn danger" data-del-history="${escapeHtml(h.id)}">Delete</button>`
        : "";

    li.innerHTML = `
      <div>
        <div class="name">${escapeHtml(h.name)}${typeTag}</div>
        <div class="meta">${fmtDateTime(when)}${modelTag}${stockTag}${h.note ? " • " + escapeHtml(h.note) : ""}</div>
      </div>
      <div style="display:flex; gap:8px; align-items:center;">
        <div class="badge">${fmtTime(when)}</div>
        ${delBtn}
      </div>
    `;
    historyList.appendChild(li);
  });

  if (me.role === "manager") {
    historyList?.querySelectorAll("button[data-del-history]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-del-history");
        await deleteHistoryItem(id);
      });
    });
  }

  // Take Requests render
  renderTakeRequests();

  // Hint line
  if (myCurrent) {
    if (ruleHint) ruleHint.textContent = "Finish when done (model + stock).";
  } else if (!qArr.length) {
    if (ruleHint) ruleHint.textContent = "Join the queue to get your turn.";
  } else if (isNextAvailMe) {
    if (ruleHint) ruleHint.textContent = "You are NEXT available. Take the up.";
  } else if (nextAvail) {
    if (ruleHint) ruleHint.textContent = `Next available is ${nextAvail.name}.`;
  } else {
    if (ruleHint) ruleHint.textContent = "No available salesperson right now.";
  }
}

function renderTakeRequests() {
  if (!takeRequestsList || !takeRequestsEmpty || !takeRequestsCount) return;

  if (!me || me.role !== "manager") {
    takeRequestsCount.textContent = "0";
    takeRequestsList.innerHTML = "";
    takeRequestsEmpty.style.display = "block";
    return;
  }

  const reqs = state?.take_requests || [];
  takeRequestsCount.textContent = String(reqs.length);

  takeRequestsList.innerHTML = "";
  takeRequestsEmpty.style.display = reqs.length ? "none" : "block";

  reqs.forEach((r) => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `
      <div>
        <div class="name">${escapeHtml(r.requester_name || "")}</div>
        <div class="meta">${fmtTime(r.created_at)}${r.note ? " • " + escapeHtml(r.note) : ""}</div>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn success" data-appr="${escapeHtml(r.id)}">Approve</button>
        <button class="btn danger" data-deny="${escapeHtml(r.id)}">Deny</button>
      </div>
    `;
    takeRequestsList.appendChild(row);
  });

  takeRequestsList.querySelectorAll("button[data-appr]").forEach((b) => {
    b.addEventListener("click", () => approveTakeRequest(b.getAttribute("data-appr")));
  });
  takeRequestsList.querySelectorAll("button[data-deny]").forEach((b) => {
    b.addEventListener("click", () => denyTakeRequest(b.getAttribute("data-deny")));
  });
}

// -------------------- HELPERS --------------------
function fmtTime(ts) {
  return new Date(Number(ts)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function fmtDateTime(ts) {
  return new Date(Number(ts)).toLocaleString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let toastTimer = null;
function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

function showLogin() {
  if (loginView) loginView.hidden = false;
  if (appView) appView.hidden = true;
}

function showApp() {
  if (loginView) loginView.hidden = true;
  if (appView) appView.hidden = false;
}

function setManualTimeNow() {
  if (!manualTime) return;
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  manualTime.value = `${hh}:${mm}`;
}

// -------------------- BOOT --------------------
(async function boot() {
  const user = await loadMe();
  if (!user) {
    showLogin();
    return;
  }
  me = user;
  showApp();
  setManualTimeNow();
  await loadState();
  if (me.role === "manager") await loadUsers();
})();
