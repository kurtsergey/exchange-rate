function save_options()
{
    chrome.storage.sync.set({
        notification: document.getElementById('notification').checked,
        alert: document.getElementById('alert').checked,
        defaultCurrency: document.getElementById('defaultCurrency').value,
        replace: document.getElementById('replace').checked,
        replaceSave: document.getElementById('replaceSave').checked,
    }, function ()
    {
        var status = document.getElementById('status');
        status.textContent = 'Настройки сохранены';
        setTimeout(function ()
        {
            status.textContent = '';
        }, 1000);
    });
}

function restore_options()
{
    chrome.storage.sync.get({
        notification: false,
        alert: false,
        defaultCurrency: 'usd',
        replace: true,
        replaceSave: true
    }, function (items)
    {
        document.getElementById('notification').checked = items.notification;
        document.getElementById('alert').checked = items.alert;
        document.getElementById('defaultCurrency').value = items.defaultCurrency;
        document.getElementById('replace').checked = items.replace;
        document.getElementById('replaceSave').checked = items.replace && items.replaceSave;
        document.getElementById('replaceSave').disabled = !items.replace;
    });
}

function onChangeReplace()
{
    if (document.getElementById('replace').checked)
    {
        document.getElementById('replaceSave').disabled = false;
    }
    else
    {
        document.getElementById('replaceSave').disabled = true;
        document.getElementById('replaceSave').checked = false;
    }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('replace').addEventListener('change', onChangeReplace);
