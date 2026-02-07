document.addEventListener('DOMContentLoaded', function() {
    // Sound configuration - NO KISS SOUND, NO CLICK SOUND
    const sounds = {
        laugh: {
            element: document.getElementById('laugh-sound'),
            file: 'mp3/cat-laugh-meme-1.mp3'
        },
        romantic: {
            element: document.getElementById('romantic-sound'),
            file: 'mp3/musica-romantica.mp3'
        },
        ignore: {
            element: document.getElementById('ignore-sound'),
            file: 'mp3/huh-cat-meme.mp3'
        },
        suspicious: {
            element: document.getElementById('suspicious-sound'),
            file: 'mp3/among-us-impostor-sound.mp3'
        },
        alarm: {
            element: document.getElementById('alarm-sound'),
            file: 'mp3/alarm_QenbR8T.mp3'
        }
    };

    // Get all stage elements
    const stages = {
        stage1: document.getElementById('stage1'),
        stage2: document.getElementById('stage2'),
        stage3: document.getElementById('stage3'),
        ignoreStage1: document.getElementById('ignore-stage1'),
        ignoreStage2: document.getElementById('ignore-stage2'),
        ignoreStage3: document.getElementById('ignore-stage3'),
        ignoreFinal: document.getElementById('ignore-final'),
        roseReveal: document.getElementById('rose-reveal'),
        directRose: document.getElementById('direct-rose')
    };

    // Get buttons
    const seeBtn = document.getElementById('see-btn');
    const ignoreBtn = document.getElementById('ignore-btn');
    const ignoreBtn1 = document.getElementById('ignore-btn1');
    const ignoreBtn2 = document.getElementById('ignore-btn2');
    const ignoreBtn3 = document.getElementById('ignore-btn3');
    const seeBtn1 = document.getElementById('see-btn1');
    const seeBtn2 = document.getElementById('see-btn2');
    const seeBtn3 = document.getElementById('see-btn3');
    const finalBtn = document.getElementById('final-btn');

    // Variables
    let ignoreClickCount = 0;

    // Function to play sound
    function playSound(soundName) {
        const sound = sounds[soundName];
        if (!sound || !sound.element) {
            console.error(`Sound not found: ${soundName}`);
            return;
        }

        try {
            sound.element.currentTime = 0;
            sound.element.volume = 0.7;
            
            const playPromise = sound.element.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log(`Auto-play failed for ${soundName}, need user interaction`);
                    
                    // Enable sounds on first click
                    const enableSound = () => {
                        sound.element.play().catch(e => console.log(`Still failed:`, e));
                        document.body.removeEventListener('click', enableSound);
                    };
                    document.body.addEventListener('click', enableSound);
                });
            }
        } catch (error) {
            console.error(`Error with sound ${soundName}:`, error);
        }
    }

    // Function to show a specific stage and hide others
    function showStage(stageId, soundName = null) {
        // Hide all stages
        Object.values(stages).forEach(stage => {
            if (stage) {
                stage.classList.remove('active');
            }
        });
        
        // Show the requested stage
        if (stages[stageId]) {
            stages[stageId].classList.add('active');
            
            // Play sound if specified
            if (soundName) {
                setTimeout(() => playSound(soundName), 100);
            }
        }
    }

    // Preload all sounds
    function preloadSounds() {
        console.log("Loading sounds...");
        
        Object.keys(sounds).forEach(soundName => {
            const sound = sounds[soundName];
            if (sound.element) {
                const source = sound.element.querySelector('source');
                if (source) {
                    sound.element.load();
                }
            }
        });
        
        console.log("Sounds ready");
    }

    // Auto sequence on page load
    function startSequence() {
        // Preload sounds first
        preloadSounds();
        
        // Stage 1 is already active (GIF + Text together)
        console.log("Starting sequence - Stage 1");
        
        // Stage 2 after 4 seconds - NO SOUND for stage 2 now
        setTimeout(() => {
            showStage('stage2');
            console.log("Showing stage 2");
            
            // Stage 3 after 4 seconds
            setTimeout(() => {
                showStage('stage3');
                console.log("Showing stage 3 with two buttons");
                
            }, 4000);
            
        }, 4000);
    }

    // Button event handlers
    function setupButton(button, stage, sound = null) {
        if (button) {
            button.addEventListener('click', function() {
                // Add click animation
                this.classList.add('clicked');
                setTimeout(() => this.classList.remove('clicked'), 300);
                
                // Show stage and play sound
                showStage(stage, sound);
            });
        }
    }

    // Setup all buttons
    setupButton(seeBtn, 'directRose', 'romantic');
    setupButton(ignoreBtn, 'ignoreStage1', 'ignore');
    setupButton(ignoreBtn1, 'ignoreStage2', 'suspicious');
    setupButton(seeBtn1, 'roseReveal', 'romantic');
    setupButton(ignoreBtn2, 'ignoreStage3', 'alarm');
    setupButton(seeBtn2, 'roseReveal', 'romantic');
    setupButton(ignoreBtn3, 'ignoreFinal', 'laugh');
    setupButton(seeBtn3, 'roseReveal', 'romantic');
    setupButton(finalBtn, 'roseReveal', 'romantic');

    // Audio context fix
    function initAudio() {
        if (typeof window.AudioContext !== 'undefined' || typeof window.webkitAudioContext !== 'undefined') {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            if (audioContext.state === 'suspended') {
                document.addEventListener('click', function resumeAudio() {
                    audioContext.resume();
                    console.log("Audio context resumed");
                    document.removeEventListener('click', resumeAudio);
                }, { once: true });
            }
        }
    }

    // Start everything
    initAudio();
    setTimeout(startSequence, 1000);

    // Fallback for GIFs
    document.querySelectorAll('.cat-gif').forEach(img => {
        img.onerror = function() {
            console.log("GIF failed: " + this.src);
        };
    });
});