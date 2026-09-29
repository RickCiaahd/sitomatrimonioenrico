const scrollIndicator =
    document.getElementById("scrollIndicator");

const copyWedshootsCode =
    document.getElementById("copyWedshootsCode");

const wedshootsCode =
    document.getElementById("wedshootsCode");

const giftToggle =
    document.getElementById("giftToggle");

const giftDetails =
    document.getElementById("giftDetails");

const copyIban =
    document.getElementById("copyIban");

const ibanCode =
    document.getElementById("ibanCode");

let scrollFramePending = false;
let scrollIndicatorEnabled = false;

async function copyText(
    text,
    button,
    successLabel
) {
    const originalLabel =
        button.innerHTML;

    try {
        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {
            await navigator.clipboard.writeText(
                text
            );
        } else {
            const textarea =
                document.createElement("textarea");

            textarea.value =
                text;

            textarea.style.position =
                "fixed";

            textarea.style.opacity =
                "0";

            textarea.style.pointerEvents =
                "none";

            (button.closest("dialog") || document.body).appendChild(textarea);

            textarea.focus();
            textarea.select();

            document.execCommand(
                "copy"
            );

            textarea.remove();
        }

        button.textContent =
            successLabel;

    } catch {
        button.textContent =
            "Seleziona e copia";
    }

    window.setTimeout(
        () => {
            button.innerHTML =
                originalLabel;
        },
        1600
    );
}

function updateScrollIndicator() {
    if (
        !scrollIndicator ||
        !scrollIndicatorEnabled
    ) {
        return;
    }

    const documentHeight =
        document.documentElement.scrollHeight;

    const viewportBottom =
        window.scrollY +
        window.innerHeight;

    const distanceFromBottom =
        documentHeight -
        viewportBottom;

    const canScroll =
        documentHeight >
        window.innerHeight + 40;

    if (
        window.scrollY > 25
    ) {
        scrollIndicator.classList.add(
            "compact"
        );
    } else {
        scrollIndicator.classList.remove(
            "compact"
        );
    }

    const indicatorVisible = canScroll && distanceFromBottom > 100;
    const canActivate = indicatorVisible && !document.documentElement.classList.contains("envelope-closed");
    scrollIndicator.tabIndex = canActivate ? 0 : -1;
    scrollIndicator.setAttribute("aria-hidden", String(!canActivate));

    if (indicatorVisible) {
        scrollIndicator.classList.add(
            "visible"
        );
    } else {
        scrollIndicator.classList.remove(
            "visible"
        );
    }
}

function enableScrollIndicator() {
    scrollIndicatorEnabled = true;

    updateScrollIndicator();
}

window.addEventListener(
    "envelopeopening",
    () => {
        window.setTimeout(
            enableScrollIndicator,
            700
        );
    }
);

window.addEventListener(
    "envelopeopened",
    () => {
        scrollIndicatorEnabled = true;

        updateScrollIndicator();
    }
);

window.addEventListener(
    "scroll",
    () => {
        if (
            scrollFramePending
        ) {
            return;
        }

        scrollFramePending =
            true;

        requestAnimationFrame(
            () => {
                updateScrollIndicator();

                scrollFramePending =
                    false;
            }
        );
    },
    {
        passive: true
    }
);

window.addEventListener(
    "resize",
    updateScrollIndicator
);

if (
    copyWedshootsCode &&
    wedshootsCode
) {
    copyWedshootsCode.addEventListener(
        "click",
        () => {
            copyText(
                wedshootsCode.textContent.trim(),
                copyWedshootsCode,
                "Copiato!"
            );
        }
    );
}

if (
    copyIban &&
    ibanCode
) {
    copyIban.addEventListener(
        "click",
        () => {
            copyText(
                ibanCode.textContent
                    .replace(/\s/g, "")
                    .trim(),
                copyIban,
                "Copiato!"
            );
        }
    );
}

(() => {
    const dialog = document.getElementById("giftDialog");
    const closeButton = document.getElementById("giftClose");
    if (!giftToggle || !dialog || !closeButton) return;
    let previousFocus = null;
    let pointerStartedOutside = false;
    giftToggle.addEventListener("click", () => {
        if (dialog.open) return;
        previousFocus = document.activeElement;
        dialog.showModal();
    });
    closeButton.addEventListener("click", () => closeDialogAnimated(dialog));
    function isOutside(event) {
        const rect = dialog.getBoundingClientRect();
        return event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom;
    }
    dialog.addEventListener("pointerdown", event => {
        pointerStartedOutside = event.target === dialog && isOutside(event);
    });
    dialog.addEventListener("click", event => {
        if (pointerStartedOutside && event.target === dialog && isOutside(event)) {
            closeDialogAnimated(dialog);
        }
        pointerStartedOutside = false;
    });
    dialog.addEventListener("close", () => {
        pointerStartedOutside = false;
        if (previousFocus && previousFocus.isConnected) {
            previousFocus.focus({ preventScroll: true });
        }
    });
})();


/* =======================================================
   CALENDARIO
======================================================= */

(() => {
    const openButton = document.getElementById("calendarOpen");
    const dialog = document.getElementById("calendarDialog");
    const closeButton = document.getElementById("calendarClose");
    const googleButton = document.getElementById("calendarGoogle");
    const appleButton = document.getElementById("calendarApple");
    const outlookButton = document.getElementById("calendarOutlook");

    if (!openButton || !dialog || !closeButton ||
        !googleButton || !appleButton || !outlookButton) {
        return;
    }

    const title = "Matrimonio Enrico & Annachiara ❤️";
    const description =
        "Matrimonio Enrico & Annachiara ❤️\n\n" +
        "12 giugno 2027 — evento per l'intera giornata\n\n" +
        "Cerimonia: ore 11:00\n" +
        "Chiesa di San Martino Vescovo, Lancusi\n\n" +
        "Ricevimento: Masseria La Morella, Battipaglia";
    const location =
        "Chiesa di San Martino Vescovo, Lancusi; " +
        "Masseria La Morella, Battipaglia";

    const googleUrl = new URL("https://calendar.google.com/calendar/render");
    googleUrl.search = new URLSearchParams({
        action: "TEMPLATE",
        text: title,
        dates: "20270612/20270613",
        details: description,
        location: location
    }).toString();
    googleButton.href = googleUrl.href;

    const outlookUrl = new URL("https://outlook.live.com/calendar/0/deeplink/compose");
    outlookUrl.search = new URLSearchParams({
        path: "/calendar/action/compose",
        rru: "addevent",
        subject: title,
        startdt: "2027-06-12T00:00:00",
        enddt: "2027-06-13T00:00:00",
        allday: "true",
        body: description,
        location: location
    }).toString();
    outlookButton.href = outlookUrl.href;

    let previousFocus = null;

    openButton.addEventListener("click", () => {
        if (dialog.open) return;
        previousFocus = document.activeElement;
        dialog.showModal();
    });

    closeButton.addEventListener("click", () => closeDialogAnimated(dialog));

    // Il backdrop nativo inoltra il click al dialog.
    let pointerStartedOutside = false;
    function isOutside(event) {
        const rect = dialog.getBoundingClientRect();
        return event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom;
    }
    dialog.addEventListener("pointerdown", event => {
        pointerStartedOutside = event.target === dialog && isOutside(event);
    });
    dialog.addEventListener("click", event => {
        if (pointerStartedOutside && event.target === dialog && isOutside(event)) {
            closeDialogAnimated(dialog);
        }
        pointerStartedOutside = false;
    });

    // Escape e contenimento del focus sono gestiti dal dialog nativo.
    dialog.addEventListener("close", () => {
        if (previousFocus && previousFocus.isConnected) {
            previousFocus.focus({ preventScroll: true });
        }
    });

    function escapeIcs(value) {
        return value.replace(/\\/g, "\\\\")
            .replace(/\r\n|\r|\n/g, "\\n")
            .replace(/;/g, "\\;")
            .replace(/,/g, "\\,");
    }

    // RFC 5545: righe di massimo 75 byte, senza spezzare caratteri UTF-8.
    function foldIcsLine(line) {
        const encoder = new TextEncoder();
        let folded = "";
        let bytes = 0;
        for (const character of line) {
            const size = encoder.encode(character).length;
            if (bytes + size > 75) {
                folded += "\r\n ";
                bytes = 1;
            }
            folded += character;
            bytes += size;
        }
        return folded;
    }

    appleButton.addEventListener("click", () => {
        const timestamp = new Date().toISOString()
            .replace(/[-:]/g, "")
            .replace(/\.\d{3}Z$/, "Z");
        const lines = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Enrico e Annachiara//Matrimonio//IT",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",
            "BEGIN:VEVENT",
            "UID:enrico-annachiara-20270612@matrimonio.local",
            "DTSTAMP:" + timestamp,
            "DTSTART;VALUE=DATE:20270612",
            "DTEND;VALUE=DATE:20270613",
            "SUMMARY:" + escapeIcs(title),
            "DESCRIPTION:" + escapeIcs(description),
            "LOCATION:" + escapeIcs(location),
            "TRANSP:TRANSPARENT",
            "END:VEVENT",
            "END:VCALENDAR"
        ];
        const content = lines.map(foldIcsLine).join("\r\n") + "\r\n";
        const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "matrimonio-enrico-annachiara-12-giugno-2027.ics";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    });
})();

/* CONFERMA PRESENZA */
(() => {
    const button = document.getElementById("rsvpOpen");
    const dialog = document.getElementById("rsvpDialog");
    const close = document.getElementById("rsvpClose");
    const frame = document.getElementById("rsvpFrame");
    if (!button || !dialog || !close || !frame) return;
    let previousFocus = null;
    let pointerStartedOutside = false;
    button.addEventListener("click", () => {
        if (dialog.open) return;
        previousFocus = document.activeElement;
        if (!frame.hasAttribute("src")) frame.src = frame.dataset.src;
        dialog.showModal();
    });
    close.addEventListener("click", () => closeDialogAnimated(dialog));
    function isOutside(event) {
        const rect = dialog.getBoundingClientRect();
        return event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom;
    }
    dialog.addEventListener("pointerdown", event => {
        pointerStartedOutside = event.target === dialog && isOutside(event);
    });
    dialog.addEventListener("click", event => {
        if (pointerStartedOutside && event.target === dialog && isOutside(event)) closeDialogAnimated(dialog);
        pointerStartedOutside = false;
    });
    dialog.addEventListener("close", () => {
        pointerStartedOutside = false;
        if (previousFocus && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    });
})();

/* LUOGHI DELLA GIORNATA */
(() => {
    const dialog = document.getElementById("placeDialog");
    const close = document.getElementById("placeClose");
    if (!dialog || !close) return;
    let previousFocus = null;
    let pointerStartedOutside = false;
    document.querySelectorAll(".place-open").forEach(button => {
        button.addEventListener("click", () => {
            if (dialog.open) return;
            previousFocus = button;
            document.getElementById("placeTitle").textContent = button.dataset.placeTitle;
            document.getElementById("placeGoogle").href = button.dataset.google;
            document.getElementById("placeWaze").href = button.dataset.waze;
            const apple = new URL("https://maps.apple.com/");
            apple.searchParams.set("daddr", button.dataset.coordinates);
            apple.searchParams.set("dirflg", "d");
            document.getElementById("placeApple").href = apple.href;
            dialog.showModal();
        });
    });
    close.addEventListener("click", () => closeDialogAnimated(dialog));
    function isOutside(event) {
        const rect = dialog.getBoundingClientRect();
        return event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom;
    }
    dialog.addEventListener("pointerdown", event => {
        pointerStartedOutside = event.target === dialog && isOutside(event);
    });
    dialog.addEventListener("click", event => {
        if (pointerStartedOutside && event.target === dialog && isOutside(event)) closeDialogAnimated(dialog);
        pointerStartedOutside = false;
    });
    dialog.addEventListener("close", () => {
        pointerStartedOutside = false;
        if (previousFocus && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    });
})();

/* CHIUSURA ANIMATA DELLE FINESTRE */
function closeDialogAnimated(dialog) {
    if (!dialog.open || dialog.classList.contains("is-closing")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        dialog.close();
        return;
    }
    const style = getComputedStyle(dialog);
    dialog.style.setProperty("--dialog-close-transform", style.transform);
    dialog.style.setProperty("--dialog-close-opacity", style.opacity);
    let fallback;
    let finished = false;
    function finish() {
        if (finished) return;
        finished = true;
        clearTimeout(fallback);
        dialog.removeEventListener("animationend", onEnd);
        dialog.close();
        dialog.classList.remove("is-closing");
        dialog.style.removeProperty("--dialog-close-transform");
        dialog.style.removeProperty("--dialog-close-opacity");
    }
    function onEnd(event) {
        if (event.target === dialog && event.animationName === "dialog-disappear") finish();
    }
    dialog.addEventListener("animationend", onEnd);
    dialog.classList.add("is-closing");
    fallback = window.setTimeout(finish, 450);
}

document.querySelectorAll("dialog.calendar-dialog").forEach(dialog => {
    dialog.addEventListener("cancel", event => {
        event.preventDefault();
        closeDialogAnimated(dialog);
    });
});

/* MUSICA ALL’APERTURA DELLA BUSTA */
(() => {
    const audio = document.getElementById("weddingMusic");
    const button = document.getElementById("musicToggle");
    const status = document.getElementById("musicStatus");
    if (!audio || !button) return;
    function update() {
        const silent = audio.paused || audio.muted || audio.ended;
        button.classList.toggle("is-muted", silent);
        const label = silent ? "Attiva la musica" : "Disattiva la musica";
        button.setAttribute("aria-label", label);
        button.title = label;
    }
    async function play() {
        try {
            audio.muted = false;
            await audio.play();
            if (status) status.textContent = "";
        } catch {
            if (status) status.textContent = "Musica non disponibile: tocca la nota per riprovare.";
        }
        update();
    }
    window.addEventListener("envelopeopening", () => {
        button.hidden = false;
        play();
    }, { once: true });
    button.addEventListener("click", () => {
        if (audio.paused || audio.ended) {
            play();
        } else {
            audio.muted = !audio.muted;
            update();
        }
    });
    ["play", "pause", "ended", "volumechange", "error"].forEach(event => audio.addEventListener(event, update));
    update();
})();

/* UN PASSO DI SCORRIMENTO A OGNI TOCCO */
if (scrollIndicator) {
    function scrollOneStep() {
        if (document.documentElement.classList.contains("envelope-closed")) return;
        const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const remaining = Math.max(0, document.documentElement.scrollHeight - window.innerHeight - window.scrollY);
        window.scrollBy({
            top: Math.min(Math.round(viewportHeight * 0.65), remaining),
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"
        });
    }
    scrollIndicator.addEventListener("click", scrollOneStep);
    scrollIndicator.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            scrollOneStep();
        }
    });
}
