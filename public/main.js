var del = document.getElementsByClassName('delete');

for (var i = 0; i < del.length; i++) {
    del[i].addEventListener('click', function(e) {
        console.log(e);
        fetch('/delete', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: e.target.name})
        }).then(res => {
            return res.json();
          }).then(data => {
            console.log(data);
            window.location.reload();
          })
        })
}