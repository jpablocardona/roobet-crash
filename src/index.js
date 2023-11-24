// Client Seed: hash of ETH block 17985520 (0xd2867566759e9158bda9bf93b343bbd9aa02ce1e0c5bc2b37a2d70d391b04f14)
// 2 millionth server seed: 76a11ece9e181cb5f0a71e71c45ca0e431b904306b9cb161fd43025a5d3ebb8d
// Public Seed Event: https://pastebin.com/1cGDjFyv

const crypto = require("crypto");

function generateSeed() {
  var hash = Math.random().toString(16).substring(2);
  return hash;
}

var seed = generateSeed();
var crashHash = generateHash();
const previousGames = [];
const salt =
  "0xd2867566759e9158bda9bf93b343bbd9aa02ce1e0c5bc2b37a2d70d391b04f14";

function generateHash() {
  return crypto.createHash("sha256").update(seed).digest("hex");
}

function divisible(hash, mod) {
  // We will read in 4 hex at a time, but the first chunk might be a bit smaller
  // So ABCDEFGHIJ should be chunked like  AB CDEF GHIJ
  var val = 0;

  var o = hash.length % 4;
  for (var i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
    val = ((val << 16) + parseInt(hash.substring(i, i + 4), 16)) % mod;
  }

  return val === 0;
}

function crashPointFromHash(serverSeed) {
  const hash = crypto
    .createHmac("sha256", serverSeed)
    .update(salt)
    .digest("hex");

  const hs = parseInt(100 / 4);
  if (divisible(hash, hs)) {
    return 1;
  }

  const h = parseInt(hash.slice(0, 52 / 4), 16);
  const e = Math.pow(2, 52);

  return Math.floor((100 * e - h) / (e - h)) / 100.0;
}

// function getPreviousGames() {
//   let gameHash = generateHash(crashHash);

//   for (let i = 0; i < 100; i++) {
//     const gameResult = crashPointFromHash(gameHash);
//     previousGames.push({ gameHash, gameResult });
//     gameHash = generateHash(gameHash);
//   }

//   return previousGames;
// }

function verifyCrash() {
  crashHash = generateHash();
  const gameResult = crashPointFromHash(crashHash);
  // const previousHundredGames = getPreviousGames();

  return { gameResult, crashHash };
}

var header = true
setInterval(function () {
  var val = verifyCrash()
  document.getElementById("crash-point").innerHTML =
  "Crash Point: " + val.gameResult + " - Hash: " + val.crashHash;
  const obj_tmp = [{ gameHash: val.gameResult, hash: val.crashHash }]
  previousGames.push(obj_tmp);
  jsonATabla(obj_tmp, header);
  console.log(val, previousGames);
  seed = generateSeed();
  header = false;
}, 1000);


function jsonATabla(json, header=false) {
  var obj = typeof json === 'string' ? JSON.parse(json) : json;

  // Creamos la tabla y los elementos thead y tbody
  var tabla = document.createElement('table');
  var thead = document.createElement('thead');
  var tbody = document.createElement('tbody');

  tabla.appendChild(thead);
  tabla.appendChild(tbody);

  // Agregando los encabezados a thead
  var cabecera = document.createElement('tr');
  Object.keys(obj[0]).forEach(function(clave) {
    var th = document.createElement('th');
    th.textContent = clave;
    cabecera.appendChild(th);
  });
  if (!header)  cabecera.style.visibility = 'hidden';
  
  thead.appendChild(cabecera);

  // Agregando las filas a tbody
  obj.forEach(function(fila) {
    var tr = document.createElement('tr');
    Object.keys(fila).forEach(function(clave) {
      var td = document.createElement('td');
      td.textContent = fila[clave];
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  // Añadimos la tabla al documento
  // Por ejemplo, podemos añadirla dentro de un div con id="container"
  document.getElementById('previous-games').appendChild(tabla);
}
