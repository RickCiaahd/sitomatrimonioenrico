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

            document.body.appendChild(
                textarea
            );

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

    if (
        canScroll &&
        distanceFromBottom > 100
    ) {
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

if (
    giftToggle &&
    giftDetails
) {
    giftToggle.addEventListener(
        "click",
        () => {
            const isOpen =
                giftToggle.getAttribute(
                    "aria-expanded"
                ) === "true";

            giftToggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            giftDetails.hidden =
                isOpen;

            giftToggle.innerHTML =
                isOpen
                    ? `
                        <span aria-hidden="true">
                            💝
                        </span>
                        Scopri di più
                    `
                    : `
                        <span aria-hidden="true">
                            💝
                        </span>
                        Nascondi
                    `;
        }
    );
}


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

    closeButton.addEventListener("click", () => dialog.close());

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
            dialog.close();
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
