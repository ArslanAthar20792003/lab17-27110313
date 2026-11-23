const formatRupees = (amount) => `Rs ${Math.round(amount).toLocaleString("en-US")}`;

const appendText = (container, tagName, text) => {
  const element = document.createElement(tagName);
  element.textContent = text;
  container.append(element);
};

const bookingForm = document.querySelector("#booking-form");

if (bookingForm) {
  const phoneInput = bookingForm.querySelector("#phone");
  const phoneError = bookingForm.querySelector("#phone-error");
  const confirmation = bookingForm.querySelector("#booking-confirmation");

  phoneInput.addEventListener("input", () => {
    phoneError.textContent = "";
    phoneInput.removeAttribute("aria-invalid");
  });

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    confirmation.hidden = true;
    phoneError.textContent = "";
    phoneInput.removeAttribute("aria-invalid");

    const phoneDigits = phoneInput.value.trim().replace(/[\s-]/g, "");
    if (!/^\d{11}$/.test(phoneDigits)) {
      phoneError.textContent = "Enter exactly 11 digits, like 0300-1234567.";
      phoneInput.setAttribute("aria-invalid", "true");
      phoneInput.focus();
      return;
    }

    if (!bookingForm.reportValidity()) {
      return;
    }

    const data = new FormData(bookingForm);
    const court = bookingForm.querySelector('[name="court"]');
    const selectedCourt = court.options[court.selectedIndex];
    const courtName = selectedCourt.text.split(" · ")[0];
    const hours = Number(data.get("hours"));
    const total = Number(selectedCourt.dataset.price) * hours;
    const [year, month, day] = data.get("date").split("-").map(Number);
    const formattedDate = new Date(year, month - 1, day).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const formattedPhone = `${phoneDigits.slice(0, 4)}-${phoneDigits.slice(4)}`;

    confirmation.replaceChildren();
    appendText(confirmation, "h3", "You're on your way");
    appendText(confirmation, "p", `${data.get("name")}, your ${courtName.toLowerCase()} is selected.`);
    appendText(confirmation, "p", `${formattedDate} · ${data.get("time")} · ${hours} ${hours === 1 ? "hour" : "hours"}`);
    appendText(confirmation, "p", `Phone: ${formattedPhone}`);
    appendText(confirmation, "p", `Total: ${formatRupees(total)} / booking (${courtName.toLowerCase()} for ${hours} ${hours === 1 ? "hour" : "hours"})`);
    confirmation.hidden = false;
  });
}

const splitForm = document.querySelector("#split-form");

if (splitForm) {
  const error = splitForm.querySelector("#split-error");
  const result = splitForm.querySelector("#split-result");

  splitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";
    result.hidden = true;

    if (!splitForm.reportValidity()) {
      return;
    }

    const data = new FormData(splitForm);
    const price = Number(data.get("price"));
    const hours = Number(data.get("hours"));
    const players = Number(data.get("players"));
    const total = price * hours;

    if (![price, hours, players].every(Number.isSafeInteger) || !Number.isSafeInteger(total)) {
      error.textContent = "Enter whole numbers with a safe total.";
      return;
    }

    const share = total / players;
    result.replaceChildren();
    appendText(result, "h3", "Here's your split");
    appendText(result, "p", `Total court cost: ${formatRupees(total)} / ${hours} ${hours === 1 ? "hour" : "hours"}`);
    appendText(result, "p", `Each of ${players} players pays ${formatRupees(share)}.`);
    appendText(result, "p", "Each share is rounded to the nearest rupee.");
    result.hidden = false;
  });
}
