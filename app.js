import { getApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const app = getApp();
const db  = getFirestore(app);

// <<< EDITAR con tu número en formato internacional sin + >>>
const WHATSAPP_PHONE = "5493764000000";

const form           = document.querySelector("form");
const inputNombre    = document.querySelector('form input[type="text"]');
const inputInvitados = document.querySelector('form input[type="number"]');
const btnConfirmar   = document.querySelector('form button[type="submit"]');
const linkNoAsistir  = document.querySelector('form a');
const btnNoAsistir   = document.querySelector('form a button');

function buildWhatsAppURL() {
  const nombre = (inputNombre.value || "").trim();
  const msg = nombre
    ? `Hola, soy ${nombre}. Lamento avisar que no podré asistir.`
    : `Hola, no podré asistir.`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
}

function updateWhatsAppLink() {
  linkNoAsistir.setAttribute("href", buildWhatsAppURL());
  linkNoAsistir.setAttribute("target", "_blank");
  linkNoAsistir.setAttribute("rel", "noopener");
}
updateWhatsAppLink();
inputNombre.addEventListener("input", updateWhatsAppLink);

async function guardarAsistencia({ nombre, invitados }) {
  await addDoc(collection(db, "confirmaciones"), {
    nombre,
    invitados,
    createdAt: serverTimestamp()
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = (inputNombre.value || "").trim();
  const invitados = Number(inputInvitados.value || "1");

  if (!nombre) { alert("Ingresá tu nombre y apellido."); return; }
  if (!Number.isFinite(invitados) || invitados < 1 || invitados > 20) {
    alert("Ingresá una cantidad válida de invitados (1–20)."); return;
  }

  const prevTxt = btnConfirmar.textContent;
  btnConfirmar.disabled = true;
  btnConfirmar.textContent = "Enviando...";

  try {
    await guardarAsistencia({ nombre, invitados });
    btnConfirmar.textContent = "¡Confirmado!";
    form.reset();
    updateWhatsAppLink();
  } catch (err) {
    console.error(err);
    alert("No se pudo guardar. Intentá de nuevo.");
    btnConfirmar.textContent = prevTxt;
  } finally {
    btnConfirmar.disabled = false;
  }
});

// “No podré asistir” abre WhatsApp
btnNoAsistir.addEventListener("click", () => {
  // El <a> ya abre WhatsApp con el href
});
