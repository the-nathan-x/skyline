"use strict";

function timeConverter(timestamp) {
    var u = new Date(timestamp * 1000);
    return u.getUTCFullYear() +
        '-' + ('0' + (u.getUTCMonth() + 1)).slice(-2) +
        '-' + ('0' + u.getUTCDate()).slice(-2) +
        ' ' + ('0' + u.getUTCHours()).slice(-2) +
        ':' + ('0' + u.getUTCMinutes()).slice(-2) +
        ':' + ('0' + u.getUTCSeconds()).slice(-2);
}

function number_formatter(n) {
    var parts = n.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function initChangellyPlugin(symbol, address) {
    if ($('#wrapperChangellyPlugin').length > 0) {
        var changellyUrl = 'https://old.changelly.com/widget/v1?auth=email&from=ETH&to=' + symbol + '&merchant_id=&address=' + address + '&amount=1&color=00cf70';
        $('#wrapperChangellyPlugin').html('<link rel="stylesheet" href="https://old.changelly.com/widget.css"\/><a id="changellyButton" href="' + changellyUrl + '" target="_blank"><img src="https://old.changelly.com/pay_button.png" \/><\/a><div id="changellyModal" style="z-index:9999999"><div class="changellyModal-content"><span class="changellyModal-close">x<\/span><iframe src="' + changellyUrl + '" width="600" height="500" class="changelly" scrolling="no" style="overflow-y:hidden; border: none" > Can\'t load widget <\/iframe><\/div><script type="text/javascript"> var changellyModal = document.getElementById(\'changellyModal\'); var changellyButton = document.getElementById(\'changellyButton\'); var changellyCloseButton = document.getElementsByClassName(\'changellyModal-close\')[0]; changellyCloseButton.onclick = function() { changellyModal.style.display = \'none\'; }; changellyButton.onclick = function widgetClick(e) { e.preventDefault(); changellyModal.style.display = \'block\'; }; <\/script><\/div>');
    }
}
var generatingDepositAddress = false;

function switchDepositCurrency(symbol) {
    $('#cardDepositAddress').removeClass('hide');
    $('#cardDepositGateway').addClass('hide');
    if (generatingDepositAddress) {
        toastr.warning('We\'re generating a new deposit address for you, please switch to other currency later.', 'WARNING', {
            closeButton: true,
            progressBar: true,
            timeOut: 3000
        });
        return false;
    }
    generatingDepositAddress = true;
    $('.slim-currencies a').removeClass('active');
    var ele = $('.slim-currencies a[data-currency-symbol="' + symbol + '"]');
    ele.addClass('active');
    var currencyDetail = ele.attr('data-currency-detail');
    currencyDetail = JSON.parse(currencyDetail);
    var cardDepositAddress = $('#cardDepositAddress');
    if (currencyDetail.symbol) {
        cardDepositAddress.find('.deposit-currency-symbol').text(currencyDetail.symbol);
    }
    if (currencyDetail.name) {
        cardDepositAddress.find('.deposit-currency-name').text(currencyDetail.name);
    }
    if (currencyDetail.confirms) {
        cardDepositAddress.find('.deposit-currency-confirms').text(currencyDetail.confirms);
    }
    if (currencyDetail.min_deposit) {
        cardDepositAddress.find('.deposit-currency-min-deposit').text(currencyDetail.min_deposit);
    }
    if (currencyDetail.exchange_rate) {
        cardDepositAddress.find('.deposit-currency-exchange-rate').text(currencyDetail.exchange_rate);
    }
    if (currencyDetail.symbol != coin.symbol) {
        cardDepositAddress.find('#fiatMinDeposit').removeClass('hide');
        cardDepositAddress.find('#alertExchangeRate').removeClass('hide');
    } else {
        cardDepositAddress.find('#fiatMinDeposit').addClass('hide');
        cardDepositAddress.find('#alertExchangeRate').addClass('hide');
    }
    cardDepositAddress.find('#depositAddress').text('Generating...');
    cardDepositAddress.find('#wrapperDestinationTag').addClass('hide');
    $.ajax({
        type: 'POST',
        url: cardDepositAddress.attr('data-action'),
        data: {
            currency: symbol
        },
        success: function(result) {
            if (result && result.status) {
                QRCode.toCanvas(document.getElementById('canvasDepositAddressQrcode'), result.data.address_uri, {
                    version: 9
                }, function(error) {
                    if (error) console.error(error);
                });
                cardDepositAddress.find('#depositAddress').text(result.data.address).attr('data-clipboard-text', result.data.address);
                if (result.data.destination_tag) {
                    cardDepositAddress.find('#destinationTag').text(result.data.destination_tag).attr('data-clipboard-text', result.data.destination_tag);
                    cardDepositAddress.find('#wrapperDestinationTag .deposit-currency-destination-tag-name').text(result.data.destination_tag_name);
                    cardDepositAddress.find('#wrapperDestinationTag').removeClass('hide');
                }
                initChangellyPlugin(symbol, result.data.address);
                return true;
            } else {
                toastr.error(result && result.message ? result.message : 'Failed to get the deposit address, please try again later.', 'ERROR', {
                    closeButton: true,
                    progressBar: true,
                    timeOut: 3000
                });
                return false;
            }
        },
        error: function() {
            toastr.error('Failed to get the deposit address, please try again later.', 'ERROR', {
                closeButton: true,
                progressBar: true,
                timeOut: 3000
            });
            return false;
        },
        complete: function() {
            generatingDepositAddress = false;
        }
    });
}

function switchDepositGateway(symbol) {
    $('#cardDepositAddress').addClass('hide');
    $('#cardDepositGateway').removeClass('hide');
    $('.slim-currencies a').removeClass('active');
    var ele = $('.slim-currencies a[data-currency-symbol="' + symbol + '"]');
    ele.addClass('active');
    var currencyDetail = ele.attr('data-currency-detail');
    currencyDetail = JSON.parse(currencyDetail);
    var cardDepositGateway = $('#cardDepositGateway');
    if (currencyDetail.min_deposit) {
        cardDepositGateway.find('.deposit-gateway-min-deposit').text(currencyDetail.min_deposit);
        cardDepositGateway.find('input[name="amount"]').attr('min', currencyDetail.min_deposit);
    }
    if (currencyDetail.exchange_rate) {
        cardDepositGateway.find('.deposit-gateway-exchange-rate').text(currencyDetail.exchange_rate);
    }
    cardDepositGateway.find('input[name="gateway"]').val(symbol);
}

$(function() {
    "use strict";
    $.ajaxSetup({
        timeout: 60000
    });

    function visitTracking() {
        $.post('/visit/track');
    }


    function getStatistics() {
  
            
                            if ($.isFunction($.fn.counterUp)) {
                                $('.counter').counterUp({
                                    delay: 10,
                                    time: 800,
                                    formatter: function(n) {
                                        var parts = n.toString().split(".");
                                        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        return parts.join(".");
                                    }
                                });
                            }
                    
        
    }

	getStatistics();

    function userLogin() {
        $('#formLogin').on('submit', function(e) {
            e.preventDefault();
            var inputWalletAddress = $('#formLogin input[name="walletAddress"]');
            var formLoginMessage = $('#formLogin label');
            var walletAddress = inputWalletAddress.val().trim();
            if (!WAValidator.validate(walletAddress, coin.symbol)) {
                formLoginMessage.html('Please enter a valid ' + coin.symbol + ' wallet address!').addClass('text-danger');
                return false;
            }
            var submitButton = $("#formLogin button[type='submit']");
            submitButton.attr('disabled', true);
            submitButton.children('i').eq(0).addClass('hide');
            submitButton.children('i').eq(1).removeClass('hide');
            $.ajax({
                type: 'POST',
                url: $(this).attr('action'),
                data: $(this).serialize(),
                dataType: 'json',
                success: function(result) {
                    if (result && true === result.status) {
                        (result.data && result.data.redirect) ? window.location.href = result.data.redirect: window.location.reload(true);
                        return true;
                    } else {
                        formLoginMessage.html(result && result.message ? result.message : 'Unknown error, please try again later.').addClass('text-danger');
                        return false;
                    }
                },
                error: function() {
                    formLoginMessage.html('A server error occurred, please try again later.').addClass('text-danger');
                    return false;
                },
                complete: function() {
                    submitButton.attr('disabled', false);
                    submitButton.children('i').eq(0).removeClass('hide');
                    submitButton.children('i').eq(1).addClass('hide');
                }
            });
        });
    }
    //userLogin();

    function initCountdown() {
        $('[data-countdown]').each(function() {
            var $this = $(this);
            var leftSeconds = $(this).data('countdown');
            if (leftSeconds > 0) {
                var endTimestamp = (new Date()).getTime() + leftSeconds * 1000;
                var finalDate = new Date(endTimestamp);
                $this.countdown(finalDate, function(event) {
                    $this.html('<span class="font-medium text-warning">' + event.strftime('%I:%M:%S') + '</span>');
                });
            }
        });
    }
    initCountdown();

    function initAccountNav() {
        var url = window.location + "";
        var path = url.replace(window.location.protocol + "//" + window.location.host + "/", "");
        var element = $('#accountNav a').filter(function() {
            $(this).removeClass('active');
            return path.indexOf(this.href.replace(window.location.protocol + "//" + window.location.host + "/", "")) >= 0;
        });
        element.addClass("active");
    }
    initAccountNav();

    function initClipboard() {
        var clipboard = new ClipboardJS('.clipboard');
        clipboard.on('success', function(e) {
            console.log(e);
            toastr.success('', 'COPIED', {
                closeButton: true,
                progressBar: true,
                timeOut: 1000
            });
        });
    }
    initClipboard();

    function bindDepositCurrencySwitch() {
        $('.slim-currencies a').on('click', function() {
            var symbol = $(this).attr('data-currency-symbol');
            var ele = $('.slim-currencies a[data-currency-symbol="' + symbol + '"]');
            var currencyDetail = ele.attr('data-currency-detail');
            currencyDetail = JSON.parse(currencyDetail);
            if (currencyDetail.type && currencyDetail.type == 'gateway') {
                switchDepositGateway(symbol);
            } else {
                switchDepositCurrency(symbol);
            }
        })
    }
    bindDepositCurrencySwitch();

    function createTicket() {
        $('#formCreateTicket').on('submit', function(e) {
            e.preventDefault();
            var submitButton = $("#formCreateTicket button[type='submit']");
            submitButton.attr('disabled', true);
            submitButton.children('i').removeClass('hide');
            $.ajax({
                type: 'POST',
                url: $(this).attr('action'),
                data: $(this).serialize(),
                dataType: 'json',
                success: function(result) {
                    if (result && true === result.status) {
                        toastr.success('We have received your ticket and will be responding to you as soon as possible! Thanks for your patience!', 'TICKET RECEIVED', {
                            closeButton: true,
                            progressBar: true,
                            timeOut: 2000,
                            onHidden: function() {
                                window.location.reload(true);
                            }
                        });
                        return true;
                    } else {
                        toastr.error(result && result.message ? result.message : 'Failed to create a new ticket, please try again later.', 'ERROR', {
                            closeButton: true,
                            progressBar: true
                        });
                        return false;
                    }
                },
                error: function() {
                    toastr.error('Failed to create a new ticket, please try again later.', 'ERROR', {
                        closeButton: true,
                        progressBar: true
                    });
                    return false;
                },
                complete: function() {
                    submitButton.attr('disabled', false);
                    submitButton.children('i').addClass('hide');
                }
            });
        });
    }
    createTicket();

    function subscribe() {
        $('#btnSubscribe').on('click', function() {
            var email = $('#inputEmail').val();
            if (email.length <= 0) {
                toastr.error('Please enter a valid email address.', 'ERROR', {
                    closeButton: true,
                    progressBar: true
                });
                return false;
            }
            $.ajax({
                type: 'POST',
                url: $(this).attr('data-action'),
                data: {
                    email: email
                },
                dataType: 'json',
                success: function(result) {
                    if (result && true === result.status) {
                        toastr.success('Thank you for your subscription.', 'SUCCESS', {
                            closeButton: true,
                            progressBar: true
                        });
                        return true;
                    } else {
                        toastr.error(result && result.message ? result.message : 'Failed to subscribe, please try again later.', 'ERROR', {
                            closeButton: true,
                            progressBar: true
                        });
                        return false;
                    }
                },
                error: function() {
                    toastr.error('Failed to subscribe, please try again later.', 'ERROR', {
                        closeButton: true,
                        progressBar: true
                    });
                    return false;
                }
            });
        });
    }
    subscribe();
});