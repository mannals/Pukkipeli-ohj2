//Highscore modal
const buttonHS = document.getElementById('HS');
buttonHS.addEventListener('click', () => {
  dialogHS.showModal();
})
const dialogHS = document.getElementById('highscore')
const iframe = dialogHS.appendChild(document.querySelector('#graph'));
iframe.addEventListener('click', () => {
  console.log(iframe.src)
})
//sulkee HS dialogin
const closeDialogHS = document.getElementById('spanHS')
closeDialogHS.addEventListener('click', () => {
  dialogHS.close();
})

//About eli lisätietoja modal
const buttonA = document.getElementById('A')
buttonA.addEventListener('click', () => {
  dialogA.showModal();
})
const dialogA = document.getElementById('about')
//about dialogin sulkeminen
const closeDialogA = document.getElementById('spanA')
//sulkee about dialogin
closeDialogA.addEventListener('click',() => {
  dialogA.close();
})

