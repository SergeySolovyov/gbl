var browser = true;
var wallet;
var balance = 0;
var transactions;
var payTr;
var trTo;
var trAmount;
var fee = 0.001;
init();

setTimeout(newTrxTest, 2000);
function init() {
    asyncInit();
    console.log("hello world0");
    async function asyncInit() {
        await jsbtc.asyncInit(window);
        console.log("hello world1");
    }

}
function newTrxTest() {
    let tx = new Transaction({ lockTime: 32659 });
    tx.addInput({
        txId: "70dc456b72e9fa24a242e59bfc98a777d0fe53b690134a892952567f08e0fff3",
        vOut: 0,
        address: "bgl1qqyxehy7gpvnl0fcgmwqmu5sxj5v33nf599j4gt"
    });
    tx.addOutput({ value: 48.985 * 100000000, address: "bgl1qxmju35mvzsl7l9wae7tpx39kuc8547k5j0jmhc" });
    //tx.addOutput({ value: 9 * 100000000, address: "bgl1qqyxehy7gpvnl0fcgmwqmu5sxj5v33nf599j4gt" });
    tx.signInput(0, {
        privateKey: "KyQvNFid7mWpqywhp5CJMRzN4LN5sDLhdN35k7L8n6vYuzLCTQt7",
        sigHashType: SIGHASH_ALL, value: 48.99 * 100000000
    });
    // https://bgl.bitaps.com/78c5454deb539ca6712a548ecef6b84061d79318a3ff565ce9854f403c37cc59
    console.log(tx);
    //sendTrx(tx)
}

function newTrx(amount, addressTo) {
    let tx = new Transaction({ lockTime: 32659 });
    tx.addInput({
        txId: payTr,
        vOut: 0,
        address: wallet.getAddress(0).address
    });
    tx.addOutput({ value: (amount - fee) * 100000000, address: addressTo });
    tx.addOutput({ value: (payTrAmount - amount) * 100000000, address: wallet.getAddress(0).address });
    tx.signInput(0, {
        privateKey: wallet.getAddress(0).privateKey,
        sigHashType: SIGHASH_ALL, value: payTrAmount * 100000000
    });
    // https://bgl.bitaps.com/78c5454deb539ca6712a548ecef6b84061d79318a3ff565ce9854f403c37cc59
    console.log(tx);
    return tx;
}

function newWallet() {
    e = generateEntropy();
    m = entropyToMnemonic(e);
    let w = new Wallet({from: m});
    console.log(w.getAddress(0).privateKey);
    console.log(w.getAddress(0).publicKey);
    console.log(w.getAddress(0).address);
    document.getElementById("mnemonic").value = m;
    getWallet(m);
    wallet = w;
    return w;
}
function getWallet(m) {
    let w = new Wallet({from: m});
    wallet = w;
    document.getElementById("prvkey").innerHTML = w.getAddress(0).privateKey;
    document.getElementById("pubkey").innerHTML = w.getAddress(0).publicKey;
    document.getElementById("address").innerHTML = w.getAddress(0).address;
    getTransactions();
    return w;
}
function getTransactions() {
    $.post( "https://bgl.bitaps.com/address/transactions/" + wallet.getAddress(0).address, function( data ) {
        //html = $.parseHTML( data ).getElementsByClassName("mono");
        parser = new DOMParser();
        doc = parser.parseFromString(data, "text/html");
        transactions = doc.getElementsByClassName("mono");
        trAmount = doc.getElementsByClassName("tx-amount");
        for (let i = 0; i<transactions.length; i++) {
            amount = trAmount[i].firstElementChild.innerText.replace(/\n/g,'').replace(/ /g,'');
            var ul = document.getElementById("transactions");
            var li = document.createElement("li");
            var div = document.createElement("div");
            div.innerHTML = ("<span style='font-size: 10pt;' onclick='getInfo((this.textContent || this.innerText))'>"+transactions[i].innerText+"</span> <span style='color: #007bff;font-size: 18pt;'>"+amount+"</span>");
            li.appendChild(div);
            ul.appendChild(li);
            balance = balance + parseFloat(amount);
        }
        getTransactionForPay();
        console.log(payTr)
        document.getElementById("balance").innerHTML = balance;
      });
}

function getMyWallet() {
    let w = new Wallet({from: "KyQvNFid7mWpqywhp5CJMRzN4LN5sDLhdN35k7L8n6vYuzLCTQt7"});
    console.log(w.mnemonic);
    console.log(w.getAddress(0).address);
    return w;
}

function sendTrx(tr) {
    outData = {"jsonrpc":"1.0","id":"curltext","method":"sendrawtransaction","params":[tr.rawTx]}
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/rrr?trx=" + tr.rawTx,
      }).done(function( msg ) {
        console.log(msg);
        if (msg == "ok"){
            addTr(tr);
        }
        
      });
    }


function getTransactionForPay() {
    for (let i = 0; i<transactions.length; i++) {
        pay = parseFloat(trAmount[i].firstElementChild.innerText.replace(/\n/g,'').replace(/ /g,''));
        if (pay > 0) {
            payTr = transactions[i].innerText.replace(/\n/g,'').replace(/ /g,'');
            payTrAmount = pay;
            return;
        }
    }
}
function getTo(to) {
    trTo = to;
}
function getAmount(am) {
    trAmount = am;
}
function send() {
    let t = newTrx(trAmount, trTo);
    sendTrx(t);
}
function getInfo(tr) {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/info?trx=" + tr,
      }).done(function( msg ) {
        alert( "Confirmations: " + msg );
      });
}
function addTr(tr) {
    var ul = document.getElementById("transactions");
            var li = document.createElement("li");
            var div = document.createElement("div");
            div.innerHTML = ("<span style='font-size: 10pt;' onclick='getInfo((this.textContent || this.innerText))'>"+tr.txId+"</span> <span style='color: #007bff;font-size: 18pt;'>"+trAmount+"</span>");
            li.appendChild(div);
            ul.appendChild(li);
            balance = balance + parseFloat(amount);
}