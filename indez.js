//Highscore modal
const buttonHS = document.getElementById('HS');
buttonHS.addEventListener('click', () => {
  dialogHS.showModal();
})
//muuttujat HS dialogin sulkemiselle
const dialogHS = document.getElementById('highscore')
const closeDialogHS = document.getElementById('spanHS')
//sulkee HS dialogin
closeDialogHS.addEventListener('click', () => {
  dialogHS.close();
})

// iframe highscorelle
cont.addEventListener('click', () => {
  const iframe = dialog.appendChild(document.querySelector('#graph'));
  console.log(iframe.src)
  dialog.showModal();
})
// muuttujat iframelle
const closeDialog = document.querySelector('span');
const dialog = document.querySelector('dialog');
//sulkee dialogin
closeDialog.addEventListener('click', () => {
    dialog.close();
})

//About eli lisätietoja modal
const buttonA = document.getElementById('A')
//avataan about modal
buttonA.addEventListener('click', () => {
  dialogA.showModal();
})
//muuttujat about dialogin sulkemiselle
const dialogA = document.getElementById('about')
const closeDialogA = document.getElementById('spanA')
//sulkee about dialogin
closeDialogA.addEventListener('click',() => {
  dialogA.close();
})

