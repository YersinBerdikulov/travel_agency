let tourData;

fetch('../../data/tours_data.json')
  .then(response => response.json())
  .then(data => {
  tourData = data;
  console.log(tourData);
});


const detailButtons = document.querySelectorAll('.card-body button');
const modal = document.getElementById("tourDetailsModal");


for (let i = 0;i < detailButtons.length;i++) {
  detailButtons[i].setAttribute('tour-id', tourData[i].id);
}
