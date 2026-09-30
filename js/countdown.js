const countdown = document.getElementById("countdown");
const countdownDays = document.getElementById("countdownDays");
const countdownHours = document.getElementById("countdownHours");
const countdownMinutes = document.getElementById("countdownMinutes");
const countdownSeconds = document.getElementById("countdownSeconds");

const WEDDING_DATE = new Date("2027-06-12T11:00:00+02:00");
const WEDDING_DAY_END = new Date("2027-06-13T04:00:00+02:00");
const FLIP_DURATION = 500;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const flipStates = new WeakMap();
let countdownTimer = null;

function initialiseFlipElement(element) {
    if (!element) return;
    const initialValue = element.textContent.trim();
    element.innerHTML = `<div class="countdown-flip"><div class="countdown-flip-face countdown-flip-current">${initialValue}</div><div class="countdown-flip-face countdown-flip-next">${initialValue}</div></div>`;
    flipStates.set(element, {
        flip: element.querySelector(".countdown-flip"),
        currentFace: element.querySelector(".countdown-flip-current"),
        nextFace: element.querySelector(".countdown-flip-next"),
        currentValue: initialValue,
        isFlipping: false,
        pendingValue: null
    });
}

function setValueImmediately(element, newValue) {
    const state = flipStates.get(element);
    if (!state) return;
    state.flip.classList.remove("is-flipping");
    state.currentFace.textContent = newValue;
    state.nextFace.textContent = newValue;
    state.currentValue = newValue;
    state.isFlipping = false;
    state.pendingValue = null;
}

function flipToValue(element, newValue) {
    const state = flipStates.get(element);
    if (!state || (state.currentValue === newValue && !state.isFlipping)) return;
    if (prefersReducedMotion.matches) return setValueImmediately(element, newValue);
    if (state.isFlipping) {
        state.pendingValue = newValue;
        return;
    }
    state.isFlipping = true;
    state.pendingValue = null;
    state.nextFace.textContent = newValue;
    state.flip.classList.remove("is-flipping");
    void state.flip.offsetWidth;
    state.flip.classList.add("is-flipping");
    setTimeout(() => {
        state.currentFace.textContent = newValue;
        state.nextFace.textContent = newValue;
        state.currentValue = newValue;
        state.flip.classList.remove("is-flipping");
        state.isFlipping = false;
        if (state.pendingValue !== null && state.pendingValue !== state.currentValue) {
            const pending = state.pendingValue;
            state.pendingValue = null;
            flipToValue(element, pending);
        } else {
            state.pendingValue = null;
        }
    }, FLIP_DURATION);
}

function getCountdownMessage(days) {
    if (days <= 1) return "Ci siamo quasi. Domani inizia il nostro giorno. ❤️";
    if (days <= 7) return "Manca pochissimo. Non vediamo l’ora di festeggiare con voi. ✨";
    if (days <= 30) return "Manca meno di un mese! ❤️";
    if (days <= 100) return "Il grande giorno si avvicina…";
    return "Manca ancora un po’, ma noi stiamo già contando i giorni. ❤️";
}

function ensureEnhancements() {
    if (!document.getElementById("weddingEnhancementStyles")) {
        const style = document.createElement("style");
        style.id = "weddingEnhancementStyles";
        style.textContent = `
            .countdown-message{margin:14px auto 0;max-width:560px;padding:0 18px;color:var(--muted);font-family:Georgia,"Times New Roman",serif;font-size:clamp(.95rem,2vw,1.08rem);font-style:italic;line-height:1.55;text-align:center}
            .day-timeline{max-width:720px;margin:30px auto 0;display:grid;gap:0;text-align:left}
            .timeline-item{position:relative;display:grid;grid-template-columns:74px 28px 1fr;gap:12px;min-height:92px;align-items:start}
            .timeline-time{padding-top:4px;color:#8176B8;font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:.82rem;text-align:right}
            .timeline-marker{position:relative;display:flex;justify-content:center}
            .timeline-marker::before{content:"";position:absolute;top:22px;bottom:-70px;width:1px;background:rgba(171,165,240,.55)}
            .timeline-item:last-child .timeline-marker::before{display:none}
            .timeline-dot{position:relative;z-index:1;width:14px;height:14px;margin-top:5px;border-radius:50%;background:#ABA5F0;box-shadow:0 0 0 5px rgba(171,165,240,.13)}
            .timeline-content h3{margin:0 0 5px;font-size:1.2rem;font-weight:400}
            .timeline-content p{margin:0;color:var(--muted);font-family:Arial,Helvetica,sans-serif;font-size:.9rem;line-height:1.5}
            .wedding-day-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:18px}
            @media(max-width:560px){.timeline-item{grid-template-columns:58px 22px 1fr;gap:9px}.timeline-time{font-size:.74rem}.timeline-content h3{font-size:1.08rem}}
        `;
        document.head.appendChild(style);
    }

    if (!document.getElementById("countdownMessage")) {
        const message = document.createElement("p");
        message.id = "countdownMessage";
        message.className = "countdown-message";
        message.setAttribute("aria-live", "polite");
        countdown.insertAdjacentElement("afterend", message);
    }

    const places = document.getElementById("luoghi");
    if (places && !document.getElementById("programma")) {
        const section = document.createElement("section");
        section.className = "section";
        section.id = "programma";
        section.innerHTML = `
            <div class="section-inner">
                <h2 class="section-title"><span class="section-emoji" aria-hidden="true">💍</span>La nostra giornata</h2>
                <p class="section-text">I momenti principali del 12 giugno, tutti in un colpo d’occhio.</p>
                <div class="day-timeline">
                    <div class="timeline-item"><div class="timeline-time">11:00</div><div class="timeline-marker"><span class="timeline-dot"></span></div><div class="timeline-content"><h3>Cerimonia</h3><p>Chiesa di San Martino Vescovo</p></div></div>
                    <div class="timeline-item"><div class="timeline-time">A seguire</div><div class="timeline-marker"><span class="timeline-dot"></span></div><div class="timeline-content"><h3>Ricevimento</h3><p>Masseria La Morella</p></div></div>
                    <div class="timeline-item"><div class="timeline-time">Poi…</div><div class="timeline-marker"><span class="timeline-dot"></span></div><div class="timeline-content"><h3>Festeggiamo insieme</h3><p>Cena, brindisi, musica e tutto quello che verrà dopo. ❤️</p></div></div>
                </div>
            </div>`;
        places.parentNode.insertBefore(section, places);
    }
}

function activateWeddingDayMode() {
    const message = document.getElementById("countdownMessage");
    if (message) message.textContent = "Oggi ci sposiamo! Qui trovi tutto quello che ti serve per vivere la giornata con noi. ❤️";
    const programme = document.getElementById("programma");
    if (programme && !programme.querySelector(".wedding-day-actions")) {
        const actions = document.createElement("div");
        actions.className = "wedding-day-actions";
        actions.innerHTML = `<a class="button button-secondary" href="https://maps.app.goo.gl/6omwCTy1Atd1c3Cb7" target="_blank" rel="noopener noreferrer">⛪ Vai alla cerimonia</a><a class="button button-secondary" href="https://maps.app.goo.gl/2apy9TeoYDG768eM7" target="_blank" rel="noopener noreferrer">🥂 Vai al ricevimento</a><a class="button button-secondary" href="https://www.wedshoots.com/it?albumId=ITb2ea31c8" target="_blank" rel="noopener noreferrer">📸 Condividi le foto</a>`;
        programme.querySelector(".section-inner").appendChild(actions);
    }
}

function updateCountdown() {
    if (!countdown || !countdownDays || !countdownHours || !countdownMinutes || !countdownSeconds) return;
    const now = Date.now();
    const remaining = WEDDING_DATE.getTime() - now;
    const message = document.getElementById("countdownMessage");

    if (remaining <= 0) {
        countdown.innerHTML = `<img class="countdown-paper-image" src="images/cartoncino.png" alt=""><div class="countdown-paper-content"><p class="countdown-finished">È arrivato il nostro giorno ❤️</p></div>`;
        if (now <= WEDDING_DAY_END.getTime()) activateWeddingDayMode();
        else if (message) message.textContent = "Grazie per aver condiviso con noi un giorno così speciale. ❤️";
        if (countdownTimer) clearInterval(countdownTimer);
        countdownTimer = null;
        return;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (message) message.textContent = getCountdownMessage(days);
    flipToValue(countdownDays, String(days));
    flipToValue(countdownHours, String(hours).padStart(2, "0"));
    flipToValue(countdownMinutes, String(minutes).padStart(2, "0"));
    flipToValue(countdownSeconds, String(seconds).padStart(2, "0"));
}

function startCountdown() {
    ensureEnhancements();
    initialiseFlipElement(countdownDays);
    initialiseFlipElement(countdownHours);
    initialiseFlipElement(countdownMinutes);
    initialiseFlipElement(countdownSeconds);
    updateCountdown();
    if (WEDDING_DATE.getTime() > Date.now()) countdownTimer = setInterval(updateCountdown, 1000);
}

startCountdown();
