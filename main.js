const date = new Date().getFullYear();
document.querySelector('.copyright').innerHTML = date;

const menu = document.querySelector('.menu-bar');
const rightSide = document.querySelector('.right-side');

menu.addEventListener('click', () => {
  rightSide.classList.toggle('showMenu');
});

const netWalkerApi =
  'https://cliniqueplushealthcare.com.ng/prescriptions/drug_class';
const myForm = document.querySelector('.form');
const doneBtn = document.querySelector('.done');
const doneBox = document.querySelector('.done-box');
const saveForm = document.querySelector('.js-save-p');
let drugNumber = 1;

myForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const medClass = document.getElementById('med-class').value;
  const medName = document.getElementById('med-name').value;
  const medDose = document.getElementById('dos').value;
  const medInterval = document.getElementById('inter').value;
  const medDuration = document.getElementById('durat').value;
  const medSelect = document.getElementById('num').value;
  const medInstruct = document.getElementById('instruct').value;

  getFormData(
    medClass,
    medName,
    medDose,
    medInterval,
    medDuration,
    medSelect,
    medInstruct
  );
  drugNumber++;

  for (let i = 0; i < myForm.length; i++) {
    myForm[i].value = '';
  }

  const formData = {
    medClass,
    medName,
    medDose,
    medInterval,
    medDuration,
    medSelect,
    medInstruct,
  };

  saveForm.addEventListener('click', () => {
    saveFormDataToStorage(formData);
    setTimeout(() => {
      doneBox.style.display = 'none';
    }, 3000);
  });
});

const medClass = document.getElementById('med-class');
const medName = document.getElementById('med-name');
const drugBox = document.querySelector('.js-drug-class');
const generalBox = document.querySelector('.general-drug-box');
const gMedBox = document.querySelector('.general-med-box');
const gMedName = document.querySelector('.js-med-name');
const closeLink = document.querySelector('.close-link');
const medCloseLink = document.querySelector('.med-close-link');
const medDose = document.getElementById('dos');

medClass.addEventListener('click', getMedClass);

async function getMedClass() {
  const resfet = await fetch(netWalkerApi);
  const result = await resfet.json();

  result.forEach((data) => {
    const drugLink = document.createElement('p');
    drugLink.className = 'drug-links';
    drugLink.textContent = data.name;
    drugLink.setAttribute('data-drugid', data.id);

    drugBox.append(drugLink);
    generalBox.style.visibility = 'visible';
    closeLink.addEventListener('click', () => {
      generalBox.style.visibility = 'hidden';
    });
  });

  const drugBtn = document.querySelectorAll('.drug-links');
  drugBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      medClass.value = e.target.textContent;
      medName.focus();
      const dataId = e.target.dataset.drugid;
      getMedName(dataId);
    });
  });
}

async function getMedName(id) {
  const medFetch = await fetch(
    `https://cliniqueplushealthcare.com.ng/prescriptions/get_drug_class_by_id/${id}`
  );
  const medRes = await medFetch.json();

  medRes.forEach((medData) => {
    const para = document.createElement('p');
    para.className = 'med-name';
    para.textContent = medData.medicine_name;

    gMedName.append(para);
    gMedBox.style.visibility = 'visible';
    medCloseLink.addEventListener('click', () => {
      gMedBox.style.visibility = 'hidden';
    });
  });

  const medicineName = document.querySelectorAll('.med-name');
  medicineName.forEach((med) => {
    med.addEventListener('click', (e) => {
      medName.value = e.target.textContent;
      medDose.focus();
    });
  });
}

function getFormData(
  drugClass,
  drugName,
  drugDose,
  drugInter,
  drugDuratOne,
  drugDuratTwo,
  DrugInstruct
) {
  const tableBox = document.querySelector('.table');
  const noDrug = document.querySelector('.no-drug');

  const tr = document.createElement('tr');
  tr.className = 'table-td';

  const firstTd = document.createElement('td');
  firstTd.textContent = drugNumber;
  firstTd.setAttribute('id', 'one');

  const secondTd = document.createElement('td');
  secondTd.textContent = drugClass;

  const thirdTd = document.createElement('td');
  thirdTd.textContent = drugName;

  const forthTd = document.createElement('td');
  forthTd.textContent = drugDose + '-' + drugInter;

  const fifthTd = document.createElement('td');
  fifthTd.textContent = drugDuratOne + '/' + drugDuratTwo;

  const sixthTd = document.createElement('td');
  sixthTd.textContent = DrugInstruct;

  const seventhTd = document.createElement('td');
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.classList.add('remove-btn');
  seventhTd.append(removeBtn);

  tr.appendChild(firstTd);
  tr.appendChild(secondTd);
  tr.appendChild(thirdTd);
  tr.appendChild(forthTd);
  tr.appendChild(fifthTd);
  tr.appendChild(sixthTd);
  tr.appendChild(seventhTd);
  tableBox.append(tr);

  const remove = document.querySelectorAll('.remove-btn');

  noDrug.style.display = 'none';
  generalBox.style.visibility = 'hidden';
  gMedBox.style.visibility = 'hidden';

  doneBtn.addEventListener('click', () => {
    doneBox.style.display = 'block';
  });

  remove.forEach((del) => {
    del.addEventListener('click', (e) => {
      e.target.parentElement.parentElement.remove();
    });
  });
}

function saveFormDataToStorage(formData) {
  const getStorage = JSON.parse(localStorage.getItem('formInfo')) || [];

  getStorage.push(formData);

  localStorage.setItem('formInfo', JSON.stringify(getStorage));
}
