import {
  collection,
  setDoc,
  doc,
  serverTimestamp,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


import { db } from "./firebase-config.js";

// =========================
// MÁSCARA DO TELEFONE
// =========================
const telefoneInput = document.getElementById("telefone");

if (telefoneInput) {
  telefoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
      e.target.value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`;
    } else if (value.length > 2) {
      e.target.value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    } else if (value.length > 0) {
      e.target.value = `(${value}`;
    }
  });
}

// =========================
// FORMULÁRIO DE PRESENÇA
// =========================
const formPresenca = document.getElementById("formPresenca");

if (formPresenca) {
  formPresenca.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const confirmacao = document.getElementById("confirmacaoSelect").value;
    const msg = document.getElementById("msgConfirmacao");

    if (confirmacao === "sim" && telefone.length < 15) {
      msg.innerHTML = "Digite um telefone válido no formato (61) 99999-9999 📱";
      msg.style.display = "block";
      return;
    }

    try {
  
// 🔥 ID legível: nome + telefone
const idDocumento = nome
  .toLowerCase()
  .trim()
  .replace(/\s+/g, "_")
  .replace(/[^\w_]/g, "");

// =========================
// 🔒 VERIFICA DUPLICIDADE
// =========================

// Normalizações
const nomeNormalizado = nome.toLowerCase().trim();
const telefoneNormalizado = telefone.replace(/\D/g, "");

// 🔍 Verifica nome duplicado
const qNome = query(
  collection(db, "confirmacoes"),
  where("nomeLower", "==", nomeNormalizado)
);

const snapNome = await getDocs(qNome);
if (!snapNome.empty) {
  mostrarModalConfirmacao(
    "Este nome já foi utilizado na confirmação.",
    "alerta"
  );
  return;
}

// 🔍 Verifica telefone duplicado
const qTelefone = query(
  collection(db, "confirmacoes"),
  where("telefoneClean", "==", telefoneNormalizado)
);

const snapTelefone = await getDocs(qTelefone);
if (!snapTelefone.empty) {
  mostrarModalConfirmacao(
    "Este telefone já foi utilizado na confirmação.",
    "alerta"
  );
  return;
}

await setDoc(doc(db, "confirmacoes", idDocumento), {
  nome,
  nomeLower: nomeNormalizado,        // 🔑 para busca
  telefone,
  telefoneClean: telefoneNormalizado, // 🔑 para busca
  confirmacao,
  createdAt: serverTimestamp()
});

 
if (confirmacao === "sim") {
  mostrarModalConfirmacao(
    `Obrigado, ${nome}! Sua presença foi confirmada ❤️`
  );
} else {
  mostrarModalConfirmacao(
    `${nome}, sentimos muito que você não poderá comparecer 😢`
  );
}
      msg.style.display = "block";
      formPresenca.reset();

    } catch (error) {
      console.error("Erro ao salvar no Firebase:", error);
      msg.innerHTML = "Erro ao enviar confirmação. Tente novamente.";
      msg.style.display = "block";
    }
  });
}


// =========================
// CONTAGEM REGRESSIVA
// =========================

// DATA DO CASAMENTO (ANO, MÊS-1, DIA, HORA, MINUTO)
const dataCasamento = new Date(2026, 5, 13, 16, 59,59); 
// 12 de dezembro de 2026 às 16:00
function atualizarContador() {
  const agora = new Date();
  const diferenca = dataCasamento - agora;
  if (diferenca <= 0) {
    document.querySelector(".contador-box").innerHTML =
      "<strong>🎉 É hoje! 🎉</strong>";
    return;
  }
  const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
  const segundos = Math.floor((diferenca / 1000) % 60);
  document.getElementById("dias").textContent = dias;
  document.getElementById("horas").textContent = horas;
  document.getElementById("minutos").textContent = minutos;
  document.getElementById("segundos").textContent = segundos;
}
// Atualiza a cada segundo
setInterval(atualizarContador, 1000);
atualizarContador();


// =====================================================
// SISTEMA DE PRESENTES (MODAL + PIX COPIA E COLA)
// =====================================================
// Abrir modal a partir do botão clicado
function presentear(botao) {
  const card = botao.closest(".card");
  if (!card) return;
  const titulo = card.querySelector("h3")?.innerText || "Presente";
  const valorTexto = card.querySelector(".valor")?.innerText || "0";
  abrirModalPresente(titulo, valorTexto);
}

// =====================================================
// MODAL DE PRESENTE
// =====================================================

function abrirModalPresente(titulo, valorTexto) {
  const modal = document.getElementById("modalPresente");
  const tituloEl = document.getElementById("modalTitulo");
  const valorEl = document.getElementById("modalValor");
  const pixEl = document.getElementById("pixCopiaCola");
  tituloEl.innerText = titulo;
  valorEl.innerText = valorTexto;

  // usa Pix pré-gerado
const chave = titulo.trim().toLowerCase();
pixAtual = PIX_POR_PRESENTE[chave];
if (!pixAtual) {
  pixEl.value = "Pix indisponível para este presente.";
} else {
  pixEl.value = pixAtual;
}
  modal.classList.remove("hidden");
}
function fecharModalPresente() {
  const modal = document.getElementById("modalPresente");
  if (modal) modal.classList.add("hidden");
}

// =====================================================
// FECHAR AO CLICAR FORA
// =====================================================
document.addEventListener("click", function (e) {
  const modal = document.getElementById("modalPresente");
  const content = modal?.querySelector(".modal-content");

  if (
    modal &&
    !modal.classList.contains("hidden") &&
    content &&
    !content.contains(e.target) &&
    !e.target.classList.contains("btn-card")
  ) {
    fecharModalPresente();
  }
});

// =====================================================
// PIX — COPIA E COLA (SEM QR)
// =====================================================
const PIX_POR_PRESENTE = {
  "bebida": "00020126530014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0205Adega5204000053039865406135.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***63047D9D",
  "eu ajudei": "00020126790014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0231Só pra não dizer que nao ajudei520400005303986540550.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***63044AC3",
  "deus tocou": "00020126700014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0222Deus tocou no coração 52040000530398654071000.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304B85F",
  "boleto":"00020126650014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0217Ajuda nos boletos5204000053039865406120.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304A0CA",
  "sal grosso":"00020126580014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0210Sal grosso520400005303986540550.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304E9B0",
  "lençol":"00020126590014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0211Lençol novo5204000053039865406120.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304D328",
  "cartório":"00020126570014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0209Cartório 5204000053039865406150.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***630459B3",
  "casal":"00020126630014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0215Noite do Casal 5204000053039865406200.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***63041FF5",
  "cerveja":"00020126560014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0208Cerveja 5204000053039865406100.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304A343",
  "churrasqueira":"00020126440014BR.GOV.BCB.PIX0122thamarafdias@gmail.com5204000053039865406250.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304EF9F",
  "coberta":"00020126700014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0222Cobertor para Thâmara 5204000053039865406130.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304CC0",
  "colher":"00020126560014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0208Faqueiro5204000053039865406250.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304A7F8",
  "comida":"00020126630014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0215Fila bo buffet 520400005303986540560.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304E03E",
  "copo":"00020126630014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0215Copos de vidro 520400005303986540550.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304D443",
  "dança":" 00020126560014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0208Dancinha520400005303986540585.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***63043140",
  "depurador":"00020126570014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0209Depurador5204000053039865406300.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***630478BB",
  "faca":"00020126650014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0217Conjunto de facas5204000053039865406150.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304D1E4",
  "festa":"00020126700014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0222Meter o louco na festa5204000053039865406150.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***63041147",
  "nosso filho":"00020126570014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0209Pergunta 5204000053039865406250.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304E73C",
  "para os gatos":"00020126630014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0215Aspirador de po5204000053039865406380.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***630482DA",
  "jogo de jantar":"00020126630014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0215Jogo de jantar 5204000053039865406300.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***63044E57",
  "lua de mel":"00020126670014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0219Vaquinha Lua de mel5204000053039865406100.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***630442CB",
  "lupa":"00020126520014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0204Lupa520400005303986540575.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***63045353",
  "mochila":"00020126550014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0207Mochila520400005303986540575.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304187C",
  "boque de flores":"00020126610014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0213Taxa do buque5204000053039865406100.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***63046662",
  "jogo de panela":"00020126440014BR.GOV.BCB.PIX0122thamarafdias@gmail.com5204000053039865406400.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304563D",
  "air fryer":"00020126580014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0210Air Fryer 5204000053039865406300.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***63041C5A",
  "pano":"00020126620014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0214Pano de Prato 520400005303986540547.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304BC90",
  "som do dj":"00020126610014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0213DJ tocar mais5204000053039865406150.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***630497B4"
};

let pixAtual = "";
function gerarPixCopiaECola(valor) {
  const valorStr = valor.toFixed(2);

  function campo(id, valor) {
    return id + String(valor.length).padStart(2, "0") + valor;
  }

  const merchantAccountInfo =
    campo("00", "BR.GOV.BCB.PIX") +
    campo("01", PIX_CHAVE);

  let payload =
    "000201" +
    campo("26", merchantAccountInfo) +
    "52040000" +
    "5303986" +
    campo("54", valorStr) +
    "5802BR" +
    campo("59", PIX_NOME) +
    campo("60", PIX_CIDADE) +
    "62070503***" +
    "6304";

  payload += calcularCRC16(payload);
  return payload;
}

// CRC16 obrigatório
function calcularCRC16(payload) {
  let crc = 0xFFFF;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }

  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
}



// =====================================================
// EXPOR FUNÇÕES PARA O HTML
// =====================================================
window.presentear = presentear;
window.abrirModalPresente = abrirModalPresente;
window.fecharModalPresente = fecharModalPresente;
window.copiarPix = copiarPix;
// =====================================================
//SCRIPT DA ANIMAÇÃO CORAÇÃO 
// =====================================================
function copiarPix() {
  const botao = document.querySelector(".btn-copy");
  const heart = document.getElementById("heartAnim");
  const hint = document.getElementById("pixHint");
  if (botao.classList.contains("copiado")) return;
  navigator.clipboard.writeText(pixAtual).then(() => {
    // Botão
    botao.classList.add("copiado");
    botao.innerText = "Pix copiado ✔";
    // Texto orientativo
    hint.classList.remove("hidden");
    setTimeout(() => hint.classList.add("show"), 50);
    // Coração ❤️
    heart.classList.remove("hidden");
    heart.classList.add("show");
    // Remove coração
    setTimeout(() => {
      heart.classList.remove("show");
      heart.classList.add("hidden");
    }, 4200);
    // Reset botão e texto
    setTimeout(() => {
      botao.classList.remove("copiado");
      botao.innerText = "Copiar código Pix";
      hint.classList.remove("show");
      setTimeout(() => hint.classList.add("hidden"), 300);
    }, 3000);
  });
}


/* =========================
 MODAL CONFIRMAÇÃO PRESENÇA
========================= */
function mostrarModalConfirmacao(mensagem, tipo = "sucesso") {
  const modal = document.getElementById("modalConfirmacao");
  const mensagemEl = document.getElementById("modalMensagem");
  const iconEl = modal.querySelector(".modal-icon");
  const boxEl = modal.querySelector(".modal-box");

  // Reset visual
  boxEl.classList.remove("modal-sucesso", "modal-alerta", "modal-erro");

  // Tipos de modal
  if (tipo === "alerta") {
    iconEl.textContent = "⚠️";
    boxEl.classList.add("modal-alerta");
  } else if (tipo === "erro") {
    iconEl.textContent = "❌";
    boxEl.classList.add("modal-erro");
  } else {
    iconEl.textContent = "❤️";
    boxEl.classList.add("modal-sucesso");
  }

  mensagemEl.textContent = mensagem;
  modal.classList.remove("hidden");
}

// =========================
// FECHAR MODAL CONFIRMAÇÃO
// =========================
window.fecharModalConfirmacao = function () {
  const modal = document.getElementById("modalConfirmacao");
  if (!modal) return;

  modal.classList.add("hidden");

  // limpa mensagem (opcional)
  const msg = document.getElementById("modalMensagem");
  if (msg) msg.textContent = "";
};

