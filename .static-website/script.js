/**
 * @param {SubmitEvent} event 
 * @param {HTMLFormElement} form 
 */
function sendContactForm(event, form) {
    event.preventDefault();

    const name = form.name.value;
    const phone = form.phone.value;
    const email = form.email.value;
    const subject = form.subject.value;
    const message = form.message.value;

    const mailtoLink = `mailto:william@velocitymedia.no?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Navn: ${name}\nTelefon: ${phone}\nE-post: ${email}\n\nMelding:\n${message}`
    )}`;    

    window.location.href = mailtoLink;
}
