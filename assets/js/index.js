import domtoimage from 'dom-to-image';

function getContentFromForm (form) {
    let content = {};

    for(let i = 0; i < form.elements.length; i++) {
        const item = form.elements[i];

        if (item.value) {
            content[item.name] = item.value
        }
    }

    return content;
}

function setElementValues (content) {
    if (content['message']) {
        document.getElementsByClassName("message")[0].innerHTML = `"${content['message']}"`;
        document.getElementsByClassName("message")[0].style.display = "block";
    } else {
        document.getElementsByClassName("message")[0].style.display = "none";
    }

    document.getElementsByClassName("message-date")[0].innerHTML = `${content['message-date']}`;
    document.getElementsByClassName("preacher")[0].innerHTML = `${content['preacher']}`;
    document.getElementsByClassName("preacher-image")[0].src = `${content['preacher-image']}`;
    document.getElementsByClassName("church-logo")[0].src = `${content['church-logo']}`;
    document.getElementsByClassName("church-local")[0].src = `${content['church-local']}`;
}

function viewImage () {
    const form = document.getElementById('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const content = getContentFromForm(form);

        setElementValues(content);
    });
}

function saveImage () {
    const button = document.getElementById('btn-save-image');
    const div = document.getElementById('generated-image');
    const options =  {
        height: 550,
        width: 500,
    }

    button.addEventListener('click', function() {
        domtoimage.toJpeg(div, options)
            .then(function (dataUrl) {
                const link = document.createElement('a');
                link.download = 'my-image-name.jpeg';
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => alert('Erro ao gerar a imagem'));
    });
}

document.addEventListener("DOMContentLoaded", function(){
    viewImage();
    saveImage();
});