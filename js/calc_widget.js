function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

crypt_calc_background_color = typeof crypt_calc_background_color == "undefined" ? "#FFFFFF" : crypt_calc_background_color;
crypt_calc_transperency = typeof crypt_calc_transperency == "undefined" ? true : crypt_calc_transperency;
crypt_calc_border_width = typeof crypt_calc_border_width == "undefined" ? 0 : crypt_calc_border_width;
crypt_calc_border_color = typeof crypt_calc_border_color == "undefined" ? "#CCCCCC" : crypt_calc_border_color;
crypt_calc_border_corners = typeof crypt_calc_border_corners == "undefined" ? "rounded" : crypt_calc_border_corners;
crypt_calc_font_family = typeof crypt_calc_font_family == "undefined" ? "Arial" : crypt_calc_font_family;
crypt_calc_font_size = typeof crypt_calc_font_size == "undefined" ? "medium" : crypt_calc_font_size;
crypt_calc_font_color = typeof crypt_calc_font_color == "undefined" ? "#000000" : crypt_calc_font_color;

crypt_calc_options = eval('(' + httpGet("https://api.cryptonator.com/api/currencies") + ')');
crypt_calc_optionsArr = new Array();

for (var i = 0; i < crypt_calc_options.rows.length; ++i) {
    crypt_calc_optionsArr.push(crypt_calc_options.rows[i].name + " (" + crypt_calc_options.rows[i].code + ")");
}

crypt_calc_optionsArr.sort();

function outList(item) {
    var text = "";

    for (var i = 0; i < crypt_calc_optionsArr.length; ++i) {
        var code = crypt_calc_optionsArr[i].match(/.*?\(([0-9a-z$-]+)\)/i)[1];

        if (code == item)
            text += '<option value="' + code + '" selected>' +
                crypt_calc_optionsArr[i] + '</option>';
        else
            text += '<option value="' + code + '">' +
                crypt_calc_optionsArr[i] + '</option>';
    }

    return text;
}


if (crypt_calc_transperency)
    crypt_calc_background_color = 'transparent';

switch (crypt_calc_font_size) {
    case 'small':
        crypt_calc_font_size = "80%";
        break;

    case 'medium':
        crypt_calc_font_size = "100%";
        break;

    case 'large':
        crypt_calc_font_size = "150%";
        break;
}

crypt_calc_style = 'background: ' + crypt_calc_background_color +
    '; border: ' + crypt_calc_border_width + 'px solid ' + crypt_calc_border_color + ';' +
    'font-family: ' + crypt_calc_font_family +'; font-size: ' + crypt_calc_font_size +
    '; color: ' + crypt_calc_font_color + ';';

crypt_calc_font_style = 'font-family: ' + crypt_calc_font_family +'; font-size: ' + crypt_calc_font_size + '; height: auto;';

if (crypt_calc_border_corners == "square") {
    crypt_calc_style += "-webkit-border-radius: 0 !important; -moz-border-radius: 0 !important; border-radius: 0 !important;";
}

document.write('\
<div class="cryptonatorwidget" style="padding:0px;' + crypt_calc_style + '">\
		<div class="row">\
			<div class="col-md-4 col-sm-4 ">\
			<div class="input-group mb-3" style="display:flex; justify-content:center; align-items:center; ">\
  <div class="input-group-prepend" style="padding:13px; border:1px solid #ebe8e8cf;  border-radius:2px; ">\
    <span class="input-group-text">$</span>\
  </div>\
				<input id="amount-1" class="form-control" type="text" placeholder="Enter amount" style="width:100%;' + crypt_calc_font_style + '">\
				</div>\
			</div>\
			<div class="col-md-4 col-sm-4 form-group">\
					<input class="form-control" type="text" placeholder="Daily 2.0% ROI" style="width:100%;' + crypt_calc_font_style + '">\
			</div>\
			<div class="col-md-4 col-sm-4 form-group">\
			<div class="input-group mb-3" style="display:flex; justify-content:center; align-items:center; ">\
  <div class="input-group-prepend" style="padding:13px; border:1px solid #ebe8e8cf;  border-radius:2px; ">\
    <span class="input-group-text">$</span>\
  </div>\
				<input id="amount-2" class="form-control" type="text" placeholder="Daily" style="width:100%;' + crypt_calc_font_style + '">\
			</div>\
			</div>\
			<div class="col-md-4 col-sm-4 form-group">\
			<div class="input-group mb-3" style="display:flex; justify-content:center; align-items:center; ">\
  <div class="input-group-prepend" style="padding:13px; border:1px solid #ebe8e8cf;  border-radius:2px; ">\
    <span class="input-group-text">$</span>\
  </div>\
				<input id="amount-3" class="form-control" type="text" placeholder="Weekly" style="width:100%;' + crypt_calc_font_style + '">\
			</div>\</div>\
			<div class="col-md-4 col-sm-4 form-group">\
			<div class="input-group mb-3" style="display:flex; justify-content:center; align-items:center; ">\
  <div class="input-group-prepend" style="padding:13px; border:1px solid #ebe8e8cf;  border-radius:2px; ">\
    <span class="input-group-text">$</span>\
  </div>\
				<input id="amount-4" class="form-control" type="text" placeholder="Monthly"  style="width:100%;' + crypt_calc_font_style + '">\
				</div>\
			</div>\<div class="col-md-4 col-sm-4 form-group">\
			<div class="input-group mb-3" style="display:flex; justify-content:center; align-items:center; ">\
  <div class="input-group-prepend" style="padding:13px; border:1px solid #ebe8e8cf;  border-radius:2px; ">\
    <span class="input-group-text">$</span>\
  </div>\
				<input id="amount-5" class="form-control" type="text" placeholder="Total" style="width:100%;' + crypt_calc_font_style + '">\
			</div>\
				</div>\
			<button type="button id="cal" class="btn btn-danger" onclick="calculate()">Calculate</button>\
			</div>\
    </div>');

crypt_calc_price12 = 0;
crypt_calc_price21 = 0;

function loadRates() {
    var crypt_calc_cur1 = document.getElementById('cur-1').value;
    var crypt_calc_cur2 = document.getElementById('cur-2').value;

    var crypt_calc_getPar = eval('(' + httpGet("https://api.cryptonator.com/api/ticker/" +
        crypt_calc_cur1 + "-" + crypt_calc_cur2) + ')');

    if (crypt_calc_getPar.success == true)
        crypt_calc_price12 = crypt_calc_getPar.ticker.price;
    else
        crypt_calc_price12 = 0;

    crypt_calc_getPar = eval('(' + httpGet("https://api.cryptonator.com/api/ticker/" +
        crypt_calc_cur2 + "-" + crypt_calc_cur1) + ')');

    if (crypt_calc_getPar.success == true)
        crypt_calc_price21 = crypt_calc_getPar.ticker.price;
    else
        crypt_calc_price21 = 0;
}


function calculate(){
    let amount=document.getElementById('amount-1').value;
    if(amount<50){
        alert ("amount must be greater than 50");
        return 
    }
    let daily_reward= amount*2/100; 
     let weekly_reward= amount*2/100*7;
     let monthaly_reward= amount*2/100*30;
     document.getElementById('amount-2').value=daily_reward+"  Daily";
     document.getElementById('amount-3').value=weekly_reward+"  Weekly";
      document.getElementById('amount-4').value=monthaly_reward+"  Monthly";
       document.getElementById('amount-5').value=daily_reward*300+"  Total";
}
document.getElementById("cal").onclick=calculate
document.getElementById('cur-1').onchange = function () {

    if (document.getElementById('amount-1').value > 0) {
        if (crypt_calc_price12 != 0)
            document.getElementById('amount-2').value = document.getElementById('amount-1').value * crypt_calc_price12;
        else
            document.getElementById('amount-2').value = "No price available";
    }
}

document.getElementById('cur-2').onchange = function () {
    
    if (document.getElementById('amount-2').value > 0) {
        if (crypt_calc_price21 != 0)
            document.getElementById('amount-1').value = document.getElementById('amount-2').value * crypt_calc_price21;
        else
            document.getElementById('amount-1').value = "No price available";
    }
}

document.getElementById('amount-1').onkeyup = function () {
        if (crypt_calc_price12 != 0)
            document.getElementById('amount-2').value = document.getElementById('amount-1').value * crypt_calc_price12;
        else
            document.getElementById('amount-2').value = "No price available";
}

document.getElementById('amount-2').onkeyup = function () {
    if (crypt_calc_price21 != 0)
        document.getElementById('amount-1').value = document.getElementById('amount-2').value * crypt_calc_price21;
    else
        document.getElementById('amount-1').value = "No price available";
}