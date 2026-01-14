// Game Constants
const GAME_STATES = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAME_OVER: 'GAME_OVER'
};

// Game configuration
const CONFIG = {
    player: {
        radius: 20,
        speed: 250,
        maxHealth: 100,
        invulnerabilityTime: 1000, // 1 second
        color: '#00ff00'
    },
    gun: {
        magazineSize: 12,
        reserveAmmo: 60,
        reloadTime: 1500,
        fireRate: 200, // ms between shots
        bulletSpeed: 600,
        bulletDamage: 25
    },
    zombie: {
        radius: 18,
        baseSpeed: 80,
        damage: 10,
        color: '#ff0000',
        spawnRate: 2000, // initial spawn rate in ms
        minSpawnRate: 500,
        spawnRateDecrease: 100, // decrease per wave
        detectionRange: 400,
        wanderSpeed: 40
    },
    hideSpot: {
        width: 100,
        height: 100,
        color: '#8B4513',
        interactDistance: 50,
        aggroLossTime: 2000 // 2 seconds
    },
    bullet: {
        radius: 4,
        color: '#ffff00'
    },
    ammoBox: {
        width: 30,
        height: 20,
        fallSpeed: 100,
        ammoAmount: 24, // 2 full magazines
        color: '#ffa500'
    },
    spinShoot: {
        rotationSpeed: 10, // radians per second
        shootInterval: 100 // ms between shots while spinning
    },
    bomb: {
        radius: 40,
        explosionRadius: 80,
        maxBombs: 5,
        color: '#333333'
    },
    tank: {
        width: 60,
        height: 80,
        speed: 150,
        maxHealth: 300,
        interactDistance: 70,
        color: '#4a4a4a',
        cannonLength: 40
    },
    levels: {
        1: {
            name: 'Easy',
            zombieHealth: 50,
            zombieSpeed: 60,
            zombieSpawnRate: 3000,
            zombieSpawnRateDecrease: 150
        },
        2: {
            name: 'Medium',
            zombieHealth: 100,
            zombieSpeed: 80,
            zombieSpawnRate: 2000,
            zombieSpawnRateDecrease: 100
        },
        3: {
            name: 'Hard',
            zombieHealth: 150,
            zombieSpeed: 100,
            zombieSpawnRate: 1500,
            zombieSpawnRateDecrease: 75
        }
    }
};

// Zombie death messages
const ZOMBIE_DEATH_MESSAGES = [
    "Ouch you got me!",
    "Not fair!",
    "Argh!",
    "I'll be back...",
    "Tell my wife...",
    "Why me?!",
    "Brutal!",
    "You win this time!",
    "I should've stayed dead!",
    "My braaaaains!",
    "Nice shot!",
    "Curse you!",
    "Oof!",
    "That hurt!",
    "Game over man!"
];

// Utility functions
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Sound Manager class
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }

    playShoot() {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    playZombieDeath() {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);

        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    playPlayerDamage() {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    playAmmoPickup() {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    playReload() {
        if (!this.enabled || !this.audioContext) return;

        // Click sound
        const oscillator1 = this.audioContext.createOscillator();
        const gainNode1 = this.audioContext.createGain();

        oscillator1.connect(gainNode1);
        gainNode1.connect(this.audioContext.destination);

        oscillator1.type = 'square';
        oscillator1.frequency.setValueAtTime(100, this.audioContext.currentTime);

        gainNode1.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode1.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

        oscillator1.start(this.audioContext.currentTime);
        oscillator1.stop(this.audioContext.currentTime + 0.05);

        // Clack sound
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode2 = this.audioContext.createGain();

        oscillator2.connect(gainNode2);
        gainNode2.connect(this.audioContext.destination);

        oscillator2.type = 'square';
        oscillator2.frequency.setValueAtTime(120, this.audioContext.currentTime + 0.1);

        gainNode2.gain.setValueAtTime(0.1, this.audioContext.currentTime + 0.1);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

        oscillator2.start(this.audioContext.currentTime + 0.1);
        oscillator2.stop(this.audioContext.currentTime + 0.15);
    }
}

// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = CONFIG.player.radius;
        this.speed = CONFIG.player.speed;
        this.health = CONFIG.player.maxHealth;
        this.maxHealth = CONFIG.player.maxHealth;
        this.angle = 0;
        this.isHiding = false;
        this.invulnerable = false;
        this.invulnerabilityTimer = 0;
        this.isSpinShooting = false;
        this.spinShootTimer = 0;
    }

    update(deltaTime, keys, canvas) {
        if (this.isHiding) return;

        let dx = 0;
        let dy = 0;

        if (keys['w'] || keys['W'] || keys['ArrowUp']) dy -= 1;
        if (keys['s'] || keys['S'] || keys['ArrowDown']) dy += 1;
        if (keys['a'] || keys['A'] || keys['ArrowLeft']) dx -= 1;
        if (keys['d'] || keys['D'] || keys['ArrowRight']) dx += 1;

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }

        // Move player
        this.x += dx * this.speed * deltaTime;
        this.y += dy * this.speed * deltaTime;

        // Keep player in bounds
        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));

        // Update invulnerability
        if (this.invulnerable) {
            this.invulnerabilityTimer -= deltaTime * 1000;
            if (this.invulnerabilityTimer <= 0) {
                this.invulnerable = false;
            }
        }
    }

    takeDamage(amount) {
        if (this.invulnerable || this.isHiding) return false;

        this.health -= amount;
        this.invulnerable = true;
        this.invulnerabilityTimer = CONFIG.player.invulnerabilityTime;

        if (this.health <= 0) {
            this.health = 0;
            return true; // Player died
        }
        return false;
    }

    draw(ctx) {
        // Draw player
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Player body (flashing when invulnerable)
        if (!this.invulnerable || Math.floor(Date.now() / 100) % 2 === 0) {
            let playerColor = CONFIG.player.color;
            if (this.isHiding) playerColor = '#006600';
            if (this.isSpinShooting) playerColor = '#ffaa00'; // Orange when spin shooting

            ctx.fillStyle = playerColor;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Gun direction indicator
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.radius - 5, -3, 15, 6);

        ctx.restore();

        // Hiding indicator
        if (this.isHiding) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '14px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('HIDING', this.x, this.y - this.radius - 10);
        }

        // Spinning indicator
        if (this.isSpinShooting) {
            ctx.fillStyle = 'rgba(255, 170, 0, 0.8)';
            ctx.font = '14px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('SPINNING!', this.x, this.y - this.radius - 10);
        }
    }
}

// Gun class
class Gun {
    constructor() {
        this.magazineSize = CONFIG.gun.magazineSize;
        this.currentAmmo = this.magazineSize;
        this.reserveAmmo = CONFIG.gun.reserveAmmo;
        this.reloadTime = CONFIG.gun.reloadTime;
        this.fireRate = CONFIG.gun.fireRate;
        this.isReloading = false;
        this.reloadTimer = 0;
        this.lastShotTime = 0;
    }

    update(deltaTime) {
        if (this.isReloading) {
            this.reloadTimer -= deltaTime * 1000;
            if (this.reloadTimer <= 0) {
                this.finishReload();
            }
        }
    }

    canShoot() {
        return !this.isReloading && this.currentAmmo > 0 &&
               Date.now() - this.lastShotTime >= this.fireRate;
    }

    shoot() {
        if (!this.canShoot()) return false;

        this.currentAmmo--;
        this.lastShotTime = Date.now();
        return true;
    }

    startReload() {
        if (this.isReloading || this.reserveAmmo === 0 || this.currentAmmo === this.magazineSize) {
            return false;
        }

        this.isReloading = true;
        this.reloadTimer = this.reloadTime;
        return true;
    }

    finishReload() {
        const ammoNeeded = this.magazineSize - this.currentAmmo;
        const ammoToReload = Math.min(ammoNeeded, this.reserveAmmo);

        this.currentAmmo += ammoToReload;
        this.reserveAmmo -= ammoToReload;
        this.isReloading = false;
        this.reloadTimer = 0;
    }
}

// Bullet class
class Bullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = CONFIG.gun.bulletSpeed;
        this.radius = CONFIG.bullet.radius;
        this.damage = CONFIG.gun.bulletDamage;
        this.active = true;
    }

    update(deltaTime, canvas) {
        this.x += Math.cos(this.angle) * this.speed * deltaTime;
        this.y += Math.sin(this.angle) * this.speed * deltaTime;

        // Remove if out of bounds
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.fillStyle = CONFIG.bullet.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// AmmoBox class
class AmmoBox {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.ammoBox.width;
        this.height = CONFIG.ammoBox.height;
        this.speed = CONFIG.ammoBox.fallSpeed;
        this.ammoAmount = CONFIG.ammoBox.ammoAmount;
        this.active = true;
    }

    update(deltaTime, canvas) {
        this.y += this.speed * deltaTime;

        // Remove if off screen
        if (this.y > canvas.height + this.height) {
            this.active = false;
        }
    }

    draw(ctx) {
        // Ammo box
        ctx.fillStyle = CONFIG.ammoBox.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        // Border
        ctx.strokeStyle = '#ff8800';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        // Ammo icon (simple bullets)
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(this.x - 8, this.y - 4, 4, 8);
        ctx.fillRect(this.x - 2, this.y - 4, 4, 8);
        ctx.fillRect(this.x + 4, this.y - 4, 4, 8);
    }

    checkCollision(player) {
        return distance(this.x, this.y, player.x, player.y) < player.radius + this.width / 2;
    }
}

// FloatingText class
class FloatingText {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.lifetime = 2000; // 2 seconds
        this.age = 0;
        this.active = true;
        this.speed = 30; // Float upward speed
    }

    update(deltaTime) {
        this.age += deltaTime * 1000;
        this.y -= this.speed * deltaTime;

        if (this.age >= this.lifetime) {
            this.active = false;
        }
    }

    draw(ctx) {
        const alpha = 1 - (this.age / this.lifetime); // Fade out over time
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ff6666';
        ctx.font = 'bold 16px Courier New';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.strokeText(this.text, this.x, this.y);
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

// Particle class
class Particle {
    constructor(x, y, angle, speed, color) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = color;
        this.radius = 3 + Math.random() * 3; // 3-6 pixels
        this.lifetime = 500 + Math.random() * 500; // 0.5-1 second
        this.age = 0;
        this.active = true;
        this.gravity = 200; // Particles fall down
    }

    update(deltaTime) {
        this.age += deltaTime * 1000;

        // Apply velocity
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // Apply gravity
        this.vy += this.gravity * deltaTime;

        // Slow down over time
        this.vx *= 0.98;

        if (this.age >= this.lifetime) {
            this.active = false;
        }
    }

    draw(ctx) {
        const alpha = 1 - (this.age / this.lifetime);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Explosion class
class Explosion {
    constructor(x, y) {
        this.particles = [];
        this.active = true;

        // Create particles in all directions
        const particleCount = 15 + Math.floor(Math.random() * 10); // 15-25 particles
        const colors = ['#ff4444', '#ff8844', '#ffaa44', '#ff6666', '#ffcc44'];

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 / particleCount) * i + (Math.random() - 0.5) * 0.5;
            const speed = 100 + Math.random() * 150; // 100-250 pixels/sec
            const color = colors[Math.floor(Math.random() * colors.length)];
            this.particles.push(new Particle(x, y, angle, speed, color));
        }
    }

    update(deltaTime) {
        let allInactive = true;

        for (const particle of this.particles) {
            particle.update(deltaTime);
            if (particle.active) {
                allInactive = false;
            }
        }

        if (allInactive) {
            this.active = false;
        }
    }

    draw(ctx) {
        for (const particle of this.particles) {
            if (particle.active) {
                particle.draw(ctx);
            }
        }
    }
}

// Bomb class
class Bomb {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = CONFIG.bomb.radius;
        this.explosionRadius = CONFIG.bomb.explosionRadius;
        this.active = true;
        this.pulseTime = 0;
    }

    update(deltaTime) {
        this.pulseTime += deltaTime;
    }

    draw(ctx) {
        // Pulsing bomb
        const pulse = Math.sin(this.pulseTime * 10) * 0.2 + 0.8;

        ctx.fillStyle = CONFIG.bomb.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Fuse
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.radius);
        ctx.lineTo(this.x, this.y - this.radius - 10);
        ctx.stroke();

        // Explosion radius indicator (faint circle)
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.explosionRadius, 0, Math.PI * 2);
        ctx.stroke();
    }

    checkZombieCollision(zombie) {
        return distance(this.x, this.y, zombie.x, zombie.y) < this.explosionRadius;
    }
}

// Tank class
class Tank {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.tank.width;
        this.height = CONFIG.tank.height;
        this.angle = 0;
        this.maxHealth = CONFIG.tank.maxHealth;
        this.health = this.maxHealth;
        this.occupied = false;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Tank body
        ctx.fillStyle = CONFIG.tank.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Tank treads
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(-this.width / 2 - 5, -this.height / 2, 5, this.height);
        ctx.fillRect(this.width / 2, -this.height / 2, 5, this.height);

        // Tank turret
        ctx.fillStyle = '#5a5a5a';
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();

        // Tank cannon
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(0, -3, CONFIG.tank.cannonLength, 6);

        ctx.restore();

        // Health bar
        const barWidth = this.width;
        const barHeight = 5;
        const barX = this.x - this.width / 2;
        const barY = this.y - this.height / 2 - 10;

        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        ctx.fillStyle = '#00ff00';
        ctx.fillRect(barX, barY, barWidth * (this.health / this.maxHealth), barHeight);

        // Interact prompt
        if (!this.occupied) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '14px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('Press T to enter', this.x, this.y - this.height / 2 - 20);
        }
    }

    isPlayerNear(player) {
        return distance(this.x, this.y, player.x, player.y) < CONFIG.tank.interactDistance;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            return true; // Tank destroyed
        }
        return false;
    }
}

// Zombie class
class Zombie {
    constructor(x, y, speed, health) {
        this.x = x;
        this.y = y;
        this.radius = CONFIG.zombie.radius;
        this.speed = speed;
        this.health = health || 100;
        this.maxHealth = health || 100;
        this.hasAggro = true;
        this.aggroLostTime = 0;
        this.wanderAngle = Math.random() * Math.PI * 2;
        this.wanderChangeTimer = 0;
    }

    update(deltaTime, player) {
        const dist = distance(this.x, this.y, player.x, player.y);

        // Check if player is hiding
        if (player.isHiding && this.hasAggro) {
            this.aggroLostTime += deltaTime * 1000;
            if (this.aggroLostTime >= CONFIG.hideSpot.aggroLossTime) {
                this.hasAggro = false;
            }
        } else if (!player.isHiding && !this.hasAggro && dist < CONFIG.zombie.detectionRange) {
            // Re-aggro if player is not hiding and in range
            this.hasAggro = true;
            this.aggroLostTime = 0;
        }

        if (this.hasAggro) {
            // Chase player
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            this.x += Math.cos(angle) * this.speed * deltaTime;
            this.y += Math.sin(angle) * this.speed * deltaTime;
        } else {
            // Wander behavior
            this.wanderChangeTimer -= deltaTime;
            if (this.wanderChangeTimer <= 0) {
                this.wanderAngle = Math.random() * Math.PI * 2;
                this.wanderChangeTimer = 1 + Math.random() * 2; // 1-3 seconds
            }

            this.x += Math.cos(this.wanderAngle) * CONFIG.zombie.wanderSpeed * deltaTime;
            this.y += Math.sin(this.wanderAngle) * CONFIG.zombie.wanderSpeed * deltaTime;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        return this.health <= 0;
    }

    draw(ctx) {
        // Zombie body
        ctx.fillStyle = CONFIG.zombie.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Eyes (creepy!)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - 6, this.y - 4, 3, 0, Math.PI * 2);
        ctx.arc(this.x + 6, this.y - 4, 3, 0, Math.PI * 2);
        ctx.fill();

        // Health bar
        const barWidth = this.radius * 2;
        const barHeight = 4;
        const barX = this.x - this.radius;
        const barY = this.y - this.radius - 8;

        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        ctx.fillStyle = '#ff0000';
        ctx.fillRect(barX, barY, barWidth * (this.health / this.maxHealth), barHeight);

        // Aggro indicator
        if (!this.hasAggro) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '12px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('?', this.x, this.y - this.radius - 15);
        }
    }
}

// HideSpot class
class HideSpot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.hideSpot.width;
        this.height = CONFIG.hideSpot.height;
    }

    isPlayerNear(player) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        return distance(player.x, player.y, centerX, centerY) < CONFIG.hideSpot.interactDistance;
    }

    draw(ctx) {
        // Hide spot (box/crate)
        ctx.fillStyle = CONFIG.hideSpot.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Border
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Cross pattern (like a crate)
        ctx.beginPath();
        ctx.moveTo(this.x + 20, this.y);
        ctx.lineTo(this.x + 20, this.y + this.height);
        ctx.moveTo(this.x + this.width - 20, this.y);
        ctx.lineTo(this.x + this.width - 20, this.y + this.height);
        ctx.stroke();
    }
}

// Main Game class
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.overlay = document.getElementById('overlay');

        this.state = GAME_STATES.MENU;
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;

        this.player = null;
        this.gun = null;
        this.bullets = [];
        this.zombies = [];
        this.hideSpots = [];
        this.ammoBoxes = [];
        this.floatingTexts = [];
        this.explosions = [];
        this.bombs = [];
        this.tank = null;
        this.killCount = 0;

        this.currentLevel = 1;
        this.bombCount = CONFIG.bomb.maxBombs;
        this.playerInTank = false;

        this.score = 0;
        this.bestScore = this.loadBestScore();
        this.gameTime = 0;
        this.zombieSpawnTimer = 0;
        this.zombieSpawnRate = CONFIG.zombie.spawnRate;
        this.zombieSpeed = CONFIG.zombie.baseSpeed;
        this.zombieHealth = 100;

        this.lastTime = 0;

        this.soundManager = new SoundManager();

        this.setupInput();
        this.gameLoop(0);
    }

    setupInput() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            if (this.state === GAME_STATES.PLAYING) {
                if (e.key === 'r' || e.key === 'R') {
                    if (this.gun.startReload()) {
                        this.soundManager.playReload();
                    }
                }
                if (e.key === 'e' || e.key === 'E') {
                    this.toggleHiding();
                }
                if (e.key === 'f' || e.key === 'F') {
                    this.toggleSpinShoot();
                }
                if (e.key === 'b' || e.key === 'B') {
                    this.dropBomb();
                }
                if (e.key === 't' || e.key === 'T') {
                    this.toggleTank();
                }
                if (e.key === 'p' || e.key === 'P') {
                    this.pauseGame();
                }
            } else if (this.state === GAME_STATES.PAUSED) {
                if (e.key === 'p' || e.key === 'P') {
                    this.resumeGame();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Mouse
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                this.mouseDown = true;
            }
        });

        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) {
                this.mouseDown = false;
            }
        });
    }

    startGame(level = 1) {
        this.state = GAME_STATES.PLAYING;
        this.overlay.classList.add('hidden');
        this.overlay.classList.remove('interactive');

        // Initialize sound (requires user interaction)
        if (!this.soundManager.audioContext) {
            this.soundManager.init();
        }

        // Set level
        this.currentLevel = level;
        const levelConfig = CONFIG.levels[level];

        // Initialize game objects
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        this.gun = new Gun();
        this.bullets = [];
        this.zombies = [];
        this.bombs = [];
        this.playerInTank = false;

        // Create hide spots
        this.hideSpots = [
            new HideSpot(200, 200),
            new HideSpot(this.canvas.width - 300, 200),
            new HideSpot(200, this.canvas.height - 300),
            new HideSpot(this.canvas.width - 300, this.canvas.height - 300),
            new HideSpot(this.canvas.width / 2 - 50, this.canvas.height / 2 - 50)
        ];

        // Create tank
        this.tank = new Tank(this.canvas.width / 2 + 200, this.canvas.height / 2);

        this.score = 0;
        this.gameTime = 0;
        this.zombieSpawnTimer = 0;
        this.zombieSpawnRate = levelConfig.zombieSpawnRate;
        this.zombieSpeed = levelConfig.zombieSpeed;
        this.zombieHealth = levelConfig.zombieHealth;
        this.bombCount = CONFIG.bomb.maxBombs;
        this.ammoBoxes = [];
        this.floatingTexts = [];
        this.explosions = [];
        this.killCount = 0;
    }

    pauseGame() {
        this.state = GAME_STATES.PAUSED;
        this.showOverlay('PAUSED', 'Press P to resume');
    }

    resumeGame() {
        this.state = GAME_STATES.PLAYING;
        this.overlay.classList.add('hidden');
        this.overlay.classList.remove('interactive');
    }

    gameOver() {
        this.state = GAME_STATES.GAME_OVER;

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore(this.bestScore);
        }

        this.showOverlay('GAME OVER',
            `Score: ${this.score}<br>Best: ${this.bestScore}<br>Time: ${this.formatTime(this.gameTime)}`,
            true);
    }

    showOverlay(title, text, showButton = false) {
        this.overlay.innerHTML = `
            <div class="overlay-title">${title}</div>
            <div class="overlay-text">${text}</div>
            ${showButton ? '<button class="overlay-button" onclick="game.startGame()">RESTART</button>' : ''}
        `;
        this.overlay.classList.remove('hidden');
        if (showButton) {
            this.overlay.classList.add('interactive');
        }
    }

    toggleHiding() {
        if (this.player.isHiding) {
            this.player.isHiding = false;
            return;
        }

        // Check if near a hide spot
        for (const spot of this.hideSpots) {
            if (spot.isPlayerNear(this.player)) {
                this.player.isHiding = true;
                return;
            }
        }
    }

    toggleSpinShoot() {
        if (this.player.isHiding) return; // Can't spin shoot while hiding
        this.player.isSpinShooting = !this.player.isSpinShooting;
        this.player.spinShootTimer = 0;
    }

    dropBomb() {
        if (this.bombCount <= 0) return;
        if (this.playerInTank) return; // Can't drop bombs in tank

        this.bombs.push(new Bomb(this.player.x, this.player.y));
        this.bombCount--;
    }

    toggleTank() {
        if (!this.tank || this.tank.health <= 0) return;

        if (this.playerInTank) {
            // Exit tank
            this.playerInTank = false;
            this.tank.occupied = false;
            this.player.x = this.tank.x;
            this.player.y = this.tank.y + this.tank.height / 2 + 30;
        } else if (this.tank.isPlayerNear(this.player)) {
            // Enter tank
            this.playerInTank = true;
            this.tank.occupied = true;
        }
    }

    spawnAmmoBox() {
        const x = Math.random() * (this.canvas.width - 100) + 50;
        const y = -20; // Start above the screen
        this.ammoBoxes.push(new AmmoBox(x, y));
    }

    spawnZombie() {
        const side = Math.floor(Math.random() * 4);
        let x, y;

        switch (side) {
            case 0: // Top
                x = Math.random() * this.canvas.width;
                y = -CONFIG.zombie.radius;
                break;
            case 1: // Right
                x = this.canvas.width + CONFIG.zombie.radius;
                y = Math.random() * this.canvas.height;
                break;
            case 2: // Bottom
                x = Math.random() * this.canvas.width;
                y = this.canvas.height + CONFIG.zombie.radius;
                break;
            case 3: // Left
                x = -CONFIG.zombie.radius;
                y = Math.random() * this.canvas.height;
                break;
        }

        this.zombies.push(new Zombie(x, y, this.zombieSpeed, this.zombieHealth));
    }

    updateGame(deltaTime) {
        this.gameTime += deltaTime;

        // Check if player is shooting (used in multiple places below)
        const isShooting = this.mouseDown || this.keys[' '];

        if (this.playerInTank && this.tank) {
            // Update tank movement
            let dx = 0;
            let dy = 0;

            if (this.keys['w'] || this.keys['W'] || this.keys['ArrowUp']) dy -= 1;
            if (this.keys['s'] || this.keys['S'] || this.keys['ArrowDown']) dy += 1;
            if (this.keys['a'] || this.keys['A'] || this.keys['ArrowLeft']) dx -= 1;
            if (this.keys['d'] || this.keys['D'] || this.keys['ArrowRight']) dx += 1;

            if (dx !== 0 && dy !== 0) {
                dx *= 0.707;
                dy *= 0.707;
            }

            this.tank.x += dx * CONFIG.tank.speed * deltaTime;
            this.tank.y += dy * CONFIG.tank.speed * deltaTime;

            // Keep tank in bounds
            this.tank.x = Math.max(this.tank.width / 2, Math.min(this.canvas.width - this.tank.width / 2, this.tank.x));
            this.tank.y = Math.max(this.tank.height / 2, Math.min(this.canvas.height - this.tank.height / 2, this.tank.y));

            // Update player position to tank
            this.player.x = this.tank.x;
            this.player.y = this.tank.y;

            // Tank aim with mouse
            this.tank.angle = Math.atan2(
                this.mouseY - this.tank.y,
                this.mouseX - this.tank.x
            );
            this.player.angle = this.tank.angle;

            // Tank shooting
            if (isShooting && this.gun.shoot()) {
                const bulletX = this.tank.x + Math.cos(this.tank.angle) * (CONFIG.tank.cannonLength + 10);
                const bulletY = this.tank.y + Math.sin(this.tank.angle) * (CONFIG.tank.cannonLength + 10);
                this.bullets.push(new Bullet(bulletX, bulletY, this.tank.angle));
                this.soundManager.playShoot();
            }
        } else {
            // Update player
            this.player.update(deltaTime, this.keys, this.canvas);

            // Update player angle based on mouse (unless spinning)
            if (!this.player.isSpinShooting) {
                this.player.angle = Math.atan2(
                    this.mouseY - this.player.y,
                    this.mouseX - this.player.x
                );
            } else {
                // Spinning - rotate constantly
                this.player.angle += CONFIG.spinShoot.rotationSpeed * deltaTime;
            }

            // Shooting (disabled while hiding, works with or without spinning)
            if (isShooting && !this.player.isHiding && this.gun.shoot()) {
                const bulletX = this.player.x + Math.cos(this.player.angle) * (this.player.radius + 10);
                const bulletY = this.player.y + Math.sin(this.player.angle) * (this.player.radius + 10);
                this.bullets.push(new Bullet(bulletX, bulletY, this.player.angle));
                this.soundManager.playShoot();
            }
        }

        // If shooting while trying to hide, break hiding
        if (isShooting && this.player.isHiding) {
            this.player.isHiding = false;
        }

        // Update gun
        this.gun.update(deltaTime);

        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update(deltaTime, this.canvas);
            if (!this.bullets[i].active) {
                this.bullets.splice(i, 1);
            }
        }

        // Update zombies
        for (const zombie of this.zombies) {
            zombie.update(deltaTime, this.player);
        }

        // Spawn zombies
        this.zombieSpawnTimer -= deltaTime * 1000;
        if (this.zombieSpawnTimer <= 0) {
            this.spawnZombie();
            this.zombieSpawnTimer = this.zombieSpawnRate;

            // Increase difficulty over time
            if (this.zombieSpawnRate > CONFIG.zombie.minSpawnRate) {
                this.zombieSpawnRate -= CONFIG.zombie.spawnRateDecrease;
                this.zombieSpeed += 2;
            }
        }

        // Collision detection: bullets vs zombies
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];

            for (let j = this.zombies.length - 1; j >= 0; j--) {
                const zombie = this.zombies[j];
                const dist = distance(bullet.x, bullet.y, zombie.x, zombie.y);

                if (dist < bullet.radius + zombie.radius) {
                    if (zombie.takeDamage(bullet.damage)) {
                        // Add random floating text before removing zombie
                        const randomMessage = ZOMBIE_DEATH_MESSAGES[Math.floor(Math.random() * ZOMBIE_DEATH_MESSAGES.length)];
                        this.floatingTexts.push(new FloatingText(zombie.x, zombie.y, randomMessage));

                        // Create explosion effect
                        this.explosions.push(new Explosion(zombie.x, zombie.y));

                        this.zombies.splice(j, 1);
                        this.score += 100;
                        this.killCount++;
                        this.soundManager.playZombieDeath();

                        // Spawn ammo box every 2 kills
                        if (this.killCount % 2 === 0) {
                            this.spawnAmmoBox();
                        }
                    }
                    this.bullets.splice(i, 1);
                    break;
                }
            }
        }

        // Collision detection: zombies vs player/tank
        for (const zombie of this.zombies) {
            if (this.playerInTank && this.tank) {
                // Check collision with tank
                const dist = distance(this.tank.x, this.tank.y, zombie.x, zombie.y);
                if (dist < (this.tank.width / 2) + zombie.radius) {
                    if (this.tank.takeDamage(CONFIG.zombie.damage)) {
                        // Tank destroyed, force player out
                        this.playerInTank = false;
                        this.tank.occupied = false;
                        this.soundManager.playPlayerDamage();
                    }
                }
            } else {
                // Check collision with player
                const dist = distance(this.player.x, this.player.y, zombie.x, zombie.y);
                if (dist < this.player.radius + zombie.radius) {
                    if (this.player.takeDamage(CONFIG.zombie.damage)) {
                        this.gameOver();
                        return;
                    } else {
                        this.soundManager.playPlayerDamage();
                    }
                }
            }
        }

        // Collision detection: bombs vs zombies
        for (let i = this.bombs.length - 1; i >= 0; i--) {
            const bomb = this.bombs[i];
            for (let j = this.zombies.length - 1; j >= 0; j--) {
                const zombie = this.zombies[j];
                if (bomb.checkZombieCollision(zombie)) {
                    // Zombie touched bomb - kill zombie and remove bomb
                    const randomMessage = ZOMBIE_DEATH_MESSAGES[Math.floor(Math.random() * ZOMBIE_DEATH_MESSAGES.length)];
                    this.floatingTexts.push(new FloatingText(zombie.x, zombie.y, randomMessage));
                    this.explosions.push(new Explosion(zombie.x, zombie.y));
                    this.zombies.splice(j, 1);
                    this.score += 100;
                    this.killCount++;
                    this.soundManager.playZombieDeath();
                    this.bombs.splice(i, 1);
                    break;
                }
            }
        }

        // Update ammo boxes
        for (let i = this.ammoBoxes.length - 1; i >= 0; i--) {
            this.ammoBoxes[i].update(deltaTime, this.canvas);

            // Check collision with player
            if (this.ammoBoxes[i].checkCollision(this.player)) {
                this.gun.reserveAmmo += this.ammoBoxes[i].ammoAmount;
                this.soundManager.playAmmoPickup();
                this.ammoBoxes.splice(i, 1);
                continue;
            }

            // Remove if inactive
            if (!this.ammoBoxes[i].active) {
                this.ammoBoxes.splice(i, 1);
            }
        }

        // Update floating texts
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            this.floatingTexts[i].update(deltaTime);

            // Remove if inactive
            if (!this.floatingTexts[i].active) {
                this.floatingTexts.splice(i, 1);
            }
        }

        // Update bombs
        for (const bomb of this.bombs) {
            bomb.update(deltaTime);
        }

        // Update explosions
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            this.explosions[i].update(deltaTime);

            // Remove if inactive
            if (!this.explosions[i].active) {
                this.explosions.splice(i, 1);
            }
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw hide spots
        for (const spot of this.hideSpots) {
            spot.draw(this.ctx);

            // Draw interaction prompt
            if (this.player && spot.isPlayerNear(this.player) && !this.player.isHiding) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.font = '16px Courier New';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('Press E to hide', spot.x + spot.width / 2, spot.y - 10);
            }
        }

        // Draw bullets
        for (const bullet of this.bullets) {
            bullet.draw(this.ctx);
        }

        // Draw ammo boxes
        for (const ammoBox of this.ammoBoxes) {
            ammoBox.draw(this.ctx);
        }

        // Draw bombs
        for (const bomb of this.bombs) {
            bomb.draw(this.ctx);
        }

        // Draw tank
        if (this.tank && this.tank.health > 0) {
            this.tank.draw(this.ctx);
        }

        // Draw zombies
        for (const zombie of this.zombies) {
            zombie.draw(this.ctx);
        }

        // Draw floating texts
        for (const text of this.floatingTexts) {
            text.draw(this.ctx);
        }

        // Draw explosions
        for (const explosion of this.explosions) {
            explosion.draw(this.ctx);
        }

        // Draw player (only if not in tank)
        if (!this.playerInTank) {
            this.player.draw(this.ctx);
        }

        // Draw HUD
        this.drawHUD();
    }

    drawHUD() {
        const padding = 20;
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 20px Courier New';

        // Level
        this.ctx.fillText(`LEVEL: ${this.currentLevel} (${CONFIG.levels[this.currentLevel].name})`, padding, 30);

        // Health bar
        const healthLabel = this.playerInTank ? 'TANK HEALTH' : 'HEALTH';
        this.ctx.fillText(healthLabel, padding, 60);
        const healthBarWidth = 200;
        const healthBarHeight = 25;

        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(padding, 70, healthBarWidth, healthBarHeight);

        const currentHealth = this.playerInTank ? this.tank.health : this.player.health;
        const maxHealth = this.playerInTank ? this.tank.maxHealth : this.player.maxHealth;
        const healthPercent = currentHealth / maxHealth;
        const healthColor = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffaa00' : '#ff0000';
        this.ctx.fillStyle = healthColor;
        this.ctx.fillRect(padding, 70, healthBarWidth * healthPercent, healthBarHeight);

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(padding, 70, healthBarWidth, healthBarHeight);

        // Ammo
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`AMMO: ${this.gun.currentAmmo} / ${this.gun.reserveAmmo}`, padding, 120);

        if (this.gun.isReloading) {
            this.ctx.fillStyle = '#ffaa00';
            this.ctx.fillText('RELOADING...', padding, 145);
        }

        // Bombs
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`BOMBS: ${this.bombCount}`, padding, 170);

        // Score and time
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`SCORE: ${this.score}`, this.canvas.width - padding, 30);
        this.ctx.fillText(`BEST: ${this.bestScore}`, this.canvas.width - padding, 60);
        this.ctx.fillText(`TIME: ${this.formatTime(this.gameTime)}`, this.canvas.width - padding, 90);
        this.ctx.fillText(`ZOMBIES: ${this.zombies.length}`, this.canvas.width - padding, 120);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    loadBestScore() {
        const saved = localStorage.getItem('zombieHideSurviveBestScore');
        return saved ? parseInt(saved, 10) : 0;
    }

    saveBestScore(score) {
        localStorage.setItem('zombieHideSurviveBestScore', score.toString());
    }

    gameLoop(currentTime) {
        requestAnimationFrame((time) => this.gameLoop(time));

        if (this.lastTime === 0) {
            this.lastTime = currentTime;
            return;
        }

        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;

        // Cap deltaTime to prevent huge jumps (e.g., when tab is inactive)
        const cappedDeltaTime = Math.min(deltaTime, 0.1);

        if (this.state === GAME_STATES.PLAYING) {
            this.updateGame(cappedDeltaTime);
            this.render();
        } else if (this.state === GAME_STATES.PAUSED) {
            // Still render, just don't update
            this.render();
        }
    }
}

// Initialize game when page loads
let game;
window.addEventListener('load', () => {
    game = new Game();
});
