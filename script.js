<script>
  if (window.location.search.includes("success=true")) {
    const popup = document.createElement("div");
    popup.innerText = "✅ Form submitted successfully!";
    popup.style.position = "fixed";
    popup.style.bottom = "30px";
    popup.style.left = "50%";
    popup.style.transform = "translateX(-50%)";
    popup.style.background = "#4CAF50";
    popup.style.color = "#fff";
    popup.style.padding = "12px 20px";
    popup.style.borderRadius = "6px";
    popup.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
    popup.style.zIndex = "9999";
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 5000);
  }
</script>
<script>
function acceptDisclaimer() {
  document.getElementById('bci-disclaimer-overlay').style.display = 'none';

  // Save permanently
  localStorage.setItem("disclaimerAccepted", "true");

  if (window.goatcounter && typeof window.goatcounter.count === "function") {
    window.goatcounter.count({
      path: location.pathname,
      title: document.title,
      event: false
    });
  }

  setTimeout(loadVisitorCount, 1500);

  // 🔥 SHOW HOLI POPUP IMMEDIATELY
  showHoliPopup();
}
</script>
<script>

   document.addEventListener("DOMContentLoaded", function () {

  function toggleMenu() {
    const nav = document.getElementById('mobileMenu');
    nav.classList.toggle('active');
  }

  window.toggleMenu = toggleMenu;

  /* DROPDOWN */

  const toggle = document.querySelector('.dropdown-toggle');
  const wrapper = document.querySelector('.dropdown-wrapper');
  const dropdown = document.getElementById('toolsDropdown');

  if (toggle && wrapper && dropdown) {

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      wrapper.classList.toggle('active');
    });

    dropdown.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    document.addEventListener('click', function () {
      wrapper.classList.remove('active');
    });

  }

  /* CLOSE MOBILE MENU WHEN CLICK OUTSIDE */

  document.addEventListener('click', function (e) {
    const nav = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');

    if (nav && hamburger && !nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove('active');
    }
  });

  /* CLOSE MENU WHEN SCREEN RESIZES */

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      const nav = document.getElementById('mobileMenu');
      if (nav) nav.classList.remove('active');
    }
  });

  /* SMOOTH SCROLL */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener('click', function (e) {

      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        e.preventDefault();

        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        const nav = document.getElementById('mobileMenu');
        if (nav && nav.classList.contains('active')) {
          nav.classList.remove('active');
        }
      }

    });

  });

});
</script>
<script>
document.getElementById("requirementForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  document.getElementById("submittedAtIST").value = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const form = e.target;
  const formData = new FormData(form);

  const response = await fetch("https://formspree.io/f/xyzjjaeo", {
    method: "POST",
    body: formData,
    headers: { 'Accept': 'application/json' }
  });

  const modal = document.getElementById("successModal");
  if (response.ok) {
    form.reset();
    modal.classList.remove("fade-out-modal");
    modal.style.display = "flex";
    modal.classList.add("fade-in-modal");

    setTimeout(() => {
      modal.classList.remove("fade-in-modal");
      modal.classList.add("fade-out-modal");
      setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove("fade-out-modal");
      }, 400);
    }, 3000);
  } else {
    alert("❌ Error submitting form. Please try again.");
  }
});

window.addEventListener('click', function(event) {
  const modal = document.getElementById('successModal');
  const content = document.getElementById('modalContent');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});
</script>
<script>
  function openRefundStatus() {
    alert("You will be redirected to the official NSDL Refund Status page.");
    window.open("https://tin.tin.nsdl.com/oltas/refund-status-pan.html", "_blank");
  }
</script>

<script>
document.addEventListener("DOMContentLoaded", function () {
  var el = document.getElementById('total-visits');
  if (!el) return;
  
  var t = setInterval(function() {
    if (window.goatcounter && window.goatcounter.visit_count) {
      clearInterval(t);
      var data = window.goatcounter.visit_count();
      el.textContent = data.count;
    }
  }, 100);
});
</script>

<script>
document.addEventListener("DOMContentLoaded", function() {
  if (!localStorage.getItem("disclaimerAccepted")) {
    document.getElementById('bci-disclaimer-overlay').style.display = 'flex';
  } else {
    showHoliPopup();
  }
});
</script>

<!--
<script>
function showHoliPopup() {
  const popup = document.getElementById("holiPopup");
  popup.style.display = "flex";

  setTimeout(() => {
    popup.classList.add("fade-out");
    setTimeout(() => {
      popup.style.display = "none";
      popup.classList.remove("fade-out");
    }, 400);
  }, 5000);
}
</script>
-->		
