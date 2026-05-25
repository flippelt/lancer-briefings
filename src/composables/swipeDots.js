// Pagination-dots indicator for the swipe carousel used by PilotModal
// and MechModal on viewports ≤ 1199px (mobile + tablet).
//
// The modals are Vue 3 multi-root components; Oruga renders both root
// <div>s as siblings inside a single wrapper element that becomes the
// scroll-snap container (see _responsive.css `.o-modal > div:nth-child(2)`).
// This helper:
//
//   1. Finds the wrapper via the modal root's parentElement.
//   2. Counts how many `.pilot-modal` / `.mech-modal` panes live inside it.
//   3. Creates a fixed-position dot indicator and appends it to <body>
//      so the dots float over the swiping content.
//   4. Listens to the wrapper's scroll event and highlights the dot
//      matching the closest snap point.
//   5. Lets the user tap a dot to scroll to that pane.
//
// Returns a cleanup function that removes the dots and detaches the
// scroll listener; callers should invoke it from `beforeUnmount` so the
// indicator goes away with the modal.
//
// Skips entirely on desktop (≥1200px) and when only one pane exists.
export function setupSwipeDots(rootEl) {
	if (!rootEl) return null;
	if (window.matchMedia("(min-width: 1200px)").matches) return null;

	const wrapper = rootEl.parentElement;
	if (!wrapper) return null;

	const pages = wrapper.querySelectorAll(":scope > .pilot-modal, :scope > .mech-modal");
	if (pages.length < 2) return null;

	const container = document.createElement("div");
	container.className = "modal-swipe-dots";
	container.setAttribute("role", "tablist");
	container.setAttribute("aria-label", "Páginas do modal");

	for (let i = 0; i < pages.length; i++) {
		const dot = document.createElement("button");
		dot.type = "button";
		dot.className = "modal-swipe-dot" + (i === 0 ? " active" : "");
		dot.setAttribute("role", "tab");
		dot.setAttribute("aria-label", `Página ${i + 1} de ${pages.length}`);
		dot.addEventListener("click", () => {
			wrapper.scrollTo({ left: i * wrapper.clientWidth, behavior: "smooth" });
		});
		container.appendChild(dot);
	}
	document.body.appendChild(container);

	const dots = container.querySelectorAll(".modal-swipe-dot");

	function updateActive() {
		const index = Math.round(wrapper.scrollLeft / wrapper.clientWidth);
		dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
	}

	wrapper.addEventListener("scroll", updateActive, { passive: true });

	return () => {
		wrapper.removeEventListener("scroll", updateActive);
		container.remove();
	};
}
