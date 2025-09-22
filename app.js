import { getApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const app = getApp();               // usa el app inicializado en index.html
const db  = getFirestore(app);

// (Opcional para futuro) Si volvés a agregar “No podré asistir”
const WHATSAPP_PHONE = "5493764000000";

const form           = document.querySelector("form");
const inputNombre    = document.querySelector('form input[type="text"]');
const inputInvitados = document.querySelector('form input[type="number"]');

async function guardarAsistencia({ nombre, invitados }) {
  return addDoc(collection(db, "confirmaciones"), {
    nombre,
    invitados,
    createdAt: serverTimestamp()
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = (inputNombre.value || "").trim();
  const invitados = Number(inputInvitados.value || "1");

  if (!nombre) {
    alert("Ingresá tu nombre y apellido.");
    return;
  }
  if (!Number.isFinite(invitados) || invitados < 1 || invitados > 20) {
    alert("Ingresá una cantidad válida de invitados (1–20).");
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  const prevTxt = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Enviando...";

  try {
    await guardarAsistencia({ nombre, invitados });
    btn.textContent = "¡Confirmado!";
    form.reset();
  } catch (err) {
    console.error(err);
    alert("No se pudo guardar. Intentá de nuevo.");
    btn.textContent = prevTxt;
  } finally {
    btn.disabled = false;
  }
});
