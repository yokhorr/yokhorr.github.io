let filterBox;
// when cards are generated
document.addEventListener('cardsGenerated', () => {
    filterBox = document.querySelectorAll('.item');
    console.log(filterBox);
});

// let tmp = document.querySelectorAll('.select');
// console.log(tmp);

// let tmp = ;
// console.log(tmp);

document.getElementById('theatreSelect').addEventListener('click', event => {
    console.log(event.target);
});

