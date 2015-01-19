
chrome.runtime.sendMessage({ type: "rates" }, function (r)
{
    if (r.byr)
    {
        $('#byr').html(numberToString(r.byr) + ' BYR');
        $('#equals').html(
            '<b>$' + numberToString(r.usd) + '</b><br />' +
            '<b>€' + numberToString(r.eur) + '</b><br/ >' +
            '<b>₽' + numberToString(r.rub) + '</b><br/ >'
        );
    }
    else
    {
        $('#byr').html('');
        $('#equals').html('');
    }

    if (r.usdRate)
    {
        $('#rates').html(
            '1$ = <b>' + numberToString(r.usdRate) + '</b> BYR<br />' +
            '1€ = <b>' + numberToString(r.eurRate) + '</b> BYR<br/ >' +
            '1₽ = <b>' + numberToString(r.rubRate) + '</b> BYR'
        );
    }
});
