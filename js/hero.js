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

/* UI V2 parallax */
(function(){const hero=document.getElementById('hero');const portrait=hero&&hero.querySelector('.hero-portrait');const content=hero&&hero.querySelector('.hero-content');const fine=window.matchMedia('(pointer:fine)');const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');if(!hero||!portrait||!content||!fine.matches||reduced.matches)return;hero.addEventListener('pointermove',event=>{const rect=hero.getBoundingClientRect();const x=((event.clientX-rect.left)/rect.width-.5);const y=((event.clientY-rect.top)/rect.height-.5);portrait.style.setProperty('--hero-x',(x*6)+'px');portrait.style.setProperty('--hero-y',(y*4)+'px');content.style.setProperty('--hero-content-x',(x*-2)+'px');content.style.setProperty('--hero-content-y',(y*-1.5)+'px')},{passive:true});hero.addEventListener('pointerleave',()=>{portrait.style.setProperty('--hero-x','0px');portrait.style.setProperty('--hero-y','0px');content.style.setProperty('--hero-content-x','0px');content.style.setProperty('--hero-content-y','0px')})})();
