let token = localStorage.getItem("smartbusToken") || "";
const socket = io();

function msg(id, text, error=false) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = error ? "error" : "";
}

async function api(url, options={}) {
  options.headers = { ...(options.headers||{}), "Content-Type":"application/json" };
  if (token) options.headers.Authorization = "Bearer " + token;
  const r = await fetch(url, options);
  const data = await r.json();
  if (!r.ok) throw new Error(data.message || "Request failed");
  return data;
}

async function register() {
  try {
    const data = await api("/api/auth/register", {
      method:"POST",
      body:JSON.stringify({name:rName.value,email:rEmail.value,password:rPass.value})
    });
    msg("registerMsg", data.message);
  } catch(e) { msg("registerMsg", e.message, true); }
}

async function login() {
  try {
    const data = await api("/api/auth/login", {
      method:"POST",
      body:JSON.stringify({email:email.value,password:pass.value})
    });
    token = data.token;
    localStorage.setItem("smartbusToken", token);
    msg("loginMsg", `Welcome ${data.user.name} (${data.user.role})`);
  } catch(e) { msg("loginMsg", e.message, true); }
}

function adminLoginHint() {
  msg("loginMsg", "Create an admin user in Compass or update a user's role to admin for admin endpoints.");
}

async function searchBuses() {
  try {
    const data = await api(`/api/buses?from=${encodeURIComponent(document.getElementById("from").value)}&to=${encodeURIComponent(document.getElementById("to").value)}`);
    document.getElementById("buses").innerHTML = data.length ? data.map(b => `
      <div class="bus">
        <b>${b.busNumber}</b> — ${b.from} → ${b.to}<br>
        Seats: <span class="available">${b.availableSeats}/${b.totalSeats}</span> | ₹${b.price}
        <br><input id="seat-${b._id}" type="number" min="1" max="${b.availableSeats}" value="1">
        <button onclick="bookBus('${b._id}')">Book Ticket</button>
        <button class="secondary" onclick="showSeats('${b._id}')">Seat Availability</button>
        <div id="seatview-${b._id}"></div>
      </div>`).join("") : "<p>No buses found. Add buses through the API or Compass.</p>";
  } catch(e) { document.getElementById("buses").innerHTML = `<p class="error">${e.message}</p>`; }
}

async function bookBus(id) {
  try {
    const seats = Number(document.getElementById("seat-"+id).value);
    const data = await api("/api/bookings", {
      method:"POST",
      body:JSON.stringify({busId:id,seats,passengerDetails:"Web passenger"})
    });
    alert("Booking confirmed! ID: " + data._id);
    searchBuses();
  } catch(e) { alert(e.message); }
}

async function showSeats(id) {
  try {
    const data = await api("/api/seats?busId="+id);
    document.getElementById("seatview-"+id).textContent =
      "Available: " + data.availableSeats + " | Booked: " + data.seats.filter(s=>s.status==="booked").length;
  } catch(e) { alert(e.message); }
}

async function bookings() {
  try {
    const data = await api("/api/bookings");
    document.getElementById("bookingList").innerHTML = data.length ? data.map(b => `
      <div class="booking">
        <b>${b.bus?.busNumber || "Bus"}</b> — ${b.seats} seat(s) — ₹${b.amount}
        <br>Status: ${b.status}
        ${b.status==="confirmed" ? `<button onclick="cancelBooking('${b._id}')">Cancel</button>` : ""}
      </div>`).join("") : "<p>No bookings yet.</p>";
  } catch(e) { document.getElementById("bookingList").innerHTML = `<p class="error">${e.message}</p>`; }
}

async function cancelBooking(id) {
  if (!confirm("Cancel this booking?")) return;
  try {
    await api("/api/bookings/"+id,{method:"DELETE"});
    bookings();
    searchBuses();
  } catch(e) { alert(e.message); }
}

socket.on("seatUpdate", data => searchBuses());
