let emotionsLog = [];
let emotionChart;

document.getElementById('registerEmotionBtn').addEventListener('click', registerEmotion);
document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);

function registerEmotion() {
    const selectedEmotion = document.getElementById('emotionSelect').value;
    const emotionIntensity = parseInt(document.getElementById('emotionIntensity').value);
    const emotionNotes = document.getElementById('emotionNotes').value;

    if (selectedEmotion && emotionIntensity >= 1 && emotionIntensity <= 5 && emotionNotes.trim() !== '') {
        const currentDate = new Date();
        emotionsLog.push({ 
            emotion: selectedEmotion, 
            intensity: emotionIntensity, 
            notes: emotionNotes,
            date: currentDate.toISOString().split('T')[0] // Salva a data no formato YYYY-MM-DD
        });

        alert('Emoção registrada com sucesso!');
        document.getElementById('emotionSelect').value = '';
        document.getElementById('emotionIntensity').value = '';
        document.getElementById('emotionNotes').value = '';

        updateDiary();
        updateChart();
        updateWeeklySummary();
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

function applyFilters() {
    const selectedEmotion = document.getElementById('filterEmotion').value;
    const selectedDate = document.getElementById('filterDate').value;

    const filteredEmotions = emotionsLog.filter(entry => {
        const matchesEmotion = selectedEmotion ? entry.emotion === selectedEmotion : true;
        const matchesDate = selectedDate ? entry.date === selectedDate : true; // Compara diretamente as strings de data
        return matchesEmotion && matchesDate;
    });

    updateDiary(filteredEmotions);
}

function updateChart() {
    const ctx = document.getElementById('emotionChart').getContext('2d');
    const emotionCounts = {};

    emotionsLog.forEach(entry => {
        emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
    });

    const labels = Object.keys(emotionCounts);
    const data = Object.values(emotionCounts);

    if (emotionChart) {
        emotionChart.data.labels = labels;
        emotionChart.data.datasets[0].data = data;
        emotionChart.update();
    } else {
        emotionChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Emoções Registradas',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function updateDiary(filteredEmotions = emotionsLog) {
    const diaryOutput = document.getElementById('diaryOutput');
    diaryOutput.innerHTML = '';

    filteredEmotions.forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.emotion}</td>
            <td>${entry.intensity}</td>
            <td>${entry.notes}</td>
        `;
        diaryOutput.appendChild(tr);
    });
}

function updateWeeklySummary() {
    const totalRecords = emotionsLog.length;
    const summaryOutput = document.getElementById('weeklySummary');
    summaryOutput.textContent = `Você registrou ${totalRecords} emoções esta semana.`;
}
