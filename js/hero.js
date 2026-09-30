const hero =
    document.querySelector(".hero");

let heroRevealTimer =
    null;


/* =======================================================
   REVEAL HERO
======================================================= */

function revealHero() {

    if (!hero) {
        return;
    }

    hero.classList.add(
        "is-revealed"
    );
}


/* =======================================================
   SINCRONIZZAZIONE CON LA BUSTA
======================================================= */

window.addEventListener(
    "envelopeopening",
    () => {

        if (heroRevealTimer) {
            clearTimeout(
                heroRevealTimer
            );
        }

        /*
         * Il movimento della Hero parte molto presto,
         * mentre il lembo superiore è ancora in apertura,
         * così ritratto e nomi accompagnano tutta
         * la sequenza della busta.
         */
        heroRevealTimer =
            setTimeout(
                revealHero,
                550
            );
    }
);


/* =======================================================
   SICUREZZA
======================================================= */

if (
    window.envelopeState &&
    window.envelopeState.opened
) {
    revealHero();
}
