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






















// =================================================================
// SISTEMA DE PRESENTES + MODAIS (CORRIGIDO E MELHORADO)
// =================================================================

// Guarda o CARD REAL clicado
let cardSelecionado = null;
let presenteSelecionado = "";


// 1️⃣ Clique em "Presentear"
function presentear(item, idCard) {
  presenteSelecionado = item;
  cardSelecionado = document.getElementById(idCard);

  if (!cardSelecionado) {
    console.error("❌ Card não encontrado:", idCard);
    alert("Erro ao selecionar presente. Recarregue a página.");
    return;
  }

  document.getElementById("textoConfirmacao").innerText =
    `Você deseja escolher o presente: "${item}"?`;

  document.getElementById("modalConfirmar").style.display = "block";
}


// 2️⃣ Confirmar presente
function confirmarPresente() {
  if (!cardSelecionado) {
    alert("Erro ao confirmar presente.");
    return;
  }

  const botao = cardSelecionado.querySelector(".btn-card");
  const status = cardSelecionado.querySelector(".status");

  if (botao) botao.style.display = "none";
  if (status) status.innerHTML = "🎉 Já escolhido!";

  cardSelecionado.classList.add("selecionado");

  // Fecha modal confirmar
  document.getElementById("modalConfirmar").style.display = "none";

  // Abre modal elegante
  document.getElementById("textoModal").innerText =
    `Obrigado por escolher presentear: ${presenteSelecionado} ❤️`;

  document.getElementById("modalPresente").style.display = "block";
}


// 3️⃣ Fechar modal de confirmação
function fecharModalConfirmar() {
  document.getElementById("modalConfirmar").style.display = "none";
}


// =========================
// MODAL ELEGANTE (FECHAR)
// =========================
function fecharModal() {
  document.getElementById("modalPresente").style.display = "none";
}


// =========================
// FECHAR MODAIS AO CLICAR FORA
// =========================
window.onclick = function (event) {

  const modalElegante = document.getElementById("modalPresente");
  if (event.target === modalElegante) {
    modalElegante.style.display = "none";
  }

  const modalConfirmar = document.getElementById("modalConfirmar");
  if (event.target === modalConfirmar) {
    modalConfirmar.style.display = "none";
  }
};




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


