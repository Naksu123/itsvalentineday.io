document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const backBtn = document.getElementById('backBtn');
    const responseText = document.getElementById('responseText');
    const mainContent = document.querySelector('.main-content');
    const successMessage = document.getElementById('successMessage');
    const envelope = document.getElementById('envelope');
    const instruction = document.getElementById('instruction');
    const musicControl = document.getElementById('musicControl');
    const bgMusic = document.getElementById('bgMusic');

    let isMusicPlaying = false;
    let phraseIndex = 0;

    const noPhrases = [
        "Nooo! 💔","Pretty please! 💕","Come back! 😘","Think again! 💓","Last chance! 🌹",
        "Say yes! 💌","Don’t go! 💖","My heart! 💘","Oopsie! 😍","Heart me! 💞",
        "Not yet! 💓","Hug me! 🤗","Change mind? 💕","Pretty please? 😇","Final yes? 💖","Love me! 💌"
    ];

    const originalYesFontSize = window.getComputedStyle(yesBtn).fontSize;
    const originalYesPadding = window.getComputedStyle(yesBtn).padding;

    // --- MUSIC LOGIC FIX ---
    function playMusic() {
        if (!isMusicPlaying) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                musicControl.textContent = '🎵';
            }).catch(e => console.log("Playback prevented:", e));
        }
    }

    function toggleMusic() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicControl.textContent = '🔇';
        } else {
            bgMusic.play().catch(()=>{});
            musicControl.textContent = '🎵';
        }
        isMusicPlaying = !isMusicPlaying;
    }

    // Listener for manual control
    musicControl.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent global listener from double-triggering
        toggleMusic();
    });

    // Global listener to satisfy browser autoplay policies on first interaction
    const startOnInteraction = () => {
        playMusic();
        ['click', 'touchstart', 'keydown'].forEach(evt => 
            document.removeEventListener(evt, startOnInteraction)
        );
    };

    ['click', 'touchstart', 'keydown'].forEach(evt => 
        document.addEventListener(evt, startOnInteraction)
    );
    // --- END MUSIC LOGIC FIX ---

    function moveNoButtonSlow() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;

        const randomX = Math.random() * (windowWidth - btnWidth - 40) + 20;
        const randomY = Math.random() * (windowHeight - btnHeight - 40) + 20;

        noBtn.style.position = 'fixed';
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';
        noBtn.style.transition = 'all 0.8s ease';
    }

    function createDrop(item){
        const drop = document.createElement('div');
        drop.className = item;
        if(item==='teddy-drop') drop.textContent='🐻';
        else if(item==='choco-drop') drop.textContent='🍫';
        else drop.textContent='💖';
        
        drop.style.left = Math.random()*100 + '%';
        drop.style.fontSize = (Math.random()*15 + 15) + 'px';
        document.body.appendChild(drop);
        
        setTimeout(()=>drop.remove(), 8000);
    }

    setInterval(()=>{
        ['teddy-drop','choco-drop','heart-drop'].forEach(item => {
            if(Math.random() < 0.3) createDrop(item);
        });
    }, 1500);

    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        noBtn.innerText = noPhrases[phraseIndex % noPhrases.length];
        phraseIndex++;

        const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
        const currentPadding = parseFloat(window.getComputedStyle(yesBtn).paddingTop);
        yesBtn.style.fontSize = `${currentSize * 1.2}px`;
        yesBtn.style.padding = `${currentPadding * 1.2}px ${currentPadding * 2.5}px`;

        moveNoButtonSlow();

        responseText.textContent = "Please? 🥺";
        responseText.style.animation = 'none';
        void responseText.offsetWidth;
        responseText.style.animation = 'textPulse 0.5s ease-out';
    });

    yesBtn.addEventListener('click', () => {
        mainContent.style.display = 'none';
        successMessage.style.display = 'block';
        noBtn.style.display = 'none';
        
        // Ensure music is playing when they click Yes
        playMusic();

        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-10px';
                confetti.style.backgroundColor = ['#ff6b9d','#c2185b','#f48fb1','#ffd6e8','#ffb3d9','#ff1744'][Math.floor(Math.random()*6)];
                confetti.style.animationDelay = Math.random()*0.5+'s';
                confetti.style.animationDuration = (Math.random()*2+2)+'s';
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }, i*20);
        }
    });

    envelope.addEventListener('click', () => {
        if (!envelope.classList.contains('open')) {
            envelope.classList.add('open');
            instruction.style.display = 'none';
        }
    });

    backBtn.addEventListener('click', () => {
        successMessage.style.display = 'none';
        mainContent.style.display = 'block';
        envelope.classList.remove('open');
        instruction.style.display = 'block';
        instruction.textContent = "✨ Click the envelope to open your letter! ✨";

        noBtn.style.display = 'inline-block';
        noBtn.style.position = 'relative';
        noBtn.style.left = 'auto';
        noBtn.style.top = 'auto';
        noBtn.style.transition = 'none';
        noBtn.innerText = "No";

        yesBtn.style.fontSize = originalYesFontSize;
        yesBtn.style.padding = originalYesPadding;

        responseText.textContent = "";
        phraseIndex = 0;
    });
});
