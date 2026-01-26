// =========================
// LISTA INTERNA DE CONVIDADOS
// =========================
let convidados = [];


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
  formPresenca.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const confirmacao = document.getElementById("confirmacaoSelect").value;
    const msg = document.getElementById("msgConfirmacao");

    if (confirmacao === "sim" && telefone.length < 15) {
      msg.innerHTML = "Digite um telefone válido no formato (61) 99999-9999 📱";
      msg.style.display = "block";
      return;
    }

    if (confirmacao === "sim") {
      msg.innerHTML = `Obrigado, ${nome}! Sua presença foi confirmada ❤️`;

      convidados.push({ nome, telefone });
      atualizarLista();
    } else {
      msg.innerHTML = "Que pena que você não poderá ir 😢";
    }

    msg.style.display = "block";
    this.reset();
  });
}


// =========================
// ATUALIZA LISTA SECRETA
// =========================
function atualizarLista() {
  const lista = document.getElementById("lista");
  if (!lista) return;

  lista.innerHTML = "";

  convidados.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.nome}</strong> — <span>${item.telefone}</span>`;
    lista.appendChild(li);
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

// =========================
// MODAL DE PRESENTE (ADAPTADO AO SEU HTML)
// =====================================================
// SISTEMA DE PRESENTES (UM ÚNICO MODAL)
// =====================================================

// Abrir modal a partir do botão clicado
function presentear(botao) {
  const card = botao.closest(".card");
  if (!card) return;

  const titulo = card.querySelector("h3")?.innerText || "Presente";
  const valor = card.querySelector(".valor")?.innerText || "";

  abrirModalPresente(titulo, valor);
}

// =====================================================
// MODAL DE PRESENTE
// =====================================================
function abrirModalPresente(titulo, valor) {
  const modal = document.getElementById("modalPresente");
  const tituloEl = document.getElementById("modalTitulo");
  const valorEl = document.getElementById("modalValor");

  if (!modal || !tituloEl || !valorEl) {
    console.error("Estrutura do modalPresente não encontrada");
    return;
  }

  tituloEl.innerText = titulo;
  valorEl.innerText = valor;

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

// EXPOR FUNÇÕES PARA O HTML (onclick)
window.fecharModalPresente = fecharModalPresente;
window.abrirModalPresente = abrirModalPresente;
window.presentear = presentear;




// =====================================================
//AREA DO PIX GERANDO QR CODE
// =====================================================

const PIX_CHAVE = "a6cb569c-d87a-42c6-8af4-398a4073d79a"; // email, cpf, telefone ou chave aleatória
const PIX_NOME = "Casamento";
const PIX_CIDADE = "BRASILIA";
function gerarPixCopiaECola(valor) {
  const valorStr = valor.toFixed(2);

  function campo(id, valor) {
    return id + String(valor.length).padStart(2, "0") + valor;
  }

  // 🔥 Campo 26 corretamente estruturado
  const merchantAccountInfo =
    campo("00", "BR.GOV.BCB.PIX") +
    campo("01", PIX_CHAVE);

  let payload =
    "000201" +
    campo("26", merchantAccountInfo) + // ← AQUI estava o erro
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


//Função CRC16 (OBRIGATÓRIA)Sem isso o Pix não funciona.
  
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

//Gerar QR dinamicamente ao clicar no card
let pixAtual = "";

function gerarQrPix(valor) {
  pixAtual = gerarPixCopiaECola(valor);

  const canvas = document.getElementById("qrCanvas");
  QRCode.toCanvas(canvas, pixAtual, { width: 220 });
}

function copiarPix() {
  navigator.clipboard.writeText(pixAtual);
  alert("Código Pix copiado!");
}

//Integrar com SEU botão presentear(this)
function presentear(botao) {
  const card = botao.closest(".card");
  if (!card) return;

  const titulo = card.querySelector("h3")?.innerText || "";
  const valorTexto = card.querySelector(".valor")?.innerText || "0";
  const valor = Number(valorTexto.replace(/[^\d,]/g, "").replace(",", "."));

  document.getElementById("modalTitulo").innerText = titulo;
  document.getElementById("modalValor").innerText = valorTexto;

  gerarQrPix(valor);
  abrirModalPresente();
}
