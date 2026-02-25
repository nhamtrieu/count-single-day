// ===== Milestones Configuration =====
const MILESTONES = [
    { days: 1, icon: '🌱', name: 'Khởi đầu', tier: 'bronze' },
    { days: 7, icon: '📅', name: '1 Tuần', tier: 'bronze' },
    { days: 14, icon: '🌙', name: '2 Tuần', tier: 'bronze' },
    { days: 30, icon: '📆', name: '1 Tháng', tier: 'silver' },
    { days: 69, icon: '😏', name: 'Nice', tier: 'silver' },
    { days: 100, icon: '💯', name: '100 Ngày', tier: 'silver' },
    { days: 200, icon: '⭐', name: '200 Ngày', tier: 'gold' },
    { days: 365, icon: '🎂', name: '1 Năm', tier: 'gold' },
    { days: 500, icon: '🔥', name: '500 Ngày', tier: 'gold' },
    { days: 730, icon: '👑', name: '2 Năm', tier: 'diamond' },
    { days: 1000, icon: '💎', name: '1000 Ngày', tier: 'diamond' },
    { days: 1825, icon: '🏆', name: '5 Năm', tier: 'legendary' },
    { days: 3650, icon: '🐉', name: '10 Năm', tier: 'legendary' },
];

// ===== DOM Elements =====
const dateInput = document.getElementById('singleDate');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const dateInputSection = document.getElementById('dateInputSection');
const counterSection = document.getElementById('counterSection');
const milestonesSection = document.getElementById('milestonesSection');
const funSection = document.getElementById('funSection');
const badgesGrid = document.getElementById('badgesGrid');
const startDateDisplay = document.getElementById('startDateDisplay');

// Counter elements
const yearsEl = document.getElementById('years');
const monthsEl = document.getElementById('months');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const totalDaysEl = document.getElementById('totalDays');

// Fun stats elements
const coffeesEl = document.getElementById('coffees');
const moviesEl = document.getElementById('movies');
const moneySavedEl = document.getElementById('moneySaved');
const fullMoonsEl = document.getElementById('fullMoons');

let countInterval = null;
let lastUnlockedMilestone = -1;

// ===== Initialize =====
function init() {
    createParticles();
    renderBadges();

    // Check localStorage for saved date
    const savedDate = localStorage.getItem('singleStartDate');
    if (savedDate) {
        dateInput.value = savedDate;
        startCounting(savedDate);
    }

    // Event listeners
    startBtn.addEventListener('click', handleStart);
    resetBtn.addEventListener('click', handleReset);
    dateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleStart();
    });

    // Set max date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('max', today);
}

// ===== Particle Background =====
function createParticles() {
    const container = document.getElementById('particles');
    const colors = ['#ff6b9d', '#c471f5', '#48b1ff', '#12d8fa', '#ffd700'];
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 6 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 20 + 15}s;
            animation-delay: ${Math.random() * 20}s;
        `;
        
        container.appendChild(particle);
    }
}

// ===== Handle Start Button =====
function handleStart() {
    const dateValue = dateInput.value;
    
    if (!dateValue) {
        shakeElement(dateInput);
        return;
    }

    const selectedDate = new Date(dateValue);
    const now = new Date();
    
    if (selectedDate > now) {
        showToast('⚠️ Ngày không thể ở tương lai!');
        shakeElement(dateInput);
        return;
    }

    // Save to localStorage
    localStorage.setItem('singleStartDate', dateValue);
    
    startCounting(dateValue);
}

// ===== Start Counting =====
function startCounting(dateString) {
    // Show sections
    dateInputSection.classList.add('hidden');
    counterSection.classList.remove('hidden');
    milestonesSection.classList.remove('hidden');
    funSection.classList.remove('hidden');

    // Display start date
    const date = new Date(dateString);
    startDateDisplay.textContent = date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Clear existing interval
    if (countInterval) clearInterval(countInterval);

    // Update immediately then every second
    updateCounter(dateString);
    countInterval = setInterval(() => updateCounter(dateString), 1000);
}

// ===== Update Counter =====
function updateCounter(dateString) {
    const startDate = new Date(dateString);
    const now = new Date();
    const diff = now - startDate;

    // Total days
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // Calculate years, months, days
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();
    
    if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }

    // Hours, minutes, seconds
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Update DOM
    yearsEl.textContent = years;
    monthsEl.textContent = months;
    daysEl.textContent = days;
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
    totalDaysEl.textContent = totalDays.toLocaleString('vi-VN');

    // Update badges
    updateBadges(totalDays);

    // Update fun stats
    updateFunStats(totalDays);
}

// ===== Render Badges =====
function renderBadges() {
    badgesGrid.innerHTML = '';
    
    MILESTONES.forEach((milestone, index) => {
        const badge = document.createElement('div');
        badge.className = `badge tier-${milestone.tier} locked`;
        badge.id = `badge-${index}`;
        badge.innerHTML = `
            <span class="badge-icon">${milestone.icon}</span>
            <span class="badge-name">${milestone.name}</span>
            <span class="badge-days">${milestone.days} ngày</span>
        `;
        badgesGrid.appendChild(badge);
    });
}

// ===== Update Badges =====
function updateBadges(totalDays) {
    MILESTONES.forEach((milestone, index) => {
        const badge = document.getElementById(`badge-${index}`);
        
        if (totalDays >= milestone.days) {
            if (badge.classList.contains('locked')) {
                badge.classList.remove('locked');
                badge.classList.add('unlocked');
                
                // Show toast for newly unlocked badges
                if (index > lastUnlockedMilestone) {
                    lastUnlockedMilestone = index;
                    // Only show toast if not loading from saved state for the first time
                    if (countInterval) {
                        showToast(`🎉 Mở khóa huy hiệu: ${milestone.icon} ${milestone.name}!`);
                    }
                }
            }
        } else {
            badge.classList.add('locked');
            badge.classList.remove('unlocked');
        }
    });

    // Set lastUnlockedMilestone on first load
    if (lastUnlockedMilestone === -1) {
        for (let i = MILESTONES.length - 1; i >= 0; i--) {
            if (totalDays >= MILESTONES[i].days) {
                lastUnlockedMilestone = i;
                break;
            }
        }
    }
}

// ===== Update Fun Stats =====
function updateFunStats(totalDays) {
    // Avg 2 coffees per day
    coffeesEl.textContent = (totalDays * 2).toLocaleString('vi-VN');
    
    // Avg 1 movie per 3 days
    moviesEl.textContent = Math.floor(totalDays / 3).toLocaleString('vi-VN');
    
    // Avg 200k VND saved per day (no dates!)
    const saved = totalDays * 200000;
    if (saved >= 1000000000) {
        moneySavedEl.textContent = (saved / 1000000000).toFixed(1) + ' tỷ';
    } else if (saved >= 1000000) {
        moneySavedEl.textContent = (saved / 1000000).toFixed(1) + ' triệu';
    } else {
        moneySavedEl.textContent = saved.toLocaleString('vi-VN');
    }
    
    // Full moon cycle ~ 29.5 days
    fullMoonsEl.textContent = Math.floor(totalDays / 29.5).toLocaleString('vi-VN');
}

// ===== Handle Reset =====
function handleReset() {
    if (!confirm('Bạn có chắc muốn đặt lại? Dữ liệu sẽ bị xóa.')) return;

    localStorage.removeItem('singleStartDate');
    
    if (countInterval) {
        clearInterval(countInterval);
        countInterval = null;
    }

    lastUnlockedMilestone = -1;
    dateInput.value = '';

    // Reset display
    counterSection.classList.add('hidden');
    milestonesSection.classList.add('hidden');
    funSection.classList.add('hidden');
    dateInputSection.classList.remove('hidden');

    // Re-render badges as locked
    renderBadges();

    showToast('🔄 Đã đặt lại thành công!');
}

// ===== Toast Notification =====
function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Remove after 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ===== Shake Animation =====
function shakeElement(el) {
    el.style.animation = 'none';
    el.offsetHeight; // trigger reflow
    el.style.animation = 'shake 0.5s ease-in-out';
    
    // Add shake keyframes if not exists
    if (!document.getElementById('shake-style')) {
        const style = document.createElement('style');
        style.id = 'shake-style';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-8px); }
                40% { transform: translateX(8px); }
                60% { transform: translateX(-4px); }
                80% { transform: translateX(4px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== Start App =====
document.addEventListener('DOMContentLoaded', init);
