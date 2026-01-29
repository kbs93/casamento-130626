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

  // 🔥 usa Pix pré-gerado
  pixAtual = PIX_POR_PRESENTE[titulo];

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
  "Bebida": "00020126530014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0205Adega5204000053039865406135.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***63047D9D",
  "Eu ajudei": "00020126790014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0231Só pra não dizer que nao ajudei520400005303986540550.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***63044AC3",
  "Deus tocou": "00020126700014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0222Deus tocou no coração 52040000530398654071000.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304B85F",
  "Boleto":" 00020126650014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0217Ajuda nos boletos5204000053039865406120.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304A0CA",
  "Sal grosso":" 00020126580014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0210Sal grosso520400005303986540550.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304E9B0",
  "Lençol":"00020126590014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0211Lençol novo5204000053039865406120.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304D328 ",
  "Cartorio":" 00020126570014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0209Cartório 5204000053039865406150.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***630459B3",
  "Casal ":" 00020126630014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0215Noite do Casal 5204000053039865406200.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***63041FF5",
  "Cerveja":" 00020126560014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0208Cerveja 5204000053039865406100.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304A343",
  "churrasqueira":" 00020126440014BR.GOV.BCB.PIX0122thamarafdias@gmail.com5204000053039865406250.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304EF9F",
  "Coberta":" 00020126700014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0222Cobertor para Thâmara 5204000053039865406130.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304CC0",
  "Colher":" 00020126560014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0208Faqueiro5204000053039865406250.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304A7F8",
  "Comida":"00020126630014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0215Fila bo buffet 520400005303986540560.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304E03E ",
  "Copo":" 00020126630014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0215Copos de vidro 520400005303986540550.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304D443",
  "Dança":" 00020126560014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0208Dancinha520400005303986540585.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***63043140",
  "Depurador":" 00020126570014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0209Depurador5204000053039865406300.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***630478BB",
  "Faca":" 00020126650014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0217Conjunto de facas5204000053039865406150.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304D1E4",
  "Festa":"00020126700014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0222Meter o louco na festa5204000053039865406150.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***63041147 ",
  "Nosso Filho":"00020126570014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0209Pergunta 5204000053039865406250.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304E73C",
  "Para os gatos":"00020126630014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0215Aspirador de po5204000053039865406380.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***630482DA ",
  "Jogo de jantar":" 00020126630014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0215Jogo de jantar 5204000053039865406300.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***63044E57",
  "Lua de mel":" 00020126670014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0219Vaquinha Lua de mel5204000053039865406100.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***630442CB",
  "Lupa":"00020126520014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0204Lupa520400005303986540575.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***63045353 ",
  "mochila":"00020126550014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0207Mochila520400005303986540575.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304187C ",
  "Boque de flores":" 00020126610014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0213Taxa do buque5204000053039865406100.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***63046662",
  "Jogo de panelas":"00020126440014BR.GOV.BCB.PIX0122thamarafdias@gmail.com5204000053039865406400.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304563D ",
  "Air fryer":" 00020126580014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0210Air Fryer 5204000053039865406300.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***63041C5A",
  "Pano":"00020126620014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0214Pano de Prato 520400005303986540547.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***6304BC90 ",
  "Som do dj":" 00020126610014BR.GOV.BCB.PIX0122thamarafdias@gmail.com0213DJ tocar mais5204000053039865406150.005802BR5921THAMARA FERREIRA DIAS6008BRASILIA62070503***630497B4"
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

// Copiar Pix
function copiarPix() {
  const botao = document.querySelector(".btn-copy");
  const heart = document.getElementById("heartAnim");

  if (botao.classList.contains("copiado")) return;

  navigator.clipboard.writeText(pixAtual).then(() => {
    // Botão verde
    botao.classList.add("copiado");
    botao.innerText = "Pix copiado ✓";

    // Mostra coração CSS
    heart.classList.remove("hidden");
    heart.classList.add("show");

    setTimeout(() => {
      heart.classList.remove("show");
      heart.classList.add("hidden");
    }, 100);

    // Volta botão
    setTimeout(() => {
      botao.classList.remove("copiado");
      botao.innerText = "Copiar código Pix";
    },);
  });
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

  if (botao.classList.contains("copiado")) return;

  navigator.clipboard.writeText(pixAtual).then(() => {
    // Botão verde
    botao.classList.add("copiado");
    botao.innerText = "Pix copiado ✔";

    // Mostra coração ❤️
    heart.classList.remove("hidden");
    heart.classList.add("show");

    // Remove coração após animação
    setTimeout(() => {
      heart.classList.remove("show");
      heart.classList.add("hidden");
    }, 4200);

    // Volta botão ao normal
    setTimeout(() => {
      botao.classList.remove("copiado");
      botao.innerText = "Copiar código Pix";
    }, 1500);
  });
}
