const cube = document.querySelector('.cube');
let isDragging = false;
let startX, startY;
let currentX = -30, currentY = -45;

document.querySelector('.cube-container').addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    e.target.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        currentY += deltaX * 0.5;
        currentX -= deltaY * 0.5;
        cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
        startX = e.clientX;
        startY = e.clientY;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    document.querySelector('.cube-container').style.cursor = 'grab';
});
