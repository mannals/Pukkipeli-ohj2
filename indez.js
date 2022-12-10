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