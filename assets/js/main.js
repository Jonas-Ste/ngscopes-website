/* NGScopes — minimal progressive enhancement. No dependencies.
   1. Marks the current page in the navigation
   2. Fills in the current year in the footer
   3. Contact form: background send if an endpoint is configured,
      otherwise it opens the visitor's email program pre-filled. */

(function () {
	'use strict';

	/* =====================================================================
	   CONFIGURATION

	   FORM_ENDPOINT decides how the contact form behaves.

	     ''  (empty)  → the form opens the visitor's email program with all
	                    fields filled in. No third party involved, nothing
	                    leaves the visitor's device until they hit send.

	     a URL        → the form is POSTed to that URL in the background and
	                    the visitor sees a confirmation on the page. Use a
	                    form-forwarding service (Formspree, Web3Forms and
	                    similar) that emails the submission to CONTACT_EMAIL.

	   Before setting a URL here, read the GDPR checklist in CONTENT.md —
	   a background-sending form needs a data processing agreement and a
	   matching section in privacy.html.
	   ===================================================================== */

	var FORM_ENDPOINT = '';
	var CONTACT_EMAIL = 'contactform@ngscopes.com';

	/* --- 1. Current page highlight --------------------------------------- */

	var path = window.location.pathname.replace(/\/$/, '/index.html');
	var file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

	Array.prototype.forEach.call(
		document.querySelectorAll('.site-nav a[href]'),
		function (link) {
			if (link.getAttribute('href') === file) {
				link.setAttribute('aria-current', 'page');
			}
		}
	);

	/* --- 2. Footer year --------------------------------------------------- */

	Array.prototype.forEach.call(
		document.querySelectorAll('[data-year]'),
		function (el) { el.textContent = new Date().getFullYear(); }
	);

	/* --- 3. Contact form -------------------------------------------------- */

	var form = document.getElementById('contact-form');
	if (!form) { return; }

	var status = document.getElementById('form-status');
	var button = form.querySelector('button[type="submit"]');

	function setStatus(message, kind) {
		status.textContent = message;
		status.className = 'form__status' + (kind ? ' form__status--' + kind : '');
	}

	function value(name) {
		var field = form.elements[name];
		return field ? field.value.trim() : '';
	}

	function markInvalid(name) {
		var field = form.elements[name];
		if (!field) { return; }
		field.setAttribute('aria-invalid', 'true');
		field.addEventListener('input', function once() {
			field.removeAttribute('aria-invalid');
			field.removeEventListener('input', once);
		});
	}

	function validate() {
		var missing = ['name', 'email', 'message'].filter(function (n) { return !value(n); });

		if (missing.length) {
			missing.forEach(markInvalid);
			setStatus('Please fill in name, email and message.', 'error');
			form.elements[missing[0]].focus();
			return false;
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email'))) {
			markInvalid('email');
			setStatus('That email address does not look right.', 'error');
			form.elements.email.focus();
			return false;
		}

		return true;
	}

	function openMailClient() {
		var body =
			'Name: ' + value('name') + '\n' +
			'Email: ' + value('email') + '\n' +
			(value('organisation') ? 'Organisation: ' + value('organisation') + '\n' : '') +
			'\n' + value('message') + '\n';

		window.location.href = 'mailto:' + CONTACT_EMAIL +
			'?subject=' + encodeURIComponent('Website enquiry – ' + value('name')) +
			'&body=' + encodeURIComponent(body);

		setStatus('Your email program should be opening now — the message is ready to send. ' +
			'If nothing happens, write to ' + CONTACT_EMAIL + ' directly.', 'success');
	}

	function sendToEndpoint() {
		button.disabled = true;
		setStatus('Sending…');

		fetch(FORM_ENDPOINT, {
			method: 'POST',
			body: new FormData(form),
			headers: { Accept: 'application/json' }
		})
			.then(function (response) {
				if (!response.ok) { throw new Error('HTTP ' + response.status); }
				form.reset();
				setStatus('Thank you — your message has been sent. We will get back to you.', 'success');
			})
			.catch(function () {
				setStatus('Sending failed. Please write to ' + CONTACT_EMAIL + ' instead.', 'error');
			})
			.then(function () {
				button.disabled = false;
			});
	}

	form.addEventListener('submit', function (e) {
		e.preventDefault();

		/* Honeypot: a real person never fills this in. Stay quiet about it. */
		if (value('website')) {
			setStatus('Thank you — your message has been sent.', 'success');
			return;
		}

		if (!validate()) { return; }

		if (FORM_ENDPOINT) { sendToEndpoint(); } else { openMailClient(); }
	});
})();
