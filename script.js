// Получаем элементы
const text = document.getElementById('text');
const audio = document.getElementById('audio');

// Настройка Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audio);

source.connect(analyser);
analyser.connect(audioContext.destination);

// Настройка анализатора
analyser.fftSize = 256;
const dataArray = new Uint8Array(analyser.frequencyBinCount);

// Анимация текста под басы
function animate() {
  analyser.getByteFrequencyData(dataArray);

  // Усредняем низкие частоты (диапазон первых 32 значений)
  const bass = dataArray.slice(0, 32).reduce((sum, value) => sum + value, 0) / 32;

  // Рассчитываем яркость на основе басов
  const brightness = Math.min(180, Math.max(100, bass)); // Диапазон яркости
  text.style.color = `rgb(${brightness}, ${brightness}, ${brightness})`;

  requestAnimationFrame(animate);
}

// Запускаем анимацию при старте музыки
audio.addEventListener('play', () => {
  audioContext.resume().then(() => {
    animate();
  });
});
