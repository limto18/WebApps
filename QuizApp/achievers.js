const achievers = document.getElementById('achievers');
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

achievers.innerHTML = highScores.map(score =>{
    return `<li class="high-score">${score.name} => ${score.score}</li>`;
})
.join("");