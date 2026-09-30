const countdown =
    document.getElementById("countdown");

const countdownDays =
    document.getElementById("countdownDays");

const countdownHours =
    document.getElementById("countdownHours");

const countdownMinutes =
    document.getElementById("countdownMinutes");

const countdownSeconds =
    document.getElementById("countdownSeconds");


const WEDDING_DATE =
    new Date("2027-06-12T11:00:00+02:00");


let countdownTimer =
    null;


/* =======================================================
   IMPOSTAZIONI FLIP
======================================================= */

const FLIP_DURATION =
    500;

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


/* =======================================================
   STATO DEI CONTATORI
======================================================= */

const flipStates =
    new WeakMap();


/* =======================================================
   CREA STRUTTURA FLIP
======================================================= */

function initialiseFlipElement(element) {

    if (!element) {
        return;
    }


    const initialValue =
        element.textContent.trim();


    element.innerHTML = `
        <div class="countdown-flip">

            <div
                class="
                    countdown-flip-face
                    countdown-flip-current
                "
            >
                ${initialValue}
            </div>

            <div
                class="
                    countdown-flip-face
                    countdown-flip-next
                "
            >
                ${initialValue}
            </div>

        </div>
    `;


    const flip =
        element.querySelector(
            ".countdown-flip"
        );


    const currentFace =
        element.querySelector(
            ".countdown-flip-current"
        );


    const nextFace =
        element.querySelector(
            ".countdown-flip-next"
        );


    flipStates.set(
        element,
        {
            flip,
            currentFace,
            nextFace,
            currentValue: initialValue,
            isFlipping: false,
            pendingValue: null
        }
    );
}


/* =======================================================
   AGGIORNAMENTO IMMEDIATO
======================================================= */

function setValueImmediately(
    element,
    newValue
) {

    const state =
        flipStates.get(
            element
        );


    if (!state) {
        return;
    }


    state.flip.classList.remove(
        "is-flipping"
    );


    state.currentFace.textContent =
        newValue;


    state.nextFace.textContent =
        newValue;


    state.currentValue =
        newValue;


    state.isFlipping =
        false;


    state.pendingValue =
        null;
}


/* =======================================================
   FLIP DEL NUMERO
======================================================= */

function flipToValue(
    element,
    newValue
) {

    if (!element) {
        return;
    }


    const state =
        flipStates.get(
            element
        );


    if (!state) {
        return;
    }


    /*
     * Nessuna animazione se il valore
     * non è cambiato.
     */
    if (
        state.currentValue === newValue &&
        !state.isFlipping
    ) {
        return;
    }


    /*
     * Accessibilità:
     * niente animazione se l'utente
     * preferisce movimenti ridotti.
     */
    if (
        prefersReducedMotion.matches
    ) {

        setValueImmediately(
            element,
            newValue
        );

        return;
    }


    /*
     * Se un flip è ancora in corso,
     * memorizziamo l'ultimo valore
     * richiesto.
     */
    if (
        state.isFlipping
    ) {

        state.pendingValue =
            newValue;

        return;
    }


    state.isFlipping =
        true;


    state.pendingValue =
        null;


    state.nextFace.textContent =
        newValue;


    /*
     * Rimuoviamo e riaggiungiamo
     * la classe per garantire che
     * l'animazione parta sempre.
     */
    state.flip.classList.remove(
        "is-flipping"
    );


    void state.flip.offsetWidth;


    state.flip.classList.add(
        "is-flipping"
    );


    setTimeout(
        () => {

            state.currentFace.textContent =
                newValue;


            state.nextFace.textContent =
                newValue;


            state.currentValue =
                newValue;


            state.flip.classList.remove(
                "is-flipping"
            );


            state.isFlipping =
                false;


            /*
             * Se nel frattempo è arrivato
             * un altro valore, lo animiamo
             * immediatamente dopo.
             */
            if (
                state.pendingValue !== null &&
                state.pendingValue !== state.currentValue
            ) {

                const pending =
                    state.pendingValue;


                state.pendingValue =
                    null;


                flipToValue(
                    element,
                    pending
                );

            } else {

                state.pendingValue =
                    null;
            }

        },
        FLIP_DURATION
    );
}


/* =======================================================
   CALCOLO COUNTDOWN
======================================================= */

function updateCountdown() {

    if (
        !countdown ||
        !countdownDays ||
        !countdownHours ||
        !countdownMinutes ||
        !countdownSeconds
    ) {
        return;
    }


    const remaining =
        WEDDING_DATE.getTime() -
        Date.now();


    if (
        remaining <= 0
    ) {

        countdown.innerHTML = `
            <img
                class="countdown-paper-image"
                src="images/cartoncino.png"
                alt=""
            >

            <div class="countdown-paper-content">

                <p class="countdown-finished">
                    È arrivato il nostro giorno ❤️
                </p>

            </div>
        `;


        if (
            countdownTimer
        ) {

            clearInterval(
                countdownTimer
            );


            countdownTimer =
                null;
        }


        return;
    }


    const totalSeconds =
        Math.floor(
            remaining / 1000
        );


    const days =
        Math.floor(
            totalSeconds /
            86400
        );


    const hours =
        Math.floor(
            (
                totalSeconds %
                86400
            ) /
            3600
        );


    const minutes =
        Math.floor(
            (
                totalSeconds %
                3600
            ) /
            60
        );


    const seconds =
        totalSeconds %
        60;


    const daysValue =
        String(
            days
        );


    const hoursValue =
        String(
            hours
        ).padStart(
            2,
            "0"
        );


    const minutesValue =
        String(
            minutes
        ).padStart(
            2,
            "0"
        );


    const secondsValue =
        String(
            seconds
        ).padStart(
            2,
            "0"
        );


    flipToValue(
        countdownDays,
        daysValue
    );


    flipToValue(
        countdownHours,
        hoursValue
    );


    flipToValue(
        countdownMinutes,
        minutesValue
    );


    flipToValue(
        countdownSeconds,
        secondsValue
    );
}


/* =======================================================
   INIZIALIZZAZIONE
======================================================= */

function startCountdown() {

    /*
     * Prima trasformiamo i quattro
     * valori nella struttura necessaria
     * al flip.
     */

    initialiseFlipElement(
        countdownDays
    );


    initialiseFlipElement(
        countdownHours
    );


    initialiseFlipElement(
        countdownMinutes
    );


    initialiseFlipElement(
        countdownSeconds
    );


    /*
     * Primo aggiornamento.
     */

    updateCountdown();


    /*
     * Poi aggiorniamo ogni secondo.
     */

    if (
        WEDDING_DATE.getTime() >
        Date.now()
    ) {

        countdownTimer =
            setInterval(
                updateCountdown,
                1000
            );
    }
}


startCountdown();
