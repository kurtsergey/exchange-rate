
var numberToString = function numberToString(n)
{
    var s = Math.floor(n).toFixed(0).toString();
    var f = '';

    if (n < 1)
    {
        f = (n - Math.floor(n)).toFixed(3).toString().substr(1);
    }
    else if (n < 10)
    {
        f = (n - Math.floor(n)).toFixed(2).toString().substr(1);
    }
    else if (n < 1000)
    {
        f = (n - Math.floor(n)).toFixed(1).toString().substr(1);
    }


    for (var i = 1; i < 5; ++i)
    {
        if (s.length > i * 3 + i - 1)
        {
            s = s.substr(0, s.length - (i * 3 + i - 1)) + '`' + s.substr(-(i * 3 + i - 1));
        }
    }

    return s + f;
};